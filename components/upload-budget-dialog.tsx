'use client';
import {useEffect, useState} from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {toast} from '@/components/ui/use-toast';
import {Download, Pencil, Trash2, Save} from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

type Version = {
  id: string;
  uploadedAt: string;
  fileUrl: string;
  fileName?: string;
  changes?: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export default function UploadBudgetDialog({open, onOpenChange}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [changes, setChanges] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [versions, setVersions] = useState<Version[]>([]);
  const [editing, setEditing] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/budget-versions`);
      const data = await res.json();
      setVersions(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=> { if (open) load(); }, [open]);

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('changes', changes);
      const res = await fetch(`${API_BASE_URL}/budget-versions/upload`, {method: 'POST', body: form});
      const data = await res.json();
      if (!data?.ok) throw new Error(data?.message || 'Upload failed');
      toast({title: 'Uploaded', description: 'New version uploaded successfully.'});
      setFile(null); setChanges('');
      await load();
    } catch (e:any) {
      toast({title: 'Upload failed', description: e.message, variant: 'destructive'});
    } finally {
      setIsUploading(false);
    }
  };

  const saveChanges = async (id: string) => {
    const value = editing[id] ?? '';
    const res = await fetch(`${API_BASE_URL}/budget-versions/${id}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({changes: value}),
    });
    const data = await res.json().catch(()=>({}));
    if (!res.ok) { toast({title: 'Update failed', variant: 'destructive'}); return; }
    toast({title: 'Updated'});
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this version?')) return;
    const res = await fetch(`${API_BASE_URL}/budget-versions/${id}`, {method: 'DELETE'});
    if (!res.ok) { toast({title: 'Delete failed', variant: 'destructive'}); return; }
    toast({title: 'Deleted'});
    await load();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Budget Transparency - Manage Versions</DialogTitle>
          <DialogDescription>Upload new versions and manage existing ones.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <div className="md:col-span-1">
              <Label>PDF File</Label>
              <Input type="file" accept="application/pdf" onChange={(e)=> setFile(e.target.files?.[0] || null)} />
              {file && <p className="text-xs text-muted-foreground mt-1">{file.name}</p>}
            </div>
            <div className="md:col-span-2">
              <Label>Changes (short description)</Label>
              <Input placeholder="e.g., Added Q3 actuals" value={changes} onChange={(e)=> setChanges(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleUpload} disabled={isUploading || !file}>{isUploading ? 'Uploading…' : 'Upload New Version'}</Button>
          </div>

          <div className="border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Uploaded Versions</h4>
              {loading && <span className="text-sm text-muted-foreground">Loading…</span>}
            </div>
            <div className="space-y-3 max-h-[40vh] overflow-y-auto">
              {versions.map((v, idx)=> (
                <div key={v.id} className="flex items-center justify-between gap-2 border rounded-md p-3">
                  <div className="min-w-0">
                    <div className="font-medium">Version Date: {new Date(v.uploadedAt).toLocaleString()} {idx===0 && <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Latest</span>}</div>
                    <div className="text-sm text-muted-foreground break-words">
                      Changes: 
                      <input
                        className="ml-2 border rounded px-2 py-1 text-sm w-[260px]"
                        value={editing[v.id] ?? (v.changes || '')}
                        onChange={(e)=> setEditing({...editing, [v.id]: e.target.value})}
                      />
                      <Button size="sm" variant="ghost" className="ml-2" onClick={()=> saveChanges(v.id)}><Save className="h-4 w-4 mr-1"/>Save</Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button asChild size="sm" variant="secondary">
                      <a href={`${API_BASE_URL}/budget-versions/${v.id}/download`} target="_blank" rel="noopener noreferrer"><Download className="h-4 w-4 mr-1" />Download</a>
                    </Button>
                    <Button size="sm" variant="destructive" onClick={()=> remove(v.id)}><Trash2 className="h-4 w-4 mr-1" />Delete</Button>
                  </div>
                </div>
              ))}
              {versions.length === 0 && !loading && <p className="text-sm text-muted-foreground">No uploads yet.</p>}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={()=> onOpenChange(false)} disabled={isUploading}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}