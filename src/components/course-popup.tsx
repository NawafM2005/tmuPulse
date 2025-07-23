import { motion, AnimatePresence } from "framer-motion";

type popup_types = {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  course?: any;
};

function formatTermCommas(term?: string | string[]): string {
  if (Array.isArray(term) && term.length > 0) {
    return term.join(", ");
  }
  if (typeof term === "string" && term.length > 0) {
    return term;
  }
  return "N/A";
}

export default function PopUp({ open, onClose, course }: popup_types) {
  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/90 hover:cursor-pointer"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col justify-left p-8 w-full max-w-3xl mt-8 gap-4 text-left bg-black text-white rounded-lg shadow-lg border-4 border-secondary text-[15px] hover:cursor-auto"
            onClick={e => e.stopPropagation()}
          >
            {course && (
              <div className="flex flex-col gap-5">
                <h1
                  className="font-bold text-[30px] text-white"
                  style={{
                    textShadow: "2px 2px 8px #000, 4px 4px 10px #6af3daff",
                  }}
                >
                  {course.code} - {course.name}
                </h1>
                <p>{course.description}</p>


                <div>
                  <p className="font-[800] text-[18px] mb-3">Course Details</p>
                    <div className="flex flex-row gap-10 mb-1 ml-5">
                      <span className="text-[15px]">Liberal: <button className="bg-secondary text-black font-bold rounded-[10px] py-1 px-2 ml-2"
                      >{course.liberal || "N/A"}</button></span>

                      <span className="text-[15px]">Term:  <button className="bg-secondary text-black font-bold rounded-[10px] py-1 px-2 ml-2"
                      >{formatTermCommas(course.term)}</button></span>
                    </div>
                </div>

                <div className="flex flex-col gap-5 ml-5">
                  <span className="text-[15px]">
                    Instructional Time: 
                    <button className="bg-secondary text-black font-bold rounded-[10px] py-1 px-2 ml-3">
                      {course["weekly contact"] || "N/A"}
                    </button>
                  </span>
                  <span className="text-[15px]">
                    GPA Weight: 
                    <button className="bg-secondary text-black font-bold rounded-[10px] py-1 px-2 ml-3">
                      {course["gpa weight"] || "N/A"}
                    </button>
                  </span>
                  <span className="text-[15px]">
                    Billing Unit: 
                    <button className="bg-secondary text-black font-bold rounded-[10px] py-1 px-2 ml-3">
                      {course["billing unit"] || "N/A"}
                    </button>
                  </span>
                  <span className="text-[15px]">
                    Course Count: 
                    <button className="bg-secondary text-black font-bold rounded-[10px] py-1 px-2 ml-3">
                      {course["course count"] || "N/A"}
                    </button>
                  </span>
                </div>

                <div className="flex flex-col gap-5">
                  <p className="font-[800] text-[18px] mb-1 ">Requirements & Restrictions</p>
                  <div className="flex flex-col gap-5 ml-5">
                      <span className="text-[15px]">
                      Prerequisites: 
                      <button className="bg-secondary text-black font-bold rounded-[10px] py-1 px-2 ml-3">
                        {course.prerequisites || "None"}
                      </button>
                      </span>
                      <span className="text-[15px]">
                        Corequisites: 
                        <button className="bg-secondary text-black font-bold rounded-[10px] py-1 px-2 ml-3">
                          {course.corequisites || "None"}
                        </button>
                      </span>
                      <span className="text-[15px]">
                        Antirequisites: 
                        <button className="bg-secondary text-black font-bold rounded-[10px] py-1 px-2 ml-3">
                          {course.antirequisites || "None"}
                        </button>
                      </span>
                      <span className="text-[15px]">
                        Custom Requisites: 
                        <button className="bg-secondary text-black font-bold rounded-[10px] py-1 px-2 ml-3">
                          {course.custom_requisites || "None"}
                        </button>
                      </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
