'use client';
import { useBot } from '@/context/BotContext';
import { knowledgeGraph } from '@/lib/knowledgeGraph';

// ── Floating button — always visible bottom-right when panel is closed ──
export function FloatingBotButton() {
  const { openBot, state } = useBot();

  if (state.isOpen) return null;

  return (
    <button
      onClick={() => openBot()}
      className="bot-float-btn"
      aria-label="Open Knowledge Bot"
      aria-expanded={false}
      aria-controls="knowledge-bot"
    >
      <span aria-hidden="true">💬</span>
      <span className="bot-float-label">Ask Bot</span>
    </button>
  );
}

// ── Inline trigger — "Learn more →" links inside depth cards / tooltips ──
interface InlineTriggerProps {
  nodeId: string;
  label?: string;
}

export function InlineBotTrigger({ nodeId, label }: InlineTriggerProps) {
  const { openBot } = useBot();
  const node = knowledgeGraph[nodeId];
  if (!node) return null;

  return (
    <button
      type="button"
      onClick={() => openBot(nodeId)}
      className="bot-trigger"
      aria-label={`Learn about: ${node.question}`}
    >
      {label ?? 'Learn more'} →
    </button>
  );
}
