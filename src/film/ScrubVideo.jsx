import { useEffect, useRef, useState } from 'react';
import { motion, transform, useMotionValueEvent, useTransform } from 'framer-motion';
import scrubLoop from './scrubLoop';
import useIsDesktop from './useIsDesktop';
import { pickSrc, videoTime } from './math';

/**
 * Scroll-scrubbed all-intra video. No bytes are requested until activation:
 * `nearViewport` activates one viewport ahead, `afterLoad` activates on the window load event.
 * The target time is recomputed from the current progress on metadata, registration and src change.
 */
export default function ScrubVideo({
  progress, window: win, src, srcMobile, poster, loadPolicy = 'nearViewport',
  className = '', style = {}, opacity,
}) {
  const videoRef = useRef(null);
  const durationRef = useRef(0);
  const targetRef = useRef(0);
  const entryRef = useRef(null);
  const isDesktop = useIsDesktop();
  const [activated, setActivated] = useState(false);
  const [active, setActive] = useState(false);
  const [failed, setFailed] = useState(false);
  const of = opacity ? transform(opacity[0], opacity[1]) : () => 1;
  const op = useTransform(progress, (p) => of(p));

  const recompute = () => {
    if (!durationRef.current) return;
    targetRef.current = videoTime(win, progress.get(), durationRef.current);
  };

  useMotionValueEvent(progress, 'change', () => recompute());

  // Activation: start loading on the chosen policy.
  useEffect(() => {
    if (activated) return undefined;
    const el = videoRef.current;
    if (!el) return undefined;
    if (loadPolicy === 'afterLoad') {
      if (document.readyState === 'complete') {
        const t = setTimeout(() => setActivated(true), 0); // never set state synchronously inside an effect
        return () => clearTimeout(t);
      }
      const onLoad = () => setActivated(true);
      window.addEventListener('load', onLoad, { once: true });
      return () => window.removeEventListener('load', onLoad);
    }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { io.disconnect(); setActivated(true); }
    }, { rootMargin: '100% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [activated, loadPolicy]);

  // Load the chosen source once activated; reload if the breakpoint changes.
  useEffect(() => {
    if (!activated || failed) return undefined;
    const el = videoRef.current;
    if (!el) return undefined;
    const chosen = pickSrc(isDesktop, src, srcMobile);
    const onMeta = () => { durationRef.current = el.duration || 0; recompute(); };
    const onError = () => { setFailed(true); if (entryRef.current) scrubLoop.unregister(entryRef.current); };
    el.addEventListener('loadedmetadata', onMeta);
    el.addEventListener('error', onError);
    if (el.getAttribute('src') === chosen) {
      if (el.duration > 0) onMeta(); // metadata already arrived before this effect re-ran
    } else {
      el.preload = 'auto';
      el.src = chosen;
      el.load();
      const prime = el.play();
      if (prime && typeof prime.then === 'function') prime.then(() => el.pause()).catch(() => {});
    }
    return () => {
      el.removeEventListener('loadedmetadata', onMeta);
      el.removeEventListener('error', onError);
    };
  }, [activated, failed, isDesktop, src, srcMobile]); // eslint-disable-line react-hooks/exhaustive-deps

  // Register with the shared loop only while the video is near the viewport.
  useEffect(() => {
    if (!activated || failed) return undefined;
    const el = videoRef.current;
    if (!el) return undefined;
    const entry = { video: el, target: () => targetRef.current };
    entryRef.current = entry;
    const io = new IntersectionObserver((entries) => {
      const near = entries.some((e) => e.isIntersecting);
      if (near) { recompute(); scrubLoop.register(entry); setActive(true); }
      else { scrubLoop.unregister(entry); setActive(false); }
    }, { rootMargin: '100% 0px' });
    io.observe(el);
    return () => { io.disconnect(); scrubLoop.unregister(entry); };
  }, [activated, failed]); // eslint-disable-line react-hooks/exhaustive-deps

  if (failed) {
    return <motion.img data-video-failed="true" src={poster} alt="" aria-hidden="true" className={className} style={{ ...style, opacity: op }} />;
  }

  return (
    // Decorative. A nearViewport poster waits for activation so it loads with its video, not with the page;
    // an afterLoad (title card) poster is set at once: it is preloaded and keeps the hero sized before load.
    <motion.video ref={videoRef} poster={activated || loadPolicy === 'afterLoad' ? poster : undefined} muted playsInline preload="none" aria-hidden="true"
      data-scrub-active={active ? 'true' : undefined}
      className={className} style={{ ...style, opacity: op }} />
  );
}
