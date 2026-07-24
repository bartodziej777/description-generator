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
    case "headingWithText":
      return `<div class="productDesc__intro--desc">
        <h3>${block.data.heading || ""}</h3>
        <p>
            ${block.data.description || ""}
        </p>
    </div>`;
    case "headingWithFilm":
      return `<div class="productDesc__movie spacer">
        <span class="productDesc__title">
            ${block.data.heading || ""}
        </span>

        <div class="productDesc__movie--wrapper">
            <iframe
                width="100%"
                height="150"
                src="${block.data.src || ""}"
                title="${block.data.heading || ""}
                frameborder="0"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
            ></iframe>
        </div>
    </div>  `;
    case "leftTextRightImage":
      return `
         <div class="productDesc__akryl spacer">
         <div class="productDesc__akryl--desc">
            <div class="productDesc__akryl--logo">
                <span class="productDesc__title">${block.data.heading || ""}</span>
            </div>

            <p>
                ${block.data.content || ""}
            </p>
        </div>
        <img
            src="${block.data.src || ""}"
            alt="${block.data.alt || ""}"
            loading="lazy"
        />
    </div>`;
    case "leftImageRightText":
      return `
         <div class="productDesc__akryl spacer">
         <img
            src="${block.data.src || ""}"
            alt="${block.data.alt || ""}"
            loading="lazy"
        />
         <div class="productDesc__akryl--desc">
            <div class="productDesc__akryl--logo">
                <span class="productDesc__title">${block.data.heading || ""}</span>
            </div>

            <p>
                ${block.data.content || ""}
            </p>
        </div>
    </div>`;
    case "faq": {
      const itemsHTML = block.data.items
        .map(
          (item) => `        
        <div class="productDesc__faq--item">
            <h3>
                ${item.question}
            </h3>

            <div class="productDesc__faq--item--answer">
                <p>
                    ${item.answer.replace(/\n/g, "<br>")}
                </p>
            </div>
        </div>
        <!---->`,
        )
        .join("\n");

      return `    <div class="productDesc__faq spacer">
        <h2>
            ${block.data.heading}
        </h2>

${itemsHTML}
    </div>`;
    }
    case "specsBlock": {
      const rowsHTML = block.data.rows
        .map(
          (row) => `                <tr>
                    <th scope="row">${row.label}</th>
                    <td>${row.value}</td>
                </tr>`,
        )
        .join("\n");

      return `    
      <h2>${block.data.heading}</h2>
      <div class="productDesc__specs--content">
        <table class="productDesc__specs--table">
            <tbody>
${rowsHTML}
            </tbody>
        </table>

        <img
            src="${block.data.src}"
            alt="${block.data.alt}"
            loading="lazy"
            style="margin-top: 1rem;"
        />
    </div>`;
    }
    default:
      return "";
  }
};
