import { Plugin } from 'obsidian';

var title = /{\s+(.*?)\s+}/;
const tag = '🏷️';
const clock = '🕛';

export default class MustacheRemover extends Plugin {
  async onload() {
    this.registerMarkdownPostProcessor(this.remover);
  }

  remover = async (element, context) => {
    await this.header_remover(element, context);
    await this.mustache_remover(element, context);
    await this.curl_adder(element, context);
  }

  header_remover = async (element, context) => {
    const is_dynbedded = element.classList.contains("dynbedded");
    var is_embedded = false;
    if (!is_dynbedded) {
      var parent = context.containerEl;
      while (parent) {
        const class_list = parent.classList;
        if (!is_embedded && class_list.contains("markdown-embed")) {
          is_embedded = true;
        }
        if (is_embedded && class_list.contains("popover")) {
          if (class_list.contains("hover-popover")) {
            is_embedded = false;
          }
        }
        parent = parent.parentElement;
      }
    }
    if (is_dynbedded || is_embedded) {
      const paragraphs = element.querySelectorAll("div p");
      if (paragraphs.length) {
        const paragraph = paragraphs[0];
        const text = paragraph.innerText;
        if (text.contains(tag)) {
          const br = paragraph.querySelectorAll("br");
          const wbr = paragraph.querySelectorAll("wbr");
          if (br.length && wbr.length && text.contains(clock)) {
            paragraph.remove();
          }
        }
      }
    }
  }
  curl_adder = async (element, context) => {
    const wbrs = element.querySelectorAll("wbr");
    for (const wbr of wbrs) {
      for (const cls of wbr.classList) {
        element.classList.add(cls);
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
