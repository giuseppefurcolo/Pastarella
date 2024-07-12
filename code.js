figma.showUI(__html__);

figma.ui.onmessage = async msg => {
  if (msg.type === 'paste-text') {
    const { text } = msg;
    const lines = text.split('\n').filter(line => line.trim() !== "");

    const selectedTextNodes = figma.currentPage.selection.filter(node => node.type === 'TEXT');

    for (let i = 0; i < selectedTextNodes.length; i++) {
      const textNode = selectedTextNodes[i];
      const line = lines[i % lines.length];
      await figma.loadFontAsync(textNode.fontName);
      textNode.characters = line;
    }

    figma.closePlugin();
  }
};
