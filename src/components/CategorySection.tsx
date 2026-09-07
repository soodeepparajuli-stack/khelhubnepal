import Link from 'next/link';
import { NewsArticle } from '@/types';
import NewsCard from './NewsCard';
import { ChevronRight } from 'lucide-react';

interface CategorySectionProps {
  title: string;
  slug: string;
  articles: NewsArticle[];
  emoji?: string;
  color?: string;
}

export default function CategorySection({ title, slug, articles, color = '#e31e24' }: CategorySectionProps) {
  if (articles.length === 0) return null;

  return (
    <section className="category-section">
      <div className="container">
        <div className="section-header">
          <div className="section-title">
            <div className="section-title-bar" style={{ backgroundColor: color }}></div>
            <h2>{title}</h2>
          </div>
          <Link href={`/category/${slug}`} className="section-view-all" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span>सबै हेर्नुस्</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="category-grid">
          {articles.slice(0, 4).map(article => (
            <NewsCard key={article.id} article={article} variant="default" showExcerpt={false} />
          ))}
        </div>
      </div>
    </section>
  );
}
