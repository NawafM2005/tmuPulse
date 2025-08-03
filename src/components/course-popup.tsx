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

function formatLiberal(lib?: string): string {
  if (lib != "None") {
    return lib === "UL" ? "Upper" : "Lower";
  }
  return "Core";
}

export default function PopUp({ open, onClose, course }: popup_types) {
  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 hover:cursor-pointer"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col justify-left p-8 w-full max-w-6xl m-10 gap-4 text-left bg-background text-foreground rounded-lg shadow-lg border-4 border-borders text-sm hover:cursor-auto"
            onClick={e => e.stopPropagation()}
          >
            {course && (
              <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto">
                <h1
                  className="font-bold text-2xl text-foreground"
                >
                  {course.code} - {course.name}
                </h1>
                <p>{course.description}</p>

                <div className="flex flex-col gap-5 mt-3">
                  <p className="font-[800] text-[18px] mb-1">Course Details</p>
                  <div className="flex flex-row gap-10 mb-1 ml-15">
                    <span className="text-[15px]">Liberal: {formatLiberal(course.liberal)}</span>
                    <span className="text-[15px]">Term: {formatTermCommas(course.term)}</span>
                  </div>
                  <span className="text-[15px] ml-15">
                    Instructional Time: {course["weekly contact"] || "N/A"}
                  </span>
                  <span className="text-[15px] ml-15">
                    GPA Weight: {course["gpa weight"] || "N/A"}
                  </span>
                  <span className="text-[15px ml-15">
                    Billing Unit: {course["billing unit"] || "N/A"}
                  </span>
                  <span className="text-[15px] ml-15">
                    Course Count: {course["course count"] || "N/A"}
                  </span>
                </div>

                <div className="flex flex-col gap-5">
                  <p className="font-[800] text-[18px] mb-1">Requirements & Restrictions</p>
                  <div className="flex flex-col gap-5 ml-15">
                    <span className="text-[15px]">
                      Prerequisites: {course.prerequisites || "None"}
                    </span>
                    <span className="text-[15px]">
                      Corequisites: {course.corequisites || "None"}
                    </span>
                    <span className="text-[15px]">
                      Antirequisites: {course.antirequisites || "None"}
                    </span>
                    <span className="text-[15px]">
                      Custom Requisites: {course.custom_requisites || "None"}
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
