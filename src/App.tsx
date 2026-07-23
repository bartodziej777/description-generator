import { useState } from "react";
import Heading from "./components/heading.tsx";
import ProducentLogo from "./components/producentLogo.tsx";
import { generateBlockHTML } from "./components/templates.tsx";
import "./App.css";
import HeadingWithText from "./components/headingWithText.tsx";
import HeadingWithFilm from "./components/headingWithFilm.tsx";
import LeftTextRightImage from "./components/leftTextRightImage.tsx";
import LeftImageRightText from "./components/leftImageRightText.tsx";
import Faq from "./components/faq.tsx";
import Specs from "./components/specs.tsx";

interface BaseBlock {
  id: number;
  type:
    | "heading"
    | "producentLogo"
    | "headingWithText"
    | "headingWithFilm"
    | "leftTextRightImage"
    | "leftImageRightText"
    | "faq"
    | "specsBlock";
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

export interface headingWithText extends BaseBlock {
  type: "headingWithText";
  data: {
    heading: string;
    description: string;
  };
}

export interface headingWithFilm extends BaseBlock {
  type: "headingWithFilm";
  data: {
    heading: string;
    src: string;
  };
}

export interface leftTextRightImage extends BaseBlock {
  type: "leftTextRightImage";
  data: {
    heading: string;
    content: string;
    src: string;
    alt: string;
  };
}

export interface leftImageRightText extends BaseBlock {
  type: "leftImageRightText";
  data: {
    heading: string;
    content: string;
    src: string;
    alt: string;
  };
}
export interface faqItem {
  id: number;
  question: string;
  answer: string;
}

export interface faq extends BaseBlock {
  type: "faq";
  data: {
    heading: string;
    items: faqItem[];
  };
}

export interface SpecRow {
  id: number;
  label: string;
  value: string;
}

export interface SpecsBlock extends BaseBlock {
  type: "specsBlock";
  data: {
    src: string;
    alt: string;
    rows: SpecRow[];
  };
}

export type Block =
  | HeadingBlock
  | ProducentLogoBlock
  | headingWithText
  | headingWithFilm
  | leftTextRightImage
  | leftImageRightText
  | faq
  | SpecsBlock;

const blocksNames: Block["type"][] = [
  "heading",
  "producentLogo",
  "headingWithText",
  "headingWithFilm",
  "leftTextRightImage",
  "leftImageRightText",
  "faq",
  "specsBlock",
];

function App() {
  const [selectedBlock, setSelectedBlock] = useState<Block["type"]>("heading");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [generatedHTML, setGeneratedHTML] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const addBlock = () => {
    const id = Date.now();
    let newBlock: Block;

    switch (selectedBlock) {
      case "heading":
        newBlock = { id, type: "heading", data: { text: "" } };
        break;

      case "producentLogo":
        newBlock = { id, type: "producentLogo", data: { src: "", alt: "" } };
        break;

      case "headingWithText":
        newBlock = {
          id,
          type: "headingWithText",
          data: { heading: "", description: "" },
        };
        break;
      case "headingWithFilm":
        newBlock = {
          id,
          type: "headingWithFilm",
          data: { heading: "", src: "" },
        };
        break;
      case "leftTextRightImage":
        newBlock = {
          id,
          type: "leftTextRightImage",
          data: { heading: "", content: "", src: "", alt: "" },
        };
        break;
      case "leftImageRightText":
        newBlock = {
          id,
          type: "leftImageRightText",
          data: { heading: "", content: "", src: "", alt: "" },
        };
        break;
      case "faq":
        newBlock = {
          id,
          type: "faq",
          data: {
            heading: "",
            items: [{ id: Date.now(), question: "", answer: "" }],
          },
        };
        break;
      case "specsBlock":
        newBlock = {
          id,
          type: "specsBlock",
          data: {
            src: "",
            alt: "",
            rows: [{ id: Date.now(), label: "", value: "" }],
          },
        };
        break;
      default:
        return;
    }

    setBlocks((prev) => [...prev, newBlock]);
  };

  const updateBlockData = (
    id: number,
    newData:
      | HeadingBlock["data"]
      | ProducentLogoBlock["data"]
      | headingWithText["data"]
      | headingWithFilm["data"]
      | leftTextRightImage["data"]
      | leftImageRightText["data"]
      | faq["data"],
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
    setIsModalOpen(true);
  };

  const copyHTMLToClipboard = () => {
    if (!generatedHTML) return;
    navigator.clipboard.writeText(generatedHTML);
    alert("Kod HTML został skopiowany!");
  };

  return (
    <>
      <header>
        <h1>
          Description generator for <span>PrestaShop</span>
        </h1>
      </header>
      <main>
        <section className="top-menu">
          <button>save as template</button>
          <div>
            <select>
              <option value="template1">Template 1</option>
              <option value="template2">Template 2</option>
            </select>
            <button id="load-template">load template</button>
          </div>
        </section>

        <section>
          <div className="blocks-container">
            {blocks.map((block, index) => (
              <div key={block.id} className="block-wrapper">
                <div className="block-actions">
                  <span>{block.type}</span>
                  <div>
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
                    <button onClick={() => removeBlock(block.id)}>
                      ✕ Usuń
                    </button>
                  </div>
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
                  {block.type === "headingWithText" && (
                    <HeadingWithText
                      data={block.data}
                      onChange={(newData) => updateBlockData(block.id, newData)}
                    />
                  )}
                  {block.type === "headingWithFilm" && (
                    <HeadingWithFilm
                      data={block.data}
                      onChange={(newData) => updateBlockData(block.id, newData)}
                    />
                  )}
                  {block.type === "leftTextRightImage" && (
                    <LeftTextRightImage
                      data={block.data}
                      onChange={(newData) => updateBlockData(block.id, newData)}
                    />
                  )}
                  {block.type === "leftImageRightText" && (
                    <LeftImageRightText
                      data={block.data}
                      onChange={(newData) => updateBlockData(block.id, newData)}
                    />
                  )}
                  {block.type === "faq" && (
                    <Faq
                      data={block.data}
                      onChange={(newData) => updateBlockData(block.id, newData)}
                    />
                  )}
                  {block.type === "specsBlock" && (
                    <Specs
                      data={block.data}
                      onChange={(newData: SpecsBlock["data"]) =>
                        updateBlockData(block.id, newData)
                      }
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="add-block-section">
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
        </section>

        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Wygenerowany Kod HTML</h2>
              <pre>
                <code>{generatedHTML}</code>
              </pre>
              <div className="modal-actions">
                <button onClick={copyHTMLToClipboard}>📋 Skopiuj kod</button>
                <button onClick={() => setIsModalOpen(false)}>✕ Zamknij</button>
              </div>
            </div>
          </div>
        )}
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
