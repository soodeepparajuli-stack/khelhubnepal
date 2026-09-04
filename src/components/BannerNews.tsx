'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NewsArticle } from '@/types';
import { formatDate, PLACEHOLDER_IMAGE } from '@/lib/data';
import { Flame, Clock, Eye, User, ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerNewsProps {
  articles: NewsArticle[];
}

export default function BannerNews({ articles }: BannerNewsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (articles.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % articles.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [articles.length]);

  if (!articles || articles.length === 0) return null;

  const current = articles[currentIndex] || articles[0];

  return (
    <section className="banner-news-section" style={{ padding: '20px 0 10px 0' }}>
      <div className="container">
        <div style={{
          background: 'linear-gradient(135deg, #0b1026 0%, #151b36 100%)',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(11, 16, 38, 0.25)',
          border: '1px solid rgba(227, 30, 36, 0.2)',
          position: 'relative',
        }}>
          {/* Top Banner Tag Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(0, 0, 0, 0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                background: 'var(--red)',
                color: 'white',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '0.5px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: '0 2px 8px rgba(227, 30, 36, 0.4)',
              }}>
                <Flame size={14} className="animate-pulse" />
                ब्यानर न्यूज (BANNER NEWS)
              </span>
              {current.category_name && (
                <span style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '13px',
                  fontWeight: 600,
                  marginLeft: '6px',
                }}>
                  • {current.category_name}
                </span>
              )}
            </div>

            {/* Slider Controls if multiple */}
            {articles.length > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px', marginRight: '6px' }}>
                  {currentIndex + 1} / {articles.length}
                </span>
                <button
                  onClick={() => setCurrentIndex((currentIndex - 1 + articles.length) % articles.length)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    color: 'white',
                    width: '28px',
                    height: '28px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  aria-label="Previous banner"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setCurrentIndex((currentIndex + 1) % articles.length)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    color: 'white',
                    width: '28px',
                    height: '28px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  aria-label="Next banner"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Main Banner Content */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '0',
          }}>
            {/* Image Column */}
            <div style={{ position: 'relative', minHeight: '280px', overflow: 'hidden' }}>
              <Link href={`/news/${current.slug}`} style={{ display: 'block', width: '100%', height: '100%' }}>
                <img
                  src={current.image_url || PLACEHOLDER_IMAGE}
                  alt={current.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    minHeight: '280px',
                    maxHeight: '380px',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.4s ease',
                  }}
                  className="banner-img"
                />
              </Link>
            </div>

            {/* Content Column */}
            <div style={{
              padding: '28px 28px 24px 28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              background: 'linear-gradient(180deg, rgba(17, 24, 54, 0.8) 0%, rgba(11, 16, 38, 0.95) 100%)',
            }}>
              <h2 style={{
                fontSize: 'clamp(20px, 3.5vw, 26px)',
                fontWeight: 800,
                lineHeight: 1.4,
                margin: '0 0 14px 0',
              }}>
                <Link
                  href={`/news/${current.slug}`}
                  style={{
                    color: '#ffffff',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  className="banner-headline"
                >
                  {current.title}
                </Link>
              </h2>

              {current.excerpt && (
                <p style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '15px',
                  lineHeight: 1.6,
                  margin: '0 0 18px 0',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {current.excerpt}
                </p>
              )}

              {/* Meta & CTA */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                marginTop: 'auto',
                paddingTop: '14px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  fontSize: '13px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  flexWrap: 'wrap',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={13} style={{ color: 'var(--red)' }} />
                    {current.author || 'KhelHub'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={13} />
                    {formatDate(current.published_at)}
                  </span>
                  {current.views !== undefined && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Eye size={13} />
                      {current.views.toLocaleString()}
                    </span>
                  )}
                </div>

                <Link
                  href={`/news/${current.slug}`}
                  style={{
                    background: 'var(--red)',
                    color: '#ffffff',
                    padding: '8px 18px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'background 0.2s',
                  }}
                >
                  पुरा पढ्नुस् →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
