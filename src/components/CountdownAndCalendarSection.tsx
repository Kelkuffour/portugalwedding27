import React, { useEffect, useState } from 'react';
import { Calendar, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { EmbossedFloralDivider } from './EmbossedRoseCorner';

// July 24, 2027 at 14:00 in Portugal (summer time, UTC+1).
const TARGET_ISO_PORTUGAL = '2027-07-24T14:00:00+01:00';
const TARGET_TIMESTAMP = new Date(TARGET_ISO_PORTUGAL).getTime();

// July 2027 starts on Thursday (Sunday-first grid).
const JULY_2027_DAYS = [
  null, null, null, null, 1, 2, 3,
  4, 5, 6, 7, 8, 9, 10,
  11, 12, 13, 14, 15, 16, 17,
  18, 19, 20, 21, 22, 23, 24,
  25, 26, 27, 28, 29, 30, 31,
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
    const title = encodeURIComponent('Casamento de Agostinho e Kety');
    const dates = '20270724T130000Z/20270724T130000Z';
    const location = encodeURIComponent('Rua das Nogueiras 7, Foros do Almada, 2130-523 Santo Estêvão');
    const details = encodeURIComponent(
      'Casamento de Agostinho e Kety — 24 de julho de 2027 às 14 horas.\n\nMorada: Rua das Nogueiras 7, Foros do Almada, 2130-523 Santo Estêvão\nDress code: Black tie / Casual chic.\nConfirmar presença até o dia 31 de março.\n'
    );
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&location=${location}&details=${details}`;
  })();

  const handleDownloadIcs = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Agostinho e Kety Invitation//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:agostinho-kety-20270724@wedding.local',
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
      'DTSTART:20270724T130000Z',
      'SUMMARY:Casamento de Agostinho e Kety',
      'LOCATION:Rua das Nogueiras 7\\, Foros do Almada\\, 2130-523 Santo Estêvão',
      'DESCRIPTION:Casamento de Agostinho e Kety. Dress code: Black tie / Casual chic. Confirmar presença até o dia 31 de março.',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'agostinho-kety-24-julho-2027.ics');
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
          CONTANDO OS MOMENTOS
        </p>
        <h2 className="font-script text-4xl sm:text-5xl text-[#3B2F26] mb-6 letterpress-text">
          Reserve a data
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
              DIAS
            </div>
          </div>

          <div className="border-r border-[#3B2F26]/35 px-2">
            <div className="font-serif-editorial text-3xl sm:text-4xl text-[#3B2F26] tabular-nums leading-none">
              {String(hours).padStart(2, '0')}
            </div>
            <div className="mt-2 font-roman-caps text-[9px] sm:text-[10px] tracking-[0.22em] text-[#6E5D4F]">
              HORAS
            </div>
          </div>

          <div className="border-r border-[#3B2F26]/35 px-2">
            <div className="font-serif-editorial text-3xl sm:text-4xl text-[#3B2F26] tabular-nums leading-none">
              {String(minutes).padStart(2, '0')}
            </div>
            <div className="mt-2 font-roman-caps text-[9px] sm:text-[10px] tracking-[0.22em] text-[#6E5D4F]">
              MINUTOS
            </div>
          </div>

          <div className="px-2">
            <div className="font-serif-editorial text-3xl sm:text-4xl text-[#3B2F26] tabular-nums leading-none">
              {String(seconds).padStart(2, '0')}
            </div>
            <div className="mt-2 font-roman-caps text-[9px] sm:text-[10px] tracking-[0.22em] text-[#6E5D4F]">
              SEGUNDOS
            </div>
          </div>
        </div>

        <p className="mt-3 font-roman-caps text-[10px] tracking-[0.2em] text-[#6E5D4F]">
          {hasPassed
            ? 'CELEBRADO EM 24 DE JULHO DE 2027 ÀS 14 HORAS'
            : 'UNTIL 24 DE JULHO DE 2027 · 14 HORAS'}
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
        {/* ChungDoi-Style Monthly Calendar Sheet for July 2027 */}
        <div className="max-w-xs mx-auto p-5 bg-[#F7F5F0] border border-[#D8CFC0] mb-7">
          <div className="font-roman-caps text-sm tracking-[0.28em] text-[#3B2F26] pb-3 mb-3 border-b border-[#8A7666]/30">
            JULHO · 2027
          </div>

          <div className="grid grid-cols-7 gap-1 text-[10px] font-roman-caps tracking-[0.12em] text-[#6E5D4F] mb-2">
            <span>DOM</span>
            <span>SEG</span>
            <span>TER</span>
            <span>QUA</span>
            <span>QUI</span>
            <span>SEX</span>
            <span>SÁB</span>
          </div>

          <div className="grid grid-cols-7 gap-y-2 text-sm font-serif-editorial tabular-nums text-[#3B2F26]">
            {JULY_2027_DAYS.map((day, idx) => {
              const isWeddingDay = day === 24;
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
        <div className="flex flex-col items-stretch gap-3 w-full max-w-md mx-auto">
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="embossed-button w-full min-w-0 px-3 py-3 rounded-xs border border-[#C8BFA8] font-roman-caps text-[11px] tracking-[0.2em] text-[#3B2F26] inline-flex items-center justify-center gap-2 text-center whitespace-normal"
          >
            <Calendar className="w-3.5 h-3.5 shrink-0 text-[#3B2F26]" />
            <span>ADICIONAR AO GOOGLE CALENDAR</span>
          </a>

          <button
            type="button"
            onClick={handleDownloadIcs}
            className="embossed-button w-full min-w-0 px-3 py-3 rounded-xs border border-[#C8BFA8] font-roman-caps text-[11px] tracking-[0.2em] text-[#3B2F26] inline-flex items-center justify-center gap-2 cursor-pointer text-center whitespace-normal"
          >
            <Download className="w-3.5 h-3.5 shrink-0 text-[#3B2F26]" />
            <span>BAIXAR CALENDÁRIO (.ICS)</span>
          </button>
        </div>
      </motion.section>
    </>
  );
};
