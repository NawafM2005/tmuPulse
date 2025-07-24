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
import time

prompt = """Parse the following HTML.

For each semester in the regular, non-co-op program, return a JSON array. Each semester should have a "semester" field (e.g., "Semester 1") and a "requirements" array.

For each requirement in "requirements", use these formats:

For a regular course: {"code": "COURSE_CODE"}

For an open elective: {"open": "open"}

For a lower-level liberal studies elective: {"lowerlib": "lower"}

For an upper-level liberal studies elective: {"upperlib": "upper"}

For a specific choice where only one course must be selected from a given list: {"option": ["COURSE_CODE1", "COURSE_CODE2", "COURSE_CODE3"]}

For instructions like "Take X courses from Table #" (e.g., "Take three courses from Table I"), include that many objects like {"table": "Table I"}.

Do not include any explanations, course names, notes, or extra descriptions. Only use the keys above (all lowercase).

The output should look like:

Return a JSON object in this exact format:

{
  "program": "Computer Science",
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

The "program" field should be the program name from the HTML (for example, from the page header or title). ONLY output the JSON object, and nothing else. Output the JSON object inside a markdown code block, with nothing before or after.

Only use information from the HTML for the regular, non-co-op program.
Do not include anything related to co-op, minors, or concentrations.

Here is the HTML:"""


API_KEY = ""

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
    driver.get(program)
    soup = BeautifulSoup(driver.page_source, "html.parser")
    divs = soup.find_all("div", class_="panel-group accordion background-hidden")

    for div in divs:
        html_content = str(div)
        full_prompt = prompt + html_content
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
            print("JSON error:", e)
            print(json_str)
    else:
        print("No JSON found in response!")
        print(response)

with open('all_programs.json', 'w') as f:
    json.dump(all_programs, f, indent=2)
print("Exported to all_programs.json")