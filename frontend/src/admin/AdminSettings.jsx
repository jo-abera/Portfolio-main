import { useEffect, useState } from 'react';
import { KeyRound, FileText } from 'lucide-react';
import { adminApi } from '../lib/api.js';
import { useAuth } from '../hooks/useAuth.jsx';
import { supabase } from '../lib/supabaseClient.js';
import Button from '../components/Button.jsx';
import FileUploader from '../components/FileUploader.jsx';

function AccountCard() {
  const { user } = useAuth();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const sendReset = async () => {
    if (!user?.email) return;
    setSending(true);
    try {
      await supabase.auth.resetPasswordForEmail(user.email);
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="rounded-2xl bg-surface p-6 shadow-soft">
      <h2 className="mb-1 text-lg font-semibold text-ink">Account</h2>
      <p className="mb-4 text-sm text-ink/50">{user?.email}</p>
      <Button variant="outline" onClick={sendReset} loading={sending}>
        <KeyRound className="h-4 w-4" /> Send Password Reset Email
      </Button>
      {sent && <p className="mt-2 text-sm text-emerald-400">Reset email sent — check your inbox.</p>}
    </div>
  );
}

function ResumeCard() {
  const [url, setUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminApi.siteContent.get().then((data) => setUrl(data.resume_file_url || ''));
  }, []);

  const save = async (newUrl) => {
    setUrl(newUrl);
    setSaving(true);
    setSaved(false);
    try {
      await adminApi.siteContent.update({ resume_file_url: newUrl });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl bg-surface p-6 shadow-soft">
      <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold text-ink">
        <FileText className="h-5 w-5 text-primary-400" /> Resume File
      </h2>
      <p className="mb-4 text-sm text-ink/50">Uploaded as a PDF to Supabase Storage; linked from the public Resume section.</p>
      <ResumeUploader value={url} onChange={save} saving={saving} saved={saved} />
    </div>
  );
}

function ResumeUploader({ value, onChange, saving, saved }) {
  return (
    <div>
      <FileUploader bucket="resume" value={value} onChange={onChange} />
      {saving && <p className="mt-1 text-xs text-ink/40">Saving…</p>}
      {saved && <p className="mt-1 text-xs text-emerald-400">Saved!</p>}
    </div>
  );
}

export default function AdminSettings() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <h1 className="text-2xl font-bold text-ink">Settings</h1>
      <AccountCard />
      <ResumeCard />
      <p className="text-sm text-ink/50">
        Social links are managed under <strong className="font-medium text-ink/70">Website Content</strong>.
      </p>
    </div>
  );
}
