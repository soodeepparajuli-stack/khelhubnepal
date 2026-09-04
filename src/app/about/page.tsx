import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { getCategories, getBreakingNews, getTeamMembers, getAdsByPosition } from '@/lib/data';
import { Users, Phone, Mail } from 'lucide-react';

export const metadata = {
  title: 'हाम्रो बारे (About Us) | KhelHub Nepal',
  description: 'KhelHub Nepal नेपाली खेलकुद क्षेत्रलाई समर्पित एक स्वतन्त्र, निष्पक्ष र व्यावसायिक अनलाइन डिजिटल खेलकुद मिडिया हो।',
};

export const revalidate = 60;

export default async function AboutPage() {
  const [categories, breakingNews, headerAds, teamMembers] = await Promise.all([
    getCategories(),
    getBreakingNews(),
    getAdsByPosition('header'),
    getTeamMembers(),
  ]);

  return (
    <>
      <Navbar categories={categories} breakingNews={breakingNews} headerAds={headerAds} />

      <main className="container" style={{ padding: '40px 16px', minHeight: '65vh' }}>
        <div style={{
          background: 'white',
          padding: '40px 32px',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--light-gray)',
          maxWidth: '920px',
          margin: '0 auto',
          boxShadow: 'var(--shadow-sm)',
        }}>
          {/* Logo & Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <Image
              src="/logo.png"
              alt="KhelHub Nepal Logo"
              width={90}
              height={90}
              style={{ margin: '0 auto 16px', display: 'block' }}
              unoptimized
            />
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--navy)' }}>
              हाम्रो बारे (About Us)
            </h1>
            <div style={{ width: '48px', height: '3px', background: 'var(--red)', margin: '10px auto 0', borderRadius: '2px' }} />
          </div>

          {/* About Paragraph - Exact and only paragraph requested by client */}
          <div style={{
            fontSize: '17px',
            lineHeight: 1.9,
            color: '#2c3e50',
            textAlign: 'justify',
            background: 'var(--off-white)',
            padding: '24px 28px',
            borderRadius: '10px',
            borderLeft: '4px solid var(--red)',
            marginBottom: '48px',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <p style={{ margin: 0 }}>
              <strong>KhelHub Nepal</strong> नेपाली खेलकुद क्षेत्रलाई समर्पित एक स्वतन्त्र, निष्पक्ष र व्यावसायिक अनलाइन डिजिटल खेलकुद मिडिया हो। खेलकुद क्षेत्रका गतिविधि, खेलाडीहरूको मिहिनेत, राष्ट्रिय तथा अन्तर्राष्ट्रिय प्रतियोगिताहरूलाई तथ्यपरक र निष्पक्ष ढंगले नेपाली पाठक र दर्शकमाझ पुर्‍याउनु हाम्रो प्रमुख उद्देश्य हो।
            </p>
          </div>

          {/* Our Team Section */}
          <div id="team" style={{ marginTop: '12px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              borderBottom: '2px solid var(--navy)',
              paddingBottom: '12px',
              marginBottom: '28px'
            }}>
              <Users size={24} style={{ color: 'var(--red)' }} />
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--navy)', margin: 0 }}>
                हाम्रो टिम (Our Team)
              </h2>
            </div>

            {teamMembers.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--dark-gray)', padding: '24px' }}>
                टिम विवरण चाँडै अपडेट गरिँदैछ।
              </p>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '24px',
              }}>
                {teamMembers.map(member => (
                  <div
                    key={member.id}
                    style={{
                      background: 'white',
                      border: '1px solid var(--light-gray)',
                      borderRadius: '12px',
                      padding: '24px 20px',
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
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      marginBottom: '16px',
                      border: '3px solid var(--off-white)',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                      background: 'var(--navy)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {member.image_url ? (
                        <img
                          src={member.image_url}
                          alt={member.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <Users size={40} style={{ color: 'white', opacity: 0.8 }} />
                      )}
                    </div>

                    {/* Name & Role */}
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--navy)', margin: '0 0 6px 0' }}>
                      {member.name}
                    </h3>
                    <div style={{
                      display: 'inline-block',
                      background: 'rgba(227,30,36,0.1)',
                      color: 'var(--red)',
                      padding: '4px 12px',
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
                        margin: '0 0 14px 0',
                      }}>
                        {member.bio}
                      </p>
                    )}

                    {/* Contact Links */}
                    {(member.phone || member.email) && (
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        fontSize: '12px',
                        color: 'var(--dark-gray)',
                        borderTop: '1px solid var(--light-gray)',
                        paddingTop: '12px',
                        width: '100%',
                      }}>
                        {member.phone && (
                          <a
                            href={`tel:${member.phone}`}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--navy)', textDecoration: 'none' }}
                          >
                            <Phone size={13} style={{ color: '#2ecc71' }} />
                            <span>{member.phone}</span>
                          </a>
                        )}
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--navy)', textDecoration: 'none' }}
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
        </div>
      </main>

      <Footer />
    </>
  );
}
