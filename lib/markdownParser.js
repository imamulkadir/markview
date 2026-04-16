/**
 * Custom remark plugin that injects `data-line` attributes into rendered HTML nodes.
 * This enables click-to-line sync in the preview pane.
 */
export function remarkLineNumbers() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.position && node.type !== 'text' && node.type !== 'inlineCode') {
        if (!node.data) node.data = {};
        if (!node.data.hProperties) node.data.hProperties = {};
        // Must use camelCase — hast-util-sanitize checks hast property names,
        // not HTML attribute names. dataLine → data-line in the final DOM.
        node.data.hProperties.dataLine = node.position.start.line;
      }
    });
  };
}

/**
 * Minimal tree visitor — avoids importing unist-util-visit to keep bundle lean.
 */
function visit(node, visitor) {
  visitor(node);
  if (node.children) {
    node.children.forEach((child) => visit(child, visitor));
  }
}
