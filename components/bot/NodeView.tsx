'use client';
import type { KnowledgeNode } from '@/lib/knowledgeGraph';
import { knowledgeGraph } from '@/lib/knowledgeGraph';

interface Props {
  node: KnowledgeNode;
  resolvedAnswer: string;
  usedDefaults: boolean;
  onNavigate: (nodeId: string) => void;
  isLearning: boolean;
}

export function NodeView({ node, resolvedAnswer, usedDefaults, onNavigate, isLearning }: Props) {
  // Highlight ₹ values in the answer
  const highlightedAnswer = resolvedAnswer.replace(
    /(₹[\d,.]+ ?(?:Cr|L|K)?)/g,
    '<span class="personalized">$1</span>'
  );

  const relatedNodes = node.relatedNodes
    .map(id => knowledgeGraph[id])
    .filter(Boolean)
    .slice(0, isLearning ? 4 : 3);

  return (
    <div>
      {/* Question */}
      <h2 className="node-question">{node.question}</h2>

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
          ℹ️ Numbers shown are based on example values. Fill in the calculator for personalized figures.
        </div>
      )}

      {/* Related questions */}
      {relatedNodes.length > 0 && (
        <div className="related-nodes mt-4">
          <div className="related-label">Related Questions</div>
          {relatedNodes.map(related => (
            <button
              key={related.id}
              type="button"
              onClick={() => onNavigate(related.id)}
              className="related-btn"
            >
              {related.question}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
