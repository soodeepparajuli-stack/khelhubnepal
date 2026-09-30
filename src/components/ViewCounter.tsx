'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

interface ViewCounterProps {
  slug: string;
  initialViews: number;
}

export default function ViewCounter({ slug, initialViews }: ViewCounterProps) {
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    // Increment view count when user visits the article
    fetch(`/api/views?slug=${encodeURIComponent(slug)}`, {
      method: 'POST',
    })
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.views === 'number') {
          setViews(data.views);
        } else {
          setViews(prev => prev + 1);
        }
      })
      .catch(() => {});
  }, [slug]);

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <Eye size={14} />
      <span>{views.toLocaleString()} पटक हेरिएको</span>
    </span>
  );
}
