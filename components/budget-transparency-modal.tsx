'use client';
import {useEffect, useState} from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Download} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

type Version = {
  id: string;
  uploadedAt: string;
  fileUrl: string;
  fileName?: string;
  changes?: string;
};

interface Props {
  open: boolean;
  onOpenChange: (v: boolean)=> void;
}

export default function BudgetTransparencyModal({open, onOpenChange}: Props) {
  const [versions, setVersions] = useState<Version[]>([]);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Budget Transparency</DialogTitle>
          <DialogDescription>See the latest and previous versions of the Budget Transparency Report.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
          {!loading && versions.length === 0 && <p className="text-sm text-muted-foreground">No uploads yet.</p>}
          {!loading && versions.map((v)=> (
            <div key={v.id} className="flex items-center justify-between border rounded-lg p-3">
              <div className="min-w-0">
                <div className="font-medium truncate">
                  Version Date: {new Date(v.uploadedAt).toLocaleString()}
                </div>
                {v.changes && (
                  <div className="text-sm text-muted-foreground break-words">
                    Changes: {v.changes}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button asChild size="sm">
                  <a
                    href={`${API_BASE_URL}/budget-versions/${v.id}/download`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="h-4 w-4 mr-2" /> Download
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
