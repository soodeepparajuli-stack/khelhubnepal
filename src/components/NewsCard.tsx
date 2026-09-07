import Link from 'next/link';
import Image from 'next/image';
import { NewsArticle } from '@/types';
import { formatDate, PLACEHOLDER_IMAGE } from '@/lib/data';

interface NewsCardProps {
  article: NewsArticle;
  variant?: 'default' | 'large' | 'horizontal' | 'sidebar';
  showExcerpt?: boolean;
}

export default function NewsCard({ article, variant = 'default', showExcerpt = false }: NewsCardProps) {
  const imageUrl = article.image_url || PLACEHOLDER_IMAGE;
  const categoryClass = article.category_slug || '';

  if (variant === 'large') {
    return (
      <div className="hero-main-card">
        <Link href={`/news/${article.slug}`} style={{ display: 'block', height: '100%' }}>
          <img
            src={imageUrl}
            alt={article.title}
            style={{
              width: '100%',
              height: '100%',
              minHeight: '340px',
              maxHeight: '440px',
              aspectRatio: '16/10',
              objectFit: 'cover',
              display: 'block',
            }}
          />
          <div className="hero-main-overlay">
            {article.category_name && (
              <span className={`category-tag ${categoryClass}`}>{article.category_name}</span>
            )}
            <h2>{article.title}</h2>
            <div className="meta">
              <span>{article.author}</span>
              <span> · </span>
              <span>{formatDate(article.published_at)}</span>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div className="hero-side-card">
        <Link
          href={`/news/${article.slug}`}
          style={{
            width: '110px',
            minWidth: '110px',
            maxWidth: '110px',
            height: '90px',
            minHeight: '90px',
            maxHeight: '90px',
            flexShrink: 0,
            display: 'block',
            borderRadius: '6px',
            overflow: 'hidden',
          }}
        >
          <img
            src={imageUrl}
            alt={article.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </Link>
        <div className="hero-side-content">
          {article.category_name && (
            <span className={`category-tag ${categoryClass}`}>{article.category_name}</span>
          )}
          <h3>
            <Link href={`/news/${article.slug}`}>{article.title}</Link>
          </h3>
          <div className="meta">{formatDate(article.published_at)}</div>
        </div>
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className="sidebar-news-item">
        <Link
          href={`/news/${article.slug}`}
          className="sidebar-news-thumb"
          style={{
            width: '84px',
            minWidth: '84px',
            maxWidth: '84px',
            height: '64px',
            minHeight: '64px',
            maxHeight: '64px',
            flexShrink: 0,
            display: 'block',
            borderRadius: '6px',
            overflow: 'hidden',
            backgroundColor: 'var(--off-white, #f1f5f9)',
          }}
        >
          <img
            src={imageUrl}
            alt={article.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </Link>
        <div className="sidebar-news-content" style={{ flex: 1, minWidth: 0 }}>
          <h4>
            <Link href={`/news/${article.slug}`}>{article.title}</Link>
          </h4>
          <div className="meta">{formatDate(article.published_at)}</div>
        </div>
      </div>
    );
  }

  // Default card
  return (
    <div className="news-card">
      <div className="news-card-image">
        <Link href={`/news/${article.slug}`}>
          <Image
            src={imageUrl}
            alt={article.title}
            width={400}
            height={225}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            unoptimized
          />
        </Link>
      </div>
      <div className="news-card-body">
        {article.category_name && (
          <span className={`category-tag ${categoryClass}`}>{article.category_name}</span>
        )}
        <h3>
          <Link href={`/news/${article.slug}`}>{article.title}</Link>
        </h3>
        {showExcerpt && article.excerpt && (
          <p className="excerpt">{article.excerpt}</p>
        )}
        <div className="meta">
          <span className="author">{article.author}</span>
          <span>·</span>
          <span>{formatDate(article.published_at)}</span>
        </div>
      </div>
    </div>
  );
}
