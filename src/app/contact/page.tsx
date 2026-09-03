import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getCategories, getBreakingNews } from '@/lib/data';
import { MapPin, Phone, Mail, Globe, Megaphone } from 'lucide-react';

export const metadata = {
  title: 'सम्पर्क (Contact Us) | KhelHub Nepal',
  description: 'KhelHub Nepal सँग सम्पर्क गर्नुस् - विज्ञापन, प्रतिक्रिया वा समाचार साझा गर्नुहोस्। फोन: 9867423197, चाबहिल काठमाडौं।',
};

export default async function ContactPage() {
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
          maxWidth: '920px',
          margin: '0 auto',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--navy)', marginBottom: '8px' }}>
            सम्पर्क गर्नुस् (Contact KhelHub Nepal)
          </h1>
          <p style={{ color: 'var(--dark-gray)', fontSize: '15px', marginBottom: '32px' }}>
            कुनै जिज्ञासा, खेलकुद समाचार सुझाव, प्रेस विज्ञप्ति वा विज्ञापन सम्बन्धी जानकारीका लागि हामीलाई सिधै सम्पर्क गर्नुहोस्।
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            {/* Address */}
            <div style={{ padding: '24px', background: 'var(--off-white)', borderRadius: '8px', border: '1px solid var(--light-gray)' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(227,30,36,0.1)', color: '#e31e24', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <MapPin size={22} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy)', marginBottom: '6px' }}>कार्यालय ठेगाना</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-medium)', margin: 0, lineHeight: 1.6 }}>
                काठमाडौं महानगरपालिका ७ चाबहिल,<br />काठमाडौं, नेपाल
              </p>
            </div>

            {/* Phone */}
            <div style={{ padding: '24px', background: 'var(--off-white)', borderRadius: '8px', border: '1px solid var(--light-gray)' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(46,204,113,0.1)', color: '#2ecc71', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <Phone size={22} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy)', marginBottom: '6px' }}>फोन सम्पर्क</h3>
              <p style={{ fontSize: '14px', margin: 0, lineHeight: 1.6 }}>
                <a href="tel:9867423197" style={{ color: 'var(--navy)', fontWeight: 700, fontSize: '15px' }}>
                  ९८६७४२३१९७ (9867423197)
                </a>
              </p>
              <span style={{ fontSize: '12px', color: 'var(--gray)' }}>आइतबार - शुक्रबार (१०:०० - ५:००)</span>
            </div>

            {/* Email */}
            <div style={{ padding: '24px', background: 'var(--off-white)', borderRadius: '8px', border: '1px solid var(--light-gray)' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(52,152,219,0.1)', color: '#3498db', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <Mail size={22} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy)', marginBottom: '6px' }}>इमेल ठेगाना</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px' }}>
                <a href="mailto:newskhelhub@gmail.com" style={{ color: 'var(--red)', fontWeight: 600 }}>
                  newskhelhub@gmail.com
                </a>
                <a href="mailto:khelhub61@gmail.com" style={{ color: 'var(--navy)', fontWeight: 600 }}>
                  khelhub61@gmail.com
                </a>
              </div>
            </div>

            {/* Online Channels */}
            <div style={{ padding: '24px', background: 'var(--off-white)', borderRadius: '8px', border: '1px solid var(--light-gray)' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(26,35,87,0.1)', color: '#1a2357', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <Globe size={22} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy)', marginBottom: '6px' }}>डिजिटल च्यानलहरू</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px' }}>
                <a href="https://khelhubnepal.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--navy)', fontWeight: 600 }}>
                  🌐 khelhubnepal.com
                </a>
                <a href="https://www.youtube.com/@KhelhubNepal" target="_blank" rel="noopener noreferrer" style={{ color: '#e31e24', fontWeight: 600 }}>
                  📺 YouTube: @KhelhubNepal
                </a>
                <a href="https://www.facebook.com/profile.php?id=61557354328245" target="_blank" rel="noopener noreferrer" style={{ color: '#1877f2', fontWeight: 600 }}>
                  👍 Facebook: KhelHub Nepal
                </a>
              </div>
            </div>
          </div>

          {/* Advertisement & Sponsorship Callout */}
          <div style={{
            background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-dark) 100%)',
            color: 'white',
            padding: '28px',
            borderRadius: '8px',
            display: 'flex',
            gap: '18px',
            alignItems: 'flex-start',
          }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(227,30,36,0.2)', color: '#ff6b70', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Megaphone size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px', color: 'white' }}>
                विज्ञापन तथा प्रायोजन (Advertising & Sponsorship)
              </h3>
              <p style={{ fontSize: '14px', opacity: 0.9, lineHeight: 1.7, margin: 0 }}>
                KhelHub Nepal को पोर्टल र सामाजिक सञ्जालमा आफ्ना ब्राण्ड, उत्पादन वा खेलकुद प्रतियोगिताहरूको प्रवर्धन गर्नका लागि हामीसँग सहकार्य गर्नुहोस्। हाम्रो आधिकारिक इमेल <strong>newskhelhub@gmail.com</strong> वा सिधै <strong>९८६७४२३१९७</strong> मा सम्पर्क गर्न सक्नुहुनेछ।
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
