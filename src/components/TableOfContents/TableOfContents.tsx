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

    let buffer = "";

    content.ops.forEach((op: any) => {
      if (typeof op.insert === "string") {
        buffer += op.insert;
      }

      // newline = end of block
      if (op.insert === "\n") {
        if (op.attributes?.header) {
          const text = buffer.replace(/\n/g, "").trim();

          if (text) {
            headings.push({
              id: `heading-${counter++}`,
              text,
              level: op.attributes.header,
            });
          }
        }

        // reset buffer after each block
        buffer = "";
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

    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
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
