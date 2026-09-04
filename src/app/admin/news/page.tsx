'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';
import { NewsArticle } from '@/types';
import { PenSquare, Star, Radio, Flame, Clock, Trash2, Edit3, ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filterTab, setFilterTab] = useState<'all' | 'published' | 'draft' | 'scheduled'>('all');

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

  const getArticleStatus = (article: NewsArticle): 'published' | 'draft' | 'scheduled' => {
    if (!article.is_published) return 'draft';
    if (article.published_at && new Date(article.published_at).getTime() > Date.now()) return 'scheduled';
    return 'published';
  };

  const counts = useMemo(() => {
    let published = 0;
    let draft = 0;
    let scheduled = 0;

    articles.forEach(a => {
      const s = getArticleStatus(a);
      if (s === 'published') published++;
      else if (s === 'draft') draft++;
      else if (s === 'scheduled') scheduled++;
    });

    return { all: articles.length, published, draft, scheduled };
  }, [articles]);

  const filteredArticles = useMemo(() => {
    if (filterTab === 'all') return articles;
    return articles.filter(a => getArticleStatus(a) === filterTab);
  }, [articles, filterTab]);

  const togglePublish = async (article: NewsArticle) => {
    const isCurrentlyPublished = article.is_published;
    await fetch('/api/news', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: article.id,
        is_published: !isCurrentlyPublished,
        published_at: !isCurrentlyPublished ? new Date().toISOString() : article.published_at,
      }),
    });
    fetchArticles();
  };

  const toggleBanner = async (article: NewsArticle) => {
    await fetch('/api/news', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: article.id, is_banner: !article.is_banner }),
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
      {/* Top Bar with Add Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: 0 }}>
            समाचार, ड्राफ्ट र सेड्युल गरिएका पोस्टहरूको व्यवस्थापन
          </p>
        </div>
        <Link href="/admin/news/new" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px' }}>
          <PenSquare size={16} />
          <span>नयाँ समाचार लेख्नुस्</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        paddingBottom: '12px',
        flexWrap: 'wrap',
      }}>
        <button
          onClick={() => setFilterTab('all')}
          style={{
            background: filterTab === 'all' ? 'rgba(255,255,255,0.15)' : 'transparent',
            border: 'none',
            color: filterTab === 'all' ? '#fff' : 'rgba(255,255,255,0.6)',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: filterTab === 'all' ? 700 : 500,
          }}
        >
          सबै ({counts.all})
        </button>
        <button
          onClick={() => setFilterTab('published')}
          style={{
            background: filterTab === 'published' ? 'rgba(46, 204, 113, 0.2)' : 'transparent',
            border: 'none',
            color: filterTab === 'published' ? '#2ecc71' : 'rgba(255,255,255,0.6)',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: filterTab === 'published' ? 700 : 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2ecc71' }}></span>
          प्रकाशित ({counts.published})
        </button>
        <button
          onClick={() => setFilterTab('draft')}
          style={{
            background: filterTab === 'draft' ? 'rgba(241, 196, 15, 0.2)' : 'transparent',
            border: 'none',
            color: filterTab === 'draft' ? '#f1c40f' : 'rgba(255,255,255,0.6)',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: filterTab === 'draft' ? 700 : 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f1c40f' }}></span>
          ड्राफ्ट ({counts.draft})
        </button>
        <button
          onClick={() => setFilterTab('scheduled')}
          style={{
            background: filterTab === 'scheduled' ? 'rgba(155, 89, 182, 0.2)' : 'transparent',
            border: 'none',
            color: filterTab === 'scheduled' ? '#c39bd3' : 'rgba(255,255,255,0.6)',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: filterTab === 'scheduled' ? 700 : 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#9b59b6' }}></span>
          सेड्युल ({counts.scheduled})
        </button>
      </div>

      {/* Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '65px' }}>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Badges</th>
              <th>Views</th>
              <th>Date / Schedule</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>लोड हुँदैछ...</td></tr>
            ) : filteredArticles.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>कुनै समाचार भेटिएन। <Link href="/admin/news/new" style={{ color: '#e31e24' }}>नयाँ समाचार लेख्नुस्!</Link></td></tr>
            ) : filteredArticles.map(article => {
              const status = getArticleStatus(article);
              return (
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
                    {status === 'published' && (
                      <button
                        onClick={() => togglePublish(article)}
                        className="badge badge-green"
                        style={{ cursor: 'pointer', border: 'none', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        title="क्लिक गरी ड्राफ्टमा बदल्नुस्"
                      >
                        <CheckCircle2 size={11} /> Published
                      </button>
                    )}
                    {status === 'draft' && (
                      <button
                        onClick={() => togglePublish(article)}
                        className="badge"
                        style={{ background: 'rgba(241, 196, 15, 0.2)', color: '#f1c40f', border: '1px solid rgba(241, 196, 15, 0.4)', cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        title="क्लिक गरी तुरुन्त प्रकाशित गर्नुस्"
                      >
                        <AlertCircle size={11} /> Draft
                      </button>
                    )}
                    {status === 'scheduled' && (
                      <span
                        className="badge"
                        style={{ background: 'rgba(155, 89, 182, 0.2)', color: '#c39bd3', border: '1px solid rgba(155, 89, 182, 0.4)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        title={`Scheduled for ${new Date(article.published_at).toLocaleString()}`}
                      >
                        <Clock size={11} /> Scheduled
                      </span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px', flexDirection: 'column' }}>
                      {article.is_banner && (
                        <span className="badge" style={{ background: 'rgba(227,30,36,0.2)', color: '#ff6b70', border: '1px solid rgba(227,30,36,0.4)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <Flame size={10} /> Banner
                        </span>
                      )}
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
                  <td style={{ fontSize: '12px', opacity: 0.7 }}>
                    {status === 'scheduled' ? (
                      <span style={{ color: '#c39bd3', fontWeight: 600 }}>
                        {new Date(article.published_at).toLocaleString('ne-NP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    ) : (
                      new Date(article.published_at).toLocaleDateString()
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      <Link href={`/admin/news/edit/${article.id}`} className="btn btn-ghost btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Edit3 size={13} /> Edit
                      </Link>
                      <button
                        onClick={() => toggleBanner(article)}
                        className="btn btn-ghost btn-sm"
                        title={article.is_banner ? 'Remove from banner news' : 'Mark as Banner News'}
                        style={{ color: article.is_banner ? '#ff6b70' : 'inherit' }}
                      >
                        <Flame size={13} fill={article.is_banner ? '#ff6b70' : 'none'} />
                      </button>
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
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
