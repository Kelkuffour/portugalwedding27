import React, { useState } from 'react';
import { Check, CheckCircle2, Copy, Phone, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { EmbossedFloralDivider } from './EmbossedRoseCorner';
import type { GuestbookWish, RsvpEntry } from '../../server';

interface RsvpSectionProps {
  rsvps: RsvpEntry[];
  onRsvpSubmitted: (entry: RsvpEntry) => void;
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({ rsvps, onRsvpSubmitted }) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [attending, setAttending] = useState<'joyfully_accepts' | 'regretfully_declines'>('joyfully_accepts');
  const [guestsCount, setGuestsCount] = useState<number>(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedEntry, setSubmittedEntry] = useState<RsvpEntry | null>(null);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText('4122 222 222');
      setCopiedPhone(true);
      window.setTimeout(() => setCopiedPhone(false), 2000);
    } catch {
      // Ignore error
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!contact.trim()) {
      setError('Please provide your telephone number or email address.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          contact: contact.trim(),
          attending,
          guestsCount: attending === 'joyfully_accepts' ? guestsCount : 0,
          attireNote: 'White or Brown',
          message: message.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Could not save RSVP.');
      }

      const data = await res.json();
      setSubmittedEntry(data.rsvp);
      onRsvpSubmitted(data.rsvp);
      setName('');
      setContact('');
      setMessage('');
    } catch (err) {
      const fallback: RsvpEntry = {
        id: `local-rsvp-${Date.now()}`,
        name: name.trim(),
        contact: contact.trim(),
        attending,
        guestsCount: attending === 'joyfully_accepts' ? guestsCount : 0,
        attireNote: 'White or Brown',
        message: message.trim(),
        createdAt: new Date().toISOString(),
      };
      setSubmittedEntry(fallback);
      onRsvpSubmitted(fallback);
      if (err instanceof Error && err.message.includes('Please')) {
        setError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.section
      id="rsvp"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="py-12 px-6 sm:px-12 border-b border-[#8A7666]/25"
    >
      {/*Exact RSVP Typography from the Uploaded Card */}
      <div className="text-center mb-8">
        <h2 className="font-serif-editorial text-4xl sm:text-5xl tracking-[0.16em] text-[#3B2F26] mb-2">
          RSVP
        </h2>
        <p className="font-roman-caps text-xs tracking-[0.22em] text-[#3B2F26] tabular-nums mb-1">
          BY 2 TH JULY AT 4122 222 222
        </p>
        <p className="font-roman-caps text-[11px] tracking-[0.22em] text-[#6E5D4F]">
          REGISTERED AT NAME
        </p>

        {/* Direct Phone Call & Copy Bar */}
        <div className="mt-4 flex items-center justify-center gap-2.5">
          <a
            href="tel:4122222222"
            className="embossed-button px-3.5 py-1.5 rounded-xs border border-[#D5CDBD] text-[10px] font-roman-caps tracking-[0.18em] text-[#3B2F26] inline-flex items-center gap-1.5 tabular-nums"
          >
            <Phone className="w-3 h-3 text-[#3B2F26]" />
            <span>CALL 4122 222 222</span>
          </a>
          <button
            type="button"
            onClick={handleCopyPhone}
            className="embossed-button px-3.5 py-1.5 rounded-xs border border-[#D5CDBD] text-[10px] font-roman-caps tracking-[0.18em] text-[#3B2F26] inline-flex items-center gap-1.5 cursor-pointer"
          >
            {copiedPhone ? (
              <>
                <Check className="w-3 h-3 text-[#3B2F26]" />
                <span>COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-[#6E5D4F]" />
                <span>COPY NUMBER</span>
              </>
            )}
          </button>
        </div>

        <EmbossedFloralDivider className="my-5" />
      </div>

      {submittedEntry ? (
        <div className="p-6 border border-[#C8BFA8] bg-[#F7F5F0] text-center rounded-xs">
          <CheckCircle2 className="w-8 h-8 text-[#3B2F26] mx-auto mb-2 stroke-[1.5]" />
          <h3 className="font-script text-4xl text-[#3B2F26] mb-2">
            Thank You, {submittedEntry.name}
          </h3>
          <p className="text-sm text-[#5C4B3E] leading-relaxed mb-4">
            {submittedEntry.attending === 'joyfully_accepts'
              ? `Your attendance (${submittedEntry.guestsCount} ${
                  submittedEntry.guestsCount === 1 ? 'Guest' : 'Guests'
                }) is confirmed for July 16, 2026 at Three O’Clock in the Afternoon.`
              : 'Your response has been recorded. Thank you for letting us know.'}
          </p>
          <button
            type="button"
            onClick={() => setSubmittedEntry(null)}
            className="embossed-button px-5 py-2 rounded-xs border border-[#D5CDBD] text-[11px] font-roman-caps tracking-[0.2em] text-[#3B2F26] cursor-pointer"
          >
            UPDATE RESPONSE
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto" noValidate>
          {error && (
            <div
              role="alert"
              className="p-3 border border-[#8C3B2B] bg-[#F9EFEA] text-xs text-[#6E2618] text-center"
            >
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="rsvp-name"
              className="block font-roman-caps text-[10px] tracking-[0.22em] text-[#3B2F26] mb-1.5"
            >
              YOUR FULL NAME *
            </label>
            <input
              id="rsvp-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3.5 py-2.5 bg-[#FAF8F4] border border-[#D5CDBD] text-sm text-[#3B2F26] placeholder:text-[#9C8D7E] focus:outline-1 focus:outline-[#3B2F26]"
            />
          </div>

          <div>
            <label
              htmlFor="rsvp-contact"
              className="block font-roman-caps text-[10px] tracking-[0.22em] text-[#3B2F26] mb-1.5"
            >
              PHONE NUMBER OR EMAIL *
            </label>
            <input
              id="rsvp-contact"
              type="text"
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Enter your phone or email"
              className="w-full px-3.5 py-2.5 bg-[#FAF8F4] border border-[#D5CDBD] text-sm text-[#3B2F26] placeholder:text-[#9C8D7E] focus:outline-1 focus:outline-[#3B2F26]"
            />
          </div>

          <div>
            <span className="block font-roman-caps text-[10px] tracking-[0.22em] text-[#3B2F26] mb-1.5">
              WILL YOU ATTEND? *
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setAttending('joyfully_accepts')}
                className={`py-2.5 px-3 border text-center font-roman-caps text-[10px] tracking-[0.18em] transition-colors cursor-pointer ${
                  attending === 'joyfully_accepts'
                    ? 'bg-[#3B2F26] text-[#FAF8F4] border-[#3B2F26]'
                    : 'bg-[#FAF8F4] text-[#3B2F26] border-[#D5CDBD]'
                }`}
              >
                JOYFULLY ACCEPTS
              </button>

              <button
                type="button"
                onClick={() => setAttending('regretfully_declines')}
                className={`py-2.5 px-3 border text-center font-roman-caps text-[10px] tracking-[0.18em] transition-colors cursor-pointer ${
                  attending === 'regretfully_declines'
                    ? 'bg-[#3B2F26] text-[#FAF8F4] border-[#3B2F26]'
                    : 'bg-[#FAF8F4] text-[#3B2F26] border-[#D5CDBD]'
                }`}
              >
                REGRETFULLY DECLINES
              </button>
            </div>
          </div>

          {attending === 'joyfully_accepts' && (
            <div>
              <label
                htmlFor="rsvp-guests"
                className="block font-roman-caps text-[10px] tracking-[0.22em] text-[#3B2F26] mb-1.5"
              >
                NUMBER OF ACCOMPANYING GUESTS
              </label>
              <select
                id="rsvp-guests"
                value={guestsCount}
                onChange={(e) => setGuestsCount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F4] border border-[#D5CDBD] text-sm text-[#3B2F26] focus:outline-1 focus:outline-[#3B2F26]"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest (Just Me)' : `Guests (Party of ${num})`}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label
              htmlFor="rsvp-message"
              className="block font-roman-caps text-[10px] tracking-[0.22em] text-[#3B2F26] mb-1.5"
            >
              MESSAGE OR NOTE (OPTIONAL)
            </label>
            <textarea
              id="rsvp-message"
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Dietary notes or message..."
              className="w-full px-3.5 py-2.5 bg-[#FAF8F4] border border-[#D5CDBD] text-sm text-[#3B2F26] placeholder:text-[#9C8D7E] focus:outline-1 focus:outline-[#3B2F26]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="embossed-button w-full py-3 px-6 border border-[#C8BFA8] font-roman-caps text-xs tracking-[0.24em] text-[#3B2F26] cursor-pointer disabled:opacity-60"
          >
            {submitting ? 'SENDING RSVP...' : 'CONFIRM ATTENDANCE'}
          </button>
        </form>
      )}

      {rsvps.length > 0 && (
        <p className="mt-5 text-center font-roman-caps text-[10px] tracking-[0.2em] text-[#6E5D4F] tabular-nums">
          CONFIRMED RESPONSES: {rsvps.length}
        </p>
      )}
    </motion.section>
  );
};

interface GuestbookSectionProps {
  wishes: GuestbookWish[];
  onWishAdded: (wish: GuestbookWish) => void;
}

export const GuestbookSection: React.FC<GuestbookSectionProps> = ({ wishes, onWishAdded }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!message.trim()) {
      setError('Please write a message for Elisabeth Anderson.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          relationship: 'Guest',
          message: message.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Could not post wish.');
      }

      const data = await res.json();
      onWishAdded(data.wish);
      setName('');
      setMessage('');
    } catch {
      const fallbackWish: GuestbookWish = {
        id: `local-wish-${Date.now()}`,
        name: name.trim(),
        relationship: 'Guest',
        message: message.trim(),
        createdAt: new Date().toISOString(),
      };
      onWishAdded(fallbackWish);
      setName('');
      setMessage('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.section
      id="guestbook"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="py-12 px-6 sm:px-12 border-b border-[#8A7666]/25"
    >
      <div className="text-center mb-7">
        <p className="font-roman-caps text-[11px] tracking-[0.26em] text-[#6E5D4F] mb-2">
          WISHES &amp; BLESSINGS
        </p>
        <h2 className="font-script text-4xl sm:text-5xl text-[#3B2F26] letterpress-text">
          Guestbook
        </h2>
        <p className="mt-2 text-sm text-[#5C4B3E]">
          Leave your warmest wishes for Elisabeth Anderson.
        </p>
        <EmbossedFloralDivider className="my-4" />
      </div>

      {/* Guestbook Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5 max-w-md mx-auto mb-8" noValidate>
        {error && (
          <div
            role="alert"
            className="p-2.5 border border-[#8C3B2B] bg-[#F9EFEA] text-xs text-[#6E2618] text-center"
          >
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="wish-name"
            className="block font-roman-caps text-[10px] tracking-[0.22em] text-[#3B2F26] mb-1"
          >
            YOUR NAME *
          </label>
          <input
            id="wish-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full px-3.5 py-2.5 bg-[#FAF8F4] border border-[#D5CDBD] text-sm text-[#3B2F26] placeholder:text-[#9C8D7E] focus:outline-1 focus:outline-[#3B2F26]"
          />
        </div>

        <div>
          <label
            htmlFor="wish-message"
            className="block font-roman-caps text-[10px] tracking-[0.22em] text-[#3B2F26] mb-1"
          >
            YOUR WISHES *
          </label>
          <textarea
            id="wish-message"
            rows={3}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a congratulatory message..."
            className="w-full px-3.5 py-2.5 bg-[#FAF8F4] border border-[#D5CDBD] text-sm text-[#3B2F26] placeholder:text-[#9C8D7E] focus:outline-1 focus:outline-[#3B2F26]"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="embossed-button w-full py-3 px-6 border border-[#C8BFA8] font-roman-caps text-xs tracking-[0.22em] text-[#3B2F26] inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          <Send className="w-3.5 h-3.5 text-[#3B2F26]" />
          <span>{submitting ? 'SENDING...' : 'SEND WISHES'}</span>
        </button>
      </form>

      {/* Submitted Wishes Scrollable Feed (ChungDoi Sổ Lưu Bút Box) */}
      <div className="max-w-md mx-auto max-h-72 overflow-y-auto space-y-3 pr-1">
        {wishes.length === 0 ? (
          <div className="p-6 border border-[#D8CFC0] bg-[#F7F5F0] text-center text-sm text-[#6E5D4F]">
            No wishes yet. Be the first to leave a blessing for Elisabeth Anderson.
          </div>
        ) : (
          wishes.map((wish) => (
            <div
              key={wish.id}
              className="p-4 bg-[#F7F5F0] border border-[#D8CFC0] text-left"
            >
              <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-[#8A7666]/20">
                <span className="font-roman-caps text-xs tracking-[0.16em] text-[#3B2F26] font-medium">
                  {wish.name}
                </span>
                <span className="font-roman-caps text-[10px] tracking-[0.14em] text-[#6E5D4F] tabular-nums">
                  {new Date(wish.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <p className="font-serif-editorial text-base text-[#4D3E32] leading-relaxed">
                {wish.message}
              </p>
            </div>
          ))
        )}
      </div>
    </motion.section>
  );
};
