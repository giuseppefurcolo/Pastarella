figma.showUI(__html__);

figma.ui.onmessage = async msg => {
  if (msg.type === 'paste-text') {
    try {
      const { text } = msg;
      const lines = text.split('\n').filter(line => line.trim() !== "");
      
      console.log("Lines to paste:", lines);
      figma.ui.postMessage({ type: 'log', message: `Lines to paste: ${lines.join(', ')}` });

      const selectedTextNodes = figma.currentPage.selection.filter(node => node.type === 'TEXT');
      
      // Sort nodes by their name (ascending order)
      selectedTextNodes.sort((a, b) => a.name.localeCompare(b.name));
      
      console.log("Selected text nodes (sorted by name):", selectedTextNodes.map(node => node.name));
      figma.ui.postMessage({ type: 'log', message: `Selected text nodes (sorted): ${selectedTextNodes.map(node => node.name).join(', ')}` });

      if (selectedTextNodes.length === 0) {
        figma.ui.postMessage({ type: 'error', message: 'No text layers selected.' });
        return;
      }

      let loopIndex = 0; // Index to track current line in the loop

      for (let i = 0; i < selectedTextNodes.length; i++) {
        const textNode = selectedTextNodes[i];
        
        const line = lines[loopIndex % lines.length]; // Use modulo to repeat lines
        
        console.log(`Pasting "${line}" into node "${textNode.name}" at y=${textNode.y}`);
        figma.ui.postMessage({ type: 'log', message: `Pasting "${line}" into node "${textNode.name}" at y=${textNode.y}` });
        
        await figma.loadFontAsync(textNode.fontName);
        textNode.characters = line.trim();
        
        console.log(`Node "${textNode.name}" updated to: "${textNode.characters}"`);
        figma.ui.postMessage({ type: 'log', message: `Node "${textNode.name}" updated to: "${textNode.text}"` });
        
        loopIndex++; // Increment loop index to move to the next line
      }

      figma.ui.postMessage({ type: 'success', message: 'Text pasted successfully!' });
    } catch (error) {
      console.error("Error:", error);
      figma.ui.postMessage({ type: 'error', message: error.message });
    } finally {
      figma.closePlugin();
    }
  }
};
