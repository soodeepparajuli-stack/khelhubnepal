'use client';

import Link from 'next/link';
import { NewsArticle, Ad } from '@/types';
import AdBanner from '@/components/AdBanner';

interface BannerNewsProps {
  articles: NewsArticle[];
  ads?: Ad[];
}

export default function BannerNews({ articles, ads }: BannerNewsProps) {
  if (!articles || articles.length === 0) return null;

  const getBannerHeader = (article: NewsArticle) => {
    return article.banner_heading?.trim() || article.category_name || '';
  };

  const getCleanTitle = (article: NewsArticle, header: string) => {
    const title = article.title.trim();
    if (header && title.toLowerCase().startsWith(header.toLowerCase())) {
      const cleaned = title.slice(header.length).replace(/^[\s:–-]+/, '').trim();
      if (cleaned) return cleaned;
    }
    return title;
  };

  return (
    <section className="banner-news-section">
      <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
        {articles.map((article, index) => {
          const header = getBannerHeader(article);
          const cleanTitle = getCleanTitle(article, header);
          const showImage = article.show_banner_image !== false && !!article.image_url;

          return (
            <div key={article.id || index} className="banner-news-item" style={{ marginBottom: '32px' }}>
              {/* 1. Header (Category / Kicker) placed ABOVE the title - smaller than title */}
              {header && (
                <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                  <Link
                    href={`/category/${article.category_slug || 'others'}`}
                    className="banner-header-tag"
                  >
                    {header}
                  </Link>
                </div>
              )}

              {/* 2. Extra Big Headline with Hover Color Change */}
              <div style={{ maxWidth: '1180px', margin: '0 auto 18px auto' }}>
                <h2
                  style={{
                    fontSize: 'clamp(30px, 5.2vw, 54px)',
                    fontWeight: 900,
                    lineHeight: 1.25,
                    textAlign: 'center',
                    margin: '0',
                    letterSpacing: '-0.02em',
                  }}
                >
                  <Link
                    href={`/news/${article.slug}`}
                    className="banner-headline-link"
                  >
                    {cleanTitle}
                  </Link>
                </h2>
              </div>

              {/* 3. Centered Small Brand Logo Mark below headline */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: showImage ? '22px' : '8px',
                }}
              >
                <Link href={`/news/${article.slug}`} aria-label="KhelHub News">
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
                      border: '1.5px solid rgba(0,0,0,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#fff',
                      transition: 'transform 0.2s ease',
                    }}
                    className="banner-logo-badge"
                  >
                    <img
                      src="/logo.png"
                      alt="KhelHub"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                </Link>
              </div>

              {/* 4. Banner Image & Caption (Show / Hide controlled by Admin) */}
              {showImage && (
                <div style={{ maxWidth: '1120px', margin: '14px auto 0 auto' }}>
                  <div className="banner-img-container">
                    <Link href={`/news/${article.slug}`} style={{ display: 'block', width: '100%' }}>
                      <img
                        src={article.image_url!}
                        alt={article.title}
                        className="banner-img-hover"
                      />
                    </Link>
                  </div>

                  {/* Caption underneath the image */}
                  {article.excerpt && (
                    <div
                      style={{
                        marginTop: '12px',
                        padding: '0 12px',
                        textAlign: 'center',
                        fontSize: '14px',
                        color: 'var(--text-muted, #64748b)',
                        lineHeight: 1.65,
                        maxWidth: '1060px',
                        margin: '12px auto 0 auto',
                      }}
                    >
                      <span>{article.excerpt}</span>
                      <Link
                        href={`/news/${article.slug}`}
                        style={{
                          color: '#0070ba',
                          fontWeight: 700,
                          marginLeft: '6px',
                          textDecoration: 'none',
                        }}
                      >
                        [..]
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* 5. In-Between Ad Banner (after item 2) */}
              {index === 1 && ads && ads.length > 0 && (
                <div style={{ margin: '36px auto 24px auto', maxWidth: '1120px', width: '100%' }}>
                  <AdBanner ads={ads} className="ad-full-width" />
                </div>
              )}

              {/* 6. Clean Divider between banner news articles (omit on last item) */}
              {index < articles.length - 1 && (
                <div
                  style={{
                    width: '100%',
                    maxWidth: '1120px',
                    height: '1px',
                    background: 'var(--border, rgba(0,0,0,0.09))',
                    margin: '40px auto',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
