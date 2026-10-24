import { useState, useEffect, useRef } from 'react';

const OptimizedImage = ({
  src,
  alt,
  lazy = true,
  className = '',
  priority = false,
  srcSet,
  sizes,
  onLoadingChange
}) => {
  const [loaded, setLoaded] = useState(!lazy);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!lazy || priority) {
      setLoaded(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, priority]);

  const getWebPSrc = (jpegPath) => {
    if (!jpegPath) return '';
    return jpegPath.replace(/\.(jpg|jpeg)$/i, '.webp');
  };

  const handleLoad = () => {
    setLoaded(true);
    onLoadingChange?.(true);
  };

  const handleError = () => {
    setError(true);
    onLoadingChange?.(false);
  };

  const webpSrc = getWebPSrc(src);
  const showWebPSource = webpSrc && webpSrc !== src && !error;

  return (
    <picture ref={imgRef}>
      {showWebPSource && (
        <source srcSet={webpSrc} type="image/webp" sizes={sizes} />
      )}
      <img
        src={loaded ? src : 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}
        alt={alt}
        srcSet={loaded ? srcSet : undefined}
        sizes={sizes}
        loading={lazy ? 'lazy' : 'eager'}
        className={className}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          opacity: loaded ? 1 : 0.5,
          transition: 'opacity 0.3s ease'
        }}
      />
    </picture>
  );
};

export default OptimizedImage;
