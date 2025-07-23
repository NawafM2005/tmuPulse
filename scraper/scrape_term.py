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

    page.wait_for_selector('input[name="token"]', timeout=150_000)
    page.fill('input[name="token"]', str(code))
    page.click('label[for="remember-me"]')
    page.click('input[type="submit"]')

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
    
    target_frame.select_option('#CLASS_SRCH_WRK2_STRM\\$35\\$', value="1259")
    target_frame.wait_for_timeout(1000)

    target_frame.select_option('select[id^="SSR_CLSRCH_WRK_SSR_EXACT_MATCH1"]', value="G")
    target_frame.wait_for_timeout(1000)

    target_frame.fill('input[name="SSR_CLSRCH_WRK_CATALOG_NBR$1"]', '0')
    target_frame.wait_for_timeout(1000)

    target_frame.select_option('select[id^="SSR_CLSRCH_WRK_ACAD_CAREER$2"]', value="UGRD")
    target_frame.wait_for_timeout(1000)

    target_frame.click('label[for="SSR_CLSRCH_WRK_SSR_OPEN_ONLY$3"]')
    target_frame.wait_for_timeout(1000)

    target_frame.click('#win6divCLASS_SRCH_WRK2_SSR_PB_CLASS_SRCH a')
    target_frame.wait_for_timeout(1000)

    target_frame.click('#win6divPSTOOLBAR .PSPUSHBUTTON.PSPRIMARY')

    target_frame.wait_for_selector('a[name^="SSR_CLSRSLT_WRK_GROUPBOX2"]', timeout=999999)

    course_title_divs = target_frame.query_selector_all('div[id^="win6divSSR_CLSRSLT_WRK_GROUPBOX2GP"]')

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
            if "Fall" not in terms:
                terms.append("Fall")
                supabase.table('courses').update({'term': terms}).eq('code', code).execute()
                print(f"Updated {code} with 'Fall'")
            else:
                print(f"{code} already got 'Fall'—skipping")
        else:
            print(f"Course {code} not found in Supabase! 🦧")

    browser.close()