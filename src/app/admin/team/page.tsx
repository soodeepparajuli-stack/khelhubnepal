'use client';

import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { TeamMember } from '@/types';
import { Users, UserPlus, Edit3, Trash2, Upload, Phone, Mail, ArrowUpDown, X } from 'lucide-react';

export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [bio, setBio] = useState('');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/team');
      const json = await res.json();
      if (json.data) {
        setTeam(json.data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const openAddModal = () => {
    setEditingMember(null);
    setName('');
    setRole('');
    setImageUrl('');
    setBio('');
    setDisplayOrder(team.length + 1);
    setEmail('');
    setPhone('');
    setError('');
    setSuccess('');
    setIsModalOpen(true);
  };

  const openEditModal = (member: TeamMember) => {
    setEditingMember(member);
    setName(member.name);
    setRole(member.role);
    setImageUrl(member.image_url || '');
    setBio(member.bio || '');
    setDisplayOrder(member.display_order || 1);
    setEmail(member.email || '');
    setPhone(member.phone || '');
    setError('');
    setSuccess('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

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
        setError(json.error || 'तस्बिर अपलोड हुन सकेन। सिधै फोटो लिंक राख्न सक्नुहुन्छ।');
      }
    } catch {
      setError('अपलोड त्रुटि। सिधै फोटो लिंक राख्न सक्नुहुन्छ।');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) {
      setError('कृपया नाम र पद अनिवार्य भर्नुहोला।');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    const payload = {
      ...(editingMember ? { id: editingMember.id } : {}),
      name: name.trim(),
      role: role.trim(),
      image_url: imageUrl.trim() || null,
      bio: bio.trim() || null,
      display_order: Number(displayOrder) || 1,
      email: email.trim() || null,
      phone: phone.trim() || null,
    };

    try {
      const res = await fetch('/api/team', {
        method: editingMember ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok) {
        setSuccess(editingMember ? 'टिम सदस्य सफलतापूर्वक अपडेट भयो!' : 'नयाँ टिम सदस्य थपियो!');
        setTimeout(() => {
          closeModal();
          fetchTeam();
        }, 800);
      } else {
        setError(json.error || 'सुरक्षित गर्न सकिएन।');
      }
    } catch {
      setError('नेटवर्क त्रुटि भयो।');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, memberName: string) => {
    if (!confirm(`के तपाईं '${memberName}' लाई टिमबाट हटाउन चाहनुहुन्छ?`)) return;

    try {
      const res = await fetch(`/api/team?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchTeam();
      } else {
        alert('हटाउन सकिएन।');
      }
    } catch {
      alert('नेटवर्क त्रुटि भयो।');
    }
  };

  return (
    <AdminShell title="हाम्रो टिम व्यवस्थापन (Our Team)">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: 0 }}>
            KhelHub Nepal का सम्पादकीय तथा प्रशासनिक टिम सदस्यहरू (कुल: {team.length})
          </p>
          <small style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>
            यहाँ थपिएका र सम्पादन गरिएका विवरणहरू हाम्रो बारे (About Us) पृष्ठमा देखिनेछन्।
          </small>
        </div>
        <button
          onClick={openAddModal}
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '14px' }}
        >
          <UserPlus size={16} />
          <span>नयाँ टिम सदस्य थप्नुस्</span>
        </button>
      </div>

      {/* Team Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>क्रम</th>
              <th style={{ width: '70px' }}>फोटो</th>
              <th>नाम (Name)</th>
              <th>पद (Designation)</th>
              <th>सम्पर्क विवरण</th>
              <th>परिचय (Bio)</th>
              <th style={{ textAlign: 'right', width: '150px' }}>कार्य (Actions)</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>लोड हुँदैछ...</td>
              </tr>
            ) : team.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>
                  कुनै टिम सदस्य भेटिएन।{' '}
                  <button onClick={openAddModal} style={{ color: 'var(--red)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                    पहिलो सदस्य थप्नुस्!
                  </button>
                </td>
              </tr>
            ) : (
              team.map((member, idx) => (
                <tr key={member.id}>
                  <td style={{ fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>
                    #{member.display_order ?? idx + 1}
                  </td>
                  <td>
                    {member.image_url ? (
                      <img
                        src={member.image_url}
                        alt={member.name}
                        style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.2)' }}
                      />
                    ) : (
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}>
                        <Users size={20} />
                      </div>
                    )}
                  </td>
                  <td>
                    <strong style={{ fontSize: '14px', color: '#fff' }}>{member.name}</strong>
                  </td>
                  <td>
                    <span className="badge badge-navy" style={{ fontSize: '12px', background: 'rgba(227,30,36,0.15)', color: '#ff6b70', border: '1px solid rgba(227,30,36,0.3)' }}>
                      {member.role}
                    </span>
                  </td>
                  <td style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                    {member.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                        <Phone size={12} style={{ color: '#2ecc71' }} />
                        <span>{member.phone}</span>
                      </div>
                    )}
                    {member.email && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Mail size={12} style={{ color: '#3498db' }} />
                        <span>{member.email}</span>
                      </div>
                    )}
                    {!member.phone && !member.email && <span style={{ opacity: 0.4 }}>—</span>}
                  </td>
                  <td style={{ maxWidth: '240px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                    <div style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {member.bio || '—'}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        onClick={() => openEditModal(member)}
                        className="btn btn-ghost btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Edit3 size={13} /> सम्पादन
                      </button>
                      <button
                        onClick={() => handleDelete(member.id, member.name)}
                        className="btn btn-danger btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px',
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            background: '#151b36',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '560px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} style={{ color: 'var(--red)' }} />
                <span>{editingMember ? 'टिम सदस्य सम्पादन गर्नुस्' : 'नयाँ टिम सदस्य थप्नुस्'}</span>
              </h3>
              <button
                onClick={closeModal}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div style={{ background: 'rgba(227,30,36,0.15)', border: '1px solid rgba(227,30,36,0.4)', color: '#ff6b70', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px' }}>
                ⚠️ {error}
              </div>
            )}
            {success && (
              <div style={{ background: 'rgba(46,204,113,0.15)', border: '1px solid rgba(46,204,113,0.4)', color: '#2ecc71', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px' }}>
                ✓ {success}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">नाम (Full Name) *</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="उदा: सुदीप पराजुली"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">पद (Role / Designation) *</label>
                <input
                  type="text"
                  className="form-input"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  placeholder="उदा: प्रधान सम्पादक / प्रबन्ध निर्देशक / संवाददाता"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">फोन नम्बर (Phone)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="९८६७४२३१९७"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">इमेल ठेगाना (Email)</label>
                  <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="khelhub@gmail.com"
                  />
                </div>
              </div>

              {/* Photo Upload */}
              <div className="form-group">
                <label className="form-label">फोटो (Profile Photo)</label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
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
                  placeholder="वा तस्बिरको लिंक पेस्ट गर्नुस् (https://...)"
                />
                {imageUrl && (
                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={imageUrl}
                      alt="Preview"
                      style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.3)' }}
                    />
                    <small style={{ color: 'rgba(255,255,255,0.6)' }}>फोटो प्रिभ्यु</small>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">क्रम (Display Order)</label>
                <input
                  type="number"
                  className="form-input"
                  value={displayOrder}
                  onChange={e => setDisplayOrder(parseInt(e.target.value) || 1)}
                  min={1}
                />
                <small style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                  सानो अंक अगाडि देखिनेछ (उदा: १, २, ३...)
                </small>
              </div>

              <div className="form-group">
                <label className="form-label">संक्षिप्त परिचय (Bio / About)</label>
                <textarea
                  className="form-textarea"
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="टिम सदस्यको संक्षिप्त अनुभव वा परिचय..."
                  rows={3}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn btn-ghost"
                  style={{ padding: '10px 18px' }}
                >
                  रद्द गर्नुस्
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                  style={{ padding: '10px 22px' }}
                >
                  {saving ? 'सुरक्षित गर्दै...' : editingMember ? '💾 अपडेट गर्नुस्' : '✓ थप्नुस्'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
