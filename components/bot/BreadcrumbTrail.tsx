'use client';
import { knowledgeGraph } from '@/lib/knowledgeGraph';
import { ChevronLeft } from 'lucide-react';
import { useLang } from '@/context/LangContext';

interface Props {
  history: string[];
  onBack: () => void;
  canGoBack: boolean;
}

export function BreadcrumbTrail({ history, onBack, canGoBack }: Props) {
  const { t, lang } = useLang();
  const { bot: bl } = t;
  const currentId = history[history.length - 1];
  const currentNode = knowledgeGraph[currentId];
  const prevId = history.length > 1 ? history[history.length - 2] : null;
  const prevNode = prevId ? knowledgeGraph[prevId] : null;

  const getLocalizedQuestion = (node: any) => {
    if (!node) return '';
    return (lang !== 'en' && node.questionI18n?.[lang]) ? node.questionI18n[lang]! : node.question;
  };

  const prevQuestion = getLocalizedQuestion(prevNode);
  const currentQuestion = getLocalizedQuestion(currentNode);

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b" style={{ borderColor: '#e8e8e8', background: '#f8f9fc' }}>
      {canGoBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded transition-colors"
          style={{ color: '#224c87' }}
          aria-label={bl.backTo(prevQuestion || bl.back)}
        >
          <ChevronLeft size={14} />
          {bl.back}
        </button>
      )}
      <span className="text-xs truncate" style={{ color: '#919090' }} title={currentQuestion}>
        {currentQuestion}
      </span>
    </div>
  );
}
