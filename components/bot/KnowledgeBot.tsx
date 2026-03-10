'use client';
import { useEffect, useRef } from 'react';
import { useBot } from '@/context/BotContext';
import { useCalculator } from '@/context/CalculatorContext';
import { knowledgeGraph } from '@/lib/knowledgeGraph';
import { resolveWithFallback } from '@/lib/botVariables';
import { NodeView } from './NodeView';
import { CategoryBrowser } from './CategoryBrowser';
import { BreadcrumbTrail } from './BreadcrumbTrail';
import { useMode } from '@/context/ModeContext';

export function KnowledgeBot() {
  const { state, closeBot, navigateTo, goBack, setCategory } = useBot();
  const { state: calcState } = useCalculator();
  const { isLearning } = useMode();
  const panelRef = useRef<HTMLElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const currentNode = knowledgeGraph[state.currentNodeId];

  const { text: resolvedAnswer, usedDefaults } = resolveWithFallback(
    currentNode?.answer ?? '',
    calcState,
  );

  // Focus management
  useEffect(() => {
    if (state.isOpen) {
      closeBtnRef.current?.focus();
    }
  }, [state.isOpen]);

  // Focus trap + Escape
  useEffect(() => {
    if (!state.isOpen) return;
    const panel = panelRef.current;
    if (!panel) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { closeBot(); return; }
      if (e.key !== 'Tab') return;

      const focusable = panel.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [state.isOpen, closeBot]);

  if (!state.isOpen || !currentNode) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="bot-backdrop" onClick={closeBot} aria-hidden="true" />

      <aside
        ref={panelRef}
        role="complementary"
        aria-label="Knowledge Bot — learn about financial concepts"
        className="knowledge-bot-panel"
        id="knowledge-bot"
      >
        {/* Header */}
        <div className="bot-header">
          <div className="flex items-center gap-2">
            <span className="text-lg" aria-hidden="true">💬</span>
            <span className="bot-title">FinCal Knowledge Bot</span>
          </div>
          <button
            ref={closeBtnRef}
            onClick={closeBot}
            className="bot-close"
            aria-label="Close knowledge bot"
          >
            ✕
          </button>
        </div>

        {/* Breadcrumb */}
        <BreadcrumbTrail
          history={state.history}
          onBack={goBack}
          canGoBack={state.history.length > 1}
        />

        {/* Content */}
        <div
          className="bot-content"
          role="region"
          aria-label={currentNode.question}
          aria-live="polite"
          aria-atomic="true"
        >
          <NodeView
            node={currentNode}
            resolvedAnswer={resolvedAnswer}
            usedDefaults={usedDefaults}
            onNavigate={navigateTo}
            isLearning={isLearning}
          />
        </div>

        {/* Categories */}
        <CategoryBrowser
          activeCategory={state.category}
          currentNodeId={state.currentNodeId}
          onNavigate={navigateTo}
          onSetCategory={setCategory}
        />
      </aside>
    </>
  );
}
