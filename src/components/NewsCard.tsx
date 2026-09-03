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
        <Link href={`/news/${article.slug}`}>
          <Image
            src={imageUrl}
            alt={article.title}
            width={800}
            height={500}
            style={{ width: '100%', height: '420px', objectFit: 'cover' }}
            priority
            unoptimized
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
        <Link href={`/news/${article.slug}`} style={{ flexShrink: 0 }}>
          <Image
            src={imageUrl}
            alt={article.title}
            width={110}
            height={90}
            style={{ width: '110px', height: '90px', objectFit: 'cover' }}
            unoptimized
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
        <Link href={`/news/${article.slug}`}>
          <Image
            src={imageUrl}
            alt={article.title}
            width={72}
            height={56}
            style={{ width: '72px', height: '56px', objectFit: 'cover', borderRadius: '4px' }}
            unoptimized
          />
        </Link>
        <div className="sidebar-news-content">
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
