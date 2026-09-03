'use client';

import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { Ad, AdPosition } from '@/types';
import { Plus, Trash2, ExternalLink, Code, X, AlertCircle, Edit3, Save } from 'lucide-react';

const AD_POSITIONS: { value: AdPosition; label: string; desc: string }[] = [
  { value: 'header', label: 'Header Top (हेडर ब्यानर)', desc: 'Top of page next to logo (468x60)' },
  { value: 'sidebar', label: 'Sidebar (साइडबार)', desc: 'Right sidebar on home & article pages (300x250)' },
  { value: 'footer', label: 'Footer Banner (फुटर ब्यानर)', desc: 'Full width banner above footer (728x90)' },
  { value: 'in-article', label: 'In-Article (समाचार भित्र)', desc: 'Inside news article body' },
];

type ModalMode = 'add' | 'edit';

export default function AdminAdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('add');
  const [editingAd, setEditingAd] = useState<Ad | null>(null);

  // Form state
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

  useEffect(() => { fetchAds(); }, []);

  const resetForm = () => {
    setName('');
    setPosition('sidebar');
    setImageUrl('');
    setLinkUrl('');
    setCode('');
    setIsActive(true);
    setError('');
    setUploading(false);
  };

  const openAddModal = () => {
    setModalMode('add');
    setEditingAd(null);
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (ad: Ad) => {
    setModalMode('edit');
    setEditingAd(ad);
    setName(ad.name);
    setPosition(ad.position);
    setImageUrl(ad.image_url || '');
    setLinkUrl(ad.link_url || '');
    setCode(ad.code || '');
    setIsActive(ad.is_active);
    setError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAd(null);
    resetForm();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const json = await res.json();
      if (res.ok && json.url) {
        setImageUrl(json.url);
      } else {
        setError(json.error || 'Upload failed. Please paste an image URL directly.');
      }
    } catch {
      setError('Upload error.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const payload = {
      ...(modalMode === 'edit' && editingAd ? { id: editingAd.id } : {}),
      name: name.trim(),
      position,
      image_url: imageUrl.trim() || null,
      link_url: linkUrl.trim() || null,
      code: code.trim() || null,
      is_active: isActive,
    };

    try {
      const res = await fetch('/api/ads', {
        method: modalMode === 'edit' ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        closeModal();
        fetchAds();
      } else {
        const json = await res.json();
        setError(json.error || 'Failed to save ad.');
      }
    } catch {
      setError('Network error. Please try again.');
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
          onClick={openAddModal}
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={15} />
          <span>नयाँ विज्ञापन थप्नुस्</span>
        </button>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          border: `1px solid ${modalMode === 'edit' ? 'rgba(52,152,219,0.5)' : 'rgba(227,30,36,0.3)'}`,
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '30px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ color: 'white', fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              {modalMode === 'edit'
                ? <><Edit3 size={16} style={{ color: '#3498db' }} /> विज्ञापन सम्पादन: <span style={{ color: '#3498db' }}>{editingAd?.name}</span></>
                : <><Plus size={16} style={{ color: '#e31e24' }} /> नयाँ विज्ञापन थप्ने</>
              }
            </h3>
            <button
              onClick={closeModal}
              className="btn btn-ghost btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <X size={14} /> बन्द
            </button>
          </div>

          {error && (
            <div style={{ background: 'rgba(227,30,36,0.2)', color: '#ff6b70', padding: '10px', borderRadius: '6px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
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
                  autoFocus
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
                    <option key={p.value} value={p.value}>{p.label} — {p.desc}</option>
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
                  placeholder="वा इमेज URL यहाँ पेस्ट गर्नुस्"
                />
                {imageUrl && (
                  <div style={{ marginTop: '8px' }}>
                    <img
                      src={imageUrl}
                      alt="Preview"
                      style={{ maxHeight: '60px', maxWidth: '180px', objectFit: 'contain', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', padding: '4px' }}
                      onError={e => (e.currentTarget.style.display = 'none')}
                    />
                  </div>
                )}
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
              <label className="form-check" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={e => setIsActive(e.target.checked)}
                  style={{ width: '16px', height: '16px' }}
                />
                <span className="form-check-label">सक्रिय राख्ने (Active)</span>
              </label>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" className="btn btn-ghost" onClick={closeModal}>
                  रद्द गर्नुस्
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Save size={14} />
                  <span>
                    {submitting
                      ? (modalMode === 'edit' ? 'अद्यावधिक हुँदैछ...' : 'थपिँदैछ...')
                      : (modalMode === 'edit' ? 'अद्यावधिक गर्नुस् (Update)' : 'सुरक्षित गर्नुस् (Save)')
                    }
                  </span>
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
                    <img
                      src={ad.image_url}
                      alt={ad.name}
                      style={{ width: 80, height: 40, objectFit: 'contain', background: '#0a0e2e', padding: 2, borderRadius: 3 }}
                    />
                  ) : ad.code ? (
                    <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.1)', padding: '3px 6px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <Code size={12} /> Code
                    </span>
                  ) : (
                    <span style={{ opacity: 0.4, fontSize: '12px' }}>—</span>
                  )}
                </td>
                <td style={{ fontWeight: 600, color: 'white' }}>{ad.name}</td>
                <td>
                  <span className="badge badge-navy">{ad.position}</span>
                </td>
                <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '12px' }}>
                  {ad.link_url ? (
                    <a
                      href={ad.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#3498db', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                    >
                      <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', whiteSpace: 'nowrap' }}>{ad.link_url}</span>
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
                    title="Click to toggle"
                  >
                    {ad.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td style={{ fontSize: '12px', opacity: 0.5 }}>
                  {new Date(ad.created_at).toLocaleDateString()}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => openEditModal(ad)}
                      className="btn btn-ghost btn-sm"
                      title="Edit ad"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Edit3 size={13} /> Edit
                    </button>
                    <button
                      onClick={() => deleteAd(ad.id)}
                      className="btn btn-danger btn-sm"
                      title="Delete ad"
                    >
                      <Trash2 size={13} />
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
