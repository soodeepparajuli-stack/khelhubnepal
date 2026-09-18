import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { getCategories, getBreakingNews, getAdsByPosition } from '@/lib/data';
import { Users, Phone, ArrowRight, ShieldCheck, Building2, MapPin } from 'lucide-react';

export const metadata = {
  title: 'हाम्रो बारे (About Us) | KhelHub Nepal',
  description: 'KhelHub Nepal नेपाली खेलकुद क्षेत्रलाई केन्द्रमा राखेर सञ्चालन गरिएको डिजिटल खेलकुद सञ्चारमाध्यम हो। अक्षरेखा मिडिया प्रा.लि. अन्तर्गत सञ्चालित KhelHub Nepal ले नेपाल तथा विश्वभरका खेलकुद गतिविधिसँग सम्बन्धित समाचार, सूचना, विश्लेषण तथा विशेष सामग्रीहरू पाठकमाझ प्रस्तुत गर्दै आएको छ।',
};

export const revalidate = 60;

export default async function AboutPage() {
  const [categories, breakingNews, headerAds] = await Promise.all([
    getCategories(),
    getBreakingNews(),
    getAdsByPosition('header'),
  ]);

  return (
    <>
      <Navbar categories={categories} breakingNews={breakingNews} headerAds={headerAds} />

      <main className="container" style={{ padding: '40px 16px', minHeight: '65vh' }}>
        <div style={{
          background: 'white',
          padding: '44px 36px',
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
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--navy)', margin: '0 0 6px 0' }}>
              हाम्रो बारे (About Us)
            </h1>
            <div style={{ width: '48px', height: '3px', background: 'var(--red)', margin: '10px auto 14px', borderRadius: '2px' }} />

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(26, 35, 87, 0.05)',
              border: '1px solid rgba(26, 35, 87, 0.12)',
              padding: '6px 18px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--navy)',
            }}>
              <ShieldCheck size={16} style={{ color: 'var(--red)' }} />
              <span>सुचना विभाग दर्ता नं.: ५५३२-२०८३/२०८४</span>
            </div>
          </div>

          {/* About Paragraph - Exact text requested by client */}
          <div style={{
            fontSize: '16.5px',
            lineHeight: 1.95,
            color: '#2c3e50',
            textAlign: 'justify',
            background: 'var(--off-white)',
            padding: '28px 32px',
            borderRadius: '10px',
            borderLeft: '4px solid var(--red)',
            marginBottom: '36px',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <p style={{ margin: 0 }}>
              <strong>KhelHub Nepal</strong> नेपाली खेलकुद क्षेत्रलाई केन्द्रमा राखेर सञ्चालन गरिएको डिजिटल खेलकुद सञ्चारमाध्यम हो। <strong>अक्षरेखा मिडिया प्रा.लि.</strong> अन्तर्गत सञ्चालित KhelHub Nepal ले नेपाल तथा विश्वभरका खेलकुद गतिविधिसँग सम्बन्धित समाचार, सूचना, विश्लेषण तथा विशेष सामग्रीहरू पाठकमाझ प्रस्तुत गर्दै आएको छ। फुटबल, क्रिकेट, मार्सल आर्ट्स, भलिबललगायत विभिन्न खेलकुदका गतिविधिलाई प्राथमिकतामा राख्दै हामी नेपाली खेलाडी, टोली, प्रतियोगिता तथा खेलकुदसँग सम्बन्धित समसामयिक विषयलाई सरल, तथ्यपरक र विश्वसनीय ढंगले प्रस्तुत गर्ने प्रयास गर्छौं । नेपालमा खेलकुद पत्रकारिताको डिजिटल पहुँच विस्तार गर्ने र नेपाली खेलाडी तथा खेलकुदको विषयलाई राष्ट्रिय तथा अन्तर्राष्ट्रिय स्तरसम्म पुर्याउने उद्देश्य KhelHub Nepal को मुख्य प्राथमिकता हो ।
            </p>
          </div>

          {/* Institutional Info Card */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
            marginBottom: '36px',
          }}>
            <div style={{
              background: 'white',
              border: '1px solid var(--light-gray)',
              borderRadius: '10px',
              padding: '20px',
              display: 'flex',
              gap: '14px',
              alignItems: 'flex-start',
            }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '8px',
                background: 'rgba(26, 35, 87, 0.08)',
                color: 'var(--navy)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Building2 size={20} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--dark-gray)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>सञ्चालक संस्था</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--navy)', marginTop: '2px' }}>
                  अक्षरेखा मिडिया प्रा.लि.
                </div>
              </div>
            </div>

            <div style={{
              background: 'white',
              border: '1px solid var(--light-gray)',
              borderRadius: '10px',
              padding: '20px',
              display: 'flex',
              gap: '14px',
              alignItems: 'flex-start',
            }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '8px',
                background: 'rgba(227, 30, 36, 0.08)',
                color: 'var(--red)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <MapPin size={20} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--dark-gray)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>कार्यालय ठेगाना</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--navy)', marginTop: '2px' }}>
                  काठमाडौं महानगरपालिका ७ चाबहिल, नेपाल
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Action Banners */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            borderTop: '1px solid var(--light-gray)',
            paddingTop: '32px',
          }}>
            {/* Our Team Card */}
            <div style={{
              background: 'var(--off-white)',
              borderRadius: '10px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: '1px solid var(--light-gray)',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--red)', marginBottom: '8px' }}>
                  <Users size={20} />
                  <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--navy)' }}>हाम्रो टिम (Our Team)</span>
                </div>
                <p style={{ fontSize: '13.5px', color: 'var(--dark-gray)', lineHeight: 1.6, margin: '0 0 16px 0' }}>
                  KhelHub Nepal का पत्रकार, विश्लेषक तथा व्यवस्थापन टिमका सदस्यहरूको विस्तृत विवरण हेर्नुहोस्।
                </p>
              </div>
              <Link
                href="/team"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'var(--navy)',
                  color: 'white',
                  padding: '10px 18px',
                  borderRadius: '6px',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  alignSelf: 'flex-start',
                  transition: 'background 0.2s ease',
                }}
              >
                <span>टिम सदस्यहरू हेर्नुहोस्</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Contact Card */}
            <div style={{
              background: 'var(--off-white)',
              borderRadius: '10px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: '1px solid var(--light-gray)',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2ecc71', marginBottom: '8px' }}>
                  <Phone size={20} />
                  <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--navy)' }}>सम्पर्क गर्नुस् (Contact Us)</span>
                </div>
                <p style={{ fontSize: '13.5px', color: 'var(--dark-gray)', lineHeight: 1.6, margin: '0 0 16px 0' }}>
                  कुनै सल्लाह, सुझाव, प्रेस विज्ञप्ति वा विज्ञापन सम्बन्धी सोधपुछका लागि हामीलाई सिधै सम्पर्क गर्नुहोस्।
                </p>
              </div>
              <Link
                href="/contact"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'white',
                  color: 'var(--navy)',
                  border: '1px solid var(--light-gray)',
                  padding: '10px 18px',
                  borderRadius: '6px',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  alignSelf: 'flex-start',
                  transition: 'background 0.2s ease',
                }}
              >
                <span>सम्पर्क विवरण</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
