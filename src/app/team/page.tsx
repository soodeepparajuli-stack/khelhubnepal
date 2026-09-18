import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getCategories, getBreakingNews, getTeamMembers, getAdsByPosition } from '@/lib/data';
import { Users, Phone, Mail } from 'lucide-react';

export const metadata = {
  title: 'हाम्रो टिम (Our Team) | KhelHub Nepal',
  description: 'KhelHub Nepal को सम्पादकीय, खेलकुद पत्रकार तथा व्यवस्थापन टिम। अक्षरेखा मिडिया प्रा.लि.।',
};

export const revalidate = 60;

export default async function TeamPage() {
  const [categories, breakingNews, headerAds, teamMembers] = await Promise.all([
    getCategories(),
    getBreakingNews(),
    getAdsByPosition('header'),
    getTeamMembers(),
  ]);

  return (
    <>
      <Navbar categories={categories} breakingNews={breakingNews} headerAds={headerAds} />

      <main className="container" style={{ padding: '40px 16px', minHeight: '70vh' }}>
        <div style={{
          background: 'white',
          padding: '40px 32px',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--light-gray)',
          maxWidth: '960px',
          margin: '0 auto',
          boxShadow: 'var(--shadow-sm)',
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(227, 30, 36, 0.1)',
              color: 'var(--red)',
              marginBottom: '16px',
            }}>
              <Users size={28} />
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--navy)', margin: '0 0 8px 0' }}>
              हाम्रो टिम (Our Team)
            </h1>
            <p style={{ color: 'var(--dark-gray)', fontSize: '15px', margin: 0 }}>
              KhelHub Nepal को सम्पादकीय, खेलकुद संवाददाता तथा व्यवस्थापन टिम
            </p>
            <div style={{ width: '48px', height: '3px', background: 'var(--red)', margin: '14px auto 0', borderRadius: '2px' }} />
          </div>

          {/* Team Members Grid */}
          {teamMembers.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: 'var(--off-white)',
              borderRadius: '12px',
              border: '1px dashed var(--light-gray)',
            }}>
              <Users size={40} style={{ color: 'var(--gray)', margin: '0 auto 12px', display: 'block' }} />
              <p style={{ color: 'var(--dark-gray)', fontSize: '16px', margin: 0 }}>
                टिम विवरण चाँडै अपडेट गरिँदैछ।
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '24px',
            }}>
              {teamMembers.map(member => (
                <div
                  key={member.id}
                  style={{
                    background: 'white',
                    border: '1px solid var(--light-gray)',
                    borderRadius: '12px',
                    padding: '28px 20px',
                    textAlign: 'center',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: '104px',
                    height: '104px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    marginBottom: '16px',
                    border: '3px solid var(--off-white)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    background: 'var(--navy)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {member.image_url ? (
                      <img
                        src={member.image_url}
                        alt={member.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Users size={44} style={{ color: 'white', opacity: 0.8 }} />
                    )}
                  </div>

                  {/* Name & Role */}
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy)', margin: '0 0 6px 0' }}>
                    {member.name}
                  </h2>
                  <div style={{
                    display: 'inline-block',
                    background: 'rgba(227,30,36,0.1)',
                    color: 'var(--red)',
                    padding: '4px 14px',
                    borderRadius: '16px',
                    fontSize: '13px',
                    fontWeight: 600,
                    marginBottom: member.bio || member.phone || member.email ? '12px' : '0',
                  }}>
                    {member.role}
                  </div>

                  {/* Bio */}
                  {member.bio && (
                    <p style={{
                      fontSize: '13px',
                      color: 'var(--dark-gray)',
                      lineHeight: 1.6,
                      margin: '0 0 16px 0',
                    }}>
                      {member.bio}
                    </p>
                  )}

                  {/* Contact Links */}
                  {(member.phone || member.email) && (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      fontSize: '12px',
                      color: 'var(--dark-gray)',
                      borderTop: '1px solid var(--light-gray)',
                      paddingTop: '14px',
                      width: '100%',
                      marginTop: 'auto',
                    }}>
                      {member.phone && (
                        <a
                          href={`tel:${member.phone}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            color: 'var(--navy)',
                            textDecoration: 'none',
                            fontWeight: 500,
                          }}
                        >
                          <Phone size={13} style={{ color: '#2ecc71' }} />
                          <span>{member.phone}</span>
                        </a>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            color: 'var(--navy)',
                            textDecoration: 'none',
                            fontWeight: 500,
                          }}
                        >
                          <Mail size={13} style={{ color: '#3498db' }} />
                          <span>{member.email}</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
