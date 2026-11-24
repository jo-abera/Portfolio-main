import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, ExternalLink, ArrowUp, ArrowDown } from 'lucide-react';
import { useFetch } from '../hooks/useFetch.js';
import { adminApi } from '../lib/api.js';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Badge from '../components/Badge.jsx';
import Button from '../components/Button.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

export default function AdminProjects() {
  const { data: projects, loading, refetch } = useFetch(() => adminApi.projects.list(), []);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminApi.projects.remove(deleteTarget.id);
      setDeleteTarget(null);
      refetch();
    } finally {
      setDeleting(false);
    }
  };

  const sortedProjects = [...(projects || [])].sort((a, b) => a.display_order - b.display_order);

  const move = async (item, direction) => {
    const idx = sortedProjects.findIndex((p) => p.id === item.id);
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= sortedProjects.length) return;
    const next = [...sortedProjects];
    const [removed] = next.splice(idx, 1);
    next.splice(newIdx, 0, removed);
    await Promise.all(next.map((p, i) => adminApi.projects.update(p.id, { display_order: i })));
    refetch();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Projects</h1>
          <p className="mt-1 text-sm text-ink/50">Use ↑ ↓ to set order on the public Projects section.</p>
        </div>
        <Button onClick={() => navigate('/admin/projects/new')}>
          <Plus className="h-4 w-4" /> Add New
        </Button>
      </div>

      {loading && <Loader label="Loading projects…" />}
      {!loading && projects?.length === 0 && <EmptyState title="No projects yet. Add your first one." />}

      {!loading && projects?.length > 0 && (
        <div className="overflow-x-auto rounded-2xl bg-surface shadow-soft">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink/40">
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Featured</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {sortedProjects.map((p) => (
                <tr key={p.id} className="border-b border-ink/5 last:border-0 hover:bg-ink/[0.02]">
                  <td className="px-5 py-3.5 font-medium text-ink">{p.title}</td>
                  <td className="px-5 py-3.5 text-ink/60">{p.category || '—'}</td>
                  <td className="px-5 py-3.5">{p.featured ? <Badge tone="primary">Featured</Badge> : '—'}</td>
                  <td className="px-5 py-3.5">
                    <Badge tone={p.is_published ? 'success' : 'neutral'}>{p.is_published ? 'Published' : 'Draft'}</Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => move(p, -1)}
                        className="rounded p-1.5 text-ink/40 hover:bg-ink/5"
                        aria-label="Move up"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => move(p, 1)}
                        className="rounded p-1.5 text-ink/40 hover:bg-ink/5"
                        aria-label="Move down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      {p.is_published && (
                        <a href={`/projects/${p.slug}`} target="_blank" rel="noopener noreferrer" className="rounded p-1.5 text-ink/40 hover:bg-ink/5" aria-label="View live">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                      <button onClick={() => navigate(`/admin/projects/${p.id}/edit`)} className="rounded p-1.5 text-ink/40 hover:bg-white/10 hover:text-ink" aria-label="Edit">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => setDeleteTarget(p)} className="rounded p-1.5 text-ink/40 hover:bg-red-500/15 hover:text-red-400" aria-label="Delete">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        description="This will permanently delete the project and its screenshots."
      />
    </div>
  );
}
