import { supabase } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import ProfPopUp from "@/components/prof-popup"

type popup_types = {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  course?: any;
};

export type Professor = {
    rmf_id: string;
    legacy_id: number;
    first_name: string;
    last_name: string;
    department: string;
    avg_rating: string;
    num_ratings: number;
    would_take_again_percent: string;
    avg_difficulty: string;
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
  const [profs, setProfs] = useState<Professor[]>([]);
  const [showPopup, setShowPopup] = React.useState(false);
  const [popupRowData, setPopupRowData] = React.useState<any>(null);

  useEffect(() => {
      if (!course?.code) {
        setProfs([]);
        return;
      }
      const fetchProfs = async () => {
        try {
          const { data, error } = await supabase
            .from('professors')
            .select('*')
            .contains('courses_taught', [course.code])
            .order('avg_rating', { ascending: false });
  
          if (error) {
            console.error('Error fetching professors:', error);
            setProfs([]);
          } else {
            setProfs(data || []);
          }
        } catch (error) {
          console.error('Error fetching professors:', error);
          setProfs([]);
        }
      };

      fetchProfs();
    }, [course?.code]);

    useEffect(() => {
      if (!open) return;

      // Remember current scroll, then lock the page
      const scrollY = window.scrollY;
      const prevOverflow = document.body.style.overflow;
      const prevPosition = document.body.style.position;
      const prevTop = document.body.style.top;
      const prevWidth = document.body.style.width;
      const prevOb = document.documentElement.style.overscrollBehavior;

      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      // helps on mobile: stop bounce/overscroll propagation
      document.documentElement.style.overscrollBehavior = 'contain';

      return () => {
        // Restore styles + scroll position
        document.body.style.overflow = prevOverflow;
        document.body.style.position = prevPosition;
        document.body.style.top = prevTop;
        document.body.style.width = prevWidth;
        document.documentElement.style.overscrollBehavior = prevOb;
        window.scrollTo(0, scrollY);
      };
    }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm p-2 sm:p-4"
          onClick={onClose}
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="relative flex flex-col w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[90vh] bg-card-bg text-foreground rounded-2xl shadow-2xl border-2 border-borders overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header with close button */}
            <div className="sticky top-0 bg-card-bg border-b border-borders p-4 sm:p-6 flex items-start justify-between">
              <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
                <button
                  onClick={onClose}
                  className="flex-shrink-0 p-2 hover:bg-card-hover rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Close"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6 text-muted hover:text-foreground hover:cursor-pointer" />
                </button>
              </div>
              <div className="w-full text-center">
                <h1 className="font-[900] text-lg sm:text-xl md:text-2xl text-foreground leading-tight">
                  {course?.code}
                </h1>
                <h2 className="font-[600] text-sm sm:text-base md:text-lg text-muted mt-1">
                  {course?.name}
                </h2>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {course && (
                <>
                  {/* Description */}
                  <div className="bg-card-hover rounded-xl p-4 border border-input-border">
                    <h3 className="font-[800] text-sm sm:text-base text-foreground mb-3">Description</h3>
                    <p className="text-xs sm:text-sm md:text-base text-foreground leading-relaxed">
                      {course.description || "No description available"}
                    </p>
                  </div>

                  {/* Course Details */}
                  <div className="bg-card-hover rounded-xl p-4 border border-input-border">
                    <h3 className="font-[800] text-sm sm:text-base text-foreground mb-4">Course Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="flex flex-col space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-input-border">
                          <span className="font-[600] text-xs sm:text-sm text-muted">Liberal:</span>
                          <span className="text-xs sm:text-sm text-foreground font-[600]">
                            {formatLiberal(course.liberal)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-input-border">
                          <span className="font-[600] text-xs sm:text-sm text-muted">Term:</span>
                          <span className="text-xs sm:text-sm text-foreground font-[600]">
                            {formatTermCommas(course.term)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-input-border">
                          <span className="font-[600] text-xs sm:text-sm text-muted">Weekly Contact:</span>
                          <span className="text-xs sm:text-sm text-foreground font-[600]">
                            {course["weekly contact"] || "N/A"}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-input-border">
                          <span className="font-[600] text-xs sm:text-sm text-muted">GPA Weight:</span>
                          <span className="text-xs sm:text-sm text-foreground font-[600]">
                            {course["gpa weight"] || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-input-border">
                          <span className="font-[600] text-xs sm:text-sm text-muted">Billing Unit:</span>
                          <span className="text-xs sm:text-sm text-foreground font-[600]">
                            {course["billing unit"] || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-input-border">
                          <span className="font-[600] text-xs sm:text-sm text-muted">Course Count:</span>
                          <span className="text-xs sm:text-sm text-foreground font-[600]">
                            {course["course count"] || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="bg-card-hover rounded-xl p-4 border border-input-border">
                    <h3 className="font-[800] text-sm sm:text-base text-foreground mb-4">Requirements & Restrictions</h3>
                    <div className="space-y-4">
                      <div className="bg-card-bg rounded-lg p-3 border border-input-border">
                        <h4 className="font-[700] text-xs sm:text-sm text-success mb-2">Prerequisites</h4>
                        <p className="text-xs sm:text-sm text-foreground">
                          {course.prerequisites || "None"}
                        </p>
                      </div>
                      <div className="bg-card-bg rounded-lg p-3 border border-input-border">
                        <h4 className="font-[700] text-xs sm:text-sm text-primary mb-2">Corequisites</h4>
                        <p className="text-xs sm:text-sm text-foreground">
                          {course.corequisites || "None"}
                        </p>
                      </div>
                      <div className="bg-card-bg rounded-lg p-3 border border-input-border">
                        <h4 className="font-[700] text-xs sm:text-sm text-danger mb-2">Antirequisites</h4>
                        <p className="text-xs sm:text-sm text-foreground">
                          {course.antirequisites || "None"}
                        </p>
                      </div>
                      {course.custom_requisites && course.custom_requisites !== "None" && (
                        <div className="bg-card-bg rounded-lg p-3 border border-input-border">
                          <h4 className="font-[700] text-xs sm:text-sm text-warning mb-2">Custom Requisites</h4>
                          <p className="text-xs sm:text-sm text-foreground">
                            {course.custom_requisites}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
              <div>
                <h3 className="font-[800] text-sm sm:text-base text-foreground mb-4">Professors</h3>
                {profs.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {profs.map((prof) => (
                      <div
                        key={prof.rmf_id}
                        className="bg-card-hover rounded-lg p-3 border border-input-border flex flex-col items-center text-center hover:cursor-pointer hover:shadow-md hover:scale-105 transition-all duration-200"
                        onClick={() => {
                          setShowPopup(true);
                          setPopupRowData(prof);
                        }}
                      >
                        <h4 className="font-[700] text-xs sm:text-sm text-foreground mb-1 truncate w-full">
                          {prof.first_name} {prof.last_name}
                        </h4>
                        <p className="text-[10px] sm:text-xs text-muted mb-1 truncate w-full">
                          {prof.department || "No dept"}
                        </p>
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] sm:text-xs text-muted">Avg Rating</span>
                          <span className="text-[11px] sm:text-xs font-semibold text-foreground">
                            {isNaN(parseFloat(prof.avg_rating))
                              ? "N/A"
                              : parseFloat(prof.avg_rating).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                    <ProfPopUp open={showPopup} prof={popupRowData} onClose={() => setShowPopup(false)}></ProfPopUp>
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-muted">No professors available for this course</p>
                )}
                
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
