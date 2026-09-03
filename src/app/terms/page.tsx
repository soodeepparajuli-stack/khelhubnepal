import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getCategories, getBreakingNews } from '@/lib/data';

export const metadata = {
  title: 'सेवा शर्तहरू (Terms of Service) | KhelHub Nepal',
};

export default async function TermsPage() {
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
            सेवा शर्तहरू (Terms of Service)
          </h1>
          <div className="article-content" style={{ fontSize: '15px', lineHeight: 1.8 }}>
            <p>
              KhelHub Nepal वेबसाइट प्रयोग गर्दा तपाईं निम्न शर्तहरूसँग सहमत हुनुभएको मानिनेछ:
            </p>
            <h3 style={{ color: 'var(--navy)', marginTop: '20px' }}>१. बौद्धिक सम्पत्ति अधिकार</h3>
            <p>यस वेबसाइटमा प्रकाशित सम्पूर्ण समाचार, लेख, तस्बिर र डिजाइन KhelHub Nepal को बौद्धिक सम्पत्ति हुन्। अनुमति विना वा उचित क्रेडिट विना कुनै पनि सामग्री पुन: उत्पादन वा प्रतिलिपि गर्न निषेध गरिएको छ।</p>
            <h3 style={{ color: 'var(--navy)', marginTop: '20px' }}>२. समाचार र सूचनाको शुद्धता</h3>
            <p>हामी सधैं तथ्यपरक र विश्वसनीय समाचार सम्प्रेषण गर्न प्रतिबद्ध छौं। यद्यपि, परिस्थिति अनुसार समाचारमा हुने पछिल्ला परिवर्तनहरूलाई हामी निरन्तर अद्यावधिक गर्दछौं।</p>
            <h3 style={{ color: 'var(--navy)', marginTop: '20px' }}>३. बाह्य लिङ्कहरू</h3>
            <p>वेबसाइटमा रहेका बाह्य वा विज्ञापन सम्बन्धी लिङ्कहरूको सामग्री र विश्वसनीयताका लागि सम्बन्धित संस्था नै जिम्मेवार हुनेछ।</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
