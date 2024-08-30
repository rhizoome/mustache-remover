import { Plugin } from 'obsidian';

var tag = /{\s+(.*?)\s+}/;

export default class MyPlugin extends Plugin {
	async onload() {
		this.registerMarkdownPostProcessor((element, context) => {
			const anchors = element.querySelectorAll("a");
			for (const anchor of anchors) {
				if (anchor.classList.contains("internal-link")) {
					const text = anchor.innerText;
					if (text == anchor.innerHTML) {
					  const match = text.match(tag);
					  if (match && match.length > 1) {
					  	anchor.innerText = match[1];
					  }
					}
				}
			}
		});
	}
}
