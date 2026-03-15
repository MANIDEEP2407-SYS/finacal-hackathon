'use client';
import type { KnowledgeNode } from '@/lib/knowledgeGraph';
import { knowledgeGraph } from '@/lib/knowledgeGraph';
import { useLang } from '@/context/LangContext';

interface Props {
  node: KnowledgeNode;
  resolvedAnswer: string;
  usedDefaults: boolean;
  onNavigate: (nodeId: string) => void;
  // isLearning removed
}

export function NodeView({ node, resolvedAnswer, usedDefaults, onNavigate }: Props) {
  const { t, lang } = useLang();
  const { bot: bl } = t;

  // Use localized question if available for current language
  const localizedQuestion = (lang !== 'en' && node.questionI18n?.[lang]) ? node.questionI18n[lang]! : node.question;

  // Highlight ₹ values in the answer (already resolved with correct language template)
  const highlightedAnswer = resolvedAnswer.replace(
    /(₹[\d,.]+ ?(?:Cr|L|K)?)/g,
    '<span class="personalized">$1</span>'
  );

  const relatedNodes = node.relatedNodes
    .map(id => knowledgeGraph[id])
    .filter(Boolean)
    .slice(0, 4);

  return (
    <div>
      {/* Question */}
      <h2 className="node-question">{localizedQuestion}</h2>

      {/* Category badge */}
      <div className="mb-3">
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: '#e8eef7', color: '#224c87' }}
        >
          {node.category.replace(/-/g, ' ')}
        </span>
        <span
          className="text-xs font-medium ml-2 px-2 py-0.5 rounded-full"
          style={{ background: node.level === 'beginner' ? '#e8f5e9' : node.level === 'intermediate' ? '#fff3e0' : '#fce4ec', color: '#3a3a3a' }}
        >
          {node.level}
        </span>
      </div>

      {/* Answer */}
      <div
        className="node-answer"
        dangerouslySetInnerHTML={{ __html: highlightedAnswer }}
      />

      {/* Defaults notice */}
      {usedDefaults && (
        <div className="defaults-notice">
          {bl.defaultsNotice}
        </div>
      )}

      {/* Related questions */}
      {relatedNodes.length > 0 && (
        <div className="related-nodes mt-4">
          <div className="related-label">{bl.relatedTitle}</div>
          {relatedNodes.map(related => (
            <button
              key={related.id}
              type="button"
              onClick={() => onNavigate(related.id)}
              className="related-btn"
            >
              {(lang !== 'en' && related.questionI18n?.[lang]) ? related.questionI18n[lang]! : related.question}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
