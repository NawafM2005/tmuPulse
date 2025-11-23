"use client";

import dynamic from "next/dynamic";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import type { EventInput, EventContentArg } from "@fullcalendar/core";
import type { CalendarApi, DatesSetArg } from "@fullcalendar/core";
import { useState, useRef } from "react";

const FullCalendar = dynamic(() => import("@fullcalendar/react"), { ssr: false });

type ScheduleCalendarProps = {
  events?: EventInput[];
  initialView?: "timeGridWeek" | "dayGridMonth" | "listWeek" | "timeGridDay";
  className?: string;
};

export default function ScheduleCalendar({
  events = [],
  initialView = "timeGridWeek",
  className = "",
}: ScheduleCalendarProps) {
  const SEMESTER_START = "2026-01-12";
  const [calApi, setCalApi] = useState<CalendarApi | null>(null);

  const calWrapRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    if (!calWrapRef.current || downloading) return;
    setDownloading(true);
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(calWrapRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "pt", "a4");
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(pageW / canvas.width, pageH / canvas.height);
      const imgW = canvas.width * ratio;
      const imgH = canvas.height * ratio;
      pdf.addImage(imgData, "PNG", (pageW - imgW) / 2, (pageH - imgH) / 2, imgW, imgH);
      pdf.save("schedule.pdf");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className={`rounded-xl border border-border bg-card p-3 tmupulse-cal ${className}`}>
      {/* Top toolbar — no titles, no help cursor */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => calApi?.gotoDate(SEMESTER_START)}
            aria-label="Jump to Winter Start"
            className="px-3 py-1.5 rounded-xl border bg-background hover:bg-muted transition shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
          >
            Winter Start
          </button>
        </div>

        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          aria-label="Download schedule as PDF"
          aria-live="polite"
          className={[
            "group inline-flex items-center gap-2 px-4 py-2 rounded-2xl",
            "text-black",
            "shadow-lg shadow-black-500",
            "transition-transform hover:-translate-y-0.5 active:translate-y-0",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400",
            downloading ? "opacity-80 cursor-wait" : "cursor-pointer",
          ].join(" ")}
        >
          {/* Icon / spinner */}
          {downloading ? (
            <svg className="h-4 w-4 animate-spin pointer-events-none" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 100 16v4l3.5-3.5L12 20v4a8 8 0 01-8-8z"/>
            </svg>
          ) : (
            <svg className="h-4 w-4 pointer-events-none" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          <span className="font-semibold tracking-wide select-none">
            {downloading ? "Preparing…" : "Download PDF"}
          </span>
        </button>
      </div>

      {/* Calendar area (captured for PDF) */}
      <div ref={calWrapRef} className="rounded-xl overflow-hidden bg-background">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView={initialView}
          timeZone="America/Toronto"
          initialDate={SEMESTER_START}
          datesSet={(arg: DatesSetArg) => setCalApi(arg.view.calendar)}
          headerToolbar={{ left: "", center: "title", right: "prev,next" }}
          height="auto"
          expandRows
          slotMinTime="08:00:00"
          slotMaxTime="22:00:00"
          weekends
          nowIndicator
          selectMirror
          allDaySlot={false}
          selectable={false}
          editable={false}
          eventOverlap
          navLinks
          events={events}
          eventClassNames={(arg) => {
            const s = ((arg.event.extendedProps as any)?.status || "").toString().toLowerCase();
            return [
              "sb-event",
              s.startsWith("closed") ? "opacity-80 ring-1 ring-rose-300" : "",
              s.startsWith("open")   ? "ring-1 ring-emerald-300" : "",
              s.startsWith("wait")   ? "ring-1 ring-amber-300"   : "",
            ].filter(Boolean);
          }}
          eventContent={(arg: EventContentArg) => {
            const ext = arg.event.extendedProps as any;
            const statusRaw: string = (ext?.status || "").toString();
            const status = statusRaw.toLowerCase();
            const pillClass =
              status.startsWith("open") ? "open" :
              status.startsWith("wait") ? "wait" :
              status.startsWith("closed") ? "closed" : "";
            return (
              <div className="sb-evt sb-evt--tiny text-foreground">
                <div className="sb-evt-title text-foreground">
                  {arg.timeText} — {arg.event.title}
                </div>
                {ext?.room && <div className="sb-evt-sub text-foreground/70">{ext.room}</div>}
                {statusRaw && (
                  <div className="sb-evt-foot">
                    <span
                      className={`sb-evt-pill ${pillClass} text-xs px-2 py-0.5 rounded-full font-semibold
                        ${pillClass === "open" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200" : ""}
                        ${pillClass === "wait" ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" : ""}
                        ${pillClass === "closed" ? "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200" : ""}
                      `}
                    >
                      {statusRaw}
                    </span>
                  </div>
                )}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}
