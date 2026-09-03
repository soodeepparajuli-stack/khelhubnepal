import AdminShell from '@/components/admin/AdminShell';
import NewsEditorForm from '@/components/admin/NewsEditorForm';
import { createAdminClient } from '@/lib/supabase';
import { MOCK_NEWS } from '@/lib/mockData';
import { notFound } from 'next/navigation';

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  const supabase = createAdminClient();

  let article = null;
  try {
    const { data } = await supabase.from('news').select('*').eq('id', id).single();
    article = data;
  } catch {
    // ignore
  }

  if (!article) {
    article = MOCK_NEWS.find(n => n.id === id) || null;
  }

  if (!article) {
    notFound();
  }

  return (
    <AdminShell title={`✏️ Edit Article: ${article.title.substring(0, 30)}...`}>
      <NewsEditorForm initialData={article} isEdit={true} />
    </AdminShell>
  );
}
