import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NewsCard from '@/components/NewsCard';
import AdBanner from '@/components/AdBanner';
import ShareButtons from '@/components/ShareButtons';
import { User, Calendar, Eye, Radio, ChevronRight } from 'lucide-react';
import {
  getNewsBySlug,
  getCategories,
  getBreakingNews,
  getRelatedNews,
  getAdsByPosition,
  formatDateEn,
  PLACEHOLDER_IMAGE,
} from '@/lib/data';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) return { title: 'Article Not Found' };

  return {
    title: article.title,
    description: article.excerpt || article.title,
    openGraph: {
      title: article.title,
      description: article.excerpt || '',
      images: article.image_url ? [article.image_url] : [],
      type: 'article',
      publishedTime: article.published_at,
      authors: [article.author],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;

  const [article, categories, breakingNews, headerAds, sidebarAds, inArticleAds] = await Promise.all([
    getNewsBySlug(slug),
    getCategories(),
    getBreakingNews(),
    getAdsByPosition('header'),
    getAdsByPosition('sidebar'),
    getAdsByPosition('in-article'),
  ]);

  if (!article) notFound();

  const relatedNews = await getRelatedNews(article.category_slug || '', slug, 5);


  // Increment views (fire and forget)
  fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/views?slug=${slug}`, {
    method: 'POST',
  }).catch(() => {});

  return (
    <>
      <Navbar categories={categories} breakingNews={breakingNews} headerAds={headerAds} />

      <main>
        <div className="container">
          <div className="article-layout">
            {/* Article Main */}
            <article className="article-main">
              {/* Breadcrumb */}
              <div className="article-breadcrumb">
                <Link href="/">गृहपृष्ठ</Link>
                <span>›</span>
                {article.category_name && (
                  <>
                    <Link href={`/category/${article.category_slug}`}>{article.category_name}</Link>
                    <span>›</span>
                  </>
                )}
                <span style={{ opacity: 0.7 }}>{article.title.substring(0, 40)}...</span>
              </div>

              {/* Article Header */}
              <div className="article-header">
                {article.category_name && (
                  <span className={`category-tag ${article.category_slug}`}>
                    {article.category_name}
                  </span>
                )}
                {article.is_breaking && (
                  <span className="category-tag" style={{ background: '#e31e24', marginLeft: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Radio size={11} />
                    <span>ब्रेकिङ</span>
                  </span>
                )}

                <h1 className="article-title">{article.title}</h1>

                <div className="article-meta" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <User size={14} style={{ color: 'var(--navy)' }} />
                    <span className="author">{article.author}</span>
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} />
                    <span>{formatDateEn(article.published_at)}</span>
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Eye size={14} />
                    <span>{article.views.toLocaleString()} पटक हेरिएको</span>
                  </span>
                </div>
              </div>

              {/* Featured Image */}
              {article.image_url && (
                <Image
                  src={article.image_url}
                  alt={article.title}
                  width={800}
                  height={450}
                  className="article-featured-image"
                  priority
                  unoptimized
                />
              )}

              {/* In-Article Ad (top) */}
              {inArticleAds[0] && (
                <div style={{ marginBottom: '20px' }}>
                  <AdBanner ads={[inArticleAds[0]]} />
                </div>
              )}

              {/* Article Content */}
              <div
                className="article-content"
                dangerouslySetInnerHTML={{ __html: article.content || '<p>सामग्री उपलब्ध छैन।</p>' }}
              />

              {/* In-Article Ad (bottom) */}
              {inArticleAds[1] && (
                <div style={{ marginTop: '20px' }}>
                  <AdBanner ads={[inArticleAds[1]]} />
                </div>
              )}

              {/* Share Buttons */}
              <ShareButtons title={article.title} />
            </article>

            {/* Sidebar */}
            <aside className="sidebar">
              {sidebarAds[0] && (
                <AdBanner ads={[sidebarAds[0]]} className="ad-sidebar" />
              )}

              {relatedNews.length > 0 && (
                <div className="sidebar-section">
                  <div className="sidebar-section-header">सम्बन्धित खेल समाचार</div>
                  <div className="sidebar-news-list">
                    {relatedNews.map(a => (
                      <NewsCard key={a.id} article={a} variant="sidebar" />
                    ))}
                  </div>
                </div>
              )}

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
