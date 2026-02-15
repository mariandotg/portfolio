import { visit } from "unist-util-visit";

export function remarkReadingTime() {
  return function (tree, file) {
    let text = "";
    visit(tree, ["text", "code"], (node) => {
      text += node.value;
    });
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    // Store on astro frontmatter so it's available in the content entry
    if (file.data.astro) {
      file.data.astro.frontmatter.readingTime = minutes;
    }
  };
}
