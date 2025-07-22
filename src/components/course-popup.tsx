import { motion } from "framer-motion";

type popup_types = {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  course?: any;
}

export default function PopUp({ open, onClose, course, children} : popup_types) {
    if (!open) return null;
    console.log(course);

return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/90 hover:cursor-pointer" onClick={onClose}>
            <div className="flex flex-col justify-left p-8 w-full max-w-3xl mt-8 gap-4 text-left bg-black text-white rounded-lg shadow-lg border-4 border-secondary text-[15px] hover:cursor-auto" onClick={e => e.stopPropagation()}>
                <h1
                    className="font-bold text-[20px] text-white"
                    style={{ textShadow: "2px 2px 8px #000, 1px 1px 10px #6af3daff" }}
                >
                    {course.code} - {course.name}
                </h1>
                <p>{course.description}</p>

                <div className="flex flex-col gap-2">
                    <p>Lecture: {course["weekly contact"] || "N/A"}</p>
                    <p>GPA Weight: {course["gpa weight"] || "N/A"}</p>
                    <p>Billing Unit: {course["billing unit"] || "N/A"}</p>
                    <p>Course Count: {course["course count"] || "N/A"}</p>
                    <p>Liberal: {course.liberal || "N/A"}</p>
                    <p>Prerequisites: {course.prerequisites || "None"}</p>
                    <p>Corequisites: {course.corequisites || "None"}</p>
                    <p>Antirequisites: {course.antirequisites || "None"}</p>
                    <p>Custom Requisites: {course.custom_requisites || "None"}</p>
                </div>
            </div>
    </div>
  );
}