'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';
import { Category } from '@/types';
import { generateSlug } from '@/lib/data';
import { Plus, Trash2, Edit3, ExternalLink, X, AlertCircle } from 'lucide-react';

const PRESET_COLORS = [
  '#2ecc71', // Green (Football)
  '#3498db', // Blue (Cricket)
  '#e67e22', // Orange (Volleyball)
  '#e31e24', // Red (Basketball/Brand)
  '#9b59b6', // Purple (eSports)
  '#1abc9c', // Teal (Others)
  '#f39c12', // Amber
  '#d35400', // Rust
  '#16a085', // Sea Green
  '#2c3e50', // Dark Slate
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [color, setColor] = useState('#e31e24');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories');
      const json = await res.json();
      setCategories(json.data || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCat(null);
    setName('');
    setSlug('');
    setColor('#e31e24');
    setError('');
    setShowModal(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCat(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setColor(cat.color || '#e31e24');
    setError('');
    setShowModal(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCat) {
      setSlug(generateSlug(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const payload = {
      ...(editingCat ? { id: editingCat.id } : {}),
      name: name.trim(),
      slug: slug.trim() || generateSlug(name),
      color,
    };

    try {
      const res = await fetch('/api/categories', {
        method: editingCat ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok) {
        setShowModal(false);
        fetchCategories();
      } else {
        setError(json.error || 'Failed to save category.');
      }
    } catch {
      setError('Network error saving category.');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteCategory = async (id: string, catName: string) => {
    if (!confirm(`Are you sure you want to delete category "${catName}"?`)) return;
    try {
      await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
      fetchCategories();
    } catch {
      alert('Failed to delete category.');
    }
  };

  return (
    <AdminShell title="खेलकुद विधा व्यवस्थापन (Categories)">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: 0 }}>
          Manage sports categories shown in navigation bar, home sections, and article publishing
        </p>
        <button
          onClick={openCreateModal}
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={15} />
          <span>नयाँ विधा थप्नुस्</span>
        </button>
      </div>

      {/* Add / Edit Category Modal */}
      {showModal && (
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(227,30,36,0.4)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '30px',
          maxWidth: '650px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ color: 'white', fontSize: '16px', fontWeight: 700 }}>
              {editingCat ? `विधा सम्पादन (Edit): ${editingCat.name}` : 'नयाँ खेलकुद विधा थप्ने (New Category)'}
            </h3>
            <button
              onClick={() => setShowModal(false)}
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

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">विधाको नाम (Category Name in Nepali) *</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={e => handleNameChange(e.target.value)}
                placeholder="उदाहरण: ब्याडमिन्टन, टेबलटेनिस, पौडी, कराते"
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">URL Slug (स्लग - English or Latin characters) *</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="form-input"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  placeholder="badminton"
                  required
                />
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setSlug(generateSlug(name))}
                >
                  Auto
                </button>
              </div>
              <small style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                This will be the web address: /category/{slug || 'badminton'}
              </small>
            </div>

            {/* Color selection */}
            <div className="form-group">
              <label className="form-label">ब्राण्ड / ब्याज रङ (Tag Color)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <input
                  type="color"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  style={{ width: '44px', height: '40px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: 'transparent' }}
                />
                <span style={{ color: 'white', fontFamily: 'monospace', fontSize: '14px' }}>{color}</span>
                <span
                  style={{
                    backgroundColor: color,
                    color: 'white',
                    padding: '3px 10px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 700,
                    marginLeft: '8px',
                  }}
                >
                  {name || 'पूर्वावलोकन'}
                </span>
              </div>

              {/* Color Presets */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {PRESET_COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: c,
                      border: color === c ? '2px solid white' : 'none',
                      cursor: 'pointer',
                      transform: color === c ? 'scale(1.15)' : 'none',
                      transition: 'transform 0.15s ease',
                    }}
                    title={c}
                  />
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setShowModal(false)}
              >
                रद्द गर्नुस्
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'सुरक्षित हुँदैछ...' : editingCat ? 'अद्यावधिक गर्नुस् (Update)' : 'विधा थप्नुस् (Add Category)'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tag Color</th>
              <th>Category Name</th>
              <th>Slug / URL</th>
              <th>Date Added</th>
              <th>Live Preview</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>लोड हुँदैछ...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>कुनै विधा फेला परेन। माथिको बटन थिचेर थप्नुस्!</td></tr>
            ) : categories.map(cat => (
              <tr key={cat.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: cat.color || '#e31e24' }} />
                    <span style={{
                      backgroundColor: cat.color || '#e31e24',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}>
                      {cat.name}
                    </span>
                  </div>
                </td>
                <td style={{ fontWeight: 700, color: 'white', fontSize: '15px' }}>
                  {cat.name}
                </td>
                <td>
                  <code style={{ background: 'rgba(255,255,255,0.08)', padding: '3px 6px', borderRadius: '4px', fontSize: '12px' }}>
                    /category/{cat.slug}
                  </code>
                </td>
                <td style={{ fontSize: '12px', opacity: 0.5 }}>
                  {new Date(cat.created_at).toLocaleDateString()}
                </td>
                <td>
                  <Link
                    href={`/category/${cat.slug}`}
                    target="_blank"
                    className="btn btn-ghost btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <span>हेर्नुस्</span>
                    <ExternalLink size={12} />
                  </Link>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => openEditModal(cat)}
                      className="btn btn-ghost btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Edit3 size={13} /> Edit
                    </button>
                    <button
                      onClick={() => deleteCategory(cat.id, cat.name)}
                      className="btn btn-danger btn-sm"
                      title="Delete category"
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
