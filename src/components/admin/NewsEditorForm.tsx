'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NewsArticle } from '@/types';
import { generateSlug } from '@/lib/data';

interface NewsEditorFormProps {
  initialData?: Partial<NewsArticle>;
  isEdit?: boolean;
}

const DEFAULT_CATEGORIES = [
  { id: '1', name: 'फुटबल', slug: 'football' },
  { id: '2', name: 'क्रिकेट', slug: 'cricket' },
  { id: '3', name: 'भलिबल', slug: 'volleyball' },
  { id: '4', name: 'बास्केटबल', slug: 'basketball' },
  { id: '5', name: 'eSports', slug: 'esports' },
  { id: '6', name: 'अन्य खेल', slug: 'others' },
];

export default function NewsEditorForm({ initialData, isEdit = false }: NewsEditorFormProps) {
  const router = useRouter();

  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>(DEFAULT_CATEGORIES);
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [categorySlug, setCategorySlug] = useState(initialData?.category_slug || 'football');
  const [author, setAuthor] = useState(initialData?.author || 'KhelHub Nepal');
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || '');
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured || false);
  const [isBreaking, setIsBreaking] = useState(initialData?.is_breaking || false);
  const [isPublished, setIsPublished] = useState(initialData?.is_published ?? true);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
          setCategories(data.data);
        }
      })
      .catch(() => {});
  }, []);

  // Auto-generate slug when title changes in new mode
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEdit && !slug) {
      setSlug(generateSlug(val));
    }
  };

  // Image Upload handler
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
        setError(json.error || 'Image upload failed. You can paste an image URL directly below.');
      }
    } catch {
      setError('Upload error. You can paste an image URL directly below.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const selectedCategory = categories.find(c => c.slug === categorySlug);

    const payload = {
      ...(isEdit && initialData?.id ? { id: initialData.id } : {}),
      title: title.trim(),
      slug: slug.trim() || generateSlug(title),
      excerpt: excerpt.trim(),
      content: content.trim(),
      category_id: selectedCategory?.id || null,
      category_name: selectedCategory?.name || 'अन्य खेल',
      category_slug: categorySlug,
      author: author.trim() || 'KhelHub Nepal',
      image_url: imageUrl.trim() || null,
      is_featured: isFeatured,
      is_breaking: isBreaking,
      is_published: isPublished,
    };

    try {
      const res = await fetch('/api/news', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (res.ok) {
        setSuccess(isEdit ? 'Article updated successfully!' : 'Article published successfully!');
        setTimeout(() => {
          router.push('/admin/news');
        }, 1200);
      } else {
        setError(json.error || 'Failed to save article.');
      }
    } catch {
      setError('Network error saving article.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form" style={{ maxWidth: '900px' }}>
      {error && (
        <div style={{ background: 'rgba(227,30,36,0.15)', border: '1px solid rgba(227,30,36,0.4)', color: '#ff6b70', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' }}>
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div style={{ background: 'rgba(46,204,113,0.15)', border: '1px solid rgba(46,204,113,0.4)', color: '#2ecc71', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' }}>
          ✅ {success}
        </div>
      )}

      {/* Title */}
      <div className="form-group">
        <label className="form-label">शीर्षक (Title) *</label>
        <input
          type="text"
          className="form-input"
          value={title}
          onChange={e => handleTitleChange(e.target.value)}
          placeholder="उदाहरण: नेपालले यूएईलाई हराउँदै विश्वकपमा स्थान बनायो"
          required
          style={{ fontSize: '16px', fontWeight: 600 }}
        />
      </div>

      {/* Slug */}
      <div className="form-group">
        <label className="form-label">URL Slug (स्लग)</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            className="form-input"
            value={slug}
            onChange={e => setSlug(e.target.value)}
            placeholder="nepal-beat-uae-world-cup"
          />
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setSlug(generateSlug(title))}
          >
            Auto
          </button>
        </div>
        <small style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '4px', display: 'block' }}>
          This will be the web address: /news/{slug || 'example-slug'}
        </small>
      </div>

      {/* Category & Author */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">वर्ग (Category) *</label>
          <select
            className="form-select"
            value={categorySlug}
            onChange={e => setCategorySlug(e.target.value)}
          >
            {categories.map(c => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">लेखक (Author)</label>
          <input
            type="text"
            className="form-input"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            placeholder="KhelHub Desk"
          />
        </div>
      </div>

      {/* Featured Image */}
      <div className="form-group">
        <label className="form-label">तस्बिर (Featured Image)</label>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}
          />
          {uploading && <span style={{ color: 'var(--red)', fontSize: '13px' }}>Uploading...</span>}
        </div>
        <input
          type="text"
          className="form-input"
          value={imageUrl}
          onChange={e => setImageUrl(e.target.value)}
          placeholder="वा सिधै इमेज लिंक पेस्ट गर्नुस् (https://...)"
        />
        {imageUrl && (
          <div style={{ marginTop: '10px' }}>
            <img
              src={imageUrl}
              alt="Preview"
              style={{ maxHeight: '180px', borderRadius: '6px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.2)' }}
            />
          </div>
        )}
      </div>

      {/* Excerpt */}
      <div className="form-group">
        <label className="form-label">सारांश (Excerpt / Short Summary)</label>
        <textarea
          className="form-textarea"
          value={excerpt}
          onChange={e => setExcerpt(e.target.value)}
          placeholder="समाचारको छोटो सारांश (होमपेज र कार्डमा देखिने)"
          rows={3}
        />
      </div>

      {/* Content (HTML Supported) */}
      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <label className="form-label" style={{ margin: 0 }}>पूर्ण समाचार सामग्री (Content) *</label>
          {/* Quick format buttons */}
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setContent(prev => prev + '\n<p>यहाँ अनुच्छेद लेख्नुस्...</p>')}
            >
              + Paragraph
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setContent(prev => prev + '\n<h3>उप-शीर्षक</h3>')}
            >
              + Subheading
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setContent(prev => prev + '\n<blockquote>"यहाँ उद्धरण लेख्नुस्"</blockquote>')}
            >
              + Quote
            </button>
          </div>
        </div>
        <textarea
          className="form-textarea"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="पूर्ण समाचार यहाँ लेख्नुस् वा HTML प्रयोग गर्नुस् (<p>, <h3>, <blockquote>, आदि)"
          rows={12}
          style={{ fontFamily: 'monospace', fontSize: '14px', lineHeight: 1.6 }}
          required
        />
      </div>

      {/* Flags */}
      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', marginBottom: '24px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <label className="form-check">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={e => setIsFeatured(e.target.checked)}
          />
          <span className="form-check-label">⭐ मुख्य समाचार (Featured on Hero)</span>
        </label>

        <label className="form-check">
          <input
            type="checkbox"
            checked={isBreaking}
            onChange={e => setIsBreaking(e.target.checked)}
          />
          <span className="form-check-label">🔴 ब्रेकिङ न्यूज (Breaking Ticker)</span>
        </label>

        <label className="form-check">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={e => setIsPublished(e.target.checked)}
          />
          <span className="form-check-label">✓ तुरुन्त प्रकाशित गर्ने (Published)</span>
        </label>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={saving}
          style={{ padding: '12px 28px', fontSize: '15px' }}
        >
          {saving ? '⏳ Saving...' : isEdit ? '💾 Update Article' : '🚀 Publish Article'}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => router.push('/admin/news')}
          style={{ padding: '12px 20px' }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
