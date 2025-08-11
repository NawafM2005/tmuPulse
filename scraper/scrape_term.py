from supabase import create_client
from dotenv import load_dotenv
import os
load_dotenv()

url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
supabase = create_client(url, key)

# Import playwright
from playwright.sync_api import sync_playwright

# This dictionary will store all program course data
all_courses_fall = {}

# ✅ Start Playwright once, outside the loop
with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)

    page = browser.new_page()
    page.goto("https://cas.torontomu.ca/login?service=https%3A%2F%2Fmy.torontomu.ca%2FuPortal%2FLogin")
    page.fill('input[name=username]', '')
    page.fill('input[name=password]', '')
    page.click('input[type="submit"]')

    code = 123456

    try:
        page.wait_for_selector('input[name="token"]', timeout=150_000)
        page.fill('input[name="token"]', str(code))
        # remember-me may not exist always; ignore failure
        try:
            page.click('label[for="remember-me"]')
        except:
            pass
        page.click('input[type="submit"]')
    except:
        print("No 2FA step appeared-ski.")

    with page.expect_popup() as popup_info:
            page.click('a#tabLink_u13l1s1000')
    popup = popup_info.value
    popup.wait_for_load_state('domcontentloaded')
    popup.wait_for_timeout(3000)
    popup.click('div#win0divPTNUI_LAND_REC_GROUPLET\\$2')
    popup.wait_for_timeout(3000)
    popup.click('a#SCC_LO_FL_WRK_SCC_VIEW_BTN\\$3')
    popup.wait_for_timeout(3000)

    target_frame = None
    for frame in popup.frames:
        if "CLASS_SEARCH.GBL" in frame.url:
            target_frame = frame

    if target_frame is None:
        raise Exception("No Frame Found!!!")

    # Get a list of all departments prefixes which are lists and fill below one by one for each one
    response = (
        supabase
        .table('departments')
        .select('*')
        .order('id', desc=False)
        .range(0, 999999)
        .execute()
    )
    prefixes = []
    for row in response.data:
        if row["prefixes"]:
            prefixes.extend(row["prefixes"])
    
    # Fill the subject input with each prefix
    for prefix in prefixes:
        # TERM select (no win6)
        target_frame.select_option('select[id*="CLASS_SRCH_WRK2_STRM"]', value="1261")
        target_frame.wait_for_timeout(500)

        target_frame.fill('input[name="SSR_CLSRCH_WRK_SUBJECT$0"]', prefix)
        target_frame.select_option('select[id*="SSR_CLSRCH_WRK_SSR_EXACT_MATCH1"]', value="G")
        target_frame.wait_for_timeout(300)

        target_frame.fill('input[name="SSR_CLSRCH_WRK_CATALOG_NBR$1"]', '0')
        target_frame.wait_for_timeout(300)

        target_frame.select_option('select[id*="SSR_CLSRCH_WRK_ACAD_CAREER$2"]', value="UGRD")
        target_frame.wait_for_timeout(300)

        # Open Classes Only (use role/name rather than label id)
        try:
            target_frame.get_by_role("checkbox", name="Open Classes Only").check()
        except:
            # fallback to input by name
            try:
                target_frame.check('input[name="SSR_CLSRCH_WRK_SSR_OPEN_ONLY$3"]')
            except:
                pass
        target_frame.wait_for_timeout(300)

        # Click Search (no win6 selector)
        try:
            target_frame.get_by_role("button", name="Search").click()
        except:
            target_frame.locator('a.PSPUSHBUTTON.PSPRIMARY:has-text("Search")').click()
        target_frame.wait_for_timeout(2000)

        # Handle "View All" button if it appears (for >50 results)
        try:
            # Wait for either results or a toolbar to render
            target_frame.wait_for_selector('a[name^="SSR_CLSRSLT_WRK_GROUPBOX2"], div[id*="PSTOOLBAR"]', timeout=10000)

            view_all_clicked = False
            # Preferred: role-based
            try:
                vb = target_frame.get_by_role("button", name="View All")
                if vb.is_visible():
                    vb.click()
                    view_all_clicked = True
            except:
                pass

            # Fallbacks: exact text on primary pushbutton
            if not view_all_clicked:
                try:
                    target_frame.locator('a.PSPUSHBUTTON.PSPRIMARY:has-text("View All")').first.click()
                    view_all_clicked = True
                except:
                    pass

            if not view_all_clicked:
                print(f"No View All button for {prefix} (≤50 results)")
            else:
                print(f"Clicked View All for {prefix}")
        except:
            print(f"No View All button for {prefix} (≤50 results)")

        # Check if results appear within 10 seconds, if not skip to next prefix
        try:
            target_frame.wait_for_selector('a[name^="SSR_CLSRSLT_WRK_GROUPBOX2"]', timeout=10000)
        except:
            print(f"No results found for prefix {prefix} after 10 seconds - skipping")
            # Go back to search page and continue with next prefix
            try:
                target_frame.get_by_role("button", name="New Search").click()
            except:
                popup.click('a#SCC_LO_FL_WRK_SCC_VIEW_BTN\\$3')
            popup.wait_for_timeout(3000)
            
            # Re-acquire the target frame after navigation
            target_frame = None
            for frame in popup.frames:
                if "CLASS_SEARCH.GBL" in frame.url:
                    target_frame = frame
                    break
            
            if target_frame is None:
                print("Warning: Could not re-acquire target frame")
                break
            continue

        # Grab course cards (no win6 in selector)
        course_title_divs = target_frame.query_selector_all('div[id*="SSR_CLSRSLT_WRK_GROUPBOX2GP"]')

        course_codes = []
        for div in course_title_divs:
            full_text = div.inner_text().replace('\xa0', ' ').strip()
            code = full_text.split('-')[0].strip()
            course_codes.append(code)

        for code in course_codes:
            result = supabase.table('courses').select('*').eq('code', code).execute()
            if result.data:
                course = result.data[0]
                terms = course.get("term", [])
                if not terms:
                    terms = []
                if "Winter" not in terms:
                    terms.append("Winter")
                    supabase.table('courses').update({'term': terms}).eq('code', code).execute()
                    print(f"Updated {code} with 'Winter'")
                else:
                    print(f"{code} already got 'Winter'—skipping")
            else:
                print(f"Course {code} not found in Supabase! 🦧")
        
        # Go back to search page (use the real 'New Search' button)
        try:
            target_frame.get_by_role("button", name="New Search").click()
        except:
            popup.click('a#SCC_LO_FL_WRK_SCC_VIEW_BTN\\$3')  # fallback
        popup.wait_for_timeout(3000)
        
        # Re-acquire the target frame after navigation
        target_frame = None
        for frame in popup.frames:
            if "CLASS_SEARCH.GBL" in frame.url:
                target_frame = frame
                break
        
        if target_frame is None:
            print("Warning: Could not re-acquire target frame")
            break

    browser.close()
