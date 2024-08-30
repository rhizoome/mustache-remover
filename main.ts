import { Plugin } from 'obsidian';

var title = /{\s+(.*?)\s+}/;
var tag = /cls\.([\w-]+)/;

export default class MustacheRemover extends Plugin {
  async onload() {
    this.registerMarkdownPostProcessor(this.remover);
  }

  remover = async (element, context) => {
    await Promise.all([
      this.header_remover(element, context),
      this.mustache_remover(element, context)
    ]);
  }

  header_remover = async (element, context) => {
    if (element.classList.contains("dynbedded")) {
      const paragraphs = element.querySelectorAll("p");
      for (const paragraph of paragraphs) {
        const br = paragraph.querySelectorAll("br");
        const wbr = paragraph.querySelectorAll("wbr");
        if (br.length && wbr.length) {
          paragraph.remove();
        }
      }
    }
  }

  mustache_remover = async (element, context) => {
    const anchors = element.querySelectorAll("a");
    for (const anchor of anchors) {
      if (anchor.classList.contains("internal-link")) {
        const text = anchor.innerText;
        if (text == anchor.innerHTML) {
          const match = text.match(title);
          if (match && match.length > 1) {
            anchor.innerText = match[1];
          }
        }
      }
    }
  }
}
