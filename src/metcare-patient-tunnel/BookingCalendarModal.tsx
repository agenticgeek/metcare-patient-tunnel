import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

/** METCARE booking calendar (GHL/LeadConnector widget). */
export const BOOKING_CALENDAR_URL =
  'https://api.myesthetictravel.com/widget/bookings/mon-rdv-en-soins-pr-et-post-op';
/** GHL embed script — enables auto-resize and the in-widget booking flow. */
const BOOKING_EMBED_SCRIPT_URL = 'https://api.myesthetictravel.com/js/form_embed.js';

export default function BookingCalendarModal({
  isOpen,
  onClose,
  lang,
}: {
  isOpen: boolean;
  onClose: () => void;
  lang: 'fr' | 'en' | 'es';
}) {
  // Load GHL embed script once (auto-resize + in-widget booking flow).
  useEffect(() => {
    if (!isOpen) return;
    if (!document.querySelector(`script[src="${BOOKING_EMBED_SCRIPT_URL}"]`)) {
      const script = document.createElement('script');
      script.src = BOOKING_EMBED_SCRIPT_URL;
      script.async = true;
      document.body.appendChild(script);
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const title =
    lang === 'fr'
      ? 'Réservez votre rendez-vous'
      : lang === 'en'
      ? 'Book your appointment'
      : 'Reserva tu cita';
  const closeLabel = lang === 'fr' ? 'Fermer' : lang === 'en' ? 'Close' : 'Cerrar';

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-cherry/40 backdrop-blur-xl"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 32, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, y: 24, filter: 'blur(10px)' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[1001] flex items-center justify-center p-4 sm:p-6"
          >
            <div className="patient-tunnel-glass relative flex h-[calc(100dvh-2rem)] max-h-[1000px] w-full max-w-4xl flex-col overflow-hidden rounded-[2.5rem] border border-white/20 shadow-2xl shadow-cherry/30">
              <div className="relative flex shrink-0 items-center justify-between border-b border-cherry/10 bg-white/30 px-6 py-5 md:px-8">
                <h2 className="text-lg font-semibold text-cherry md:text-xl">{title}</h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={closeLabel}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-cherry/5 text-cherry/40 transition-all hover:bg-cherry/10 hover:text-cherry"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-white">
                <iframe
                  id="patient-tunnel-booking-iframe"
                  src={BOOKING_CALENDAR_URL}
                  title={title}
                  className="block w-full border-0"
                  style={{ minHeight: '100%', height: '1100px' }}
                  scrolling="no"
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
