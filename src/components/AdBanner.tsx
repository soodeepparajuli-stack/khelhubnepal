import Image from 'next/image';
import { Ad } from '@/types';

interface AdBannerProps {
  ads: Ad[];
  className?: string;
  style?: React.CSSProperties;
}

export default function AdBanner({ ads, className = '', style }: AdBannerProps) {
  // Pick first active ad
  const ad = ads[0];

  if (!ad) return null;

  // If custom HTML code, render it
  if (ad.code) {
    return (
      <div className={`ad-banner ${className}`} style={style} dangerouslySetInnerHTML={{ __html: ad.code }} />
    );
  }

  // If image ad
  if (ad.image_url) {
    return (
      <div className={`ad-banner ${className}`} style={style}>
        <a href={ad.link_url || '#'} target="_blank" rel="noopener noreferrer sponsored">
          <Image
            src={ad.image_url}
            alt={`Advertisement - ${ad.name}`}
            width={728}
            height={90}
            style={{ width: '100%', height: 'auto', display: 'block' }}
            unoptimized
          />
        </a>
      </div>
    );
  }

  return null;
}
