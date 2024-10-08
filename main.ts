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
    if (element.innerHTML == "") {
      element.classList.add("sp-removed-element");
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

  get_tag = async () => {
    const index = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
    const seed = String(Math.random());

    const encoder = new TextEncoder();
    const data = encoder.encode(seed);

    const res = new Uint8Array(await crypto.subtle.digest('SHA-256', data));
    let serial = 0.0;
    serial += res[0];
    serial += res[1] * 2**8;
    serial += res[2] * 2**16;
    serial += res[3] * 2**24;
    serial += res[4] * 2**32;
    serial += res[5] * 2**40;

    let result = [];
    while (serial > 0) {
      const mod = serial % index.length;
      serial = Math.floor(serial / index.length);
      result.push(index[mod]);
    }
    return result.reverse().slice(2, 6).join("");
  }
}
