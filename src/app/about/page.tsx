import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { getCategories, getBreakingNews } from '@/lib/data';
import { Award, Target, Phone, Mail, MapPin, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'हाम्रो बारे (About Us) | KhelHub Nepal',
  description: 'KhelHub Nepal को परिचय, दृष्टिकोण, सम्पादकीय नीति र सम्पर्क विवरण।',
};

export default async function AboutPage() {
  const [categories, breakingNews] = await Promise.all([
    getCategories(),
    getBreakingNews(),
  ]);

  return (
    <>
      <Navbar categories={categories} breakingNews={breakingNews} />

      <main className="container" style={{ padding: '36px 16px' }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--light-gray)',
          maxWidth: '880px',
          margin: '0 auto',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Image
              src="/logo.png"
              alt="KhelHub Nepal Logo"
              width={88}
              height={88}
              style={{ margin: '0 auto 16px', display: 'block' }}
              unoptimized
            />
            <h1 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--navy)' }}>
              KhelHub Nepal (खेलहब नेपाल)
            </h1>
            <p style={{ color: 'var(--dark-gray)', fontSize: '15px', marginTop: '6px' }}>
              नेपालको आधिकारिक खेलकुद अनलाइन समाचार पोर्टल • khelhubnepal.com
            </p>
          </div>

          <div className="article-content" style={{ fontSize: '16px', lineHeight: 1.85, color: 'var(--text-medium)' }}>
            <p>
              <strong>KhelHub Nepal</strong> नेपाली खेलकुद क्षेत्रलाई समर्पित एक स्वतन्त्र, निष्पक्ष र व्यावसायिक अनलाइन डिजिटल खेलकुद मिडिया हो। खेलकुद क्षेत्रका गतिविधि, खेलाडीहरूको मिहिनेत, राष्ट्रिय तथा अन्तर्राष्ट्रिय प्रतियोगिताहरूलाई तथ्यपरक र निष्पक्ष ढंगले नेपाली पाठक र दर्शकमाझ पुर्‍याउनु हाम्रो प्रमुख उद्देश्य हो।
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', margin: '28px 0' }}>
              <div style={{ background: 'var(--off-white)', padding: '20px', borderRadius: '8px', borderLeft: '4px solid var(--navy)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--navy)', fontWeight: 700 }}>
                  <Target size={20} />
                  <span>हाम्रो लक्ष्य (Mission)</span>
                </div>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6 }}>
                  नेपालको कुनाकाप्चामा लुकेका प्रतिभाहरूलाई राष्ट्रिय मञ्चमा उजागर गर्ने र नेपाली खेलकुदको विकासमा सशक्त आवाज बन्ने।
                </p>
              </div>

              <div style={{ background: 'var(--off-white)', padding: '20px', borderRadius: '8px', borderLeft: '4px solid var(--red)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--red)', fontWeight: 700 }}>
                  <Award size={20} />
                  <span>सम्पादकीय निष्पक्षता (Ethics)</span>
                </div>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6 }}>
                  तथ्य, प्रमाण र आधिकारिक स्रोतमा आधारित विश्वसनीय समाचार सम्प्रेषण। पत्रकारिताको उच्चतम आचारसंहिताको पूर्ण पालना।
                </p>
              </div>
            </div>

            <h3 style={{ color: 'var(--navy)', marginTop: '28px', marginBottom: '12px' }}>हामी के कभर गर्छौं?</h3>
            <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} style={{ color: '#2ecc71', flexShrink: 0 }} />
                <span><strong>फुटबल:</strong> सहिद स्मारक ‘ए’ डिभिजन, साफ च्याम्पियनसिप, नेपाली राष्ट्रिय टोली, विश्वकप र युरोपेली लिगहरू।</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} style={{ color: '#3498db', flexShrink: 0 }} />
                <span><strong>क्रिकेट:</strong> आईसीसी क्रिकेट विश्वकप लिग-२, नेपाल प्रिमियर लिग (NPL), राष्ट्रिय प्रतियोगिताहरू।</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} style={{ color: '#e67e22', flexShrink: 0 }} />
                <span><strong>भलिबल:</strong> राष्ट्रिय खेल भलिबलका क्लब च्याम्पियनसिप, काभा (CAVA) प्रतियोगिताहरू।</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} style={{ color: '#e31e24', flexShrink: 0 }} />
                <span><strong>अन्य खेल:</strong> बास्केटबल, eSports, कराते, तेक्वान्दो, एथलेटिक्स र उदीयमान खेलहरू।</span>
              </li>
            </ul>

            <div style={{
              marginTop: '36px',
              padding: '24px',
              background: 'var(--off-white)',
              borderRadius: '8px',
              border: '1px solid var(--light-gray)',
            }}>
              <h4 style={{ color: 'var(--navy)', marginBottom: '14px', fontWeight: 700, fontSize: '16px' }}>
                आधिकारिक सम्पर्क विवरण
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', fontSize: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} style={{ color: 'var(--red)', flexShrink: 0 }} />
                  <span>काठमाडौं महानगरपालिका ७ चाबहिल</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={16} style={{ color: '#2ecc71', flexShrink: 0 }} />
                  <span>९८६७४२३१९७ (9867423197)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={16} style={{ color: '#3498db', flexShrink: 0 }} />
                  <span>newskhelhub@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
