type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  children?: HastNode[];
  properties?: Record<string, unknown>;
};

/** Duyệt cây depth-first — thay thế unist-util-visit (chỉ cần visit element). */
export function walkTree(node: HastNode, visitor: (node: HastNode) => void): void {
  visitor(node);
  for (const child of node.children ?? []) {
    walkTree(child, visitor);
  }
}

/** Thêm target/rel cho link http(s) tuyệt đối — thay thế rehype-external-links. */
export function rehypeExternalLinksLocal() {
  return (tree: HastNode) => {
    walkTree(tree, (node) => {
      if (node.type !== "element" || node.tagName !== "a") return;
      const href = node.properties?.href;
      if (typeof href !== "string" || !/^https?:\/\//.test(href)) return;
      node.properties = {
        ...node.properties,
        target: "_blank",
        rel: "nofollow noopener noreferrer",
      };
    });
  };
}

/** Trích chuỗi code thô lên `<pre>` cho nút copy (semantics template). */
export function rehypeRawString() {
  return (tree: HastNode) => {
    walkTree(tree, (node) => {
      if (node.type !== "element" || node.tagName !== "pre") return;
      const codeEl = node.children?.[0];
      if (codeEl?.type !== "element" || codeEl.tagName !== "code") return;
      const first = codeEl.children?.[0];
      if (first?.type === "text" && typeof first.value === "string") {
        (node as HastNode & { __rawString__?: string }).__rawString__ = first.value;
      }
    });
  };
}

/** Chuyển `__rawString__` từ figure pretty-code xuống `<pre>` con (semantics template). */
export function rehypeForwardRawString() {
  return (tree: HastNode) => {
    walkTree(tree, (node) => {
      if (node.type !== "element" || node.tagName !== "figure") return;
      if (!("data-rehype-pretty-code-figure" in (node.properties ?? {}))) return;
      const pre = node.children?.at(-1);
      if (pre?.type !== "element" || pre.tagName !== "pre") return;
      const raw = (node as HastNode & { __rawString__?: string }).__rawString__;
      if (raw) {
        pre.properties = { ...pre.properties, __rawString__: raw };
      }
    });
  };
}
