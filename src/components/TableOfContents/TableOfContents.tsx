import React, { useEffect, useState } from "react";
import "./TableOfContents.scss";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TocNode extends TocItem {
  children: TocNode[];
}

const TableOfContents = ({ content }: any) => {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!content?.ops) return;

    const headings: TocItem[] = [];
    let counter = 0;

    content.ops.forEach((op: any, index: number) => {
      if (op.insert === "\n" && op.attributes?.header) {
        let text = "";

        let i = index - 1;

        while (i >= 0 && typeof content.ops[i].insert === "string") {
          text = content.ops[i].insert + text;

          if (content.ops[i].insert.includes("\n")) break;

          i--;
        }

        // 🔥 KEY FIX: take LAST line only
        const lines = text
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean);
        const headingText = lines[lines.length - 1];

        if (headingText) {
          headings.push({
            id: `heading-${counter++}`,
            text: headingText,
            level: op.attributes.header,
          });
        }
      }
    });

    setItems(headings);
  }, [content]);

  const buildTree = (items: TocItem[]): TocNode[] => {
    const tree: TocNode[] = [];
    const stack: TocNode[] = [];

    items.forEach((item) => {
      const node: TocNode = { ...item, children: [] };

      while (stack.length && stack[stack.length - 1].level >= item.level) {
        stack.pop();
      }

      if (stack.length === 0) {
        tree.push(node);
      } else {
        stack[stack.length - 1].children.push(node);
      }

      stack.push(node);
    });

    return tree;
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    setActiveId(id);

    const yOffset = -80;
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  };

  const renderTree = (nodes: TocNode[]) => {
    return (
      <ul className="toc-list">
        {nodes.map((node) => (
          <li key={node.id}>
            <div
              className={`toc-item level-${node.level} ${
                activeId === node.id ? "active" : ""
              }`}
              onClick={() => scrollTo(node.id)}
            >
              {node.text}
            </div>

            {node.children.length > 0 && renderTree(node.children)}
          </li>
        ))}
      </ul>
    );
  };

  if (!items.length) return null;

  const tree = buildTree(items);

  return (
    <div className="toc">
      <div className="toc-title">Contents</div>
      {renderTree(tree)}
    </div>
  );
};

export default TableOfContents;
