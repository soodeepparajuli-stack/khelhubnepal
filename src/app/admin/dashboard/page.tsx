import { createAdminClient } from '@/lib/supabase';
import AdminShell from '@/components/admin/AdminShell';
import Link from 'next/link';
import { MOCK_NEWS, MOCK_ADS } from '@/lib/mockData';
import { Newspaper, Star, Radio, Megaphone, PenSquare, FolderTree, ExternalLink } from 'lucide-react';

const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

export default async function AdminDashboard() {
  let totalArticles = MOCK_NEWS.length;
  let featuredCount = MOCK_NEWS.filter(n => n.is_featured).length;
  let breakingCount = MOCK_NEWS.filter(n => n.is_breaking).length;
  let adsCount = MOCK_ADS.length;
  let recentNews = MOCK_NEWS.slice(0, 8);

  if (!isPlaceholder) {
    try {
      const supabase = createAdminClient();
      const [
        { count: tCount },
        { count: fCount },
        { count: bCount },
        { count: aCount },
        { data: rNews },
      ] = await Promise.all([
        supabase.from('news').select('*', { count: 'exact', head: true }),
        supabase.from('news').select('*', { count: 'exact', head: true }).eq('is_featured', true),
        supabase.from('news').select('*', { count: 'exact', head: true }).eq('is_breaking', true),
        supabase.from('ads').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('news').select('id, title, category_name, published_at, is_published, views').order('created_at', { ascending: false }).limit(8),
      ]);

      if (tCount !== null && tCount !== undefined) totalArticles = tCount;
      if (fCount !== null && fCount !== undefined) featuredCount = fCount;
      if (bCount !== null && bCount !== undefined) breakingCount = bCount;
      if (aCount !== null && aCount !== undefined) adsCount = aCount;
      if (rNews && rNews.length > 0) recentNews = rNews as typeof MOCK_NEWS;
    } catch {
      // Fallback to mock counts
    }
  }

  return (
    <AdminShell title="📊 ड्यासबोर्ड (Dashboard)">
      {isPlaceholder && (
        <div style={{
          background: 'rgba(52, 152, 219, 0.15)',
          border: '1px solid rgba(52, 152, 219, 0.4)',
          borderRadius: '8px',
          padding: '14px 18px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div>
            <strong style={{ color: '#3498db' }}>ℹ️ Demo Mode:</strong>{' '}
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>
              वेबसाइट अहिले नमूना डाटा (Demo Data) मा चलिरहेको छ। आफ्नो Supabase credentials जोडेपछि यो सिधै लाइभ डाटाबेसमा जोडिन्छ।
            </span>
          </div>
          <span style={{ fontSize: '12px', background: '#3498db', color: 'white', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
            Active & Ready
          </span>
        </div>
      )}

      {/* Stats */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-icon" style={{ color: '#3498db' }}><Newspaper size={26} /></div>
          <div className="stat-value">{totalArticles}</div>
          <div className="stat-label">Total Articles</div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon" style={{ color: '#f39c12' }}><Star size={26} /></div>
          <div className="stat-value">{featuredCount}</div>
          <div className="stat-label">Featured on Hero</div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon" style={{ color: '#e31e24' }}><Radio size={26} /></div>
          <div className="stat-value">{breakingCount}</div>
          <div className="stat-label">Breaking Ticker</div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon" style={{ color: '#2ecc71' }}><Megaphone size={26} /></div>
          <div className="stat-value">{adsCount}</div>
          <div className="stat-label">Active Advertisements</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <Link href="/admin/news/new" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <PenSquare size={15} />
          <span>नयाँ समाचार लेख्नुस्</span>
        </Link>
        <Link href="/admin/categories" className="btn btn-navy" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <FolderTree size={15} />
          <span>वर्ग व्यवस्थापन (Categories)</span>
        </Link>
        <Link href="/admin/ads" className="btn btn-navy" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Megaphone size={15} />
          <span>विज्ञापन व्यवस्थापन (Ads)</span>
        </Link>
        <Link href="/admin/news" className="btn btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Newspaper size={15} />
          <span>सम्पूर्ण समाचार</span>
        </Link>
        <a href="/" target="_blank" className="btn btn-ghost" style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <ExternalLink size={14} />
          <span>वेबसाइट हेर्नुस्</span>
        </a>
      </div>

      {/* Recent Articles */}
      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <h3>हालैका समाचार (Recent Articles)</h3>
          <Link href="/admin/news" className="btn btn-ghost btn-sm">सबै हेर्नुस् →</Link>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Views</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentNews.map(article => (
              <tr key={article.id}>
                <td style={{ maxWidth: '320px' }}>
                  <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: '13px', lineHeight: 1.4 }}>
                    {article.title}
                  </span>
                </td>
                <td>
                  <span className="badge badge-navy">{article.category_name || '—'}</span>
                </td>
                <td>
                  <span className={`badge ${article.is_published ? 'badge-green' : 'badge-red'}`}>
                    {article.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td>{article.views?.toLocaleString() || 0}</td>
                <td style={{ fontSize: '12px', opacity: 0.6 }}>
                  {new Date(article.published_at).toLocaleDateString()}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <Link href={`/admin/news/edit/${article.id}`} className="btn btn-ghost btn-sm">
                      Edit
                    </Link>
                    <Link href={`/news/${article.slug}`} target="_blank" className="btn btn-ghost btn-sm">
                      View ↗
                    </Link>
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
