import useIsDesktop from './useIsDesktop';

/**
 * The office scenes' shared coordinate space.
 * Desktop: a 16:9 box contain-fitted and centred in its parent (the stage, the static block or the
 * 1920×1080 capture stage), so the backdrop, the Build clip, the boxes and the actors keep the same
 * relative geometry at every viewport; the parent's paper shows in the letterbox bars. Children position
 * in % of the camera and may size in `cqw`/`cqh` (the camera is a size container).
 * Mobile: the parent itself, so the banded mobile layout is unchanged.
 */
export default function Camera({ children }) {
  const isDesktop = useIsDesktop();
  if (!isDesktop) return <div data-camera className="absolute inset-0">{children}</div>;
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ containerType: 'size' }}>
      <div data-camera className="absolute overflow-hidden"
        style={{
          left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
          width: 'min(100cqw, calc(100cqh * 16 / 9))', height: 'min(100cqh, calc(100cqw * 9 / 16))',
          containerType: 'size',
        }}>
        {children}
      </div>
    </div>
  );
}
