import React, { useEffect, useState } from 'react';
import { Calendar, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { EmbossedFloralDivider } from './EmbossedRoseCorner';

// July 16, 2026 at 3:00 PM in Miami (EDT, UTC-4)
const TARGET_ISO_MIAMI = '2026-07-16T15:00:00-04:00';
const TARGET_TIMESTAMP = new Date(TARGET_ISO_MIAMI).getTime();

// July 2026 starts on Wednesday (index 3 in Sun-Sat) and has 31 days
const JULY_2026_DAYS = [
  null, null, null, 1, 2, 3, 4,
  5, 6, 7, 8, 9, 10, 11,
  12, 13, 14, 15, 16, 17, 18,
  19, 20, 21, 22, 23, 24, 25,
  26, 27, 28, 29, 30, 31, null,
];

export const CountdownAndCalendarSection: React.FC = () => {
  const [nowMs, setNowMs] = useState<number>(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const diffMs = TARGET_TIMESTAMP - nowMs;
  const hasPassed = diffMs <= 0;
  const absSeconds = Math.floor(Math.abs(diffMs) / 1000);

  const days = Math.floor(absSeconds / (3600 * 24));
  const hours = Math.floor((absSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((absSeconds % 3600) / 60);
  const seconds = absSeconds % 60;

  const googleCalendarUrl = (() => {
    const title = encodeURIComponent('Bridal Shower Honouring Elisabeth Anderson');
    const dates = '20260716T190000Z/20260716T230000Z';
    const location = encodeURIComponent('Love Gardens Villa, Pearlsville CA 1238 Miami');
    const details = encodeURIComponent(
      'You are invited to a Bridal Shower honouring Elisabeth Anderson on July 16, 2026 at Three O’Clock in the Afternoon.\n\nVenue: Love Gardens Villa, Pearlsville CA 1238 Miami\nDresscode: Please wear something white or brown.\nRSVP by 2th July at 4122 222 222.\nRegistered at Name.'
    );
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&location=${location}&details=${details}`;
  })();

  const handleDownloadIcs = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Elisabeth Anderson Invitation//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:elisabeth-anderson-20260716@lovegardensvilla.miami',
      'DTSTAMP:20260701T120000Z',
      'DTSTART:20260716T190000Z',
      'DTEND:20260716T230000Z',
      'SUMMARY:Bridal Shower Honouring Elisabeth Anderson',
      'LOCATION:Love Gardens Villa\\, Pearlsville CA 1238 Miami',
      'DESCRIPTION:You are invited to a Bridal Shower honouring Elisabeth Anderson. Dresscode: Please wear something white or brown. RSVP by 2th July at 4122 222 222.',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'elisabeth-anderson-july-16-2026.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Section 06: Wedding Countdown */}
      <motion.section
        id="countdown"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="py-12 px-6 sm:px-12 text-center border-b border-[#8A7666]/25"
      >
        <p className="font-roman-caps text-[11px] tracking-[0.26em] text-[#6E5D4F] mb-2">
          COUNTING THE MOMENTS
        </p>
        <h2 className="font-script text-4xl sm:text-5xl text-[#3B2F26] mb-6 letterpress-text">
          Save The Date
        </h2>

        {/* 4-Column Countdown Box */}
        <div
          className="grid grid-cols-4 border-y border-[#3B2F26]/40 py-5 max-w-md mx-auto"
          aria-live="polite"
        >
          <div className="border-r border-[#3B2F26]/35 px-2">
            <div className="font-serif-editorial text-3xl sm:text-4xl text-[#3B2F26] tabular-nums leading-none">
              {String(days).padStart(2, '0')}
            </div>
            <div className="mt-2 font-roman-caps text-[9px] sm:text-[10px] tracking-[0.22em] text-[#6E5D4F]">
              DAYS
            </div>
          </div>

          <div className="border-r border-[#3B2F26]/35 px-2">
            <div className="font-serif-editorial text-3xl sm:text-4xl text-[#3B2F26] tabular-nums leading-none">
              {String(hours).padStart(2, '0')}
            </div>
            <div className="mt-2 font-roman-caps text-[9px] sm:text-[10px] tracking-[0.22em] text-[#6E5D4F]">
              HOURS
            </div>
          </div>

          <div className="border-r border-[#3B2F26]/35 px-2">
            <div className="font-serif-editorial text-3xl sm:text-4xl text-[#3B2F26] tabular-nums leading-none">
              {String(minutes).padStart(2, '0')}
            </div>
            <div className="mt-2 font-roman-caps text-[9px] sm:text-[10px] tracking-[0.22em] text-[#6E5D4F]">
              MINUTES
            </div>
          </div>

          <div className="px-2">
            <div className="font-serif-editorial text-3xl sm:text-4xl text-[#3B2F26] tabular-nums leading-none">
              {String(seconds).padStart(2, '0')}
            </div>
            <div className="mt-2 font-roman-caps text-[9px] sm:text-[10px] tracking-[0.22em] text-[#6E5D4F]">
              SECONDS
            </div>
          </div>
        </div>

        <p className="mt-3 font-roman-caps text-[10px] tracking-[0.2em] text-[#6E5D4F]">
          {hasPassed
            ? 'CELEBRATED ON JULY 16, 2026 AT THREE O’CLOCK IN THE AFTERNOON'
            : 'UNTIL JULY 16, 2026 · THREE O’CLOCK IN THE AFTERNOON'}
        </p>
      </motion.section>

      {/* Section 07: Calendar Sheet & Calendar Integration */}
      <motion.section
        id="calendar"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="py-12 px-6 sm:px-12 text-center border-b border-[#8A7666]/25"
      >
        {/* ChungDoi-Style Monthly Calendar Sheet for July 2026 */}
        <div className="max-w-xs mx-auto p-5 bg-[#F7F5F0] border border-[#D8CFC0] mb-7">
          <div className="font-roman-caps text-sm tracking-[0.28em] text-[#3B2F26] pb-3 mb-3 border-b border-[#8A7666]/30">
            JULY · 2026
          </div>

          <div className="grid grid-cols-7 gap-1 text-[10px] font-roman-caps tracking-[0.12em] text-[#6E5D4F] mb-2">
            <span>SU</span>
            <span>MO</span>
            <span>TU</span>
            <span>WE</span>
            <span>TH</span>
            <span>FR</span>
            <span>SA</span>
          </div>

          <div className="grid grid-cols-7 gap-y-2 text-sm font-serif-editorial tabular-nums text-[#3B2F26]">
            {JULY_2026_DAYS.map((day, idx) => {
              const isWeddingDay = day === 16;
              return (
                <div
                  key={idx}
                  className="relative h-8 flex items-center justify-center"
                >
                  {day !== null && (
                    <>
                      {isWeddingDay && (
                        <svg
                          viewBox="0 0 36 36"
                          className="absolute inset-0 w-8 h-8 mx-auto my-auto text-[#3B2F26]"
                          fill="none"
                        >
                          <path
                            d="M18 31 C18 31 5 22.5 5 13 C5 8.5 8.5 5.5 12.5 5.5 C15.2 5.5 17.2 7 18 9 C18.8 7 20.8 5.5 23.5 5.5 C27.5 5.5 31 8.5 31 13 C31 22.5 18 31 18 31 Z"
                            stroke="#3B2F26"
                            strokeWidth="1.3"
                            fill="rgba(59, 47, 38, 0.08)"
                          />
                        </svg>
                      )}
                      <span className={isWeddingDay ? 'font-bold text-[#3B2F26] relative z-10' : ''}>
                        {day}
                      </span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <EmbossedFloralDivider className="my-5" />

        {/* Add to Calendar Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="embossed-button w-full sm:w-auto px-5 py-3 rounded-xs border border-[#C8BFA8] font-roman-caps text-[11px] tracking-[0.2em] text-[#3B2F26] inline-flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Calendar className="w-3.5 h-3.5 text-[#3B2F26]" />
            <span>ADD TO GOOGLE CALENDAR</span>
          </a>

          <button
            type="button"
            onClick={handleDownloadIcs}
            className="embossed-button w-full sm:w-auto px-5 py-3 rounded-xs border border-[#C8BFA8] font-roman-caps text-[11px] tracking-[0.2em] text-[#3B2F26] inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-[#3B2F26]" />
            <span>DOWNLOAD CALENDAR (.ICS)</span>
          </button>
        </div>
      </motion.section>
    </>
  );
};
