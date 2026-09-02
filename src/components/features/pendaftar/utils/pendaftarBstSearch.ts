import { Applicant, BSTNode } from "../types";

export function bstInsert(root: BSTNode | null, node: BSTNode): BSTNode {
  if (!root) return node;
  if (node.key < root.key) root.left = bstInsert(root.left, node);
  else root.right = bstInsert(root.right, node);
  return root;
}

export function bstSearch(
  root: BSTNode | null,
  query: string,
  results: number[],
): void {
  if (!root) return;
  bstSearch(root.left, query, results);
  if (root.key.includes(query)) results.push(root.id);
  bstSearch(root.right, query, results);
}

export function buildKey(a: Applicant): string {
  const initial = (a.nama || "").trim().charAt(0).toLowerCase();
  const jurusan = (a.jurusan_1 || a.jurusan1 || "").toLowerCase();
  const sekolah = (a.sekolah_asal || a.sekolahAsal || "").toLowerCase();
  return `${initial}|${jurusan}|${sekolah}`;
}
