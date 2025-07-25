from supabase import create_client
import json
from dotenv import load_dotenv
import os


load_dotenv()

url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
supabase = create_client(url, key)


print("📡 Connected to Supabase")

# Load JSON data
with open("all_programs.json", "r") as file:
    all_programs = json.load(file)

for program in all_programs:
    supabase.table("programs").insert({
        "program": program["program"],
        "total_courses": program["total_courses"],
        "total_lowerlib": program["total_lowerlib"],
        "total_upperlib": program["total_upperlib"],
        "total_open": program["total_open"],
        "total_core": program["total_core"],
        "other": program["other"],
        "semesters": program["semesters"]
    }).execute()
print("Done!")