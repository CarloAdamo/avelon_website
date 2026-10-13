export function Paper() {
  return (
    <div aria-hidden="true" className="absolute inset-0"
      style={{ backgroundImage: 'url(/film/paper.png)', backgroundRepeat: 'repeat', backgroundSize: '160px 160px' }} />
  );
}

export function Backdrop({ src, srcMobile, alt = '' }) {
  return (
    <picture>
      {srcMobile && <source media="(max-width: 767px)" srcSet={srcMobile} />}
      <img src={src} alt={alt} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
    </picture>
  );
}
