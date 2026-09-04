import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NewsCard from '@/components/NewsCard';
import AdBanner from '@/components/AdBanner';
import BannerNews from '@/components/BannerNews';
import CategorySection from '@/components/CategorySection';
import {
  getCategories,
  getBannerNews,
  getFeaturedNews,
  getBreakingNews,
  getLatestNews,
  getNewsByCategory,
  getAdsByPosition,
  getAllActiveAds,
} from '@/lib/data';
import { Ad, NewsArticle } from '@/types';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  // Fetch all data in parallel
  const [
    categories,
    bannerNews,
    featuredNews,
    breakingNews,
    latestNews,
    footballNews,
    cricketNews,
    volleyballNews,
    basketballNews,
    headerAds,
    inArticleAds,
    sidebarAds,
    footerAds,
  ] = await Promise.all([
    getCategories(),
    getBannerNews(),
    getFeaturedNews(),
    getBreakingNews(),
    getLatestNews(12),
    getNewsByCategory('football', 4),
    getNewsByCategory('cricket', 4),
    getNewsByCategory('volleyball', 4),
    getNewsByCategory('basketball', 4),
    getAdsByPosition('header'),
    getAdsByPosition('in-article'),
    getAdsByPosition('sidebar'),
    getAdsByPosition('footer'),
  ]);

  const heroMain = featuredNews[0] || latestNews[0];
  const heroSide = featuredNews.slice(1, 5).length > 0 ? featuredNews.slice(1, 5) : latestNews.slice(1, 5);

  return (
    <>
      <Navbar categories={categories} breakingNews={breakingNews} headerAds={headerAds} />

      <main>
        {/* Banner News (ब्यानर न्यूज) */}
        {bannerNews.length > 0 && (
          <BannerNews articles={bannerNews} />
        )}

        {/* Hero Section */}
        {heroMain && (

          <section className="hero-section">
            <div className="container">
              <div className="hero-grid">
                <NewsCard article={heroMain} variant="large" />
                <div className="hero-side">
                  {heroSide.map(article => (
                    <NewsCard key={article.id} article={article} variant="horizontal" />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="section-divider" />

        {/* Full-width In-Article Ad Banner (between hero and news grid) */}
        {inArticleAds.length > 0 && (
          <div className="container">
            <div className="ad-full-width">
              <AdBanner ads={inArticleAds} className="ad-full-width" />
            </div>
          </div>
        )}

        {/* Main Content + Sidebar */}
        <section className="main-content">
          <div className="container">
            <div className="content-with-sidebar">
              {/* Left: News Grid */}
              <div>
                <div className="section-header" style={{ marginBottom: '16px' }}>
                  <div className="section-title">
                    <div className="section-title-bar"></div>
                    <h2>ताजा खेलकुद समाचार</h2>
                  </div>
                </div>
                <div className="news-grid">
                  {latestNews.map(article => (
                    <NewsCard key={article.id} article={article} variant="default" />
                  ))}
                </div>
              </div>

              {/* Right: Sidebar */}
              <aside className="sidebar">
                {/* Sidebar Ad */}
                {sidebarAds[0] && (
                  <AdBanner ads={[sidebarAds[0]]} className="ad-sidebar" />
                )}

                {/* Latest News List */}
                <div className="sidebar-section">
                  <div className="sidebar-section-header" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    लोकप्रिय समाचार
                  </div>
                  <div className="sidebar-news-list">
                    {latestNews.slice(0, 8).map(article => (
                      <NewsCard key={article.id} article={article} variant="sidebar" />
                    ))}
                  </div>
                </div>

                {/* Second Sidebar Ad */}
                {sidebarAds[1] && (
                  <AdBanner ads={[sidebarAds[1]]} className="ad-sidebar" />
                )}
              </aside>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Category Sections */}
        <CategorySection
          title="फुटबल"
          slug="football"
          color="#2ecc71"
          articles={footballNews}
        />
        <div className="section-divider" />

        <CategorySection
          title="क्रिकेट"
          slug="cricket"
          color="#3498db"
          articles={cricketNews}
        />
        <div className="section-divider" />

        <CategorySection
          title="भलिबल"
          slug="volleyball"
          color="#e67e22"
          articles={volleyballNews}
        />
        <div className="section-divider" />

        <CategorySection
          title="बास्केटबल"
          slug="basketball"
          color="#e31e24"
          articles={basketballNews}
        />

        {/* Footer Ad */}
        {footerAds[0] && (
          <div className="container">
            <div className="ad-full-width">
              <AdBanner ads={footerAds} className="ad-full-width" />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
