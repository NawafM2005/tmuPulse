import json
import re
import requests
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
import os
from dotenv import load_dotenv

prompt = """Parse the following HTML.

Your task is to extract a detailed, structured JSON object representing the semesters and requirements of the regular, non-co-op program described in the HTML. 

For each semester, return an object with:
- A "semester" field (e.g., "Semester 1")
- A "requirements" array

For each requirement, use **ONLY** these formats (all lowercase):

- For a regular course: {"code": "COURSE_CODE"}
- For an open elective: {"open": "open"}
- For a lower-level liberal studies elective: {"lowerlib": "lower"}
- For an upper-level liberal studies elective: {"upperlib": "upper"}
- For a specific choice where only one course must be selected from a given list: {"option": ["COURSE_CODE1", "COURSE_CODE2", ...]}
- For instructions like "Take X courses from Table #", include that many objects like {"table": "Table I"}

**THINK CAREFULLY:** If the HTML lists many courses for "Semester 1 and 2" (or similar), intelligently split these between the semesters as they would most likely be distributed (e.g., 5 in Semester 1, 5 in Semester 2), rather than placing all courses in one semester. If a specific split is unclear, distribute courses as evenly as possible. Use logical reasoning and context from the document to infer semester breakdowns as needed.

Do not include any explanations, course names, notes, or extra descriptions. Only use the keys above.

**Output Format:**
Return a single JSON object in this exact format:

{
  "program": "Computer Science",
  "total_courses": 40,
  "total_lowerlib": 3,
  "total_upperlib": 3,
  "total_open": 6,
  "total_core": 24,
  "other": 4,
  "semesters": [
    {
      "semester": "Semester 1",
      "requirements": [
        {"option": ["CPS 109", "CPS 106"]},
        {"code": "CPS 213"},
        {"code": "MTH 110"},
        {"option": ["BLG 143", "CHY 103", "PCS 110"]},
        {"lowerlib": "lower"}
      ]
    },
    {
      "semester": "Semester 2",
      "requirements": [
        {"code": "CPS 209"},
        {"code": "CPS 310"},
        {"code": "CPS 412"},
        {"code": "MTH 207"},
        {"lowerlib": "lower"}
      ]
    }
  ]
}

Where:
- "program": The program name (extracted from the page header or title)
- "semesters": An array with a separate entry for each semester, following the above rules
- "total_courses": The total number of items in all requirements arrays (all semesters)
- "total_lowerlib": The number of {"lowerlib": "lower"} entries
- "total_upperlib": The number of {"upperlib": "upper"} entries
- "total_open": The number of {"open": "open"} entries
- "total_core": The number of {"code": ...} entries, {"table": ...} entries, and all courses starting with the program's prefix (e.g., "CPS" for Computer Science)
- "other": The number of courses that do not fit any of the above (such as optional courses from other departments)

**Very important:** If the document is ambiguous or unclear, use your own best judgment to produce a logical, balanced semester breakdown and counts.

ONLY output the JSON object, with no extra text or explanation. Put the JSON inside a markdown code block, with nothing before or after.

Only use information from the HTML for the regular, non-co-op program.
Do not include anything related to co-op, minors, or concentrations.

Here is the HTML:"""

load_dotenv()
API_KEY = os.getenv("OPENAI_API_KEY")


def ask_chat_api(prompt):
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "gpt-4o",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0
    }
    response = requests.post(url, headers=headers, json=data)
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]


driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
driver.get("https://www.torontomu.ca/calendar/2025-2026/programs/")

WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "tbody")))

soup = BeautifulSoup(driver.page_source, "html.parser")
tbody = soup.find("tbody")

base_url = "https://www.torontomu.ca/"
program_links = []
gpt_responses = []

# Gather all program links
for row in tbody.find_all("tr", recursive=False):
    link = row.find("a", href=True)
    if link:
        parts = link['href'].split("/")[1:]
        joined_path = "/".join(parts)
        full_link = base_url + joined_path
        program_links.append(full_link)

for program in program_links:
    print("Scraping:", program)
    driver.get(program)
    soup = BeautifulSoup(driver.page_source, "html.parser")

    # ==== ONLY mainContentSki ====
    main_content = soup.find("div", class_="panel-group accordion background-hidden")
    if not main_content:
        print("No mainContent found, MonkySki:", program)
        continue

    html_content = str(main_content)
    full_prompt = prompt + html_content + "\nProgram name is in this link:" + program

    try:
        answer = ask_chat_api(full_prompt)
    except Exception as e:
        answer = f"Error: {str(e)}"
    gpt_responses.append(answer)
    time.sleep(10)

all_programs = []

for response in gpt_responses:
    if not isinstance(response, str):
        continue
    # Try markdown code block first
    match = re.search(r'```json\s*(.*?)\s*```', response, re.DOTALL)
    # Try JSON object
    if not match:
        match = re.search(r'({[\s\S]+})', response, re.DOTALL)
    # Try JSON array (as fallback)
    if not match:
        match = re.search(r'(\[[\s\S]+\])', response, re.DOTALL)
    if match:
        json_str = match.group(1)
        try:
            data = json.loads(json_str)
            all_programs.append(data)
        except Exception as e:
            print(json_str)
    else:
        print(response)

with open('all_programs.json', 'w') as f:
    json.dump(all_programs, f, indent=2)
print("Exported to all_programs.json")