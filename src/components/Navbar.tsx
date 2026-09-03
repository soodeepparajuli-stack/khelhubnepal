'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { NewsArticle, Category, Ad } from '@/types';
import { useState, useEffect } from 'react';
import { Calendar, Search, Radio, Phone, Mail } from 'lucide-react';

import AdBanner from './AdBanner';

interface NavbarProps {
  categories: Category[];
  breakingNews: NewsArticle[];
  headerAds?: Ad[];
}

export default function Navbar({ categories, breakingNews, headerAds = [] }: NavbarProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Duplicate ticker items for seamless infinite scroll
  const tickerItems = [...breakingNews, ...breakingNews];

  const getNepaliDate = () => {
    return new Date().toLocaleDateString('ne-NP', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      {/* Top Bar with real contact & social links */}
      <div className="top-bar">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span className="top-bar-date" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={13} style={{ opacity: 0.8 }} />
              {getNepaliDate()}
            </span>
            <span style={{ opacity: 0.3 }}>|</span>
            <a
              href="tel:9867423197"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', opacity: 0.85, fontSize: '12px' }}
            >
              <Phone size={12} /> 9867423197
            </a>
            <span style={{ opacity: 0.3 }}>|</span>
            <a
              href="mailto:newskhelhub@gmail.com"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', opacity: 0.85, fontSize: '12px' }}
            >
              <Mail size={12} /> newskhelhub@gmail.com
            </a>
          </div>

          <div className="top-bar-social">
            <a
              href="https://www.youtube.com/@KhelhubNepal"
              target="_blank"
              rel="noopener noreferrer"
              title="KhelHub Nepal on YouTube"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              <span>YouTube</span>
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61557354328245"
              target="_blank"
              rel="noopener noreferrer"
              title="KhelHub Nepal on Facebook"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              <span>Facebook</span>
            </a>
          </div>
        </div>
      </div>

      {/* Breaking News Ticker */}
      {breakingNews.length > 0 && (
        <div className="breaking-bar">
          <div className="container">
            <span className="breaking-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Radio size={13} style={{ color: '#ff4d4f' }} />
              ब्रेकिङ
            </span>
            <div className="ticker-wrapper">
              <div className="ticker-track">
                {tickerItems.map((item, i) => (
                  <span className="ticker-item" key={`${item.id}-${i}`}>
                    <Link href={`/news/${item.slug}`}>{item.title}</Link>
                    <span style={{ marginLeft: '30px', opacity: 0.4 }}>•</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={`site-header ${isScrolled ? 'is-scrolled' : ''}`}>
        <div className="container">
          <div className="header-inner">
            <Link href="/" className="site-logo">
              <Image
                src="/logo.png"
                alt="KhelHub Nepal Official Logo"
                width={56}
                height={56}
                style={{ height: '56px', width: 'auto' }}
                priority
                unoptimized
              />
              <div className="site-logo-text">
                <div className="brand-name">
                  <span>KHEL</span><span>HUB</span>
                </div>
                <div className="brand-tagline">— NEPAL —</div>
              </div>
            </Link>

            {/* Header Ad Space */}
            {headerAds.length > 0 ? (
              <div className="header-ad">
                <AdBanner ads={headerAds} className="ad-header" />
              </div>
            ) : (
              <div className="header-ad" style={{ display: 'none' }} />
            )}

            {/* Search */}
            <div className="header-search">
              <form action="/search" method="get">
                <input
                  type="text"
                  name="q"
                  placeholder="समाचार खोज्नुस्..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <button type="submit" aria-label="Search" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Search size={15} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation (Clean typography, no cheap emojis) */}
      <nav className="main-nav">
        <div className="container">
          <div className="nav-inner">
            <Link href="/" className={`nav-link home ${pathname === '/' ? 'active' : ''}`}>
              गृहपृष्ठ
            </Link>
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`nav-link ${pathname === `/category/${cat.slug}` ? 'active' : ''}`}
              >
                {cat.name}
              </Link>
            ))}
            <Link href="/about" className={`nav-link ${pathname === '/about' ? 'active' : ''}`}>
              हाम्रो बारे
            </Link>
            <Link href="/contact" className={`nav-link ${pathname === '/contact' ? 'active' : ''}`}>
              सम्पर्क
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
