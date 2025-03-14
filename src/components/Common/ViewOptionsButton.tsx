import { ViewOptions } from '@/types/types';
import { ViewList, ViewModule } from '@mui/icons-material';

interface ViewOptionsButtonProps {
    view: ViewOptions;
    onChange: (view: ViewOptions) => void;
}

export default function ViewOptionsButton({ view, onChange }: ViewOptionsButtonProps) {
    return (
        <div className="inline-flex rounded-lg border border-[var(--border-color)] overflow-hidden">
            <button
                onClick={() => onChange('compact')}
                className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors
                    ${view === 'compact'
                        ? 'bg-[var(--hover-background)] text-[var(--text-primary)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--hover-background)]'}`}
            >
                <ViewModule fontSize="small" />
                <span>Compact</span>
            </button>
            <button
                onClick={() => onChange('full')}
                className={`flex items-center gap-2 px-3 py-2 text-sm border-l border-[var(--border-color)] transition-colors
                    ${view === 'full'
                        ? 'bg-[var(--hover-background)] text-[var(--text-primary)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--hover-background)]'}`}
            >
                <ViewList fontSize="small" />
                <span>Full Details</span>
            </button>
        </div>
    );
}