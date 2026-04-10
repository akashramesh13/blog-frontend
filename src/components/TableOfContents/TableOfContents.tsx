import React, { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

const TableOfContents = ({ content }: any) => {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!content?.ops) return;

    const headings: TocItem[] = [];
    let counter = 0;

    content.ops.forEach((op: any, index: number) => {
      if (op.attributes?.header) {
        const prev = content.ops[index - 1];

        if (prev?.insert) {
          const text = prev.insert.replace(/\n/g, "").trim();

          if (text) {
            headings.push({
              id: `heading-${counter++}`,
              text,
              level: op.attributes.header,
            });
          }
        }
      }
    });

    setItems(headings);
  }, [content]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    setActiveId(id);

    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  if (!items.length) return null;

  return (
    <div className="toc">
      <div className="toc-title">Contents</div>

      <ul className="toc-list">
        {items.map((item) => (
          <li
            key={item.id}
            className={`toc-item level-${item.level} ${
              activeId === item.id ? "active" : ""
            }`}
            onClick={() => scrollTo(item.id)}
          >
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableOfContents;
