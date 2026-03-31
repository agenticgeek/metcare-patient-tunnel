declare global {
  interface Window {
    fbq?: (type: string, event: string, data?: Record<string, unknown>) => void;
  }
}

export type PixelEventData = Record<string, unknown>;

const send = (type: string, event: string, data?: PixelEventData) => {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  if (data) {
    window.fbq(type, event, data);
  } else {
    window.fbq(type, event);
  }
};

export const trackPageView = () => send('track', 'PageView');

export const trackViewContent = (content_name: string) =>
  send('track', 'ViewContent', { content_name });

export const trackLead = (content_name: string) =>
  send('track', 'Lead', { content_name });

export const trackCustom = (eventName: string, data?: PixelEventData) =>
  send('trackCustom', eventName, data ?? {});

export {};

