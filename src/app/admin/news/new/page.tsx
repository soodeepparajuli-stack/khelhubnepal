import AdminShell from '@/components/admin/AdminShell';
import NewsEditorForm from '@/components/admin/NewsEditorForm';

export default function NewArticlePage() {
  return (
    <AdminShell title="✏️ नयाँ समाचार लेख्नुस् (New Article)">
      <NewsEditorForm />
    </AdminShell>
  );
}
