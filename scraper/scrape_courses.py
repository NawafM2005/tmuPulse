# To fetch webpages
import requests

# To parse HTML use BeautifulSoup
from bs4 import BeautifulSoup

# To save course data to json file
import json

# Import playwright
from playwright.sync_api import sync_playwright

url = "https://www.torontomu.ca/calendar/2025-2026/courses/"

res = requests.get(url)
soup = BeautifulSoup(res.text, "html.parser")

# Find all <tr> elements except the first header row
rows = soup.find_all("tr")[1:]

# This dictionary will store all program course data
all_programs = {}

total_programs = len(rows)
processed_count = 0

# ✅ Start Playwright once, outside the loop
with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)

    for row in rows:
        link = row.find("td").find("a")
        program_link = "/".join(link["href"].split("/")[3:])

        page = browser.new_page()
        page.goto("https://www.torontomu.ca/" + program_link, timeout=60000)
        page.wait_for_selector("li.stackItem.list-group-item")
        content = page.content()
        page.close()

        soup = BeautifulSoup(content, 'html.parser')
        course_items = soup.select("li.stackItem.list-group-item")
        major = soup.select_one("div.heading.resPageHeading h1")

        if not major:
            continue  # skip if no major title

        all_programs[major.text] = []

        for item in course_items:
            code_block = item.select_one("a.courseCode")
            if not code_block:
                continue

            full_title = code_block.text.strip()
            code = full_title[:7].strip()
            name = full_title[10:].strip()

            desc_block = item.select_one("div.courseDescription")
            desc = desc_block.text[18:].strip() if desc_block else ""

            weekly_contact = item.select_one("div.weeklyContact")
            gpa_weight = item.select_one("div.gpaWeight")
            billing_unit = item.select_one("div.billingUnit")
            course_count = item.select_one("div.courseCount")

            url = "https://www.torontomu.ca/" + code_block["href"]
            res = requests.get(url)
            soup = BeautifulSoup(res.text, "html.parser")

            requisites = soup.select("div.requisitesBlock div.requisites")
            requisites_data = {
                "prerequisites": "None",
                "corequisites": "None",
                "antirequisites": "None",
                "custom requisites": "None"
            }

            for req in requisites:
                heading = req.select_one("h3")
                value = req.select_one("p")
                if heading and value:
                    key = heading.text.strip().lower()
                    val = value.text.strip()
                    if key in requisites_data:
                        requisites_data[key] = val

            all_programs[major.text].append({
                "code": code,
                "name": name,
                "description": desc,
                "weekly contact": weekly_contact.text.split(":")[1] if weekly_contact else "None",
                "gpa weight": gpa_weight.text.split(":")[1] if gpa_weight else "None",
                "billing unit": billing_unit.text.split(":")[1] if billing_unit else "None",
                "course count": course_count.text.split(":")[1] if course_count else "None",
                **requisites_data
            })

        # 🟡 Update progress
        processed_count += 1
        percent_done = int((processed_count / total_programs) * 100)
        print(f"Fetching all TMU Programs...{percent_done}% - {major.text}")

    browser.close()

# Save to JSON
with open("courses.json", "w") as f:
    json.dump(all_programs, f, indent=2)

print(f"✅ Scraped and saved {len(all_programs)} programs.")
