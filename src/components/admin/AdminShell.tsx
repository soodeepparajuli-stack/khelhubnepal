'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { LayoutDashboard, Newspaper, PenSquare, FolderTree, Megaphone, Globe, LogOut } from 'lucide-react';

interface AdminShellProps {
  children: React.ReactNode;
  title: string;
}

export default function AdminShell({ children, title }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/news', label: 'News Articles', icon: Newspaper },
    { href: '/admin/news/new', label: 'New Article', icon: PenSquare },
    { href: '/admin/categories', label: 'Categories', icon: FolderTree },
    { href: '/admin/ads', label: 'Manage Ads', icon: Megaphone },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <Image
            src="/logo.png"
            alt="KhelHub Logo"
            width={40}
            height={40}
            unoptimized
          />
          <span>KhelHub Nepal<br /><small style={{ fontWeight: 400, opacity: 0.6, fontSize: '11px' }}>Admin CMS</small></span>
        </div>

        <nav className="admin-nav">
          <div className="admin-nav-section">Main</div>
          {navItems.slice(0, 2).map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-item ${pathname === item.href ? 'active' : ''}`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="admin-nav-section">Content & Media</div>
          {navItems.slice(2).map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-item ${pathname === item.href ? 'active' : ''}`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="admin-nav-section">Quick Links</div>
          <a href="/" target="_blank" className="admin-nav-item">
            <Globe size={16} />
            <span>View Website ↗</span>
          </a>
          <button
            onClick={handleLogout}
            className="admin-nav-item"
            style={{ width: '100%', textAlign: 'left', color: '#ff6b70', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit' }}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        <div className="admin-topbar">
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>{title}</h1>
          <button
            onClick={handleLogout}
            className="admin-logout-btn"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
}
