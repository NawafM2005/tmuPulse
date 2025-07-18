from supabase import create_client
import json

# URL and key for your Supabase project
url = "https://znvxemmeltezycyzfobo.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpudnhlbW1lbHRlenljeXpmb2JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MDMwMTMsImV4cCI6MjA2ODM3OTAxM30.kXxs3NepH3BwnbD87JXEqoNJNGXU-q2tyciC0Vgy1Gw"
supabase = create_client(url, key)


print("📡 Connected to Supabase")

# Load JSON data
with open("courses.json", "r") as file:
    data = json.load(file)

for dept_name, course_list in data.items():
    # Always check if department exists first
    dept_lookup = supabase.table("departments").select("id").eq("name", dept_name).execute()
    
    if dept_lookup.data:
        dept_id = dept_lookup.data[0]["id"]
    else:
        # Insert only if not found
        dept_response = supabase.table("departments").insert({"name": dept_name}).execute()
        dept_id = dept_response.data[0]["id"]

    # Insert Course Data and link department_id
    for course in course_list:
        supabase.table("courses").insert({
            "code": course.get("code"),
            "name": course.get("name"),
            "description": course.get("description"),
            "weekly_contact": course.get("weekly contact"),
            "gpa_weight": course.get("gpa weight", 0),
            "billing_unit": course.get("billing unit", 0),
            "course_count": course.get("course count", 0),
            "prerequisites": course.get("prerequisites"),
            "corequisites": course.get("corequisites"),
            "antirequisites": course.get("antirequisites"),
            "custom_requisites": course.get("custom requisites"),
            "department_id": dept_id
        }).execute()
