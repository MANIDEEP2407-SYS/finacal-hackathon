'use client';
import { useBot } from '@/context/BotContext';
import { knowledgeGraph } from '@/lib/knowledgeGraph';
import { useLang } from '@/context/LangContext';

// ── Floating button — always visible bottom-right when panel is closed ──
export function FloatingBotButton() {
  const { t } = useLang();
  const { bot: bl } = t;
  const { openBot, state } = useBot();

  if (state.isOpen) return null;

  return (
    <button
      onClick={() => openBot()}
      className="bot-float-btn"
      aria-label={bl.panelTitle}
      aria-expanded={false}
      aria-controls="knowledge-bot"
    >
      <span aria-hidden="true">💬</span>
      <span className="bot-float-label">{bl.askBot}</span>
    </button>
  );
}

// ── Inline trigger — "Learn more →" links inside depth cards / tooltips ──
interface InlineTriggerProps {
  nodeId: string;
  label?: string;
}

export function InlineBotTrigger({ nodeId, label }: InlineTriggerProps) {
  const { t, lang } = useLang();
  const { bot: bl } = t;
  const { openBot } = useBot();
  const node = knowledgeGraph[nodeId];
  if (!node) return null;

  const localizedQuestion = (lang !== 'en' && node.questionI18n?.[lang]) ? node.questionI18n[lang]! : node.question;

  return (
    <button
      type="button"
      onClick={() => openBot(nodeId)}
      className="bot-trigger"
      aria-label={`${bl.learnAbout}: ${localizedQuestion}`}
    >
      {label ?? bl.learnMore} →
    </button>
  );
}
