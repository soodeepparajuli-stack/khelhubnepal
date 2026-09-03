'use client';

import { useState, useEffect } from 'react';
import { Ad } from '@/types';

interface AdBannerProps {
  ads: Ad[];
  className?: string;
  style?: React.CSSProperties;
}

// Rotate through multiple ads every 8 seconds if more than one
export default function AdBanner({ ads, className = '', style }: AdBannerProps) {
  const activeAds = ads.filter(a => a.is_active !== false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activeAds.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(i => (i + 1) % activeAds.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeAds.length]);

  const ad = activeAds[currentIndex];
  if (!ad) return null;

  // If custom HTML/AdSense code, render directly
  if (ad.code) {
    return (
      <div
        className={`ad-banner ${className}`}
        style={style}
        dangerouslySetInnerHTML={{ __html: ad.code }}
      />
    );
  }

  // Image ad — let the image fill naturally without forced dimensions
  if (ad.image_url) {
    return (
      <div
        className={`ad-banner ${className}`}
        style={{ position: 'relative', ...style }}
      >
        {activeAds.length > 1 && (
          <div style={{
            position: 'absolute',
            top: '4px',
            right: '6px',
            display: 'flex',
            gap: '4px',
            zIndex: 2,
          }}>
            {activeAds.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: i === currentIndex ? 'white' : 'rgba(255,255,255,0.4)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
                aria-label={`Ad ${i + 1}`}
              />
            ))}
          </div>
        )}
        <a
          href={ad.link_url || '#'}
          target="_blank"
          rel="noopener noreferrer sponsored"
          style={{ display: 'block' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ad.image_url}
            alt={`Advertisement - ${ad.name}`}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              objectFit: 'contain',
              maxHeight: className.includes('sidebar') ? '160px' : '60px',
            }}
          />
        </a>
      </div>
    );
  }

  return null;
}
