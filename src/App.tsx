import { useState } from "react";
import Heading from "./components/heading.tsx";
import ProducentLogo from "./components/producentLogo.tsx";
import { generateBlockHTML } from "./components/templates.tsx";
import "./App.css";

interface BaseBlock {
  id: number;
  type: "heading" | "producentLogo";
}

export interface HeadingBlock extends BaseBlock {
  type: "heading";
  data: {
    text: string;
  };
}

export interface ProducentLogoBlock extends BaseBlock {
  type: "producentLogo";
  data: {
    src: string;
    alt: string;
  };
}

export type Block = HeadingBlock | ProducentLogoBlock;
const blocksNames: Block["type"][] = ["heading", "producentLogo"];

function App() {
  const [selectedBlock, setSelectedBlock] = useState<Block["type"]>("heading");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [generatedHTML, setGeneratedHTML] = useState<string>("");

  const addBlock = () => {
    const id = Date.now();
    const newBlock: Block =
      selectedBlock === "heading"
        ? { id, type: "heading", data: { text: "" } }
        : { id, type: "producentLogo", data: { src: "", alt: "" } };

    setBlocks((prev) => [...prev, newBlock]);
  };

  const updateBlockData = (
    id: number,
    newData: HeadingBlock["data"] | ProducentLogoBlock["data"],
  ) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === id ? ({ ...block, data: newData } as Block) : block,
      ),
    );
  };

  const removeBlock = (id: number) => {
    setBlocks((prev) => prev.filter((block) => block.id !== id));
  };

  const moveBlock = (index: number, direction: number) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;

    setBlocks((prev) => {
      const updated = [...prev];
      const [movedItem] = updated.splice(index, 1);
      updated.splice(targetIndex, 0, movedItem);
      return updated;
    });
  };

  const handleGenerate = () => {
    const innerContent = blocks
      .map((block) => generateBlockHTML(block))
      .join("\n\n");

    const fullHTML = `<div class="productDesc">\n${innerContent}\n</div>`;
    setGeneratedHTML(fullHTML);
  };

  const copyHTMLToClipboard = () => {
    if (!generatedHTML) return;
    navigator.clipboard.writeText(generatedHTML);
    alert("Kod HTML został skopiowany!");
  };

  return (
    <>
      <header>
        <h1>Description generator for Presta</h1>
      </header>
      <main>
        <section>
          <button>save as template</button>
          <select>
            <option value="template1">Template 1</option>
            <option value="template2">Template 2</option>
          </select>
          <button>load template</button>
        </section>

        <section>
          <div className="blocks-container">
            {blocks.map((block, index) => (
              <div key={block.id} className="block-wrapper">
                <div className="block-actions">
                  <button
                    onClick={() => moveBlock(index, -1)}
                    disabled={index === 0}
                  >
                    ▲ Wyżej
                  </button>
                  <button
                    onClick={() => moveBlock(index, 1)}
                    disabled={index === blocks.length - 1}
                  >
                    ▼ Niżej
                  </button>
                  <button onClick={() => removeBlock(block.id)}>✕ Usuń</button>
                </div>

                <div className="block-content">
                  {block.type === "heading" && (
                    <Heading
                      data={block.data}
                      onChange={(newData) => updateBlockData(block.id, newData)}
                    />
                  )}
                  {block.type === "producentLogo" && (
                    <ProducentLogo
                      data={block.data}
                      onChange={(newData) => updateBlockData(block.id, newData)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div>
            <select
              id="block-select"
              value={selectedBlock}
              onChange={(e) =>
                setSelectedBlock(e.target.value as Block["type"])
              }
            >
              {blocksNames.map((blockName) => (
                <option key={blockName} value={blockName}>
                  {blockName}
                </option>
              ))}
            </select>
            <button onClick={addBlock}>add block</button>
          </div>
        </section>

        <section className="generate-section">
          <button onClick={handleGenerate}>generate</button>

          {generatedHTML && (
            <div className="preview-container">
              <div className="preview-actions">
                <button onClick={copyHTMLToClipboard}>📋 Skopiuj kod</button>
              </div>
              <pre>
                <code>{generatedHTML}</code>
              </pre>
            </div>
          )}
        </section>
      </main>
      <footer>
        <p>
          Created by <a href="https://github.com/bartodziej777">Bartłomiej</a>
        </p>
      </footer>
    </>
  );
}

export default App;
