"use client"
import { supabase } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

type popup_types = {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  prof?: any;
};

export type Review = {
  idx: number;
  id: number;
  rmf_id: string;
  legacy_id: number;
  professor_id: number;
  course_id: number;
  date: string;
  comment: string | null;
  helpful_rating: string;
  clarity_rating: string;
  difficulty_rating: string;
  rating_tags: string[] | null;
  attendance_mandatory: "mandatory" | "non mandatory" | "unknown";
  would_take_again: boolean | null;
  grade: string;
  textbook_use: string;
  is_for_online_class: boolean;
  is_for_credit: boolean;
  thumbs_up_total: number;
  thumbs_down_total: number;
  flag_status: "UNFLAGGED" | "FLAGGED" | string;
  created_by_user: boolean;
  created_at: string;
  updated_at: string;
  class: string;
};

export default function PopUp({ open, onClose, prof }: popup_types) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [endIdx, setEndIdx] = useState(5);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  useEffect(() => {
    if (!prof?.rmf_id) {
      setReviews([]);
      return;
    }
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('professor_id', prof.id)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching reviews:', error);
          setReviews([]);
        } else {
          setReviews(data || []);
        }
        setEndIdx(Math.min(5, data ? data.length : 0));
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews([]);
      }
    };

    fetchReviews();
  }, [prof?.rmf_id]);

  useEffect(() => {
    setSelectedCourse(null);
    setEndIdx(5);
  }, [prof?.id]);

  const handleCourseClick = (course: string) => {
    setSelectedCourse(course === selectedCourse ? null : course);
  };

  const displayedReviews = selectedCourse
  ? reviews.filter((review) => review.class === selectedCourse)
  : reviews;

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
      {open && prof && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm p-2 sm:p-4"
          onClick={onClose}
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="relative flex flex-col w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl max-h-[90vh] bg-card-bg text-foreground rounded-2xl shadow-2xl border-2 border-borders overflow-hidden"
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
                  {prof.first_name} {prof.last_name}
                </h1>
                <div className="text-sm text-muted mt-1">{prof.department}</div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-card-hover rounded-xl p-4 border border-input-border flex flex-col items-center">
                  <span className="font-[700] text-xs sm:text-sm text-muted mb-2">Avg. Rating</span>
                  <span className="text-lg sm:text-xl font-bold">
                    {prof.avg_rating !== undefined && prof.avg_rating !== null && prof.avg_rating !== "" ? Number(prof.avg_rating).toFixed(2) : "N/A"}
                  </span>
                </div>
                <div className="bg-card-hover rounded-xl p-4 border border-input-border flex flex-col items-center">
                  <span className="font-[700] text-xs sm:text-sm text-muted mb-2"># Reviews</span>
                  <span className="text-lg sm:text-xl font-bold">
                    {prof.num_ratings ?? "N/A"}
                  </span>
                </div>
                <div className="bg-card-hover rounded-xl p-4 border border-input-border flex flex-col items-center">
                  <span className="font-[700] text-xs sm:text-sm text-muted mb-2">Would Take Again</span>
                  <span className="text-lg sm:text-xl font-bold">
                    {prof.would_take_again_percent !== undefined && prof.would_take_again_percent !== null && prof.would_take_again_percent !== "" 
                      ? `${Number(prof.would_take_again_percent).toFixed(0)}%`
                      : "N/A"}
                  </span>
                </div>
                <div className="bg-card-hover rounded-xl p-4 border border-input-border flex flex-col items-center">
                  <span className="font-[700] text-xs sm:text-sm text-muted mb-2">Avg. Difficulty</span>
                  <span className="text-lg sm:text-xl font-bold">
                    {prof.avg_difficulty !== undefined && prof.avg_difficulty !== null && prof.avg_difficulty !== "" ? Number(prof.avg_difficulty).toFixed(2) : "N/A"}
                  </span>
                </div>
              </div>
              {/* Reviews */}
                <div className="flex flex-col gap-5">
                  <p className="font-bold">Recent Reviews</p>
                  {/* Courses Badges */}
                  <div className="flex flex-col text-center items-center">
                    {prof.courses_taught && prof.courses_taught.length > 0 ? (
                      <span className="flex flex-wrap gap-2">
                        {prof.courses_taught.map((course : string) => (
                          <button
                            key={course}
                            className={`text-xs font-medium px-2 py-0.5 rounded-md hover:cursor-pointer ${
                              selectedCourse === course
                                ? "bg-blue-600 text-white"
                                : "bg-blue-100 text-blue-800"
                            }`}
                            onClick={() => handleCourseClick(course)}
                          >
                            {course}
                          </button>
                        ))}
                      </span>
                    ) : (
                      <span className="text-sm text-muted">No courses found</span>
                    )}
                  </div>
                  {displayedReviews.length > 0 ? (
                    <ul className="space-y-4">
                      {displayedReviews.slice(0, endIdx).map((review) => (
                        <li
                          key={review.id ?? review.idx}
                          className="bg-card-hover rounded-xl p-4 border border-borders/60 shadow-sm hover:shadow-md transition"
                        >
                          {/* Top row: class + date */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex flex-wrap items-center gap-2">
                              {review.class && (
                                <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
                                  {review.class}
                                </span>
                              )}
                              {review.grade && (
                                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                                  Grade: {review.grade}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-muted">
                              {review.date
                                ? new Date(review.date).toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })
                                : "—"}
                            </span>
                          </div>

                          {/* Comment */}
                          <div className="text-sm leading-6 mb-3">
                            {review.comment ? (
                              <p className="whitespace-pre-line">{review.comment}</p>
                            ) : (
                              <span className="italic text-gray-400">No comment provided</span>
                            )}
                          </div>

                          {/* Ratings */}
                          <div className="flex flex-wrap gap-2 text-xs font-medium">
                            <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-800">
                              Helpful: {review.helpful_rating || "—"}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-800">
                              Clarity: {review.clarity_rating || "—"}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-800">
                              Difficulty: {review.difficulty_rating || "—"}
                            </span>
                            {typeof review.would_take_again === "boolean" && (
                              <span
                                className={`px-2 py-0.5 rounded-md ${
                                  review.would_take_again
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {review.would_take_again ? "Would Take Again" : "Would Not Take Again"}
                              </span>
                            )}
                            {review.attendance_mandatory &&
                              review.attendance_mandatory !== "unknown" && (
                                <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-700">
                                  Attendance:{" "}
                                  {review.attendance_mandatory === "mandatory"
                                    ? "Mandatory"
                                    : "Optional"}
                                </span>
                              )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="italic text-gray-400">No reviews available</p>
                  )}
                </div>
                {displayedReviews.length > 5 && (
                  <div>
                    <button className="text-sm text-blue-500 hover:underline hover:cursor-pointer" onClick={() => {
                      setEndIdx((prevEndIdx) => Math.min(prevEndIdx + 5, displayedReviews.length));
                    }}>
                      Show more
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
      )}
    </AnimatePresence>
  );
}