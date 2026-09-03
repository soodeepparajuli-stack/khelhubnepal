'use client';

import { useState, useEffect } from 'react';
import { Ad } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AdBannerProps {
  ads: Ad[];
  className?: string;
  style?: React.CSSProperties;
}

export default function AdBanner({ ads, className = '', style }: AdBannerProps) {
  const activeAds = ads.filter(a => a.is_active !== false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const multiple = activeAds.length > 1;

  useEffect(() => {
    if (!multiple || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex(i => (i + 1) % activeAds.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeAds.length, multiple, isPaused]);

  const ad = activeAds[currentIndex];
  if (!ad) return null;

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(i => (i - 1 + activeAds.length) % activeAds.length);
  };

  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(i => (i + 1) % activeAds.length);
  };

  const isSidebar = className.includes('sidebar');
  const isHeader = className.includes('header') || className.includes('ad-header');
  const isFullWidth = className.includes('full-width') || className.includes('ad-full-width');

  // Ad Content
  const adContent = ad.code ? (
    <div
      style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
      dangerouslySetInnerHTML={{ __html: ad.code }}
    />
  ) : ad.image_url ? (
    <a
      href={ad.link_url || '#'}
      target="_blank"
      rel="noopener noreferrer sponsored"
      style={{
        display: 'block',
        width: '100%',
        maxWidth: isHeader ? '480px' : 'none',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={ad.image_url}
        alt={`Advertisement - ${ad.name}`}
        style={{
          width: '100%',
          maxWidth: isHeader ? '480px' : '100%',
          height: 'auto',
          maxHeight: isHeader ? '75px' : isFullWidth ? '240px' : 'none',
          objectFit: isFullWidth ? 'cover' : 'contain',
          display: 'block',
          margin: '0 auto',
          borderRadius: 'var(--radius)',
        }}
      />
    </a>
  ) : null;

  if (!adContent) return null;

  return (
    <div
      className={`ad-banner ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      {/* Header specific layout: inline side arrows or compact switcher */}
      {isHeader && multiple ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%', justifyContent: 'center' }}>
          <button
            onClick={prev}
            type="button"
            title="अघिल्लो विज्ञापन (Previous Ad)"
            aria-label="Previous ad"
            style={{
              background: 'rgba(10, 14, 46, 0.65)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
              flexShrink: 0,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              transition: 'background 0.2s',
            }}
          >
            <ChevronLeft size={14} />
          </button>

          <div style={{ position: 'relative', flex: 1, display: 'flex', justifyContent: 'center' }}>
            {adContent}
            {/* Ad counter badge */}
            <span
              style={{
                position: 'absolute',
                bottom: '2px',
                right: '4px',
                background: 'rgba(0,0,0,0.6)',
                color: '#fff',
                fontSize: '9px',
                padding: '1px 5px',
                borderRadius: '3px',
                letterSpacing: '0.5px',
                pointerEvents: 'none',
              }}
            >
              Ad {currentIndex + 1}/{activeAds.length}
            </span>
          </div>

          <button
            onClick={next}
            type="button"
            title="अर्को विज्ञापन (Next Ad)"
            aria-label="Next ad"
            style={{
              background: 'rgba(10, 14, 46, 0.65)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
              flexShrink: 0,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              transition: 'background 0.2s',
            }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      ) : (
        <>
          <div style={{ width: '100%', position: 'relative' }}>
            {adContent}

            {/* Quick click arrows on hover for full-width and sidebar banners */}
            {multiple && (
              <>
                <button
                  onClick={prev}
                  type="button"
                  aria-label="Previous ad"
                  style={{
                    position: 'absolute',
                    left: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(10, 14, 46, 0.75)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'white',
                    zIndex: 2,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                  }}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={next}
                  type="button"
                  aria-label="Next ad"
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(10, 14, 46, 0.75)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'white',
                    zIndex: 2,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}
          </div>

          {/* Navigation Dots Indicator for in-article, sidebar, and footer */}
          {multiple && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '6px',
              }}
            >
              {activeAds.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Go to ad ${i + 1}`}
                  style={{
                    width: i === currentIndex ? '18px' : '6px',
                    height: '6px',
                    borderRadius: '3px',
                    background: i === currentIndex ? '#e31e24' : 'rgba(255,255,255,0.35)',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 0.25s ease',
                  }}
                />
              ))}

              <span
                style={{
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginLeft: '4px',
                }}
              >
                Ad {currentIndex + 1} of {activeAds.length}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
