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
  const [isBanner, setIsBanner] = useState(initialData?.is_banner || false);

  // Status: published, draft, or scheduled
  const initialStatus = (() => {
    if (initialData?.is_published === false) return 'draft';
    if (initialData?.published_at && new Date(initialData.published_at).getTime() > Date.now()) return 'scheduled';
    return 'published';
  })();
  const [publishStatus, setPublishStatus] = useState<'published' | 'draft' | 'scheduled'>(initialStatus);
  const [scheduledAt, setScheduledAt] = useState(() => {
    if (initialData?.published_at && new Date(initialData.published_at).getTime() > Date.now()) {
      const d = new Date(initialData.published_at);
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      return d.toISOString().slice(0, 16);
    }
    const d = new Date(Date.now() + 2 * 3600 * 1000);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  });

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

    // Compute publish settings
    let finalIsPublished = true;
    let finalPublishedAt = initialData?.published_at || new Date().toISOString();

    if (publishStatus === 'draft') {
      finalIsPublished = false;
    } else if (publishStatus === 'scheduled') {
      finalIsPublished = true;
      finalPublishedAt = new Date(scheduledAt).toISOString();
    } else {
      finalIsPublished = true;
      if (!isEdit || (initialData?.published_at && new Date(initialData.published_at).getTime() > Date.now())) {
        finalPublishedAt = new Date().toISOString();
      }
    }

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
      is_banner: isBanner,
      is_published: finalIsPublished,
      published_at: finalPublishedAt,
    };

    try {
      const res = await fetch('/api/news', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (res.ok) {
        const successMsg = publishStatus === 'draft'
          ? 'समाचार ड्राफ्टको रूपमा सुरक्षित गरियो!'
          : publishStatus === 'scheduled'
          ? 'समाचार सेड्युल गरियो!'
          : isEdit
          ? 'समाचार सफलतापूर्वक अपडेट भयो!'
          : 'समाचार सफलतापूर्वक प्रकाशित भयो!';

        setSuccess(successMsg);
        setTimeout(() => {
          router.push('/admin/news');
        }, 1000);
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

      {/* Badges / Visibility Highlights */}
      <div className="form-group" style={{ marginBottom: '20px' }}>
        <label className="form-label">समाचार प्राथमिकता (Badges & Placement)</label>
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <label className="form-check" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isBanner}
              onChange={e => setIsBanner(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--red)' }}
            />
            <span style={{ fontWeight: 600, color: isBanner ? '#ff6b70' : 'rgba(255,255,255,0.85)' }}>
              🔥 ब्यानर न्यूज (Banner News - शीर्ष स्थानमा)
            </span>
          </label>

          <label className="form-check" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={e => setIsFeatured(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#f39c12' }}
            />
            <span style={{ fontWeight: 600, color: isFeatured ? '#f39c12' : 'rgba(255,255,255,0.85)' }}>
              ⭐ मुख्य समाचार (Featured on Hero)
            </span>
          </label>

          <label className="form-check" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isBreaking}
              onChange={e => setIsBreaking(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--red)' }}
            />
            <span style={{ fontWeight: 600, color: isBreaking ? '#ff4d4f' : 'rgba(255,255,255,0.85)' }}>
              🔴 ब्रेकिङ न्यूज (Breaking Ticker)
            </span>
          </label>
        </div>
      </div>

      {/* Publication Status (ड्राफ्ट, सेड्युल र तुरुन्त प्रकाशित) */}
      <div className="form-group" style={{ marginBottom: '28px' }}>
        <label className="form-label">प्रकाशन स्थिति (Publication Status) *</label>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
          marginBottom: '16px',
        }}>
          {/* Publish Now */}
          <label style={{
            background: publishStatus === 'published' ? 'rgba(46, 204, 113, 0.15)' : 'rgba(255,255,255,0.03)',
            border: publishStatus === 'published' ? '2px solid #2ecc71' : '1px solid rgba(255,255,255,0.1)',
            padding: '16px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            transition: 'all 0.2s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="radio"
                name="publishStatus"
                value="published"
                checked={publishStatus === 'published'}
                onChange={() => setPublishStatus('published')}
                style={{ accentColor: '#2ecc71', width: '18px', height: '18px' }}
              />
              <strong style={{ color: publishStatus === 'published' ? '#2ecc71' : '#fff', fontSize: '15px' }}>
                🚀 तुरुन्त प्रकाशित (Publish Now)
              </strong>
            </div>
            <small style={{ color: 'rgba(255,255,255,0.6)', paddingLeft: '28px', fontSize: '12px' }}>
              सेभ हुनासाथ पाठकहरूलाई तुरुन्तै देखिनेछ।
            </small>
          </label>

          {/* Draft */}
          <label style={{
            background: publishStatus === 'draft' ? 'rgba(241, 196, 15, 0.15)' : 'rgba(255,255,255,0.03)',
            border: publishStatus === 'draft' ? '2px solid #f1c40f' : '1px solid rgba(255,255,255,0.1)',
            padding: '16px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            transition: 'all 0.2s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="radio"
                name="publishStatus"
                value="draft"
                checked={publishStatus === 'draft'}
                onChange={() => setPublishStatus('draft')}
                style={{ accentColor: '#f1c40f', width: '18px', height: '18px' }}
              />
              <strong style={{ color: publishStatus === 'draft' ? '#f1c40f' : '#fff', fontSize: '15px' }}>
                📝 मस्यौदा / ड्राफ्ट (Draft)
              </strong>
            </div>
            <small style={{ color: 'rgba(255,255,255,0.6)', paddingLeft: '28px', fontSize: '12px' }}>
              एडमिनमा सुरक्षित रहनेछ, साइटमा देखिने छैन।
            </small>
          </label>

          {/* Schedule */}
          <label style={{
            background: publishStatus === 'scheduled' ? 'rgba(155, 89, 182, 0.2)' : 'rgba(255,255,255,0.03)',
            border: publishStatus === 'scheduled' ? '2px solid #9b59b6' : '1px solid rgba(255,255,255,0.1)',
            padding: '16px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            transition: 'all 0.2s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="radio"
                name="publishStatus"
                value="scheduled"
                checked={publishStatus === 'scheduled'}
                onChange={() => setPublishStatus('scheduled')}
                style={{ accentColor: '#9b59b6', width: '18px', height: '18px' }}
              />
              <strong style={{ color: publishStatus === 'scheduled' ? '#c39bd3' : '#fff', fontSize: '15px' }}>
                ⏰ सेड्युल (Schedule for Later)
              </strong>
            </div>
            <small style={{ color: 'rgba(255,255,255,0.6)', paddingLeft: '28px', fontSize: '12px' }}>
              तोकिएको मिति र समय पुगेपछि मात्र देखिनेछ।
            </small>
          </label>
        </div>

        {/* Scheduled Date-Time Picker */}
        {publishStatus === 'scheduled' && (
          <div style={{
            background: 'rgba(155, 89, 182, 0.1)',
            border: '1px solid rgba(155, 89, 182, 0.3)',
            padding: '18px',
            borderRadius: '8px',
            marginTop: '12px',
          }}>
            <label className="form-label" style={{ color: '#d7bde2', marginBottom: '8px', display: 'block' }}>
              📅 प्रकाशित हुने मिति र समय (Scheduled Publish Date & Time) *
            </label>
            <input
              type="datetime-local"
              className="form-input"
              value={scheduledAt}
              onChange={e => setScheduledAt(e.target.value)}
              required={publishStatus === 'scheduled'}
              style={{ maxWidth: '340px', fontSize: '15px', colorScheme: 'dark' }}
            />
            <small style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginTop: '8px', display: 'block' }}>
              💡 यो समाचार माथि तोकिएको मिति र समय नआएसम्म सार्वजनिक वेबसाइटमा देखिने छैन।
            </small>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={saving}
          style={{
            padding: '12px 30px',
            fontSize: '15px',
            background: publishStatus === 'draft' ? '#d4ac0d' : publishStatus === 'scheduled' ? '#8e44ad' : 'var(--red)',
            borderColor: publishStatus === 'draft' ? '#b7950b' : publishStatus === 'scheduled' ? '#7d3c98' : 'var(--red)',
          }}
        >
          {saving
            ? '⏳ सेभ हुँदैछ...'
            : publishStatus === 'draft'
            ? '💾 ड्राफ्ट सुरक्षित गर्नुस्'
            : publishStatus === 'scheduled'
            ? '⏰ सेड्युल पोस्ट सुरक्षित गर्नुस्'
            : isEdit
            ? '💾 समाचार अपडेट गर्नुस्'
            : '🚀 तुरुन्त प्रकाशित गर्नुस्'}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => router.push('/admin/news')}
          style={{ padding: '12px 20px' }}
        >
          रद्द गर्नुस्
        </button>
      </div>
    </form>
  );
}

