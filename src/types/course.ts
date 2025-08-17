
export type Section = {
  room: string;
  status: string;
  section: string;
  days_times: string;
  instructor: string;
  class_number: string;
  meeting_dates: string;
};

export type Course = {
  code: string;
  name: string;
  description: string;
  term: string[];
  "weekly contact": string;
  "gpa weight": string;
  "billing unit": string;
  "course count": string;
  prerequisites: string;
  corequisites: string;
  antirequisites: string;
  "custom requisites": string;
  liberal: string;
  sections: Section[];
};
