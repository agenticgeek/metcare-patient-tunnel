/**
 * Shared handle to the active Lenis instance so overlays (e.g. the form modal)
 * can pause page smooth-scrolling while they are open. Lenis drives scrolling
 * from JS, so `overflow: hidden` on <body> alone does not stop the page from
 * moving behind a modal — we must stop Lenis explicitly.
 */
type LenisLike = { stop: () => void; start: () => void };

let instance: LenisLike | null = null;

export function setLenisInstance(l: LenisLike | null) {
  instance = l;
}

export function stopLenis() {
  instance?.stop();
}

export function startLenis() {
  instance?.start();
}
