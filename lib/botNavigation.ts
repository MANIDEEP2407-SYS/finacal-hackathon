import { knowledgeGraph, CATEGORIES, type KnowledgeNode } from './knowledgeGraph';

export function getNodesByCategory(categoryId: string): KnowledgeNode[] {
  return Object.values(knowledgeGraph).filter(n => n.category === categoryId);
}

export function getCategoryLabel(categoryId: string): string {
  return CATEGORIES.find(c => c.id === categoryId)?.label ?? categoryId;
}

export function getRelatedNodes(nodeId: string): KnowledgeNode[] {
  const node = knowledgeGraph[nodeId];
  if (!node) return [];
  return node.relatedNodes
    .map(id => knowledgeGraph[id])
    .filter(Boolean);
}

export { CATEGORIES };
