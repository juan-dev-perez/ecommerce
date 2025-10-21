import { Category } from '@prisma/client';

export type CategoryNode = Category & {
  children: CategoryNode[];
};

export function buildCategoryTree(categories: Category[]): CategoryNode[] {
  const nodes: CategoryNode[] = categories.map((cat) => ({
    ...cat,
    children: [],
  }));

  const categoryMap = new Map(nodes.map((node) => [node.id, node]));

  const tree: CategoryNode[] = [];

  for (const node of nodes) {
    if (node.parentId) {
      const parent = categoryMap.get(node.parentId);
      if (parent) {
        parent.children.push(node);
      }
    } else {
      tree.push(node);
    }
  }

  return tree;
}
