const STAGE_CONFIG: Record<string, { label: string; cls: string; icon: string }> = {
  submitted:         { label: 'Submitted',         cls: 'bg-blue-50 text-blue-700 border-blue-200',      icon: '📝' },
  manager_reviewed:  { label: 'Under Review',      cls: 'bg-purple-50 text-purple-700 border-purple-200',icon: '🔍' },
  manager_approved:  { label: 'Manager Approved',  cls: 'bg-amber-50 text-amber-700 border-amber-200',   icon: '✅' },
  ceo_approved:      { label: 'CEO Approved',      cls: 'bg-green-50 text-green-700 border-green-200',   icon: '🏆' },
  rejected:          { label: 'Rejected',          cls: 'bg-red-50 text-red-700 border-red-200',         icon: '❌' },
};

export default function StageBadge({ stage, fastTracked }: { stage: string; fastTracked?: boolean }) {
  const c = STAGE_CONFIG[stage] ?? { label: stage, cls: 'bg-gray-100 text-gray-600 border-gray-200', icon: '•' };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-xs font-mono font-medium ${c.cls}`}>
      {c.icon} {c.label}
      {fastTracked && stage === 'ceo_approved' && <span className="ml-0.5 text-amber-500">⚡</span>}
    </span>
  );
}
