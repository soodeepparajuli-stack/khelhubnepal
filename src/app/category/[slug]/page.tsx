import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NewsCard from '@/components/NewsCard';
import AdBanner from '@/components/AdBanner';
import { getCategories, getBreakingNews, getNewsByCategory, getAdsByPosition } from '@/lib/data';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

const EMOJI_MAP: Record<string, string> = {
  football: '⚽',
  cricket: '🏏',
  volleyball: '🏐',
  basketball: '🏀',
  esports: '🎮',
  others: '🏅',
  badminton: '🏸',
  tennis: '🎾',
  swimming: '🏊',
  boxing: '🥊',
};

function getEmoji(slug: string): string {
  return EMOJI_MAP[slug] || '🏆';
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find(c => c.slug === slug);

  if (!category) {
    return { title: 'खेलकुद समाचार | KhelHub Nepal' };
  }

  const emoji = getEmoji(slug);
  return {
    title: `${emoji} ${category.name} समाचार | KhelHub Nepal`,
    description: `KhelHub Nepal मा ${category.name} सम्बन्धी ताजा खेलकुद समाचार र अपडेटहरू पढ्नुस्।`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  const [categories, breakingNews, articles, headerAds, sidebarAds] = await Promise.all([
    getCategories(),
    getBreakingNews(),
    getNewsByCategory(slug, 20),
    getAdsByPosition('header'),
    getAdsByPosition('sidebar'),
  ]);

  const category = categories.find(c => c.slug === slug);

  // If not found in database categories or mock
  if (!category && articles.length === 0) {
    notFound();
  }

  const categoryName = category?.name || slug;
  const categoryColor = category?.color || '#1a2357';
  const emoji = getEmoji(slug);

  return (
    <>
      <Navbar categories={categories} breakingNews={breakingNews} headerAd={headerAds[0] || null} />

      <main>
        <div className="container">
          {/* Dynamic Category Header */}
          <div style={{
            background: `linear-gradient(135deg, ${categoryColor} 0%, #0f1535 100%)`,
            color: 'white',
            padding: '24px 28px',
            borderRadius: 'var(--radius)',
            margin: '20px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <span style={{ fontSize: '38px', background: 'rgba(255,255,255,0.15)', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {emoji}
            </span>
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0 }}>{categoryName}</h1>
              <p style={{ fontSize: '14px', opacity: 0.85, margin: '4px 0 0' }}>
                {articles.length} वटा समाचार उपलब्ध छन्
              </p>
            </div>
          </div>

          <div className="content-with-sidebar">
            <div>
              {articles.length === 0 ? (
                <div className="empty-state">
                  <span style={{ fontSize: '48px' }}>{emoji}</span>
                  <h3>अहिलेसम्म कुनै समाचार छैन</h3>
                  <p>छिट्टै {categoryName} सम्बन्धी समाचार थपिनेछन्।</p>
                </div>
              ) : (
                <div className="news-grid">
                  {articles.map(article => (
                    <NewsCard key={article.id} article={article} variant="default" showExcerpt />
                  ))}
                </div>
              )}
            </div>

            <aside className="sidebar">
              {sidebarAds[0] && (
                <AdBanner ads={[sidebarAds[0]]} className="ad-sidebar" />
              )}

              {/* Dynamic Other Categories */}
              <div className="sidebar-section">
                <div className="sidebar-section-header">📂 अन्य खेलकुद वर्ग</div>
                <div style={{ padding: '8px' }}>
                  {categories
                    .filter(c => c.slug !== slug)
                    .map(c => (
                      <a
                        key={c.slug}
                        href={`/category/${c.slug}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 8px',
                          borderBottom: '1px solid var(--light-gray)',
                          fontSize: '14px',
                          fontWeight: 600,
                          transition: 'all 0.2s',
                        }}
                        onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--red)'; }}
                        onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.color = 'inherit'; }}
                      >
                        <span>{getEmoji(c.slug)}</span> {c.name}
                      </a>
                    ))
                  }
                </div>
              </div>

              {sidebarAds[1] && (
                <AdBanner ads={[sidebarAds[1]]} className="ad-sidebar" />
              )}
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
