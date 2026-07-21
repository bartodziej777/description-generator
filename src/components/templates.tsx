import type { Block } from "../App";

export const generateBlockHTML = (block: Block): string => {
  switch (block.type) {
    case "heading":
      return `<h2>${block.data.text || ""}</h2>`;
    case "producentLogo":
      return `<div class="productDesc__logo spacer">
            <img
                src="${block.data.src || ""}"
                alt="${block.data.alt || ""}"
            />
        </div>`;
    default:
      return "";
  }
};
