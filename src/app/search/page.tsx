import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NewsCard from '@/components/NewsCard';
import AdBanner from '@/components/AdBanner';
import { getCategories, getBreakingNews, searchNews, getAdsByPosition } from '@/lib/data';

export const dynamic = 'force-dynamic';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q || '';

  const [categories, breakingNews, results, headerAds, sidebarAds] = await Promise.all([
    getCategories(),
    getBreakingNews(),
    searchNews(query),
    getAdsByPosition('header'),
    getAdsByPosition('sidebar'),
  ]);

  return (
    <>
      <Navbar categories={categories} breakingNews={breakingNews} headerAd={headerAds[0] || null} />

      <main>
        <div className="container" style={{ padding: '24px 16px' }}>
          <div style={{
            background: 'white',
            padding: '20px 24px',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--light-gray)',
            marginBottom: '24px',
          }}>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--navy)', marginBottom: '12px' }}>
              🔍 खोज नतिजा: &ldquo;{query}&rdquo;
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--gray)', margin: 0 }}>
              {results.length} वटा समाचार भेटियो
            </p>
          </div>

          <div className="content-with-sidebar">
            <div>
              {results.length === 0 ? (
                <div className="empty-state">
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔎</div>
                  <h3>कुनै नतिजा भेटिएन</h3>
                  <p>कृपया अर्को शब्द खोजेर प्रयास गर्नुस्।</p>
                </div>
              ) : (
                <div className="news-grid">
                  {results.map(article => (
                    <NewsCard key={article.id} article={article} variant="default" showExcerpt />
                  ))}
                </div>
              )}
            </div>

            <aside className="sidebar">
              {sidebarAds[0] && (
                <AdBanner ads={[sidebarAds[0]]} className="ad-sidebar" />
              )}
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
