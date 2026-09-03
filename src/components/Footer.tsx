import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, ChevronRight, Globe } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            {/* Brand Information */}
            <div className="footer-brand">
              <div className="site-logo" style={{ marginBottom: '16px' }}>
                <Image
                  src="/logo.png"
                  alt="KhelHub Nepal Official Logo"
                  width={48}
                  height={48}
                  style={{ height: '48px', width: 'auto' }}
                  unoptimized
                />
                <div className="site-logo-text">
                  <div className="brand-name">
                    <span style={{ color: '#ffffff' }}>KHEL</span>
                    <span style={{ color: '#e31e24' }}>HUB</span>
                  </div>
                  <div className="brand-tagline" style={{ color: 'rgba(255,255,255,0.5)' }}>— NEPAL —</div>
                </div>
              </div>
              <p style={{ fontSize: '13px', lineHeight: 1.7, opacity: 0.8, marginBottom: '16px' }}>
                नेपालको आधिकारिक खेलकुद समाचार पोर्टल। फुटबल, क्रिकेट, भलिबल, बास्केटबल लगायत सम्पूर्ण राष्ट्रिय तथा अन्तर्राष्ट्रिय खेलकुदका ताजा समाचार र विश्लेषण।
              </p>
              <div className="footer-social">
                <a
                  href="https://www.youtube.com/@KhelhubNepal"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="YouTube Channel"
                  aria-label="YouTube"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61557354328245"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Facebook Page"
                  aria-label="Facebook"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              </div>
            </div>

            {/* Sports Categories */}
            <div className="footer-col">
              <h4>खेलकुद विधा</h4>
              <ul>
                <li><Link href="/category/football"><ChevronRight size={13} /> फुटबल</Link></li>
                <li><Link href="/category/cricket"><ChevronRight size={13} /> क्रिकेट</Link></li>
                <li><Link href="/category/volleyball"><ChevronRight size={13} /> भलिबल</Link></li>
                <li><Link href="/category/basketball"><ChevronRight size={13} /> बास्केटबल</Link></li>
                <li><Link href="/category/esports"><ChevronRight size={13} /> eSports</Link></li>
                <li><Link href="/category/others"><ChevronRight size={13} /> अन्य खेलकुद</Link></li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="footer-col">
              <h4>द्रुत लिङ्कहरू</h4>
              <ul>
                <li><Link href="/"><ChevronRight size={13} /> गृहपृष्ठ</Link></li>
                <li><Link href="/about"><ChevronRight size={13} /> हाम्रो बारे</Link></li>
                <li><Link href="/contact"><ChevronRight size={13} /> सम्पर्क</Link></li>
                <li><Link href="/privacy"><ChevronRight size={13} /> गोपनीयता नीति</Link></li>
                <li><Link href="/terms"><ChevronRight size={13} /> सेवा शर्तहरू</Link></li>
              </ul>
            </div>

            {/* Official Contact Info */}
            <div className="footer-col">
              <h4>सम्पर्क ठेगाना</h4>
              <ul style={{ gap: '12px' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', opacity: 0.85 }}>
                  <MapPin size={16} style={{ flexShrink: 0, marginTop: '2px', color: '#ff4d4f' }} />
                  <span>काठमाडौं महानगरपालिका ७, चाबहिल, काठमाडौं, नेपाल</span>
                </li>
                <li>
                  <a href="tel:9867423197" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={15} style={{ flexShrink: 0, color: '#2ecc71' }} />
                    <span>९८६७४२३१९७ (9867423197)</span>
                  </a>
                </li>
                <li>
                  <a href="mailto:newskhelhub@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={15} style={{ flexShrink: 0, color: '#3498db' }} />
                    <span>newskhelhub@gmail.com</span>
                  </a>
                </li>
                <li>
                  <a href="mailto:khelhub61@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={15} style={{ flexShrink: 0, color: '#3498db' }} />
                    <span>khelhub61@gmail.com</span>
                  </a>
                </li>
                <li>
                  <a href="https://khelhubnepal.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Globe size={15} style={{ flexShrink: 0, color: '#e67e22' }} />
                    <span>khelhubnepal.com</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="footer-bottom">
          <span>© {currentYear} KhelHub Nepal (khelhubnepal.com). सर्वाधिकार सुरक्षित।</span>
          <span>काठमाडौं महानगरपालिका ७ चाबहिल, नेपाल</span>
        </div>
      </div>
    </footer>
  );
}
