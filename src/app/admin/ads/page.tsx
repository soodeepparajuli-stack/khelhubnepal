'use client';

import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { Ad, AdPosition } from '@/types';
import { Plus, Trash2, ExternalLink, Code, ImageIcon, X, AlertCircle } from 'lucide-react';

const AD_POSITIONS: { value: AdPosition; label: string; desc: string }[] = [
  { value: 'header', label: 'Header Top (हेडर ब्यानर)', desc: 'Top of page next to logo (468x60)' },
  { value: 'sidebar', label: 'Sidebar (साइडबार)', desc: 'Right sidebar on home & article pages (300x250)' },
  { value: 'footer', label: 'Footer Banner (फुटर ब्यानर)', desc: 'Full width banner above footer (728x90)' },
  { value: 'in-article', label: 'In-Article (समाचार भित्र)', desc: 'Inside news article body' },
];

export default function AdminAdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Ad form state
  const [name, setName] = useState('');
  const [position, setPosition] = useState<AdPosition>('sidebar');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [code, setCode] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ads');
      const json = await res.json();
      setAds(json.data || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      if (res.ok && json.url) {
        setImageUrl(json.url);
      } else {
        setError(json.error || 'Upload failed. You can paste an image URL directly.');
      }
    } catch {
      setError('Upload error.');
    } finally {
      setUploading(false);
    }
  };

  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          position,
          image_url: imageUrl.trim() || null,
          link_url: linkUrl.trim() || null,
          code: code.trim() || null,
          is_active: isActive,
        }),
      });

      if (res.ok) {
        setName('');
        setImageUrl('');
        setLinkUrl('');
        setCode('');
        setShowAddModal(false);
        fetchAds();
      } else {
        const json = await res.json();
        setError(json.error || 'Failed to create ad.');
      }
    } catch {
      setError('Network error creating ad.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleAdActive = async (ad: Ad) => {
    await fetch('/api/ads', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: ad.id, is_active: !ad.is_active }),
    });
    fetchAds();
  };

  const deleteAd = async (id: string) => {
    if (!confirm('के तपाईं यो विज्ञापन पक्कै हटाउन चाहनुहुन्छ? (Delete ad?)')) return;
    await fetch(`/api/ads?id=${id}`, { method: 'DELETE' });
    fetchAds();
  };

  return (
    <AdminShell title="विज्ञापन व्यवस्थापन (Manage Ads)">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: 0 }}>
          Manage sponsor banners, Google AdSense, or custom promotions across KhelHub Nepal
        </p>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={15} />
          <span>नयाँ विज्ञापन थप्नुस्</span>
        </button>
      </div>

      {/* Add Ad Modal / Form */}
      {showAddModal && (
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(227,30,36,0.3)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '30px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ color: 'white', fontSize: '16px', fontWeight: 700 }}>नयाँ विज्ञापन थप्ने फारम (New Advertisement)</h3>
            <button
              onClick={() => setShowAddModal(false)}
              className="btn btn-ghost btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <X size={14} /> बन्द गर्नुस्
            </button>
          </div>

          {error && (
            <div style={{ background: 'rgba(227,30,36,0.2)', color: '#ff6b70', padding: '10px', borderRadius: '6px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleCreateAd}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">विज्ञापनको नाम (Ad Name) *</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="उदा: Ncell Sports Offer"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">स्थान (Placement Position) *</label>
                <select
                  className="form-select"
                  value={position}
                  onChange={e => setPosition(e.target.value as AdPosition)}
                >
                  {AD_POSITIONS.map(p => (
                    <option key={p.value} value={p.value}>{p.label} - {p.desc}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">क्लिक गर्दा खुल्ने लिंक (Target URL)</label>
                <input
                  type="url"
                  className="form-input"
                  value={linkUrl}
                  onChange={e => setLinkUrl(e.target.value)}
                  placeholder="https://sponsor-website.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">ब्यानर तस्बिर (Banner Image)</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}
                  />
                  {uploading && <span style={{ color: 'var(--red)', fontSize: '12px' }}>Uploading...</span>}
                </div>
                <input
                  type="text"
                  className="form-input"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="वा इमेज लिंक पेस्ट गर्नुस्"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">वा AdSense / HTML कोड (Optional embed code)</label>
              <textarea
                className="form-textarea"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="Google AdSense कोड वा कुनै कस्टम HTML ब्यानर कोड यहाँ राख्नुस्"
                rows={3}
                style={{ fontFamily: 'monospace', fontSize: '13px' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <label className="form-check">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={e => setIsActive(e.target.checked)}
                />
                <span className="form-check-label">सक्रिय राख्ने (Active immediately)</span>
              </label>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowAddModal(false)}
                >
                  रद्द गर्नुस्
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'थपिँदैछ...' : 'सुरक्षित गर्नुस् (Save Ad)'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Ads List Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Preview</th>
              <th>Name</th>
              <th>Position</th>
              <th>Destination Link</th>
              <th>Status</th>
              <th>Date Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>लोड हुँदैछ...</td></tr>
            ) : ads.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', opacity: 0.6 }}>
                  अहिलेसम्म कुनै विज्ञापन थपिएको छैन। माथिको बटन थिचेर विज्ञापन थप्नुस्!
                </td>
              </tr>
            ) : ads.map(ad => (
              <tr key={ad.id}>
                <td>
                  {ad.image_url ? (
                    <img src={ad.image_url} alt={ad.name} style={{ width: 80, height: 40, objectFit: 'contain', background: '#0a0e2e', padding: 2, borderRadius: 3 }} />
                  ) : ad.code ? (
                    <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.1)', padding: '3px 6px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <Code size={12} /> Code
                    </span>
                  ) : (
                    <span style={{ opacity: 0.4 }}>—</span>
                  )}
                </td>
                <td style={{ fontWeight: 600, color: 'white' }}>{ad.name}</td>
                <td>
                  <span className="badge badge-navy">
                    {ad.position}
                  </span>
                </td>
                <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '12px' }}>
                  {ad.link_url ? (
                    <a href={ad.link_url} target="_blank" rel="noopener noreferrer" style={{ color: '#3498db', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <span>{ad.link_url}</span>
                      <ExternalLink size={10} />
                    </a>
                  ) : (
                    <span style={{ opacity: 0.4 }}>—</span>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => toggleAdActive(ad)}
                    className={`badge ${ad.is_active ? 'badge-green' : 'badge-red'}`}
                    style={{ cursor: 'pointer', border: 'none', fontFamily: 'inherit' }}
                    title="Click to toggle status"
                  >
                    {ad.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td style={{ fontSize: '12px', opacity: 0.5 }}>
                  {new Date(ad.created_at).toLocaleDateString()}
                </td>
                <td>
                  <button
                    onClick={() => deleteAd(ad.id)}
                    className="btn btn-danger btn-sm"
                    title="Delete ad"
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
