'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';
import { NewsArticle } from '@/types';
import { PenSquare, Star, Radio, Trash2, Edit3, ImageIcon } from 'lucide-react';

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/news');
      const json = await res.json();
      setArticles(json.data || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchArticles(); }, []);

  const togglePublish = async (article: NewsArticle) => {
    await fetch('/api/news', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: article.id, is_published: !article.is_published }),
    });
    fetchArticles();
  };

  const toggleFeatured = async (article: NewsArticle) => {
    await fetch('/api/news', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: article.id, is_featured: !article.is_featured }),
    });
    fetchArticles();
  };

  const deleteArticle = async (id: string) => {
    if (!confirm('के तपाईं यो समाचार पक्कै हटाउन चाहनुहुन्छ? (Delete article?)')) return;
    setDeleting(id);
    await fetch(`/api/news?id=${id}`, { method: 'DELETE' });
    setDeleting(null);
    fetchArticles();
  };

  return (
    <AdminShell title="समाचार व्यवस्थापन (News Articles)">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: 0 }}>
          कुल {articles.length} वटा समाचार
        </p>
        <Link href="/admin/news/new" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <PenSquare size={15} />
          <span>नयाँ समाचार लेख्नुस्</span>
        </Link>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Badges</th>
              <th>Views</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>लोड हुँदैछ...</td></tr>
            ) : articles.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>कुनै समाचार भेटिएन। <Link href="/admin/news/new" style={{ color: '#e31e24' }}>पहिलो समाचार लेख्नुस्!</Link></td></tr>
            ) : articles.map(article => (
              <tr key={article.id}>
                <td>
                  {article.image_url ? (
                    <img src={article.image_url} alt={article.title} style={{ width: 60, height: 45, objectFit: 'cover', borderRadius: 4 }} />
                  ) : (
                    <div style={{ width: 60, height: 45, background: 'rgba(255,255,255,0.08)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)' }}>
                      <ImageIcon size={18} />
                    </div>
                  )}
                </td>
                <td style={{ maxWidth: '240px' }}>
                  <div style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: '13px', lineHeight: 1.4 }}>
                    {article.title}
                  </div>
                </td>
                <td>
                  <span className="badge badge-navy">{article.category_name || '—'}</span>
                </td>
                <td>
                  <button
                    onClick={() => togglePublish(article)}
                    className={`badge ${article.is_published ? 'badge-green' : 'badge-red'}`}
                    style={{ cursor: 'pointer', border: 'none', fontFamily: 'inherit' }}
                    title="Click to toggle"
                  >
                    {article.is_published ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '4px', flexDirection: 'column' }}>
                    {article.is_featured && (
                      <span className="badge badge-orange" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <Star size={10} /> Featured
                      </span>
                    )}
                    {article.is_breaking && (
                      <span className="badge badge-red" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <Radio size={10} /> Breaking
                      </span>
                    )}
                  </div>
                </td>
                <td style={{ fontSize: '13px' }}>{article.views?.toLocaleString() || 0}</td>
                <td style={{ fontSize: '12px', opacity: 0.5 }}>
                  {new Date(article.published_at).toLocaleDateString()}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <Link href={`/admin/news/edit/${article.id}`} className="btn btn-ghost btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Edit3 size={13} /> Edit
                    </Link>
                    <button
                      onClick={() => toggleFeatured(article)}
                      className="btn btn-ghost btn-sm"
                      title={article.is_featured ? 'Remove from featured' : 'Mark as featured'}
                      style={{ color: article.is_featured ? '#f39c12' : 'inherit' }}
                    >
                      <Star size={13} fill={article.is_featured ? '#f39c12' : 'none'} />
                    </button>
                    <button
                      onClick={() => deleteArticle(article.id)}
                      className="btn btn-danger btn-sm"
                      disabled={deleting === article.id}
                      title="Delete"
                    >
                      {deleting === article.id ? '...' : <Trash2 size={13} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
