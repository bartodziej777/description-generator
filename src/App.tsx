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

const setCookie = (name: string, value: string, days = 365) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict`;
};

const getCookie = (name: string): string | null => {
  return document.cookie.split("; ").reduce((r, v) => {
    const parts = v.split("=");
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, "");
};

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

export interface Template {
  name: string;
  blockTypes: Block["type"][];
}

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
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState<boolean>(false);

  const [newTemplateName, setNewTemplateName] = useState<string>("");
  const [selectedTemplateName, setSelectedTemplateName] = useState<string>("");

  const [templates, setTemplates] = useState<Template[]>(() => {
    const saved = getCookie("presta_templates");
    return saved ? JSON.parse(saved) : [];
  });

  const createEmptyBlock = (type: Block["type"], id: number): Block => {
    switch (type) {
      case "heading":
        return { id, type, data: { text: "" } };
      case "producentLogo":
        return { id, type, data: { src: "", alt: "" } };
      case "headingWithText":
        return { id, type, data: { heading: "", description: "" } };
      case "headingWithFilm":
        return { id, type, data: { heading: "", src: "" } };
      case "leftTextRightImage":
      case "leftImageRightText":
        return {
          id,
          type,
          data: { heading: "", content: "", src: "", alt: "" },
        };
      case "faq":
        return {
          id,
          type,
          data: {
            heading: "",
            items: [{ id: Date.now(), question: "", answer: "" }],
          },
        };
      case "specsBlock":
        return {
          id,
          type,
          data: {
            src: "",
            alt: "",
            rows: [{ id: Date.now(), label: "", value: "" }],
          },
        };
      default:
        return { id, type: "heading", data: { text: "" } };
    }
  };

  const addBlock = () => {
    const id = Date.now();
    const newBlock = createEmptyBlock(selectedBlock, id);
    setBlocks((prev) => [...prev, newBlock]);
  };

  const updateBlockData = (id: number, newData: Block["data"]) => {
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

  const handleSaveTemplate = () => {
    if (!newTemplateName.trim()) {
      alert("Proszę podać nazwę szablonu!");
      return;
    }

    const blockTypes = blocks.map((b) => b.type);
    const newTemplate: Template = {
      name: newTemplateName.trim(),
      blockTypes,
    };

    const updatedTemplates = [
      ...templates.filter((t) => t.name !== newTemplate.name),
      newTemplate,
    ];

    setTemplates(updatedTemplates);
    setCookie("presta_templates", JSON.stringify(updatedTemplates));

    setNewTemplateName("");
    setIsSaveModalOpen(false);
    alert("Szablon został zapisany!");
  };

  const handleLoadTemplate = () => {
    const template = templates.find((t) => t.name === selectedTemplateName);
    if (!template) {
      alert("Proszę wybrać szablon!");
      return;
    }

    const loadedBlocks = template.blockTypes.map((type, index) =>
      createEmptyBlock(type, Date.now() + index),
    );

    setBlocks(loadedBlocks);
    setIsLoadModalOpen(false);
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
          <button
            onClick={() => setIsSaveModalOpen(true)}
            disabled={blocks.length === 0}
          >
            save as template
          </button>
          <div>
            <select
              value={selectedTemplateName}
              onChange={(e) => setSelectedTemplateName(e.target.value)}
            >
              <option value="">Wybierz szablon...</option>
              {templates.map((tpl) => (
                <option key={tpl.name} value={tpl.name}>
                  {tpl.name}
                </option>
              ))}
            </select>
            <button
              id="load-template"
              onClick={handleLoadTemplate}
              disabled={!selectedTemplateName}
            >
              load template
            </button>
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
                      onChange={(newData) => updateBlockData(block.id, newData)}
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

        {isSaveModalOpen && (
          <div
            className="modal-overlay"
            onClick={() => setIsSaveModalOpen(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Zapisz szablon</h2>
              <p>Podaj nazwę dla aktualnego układu {blocks.length} bloków:</p>
              <input
                type="text"
                placeholder="np. Szablon Baterii Umywalkowych"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                style={{ width: "100%", padding: "8px", margin: "10px 0" }}
              />
              <div className="modal-actions">
                <button onClick={handleSaveTemplate}>Zapisz</button>
                <button onClick={() => setIsSaveModalOpen(false)}>
                  Anuluj
                </button>
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
