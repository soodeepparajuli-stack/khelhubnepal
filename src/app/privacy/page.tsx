import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getCategories, getBreakingNews } from '@/lib/data';

export const metadata = {
  title: 'गोपनीयता नीति (Privacy Policy) | KhelHub Nepal',
};

export default async function PrivacyPage() {
  const [categories, breakingNews] = await Promise.all([
    getCategories(),
    getBreakingNews(),
  ]);

  return (
    <>
      <Navbar categories={categories} breakingNews={breakingNews} />
      <main className="container" style={{ padding: '30px 16px' }}>
        <div style={{
          background: 'white',
          padding: '36px',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--light-gray)',
          maxWidth: '860px',
          margin: '0 auto',
        }}>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--navy)', marginBottom: '16px' }}>
            गोपनीयता नीति (Privacy Policy)
          </h1>
          <div className="article-content" style={{ fontSize: '15px', lineHeight: 1.8 }}>
            <p>
              KhelHub Nepal ले आफ्ना प्रयोगकर्ताहरूको गोपनीयताको पूर्ण सम्मान गर्दछ। यस गोपनीयता नीतिले हामीले कसरी तपाईंको जानकारी संकलन, प्रयोग र संरक्षण गर्छौं भन्ने विषयमा व्याख्या गर्दछ।
            </p>
            <h3 style={{ color: 'var(--navy)', marginTop: '20px' }}>१. संकलित जानकारी</h3>
            <p>हाम्रो वेबसाइट भ्रमण गर्दा तपाईंको ब्राउजर वा डिभाइसबाट स्वतः प्राप्त हुने प्राविधिक विवरणहरू (जस्तै IP ठेगाना, ब्राउजर प्रकार, भिजिट गरिएको पृष्ठहरू) वेबसाइटको कार्यसम्पादन सुधार गर्नका लागि मात्र प्रयोग गरिन्छ।</p>
            <h3 style={{ color: 'var(--navy)', marginTop: '20px' }}>२. कुकीज (Cookies)</h3>
            <p>प्रयोगकर्ता अनुभवलाई सहज बनाउन र विज्ञापनहरूको प्रभावकारिता मापन गर्नका लागि हामी सामान्य कुकीज प्रयोग गर्न सक्दछौं।</p>
            <h3 style={{ color: 'var(--navy)', marginTop: '20px' }}>३. तेस्रो पक्षीय विज्ञापनहरू</h3>
            <p>हाम्रो वेबसाइटमा देखिने तेस्रो पक्षीय विज्ञापनदाताहरूले आफ्नै नीति अनुसार कुकीज प्रयोग गर्न सक्दछन्।</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
