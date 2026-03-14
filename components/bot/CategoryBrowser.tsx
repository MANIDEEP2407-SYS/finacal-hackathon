'use client';
import { CATEGORIES, knowledgeGraph } from '@/lib/knowledgeGraph';
import { getNodesByCategory } from '@/lib/botNavigation';
import { useLang } from '@/context/LangContext';

interface Props {
  activeCategory: string | null;
  currentNodeId: string;
  onNavigate: (nodeId: string) => void;
  onSetCategory: (category: string | null) => void;
}

export function CategoryBrowser({ activeCategory, currentNodeId, onNavigate, onSetCategory }: Props) {
  const { t } = useLang();
  const { bot: bl } = t;
  const filteredNodes = activeCategory ? getNodesByCategory(activeCategory) : [];

  return (
    <div className="border-t" style={{ borderColor: '#e8e8e8' }}>
      {/* Category tabs */}
      <div className="category-tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSetCategory(activeCategory === cat.id ? null : cat.id)}
            className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
          >
            {bl.categories[cat.id as keyof typeof bl.categories] || cat.label}
          </button>
        ))}
      </div>

      {/* Filtered node list */}
      {activeCategory && filteredNodes.length > 0 && (
        <div className="px-4 pb-3 space-y-1 max-h-48 overflow-y-auto">
          {filteredNodes.map(node => (
            <button
              key={node.id}
              type="button"
              onClick={() => {
                onNavigate(node.id);
                onSetCategory(null);
              }}
              className="w-full text-left text-sm px-3 py-2 rounded transition-colors"
              style={{
                color: node.id === currentNodeId ? '#fff' : '#224c87',
                background: node.id === currentNodeId ? '#224c87' : 'transparent',
              }}
              onMouseEnter={e => {
                if (node.id !== currentNodeId) {
                  (e.currentTarget as HTMLElement).style.background = '#e8eef7';
                }
              }}
              onMouseLeave={e => {
                if (node.id !== currentNodeId) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }
              }}
            >
              {node.question}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
