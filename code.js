// Plugin principal que embaralha elementos dentro de um frame
figma.showUI(__html__, { width: 300, height: 200 });

// Função para embaralhar array (algoritmo Fisher-Yates)
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Função para duplicar um frame
function duplicateFrame(originalFrame) {
  const duplicatedFrame = originalFrame.clone();
  
  // Posiciona o frame duplicado ao lado do original
  duplicatedFrame.x = originalFrame.x + originalFrame.width + 50;
  duplicatedFrame.y = originalFrame.y;
  
  // Renomeia o frame
  duplicatedFrame.name = `${originalFrame.name} - Shuffled`;
  
  return duplicatedFrame;
}

// Função principal para embaralhar elementos
function shuffleFrameElements() {
  const selection = figma.currentPage.selection;
  
  // Verifica se há algo selecionado
  if (selection.length === 0) {
    figma.notify("❌ Selecione um frame para embaralhar seus elementos!");
    return;
  }
  
  // Verifica se o primeiro item selecionado é um frame
  const selectedNode = selection[0];
  if (selectedNode.type !== "FRAME") {
    figma.notify("❌ Por favor, selecione um frame!");
    return;
  }
  
  const originalFrame = selectedNode;
  
  // Pega todos os filhos do frame (elementos que serão embaralhados)
  const children = [...originalFrame.children];
  
  if (children.length === 0) {
    figma.notify("❌ O frame selecionado não possui elementos para embaralhar!");
    return;
  }
  
  if (children.length < 2) {
    figma.notify("❌ O frame precisa ter pelo menos 2 elementos para embaralhar!");
    return;
  }
  
  // Embaralha os elementos
  const shuffledChildren = shuffleArray(children);
  
  // Duplica o frame original
  const newFrame = duplicateFrame(originalFrame);
  
  // Remove todos os filhos do frame duplicado
  newFrame.children.forEach(child => child.remove());
  
  // Adiciona os elementos embaralhados ao novo frame
  // Precisamos clonar cada elemento e adicionar ao novo frame
  shuffledChildren.forEach((child, index) => {
    const clonedChild = child.clone();
    newFrame.appendChild(clonedChild);
  });
  
  // Seleciona o novo frame criado
  figma.currentPage.selection = [newFrame];
  
  // Centraliza a visualização no novo frame
  figma.viewport.scrollAndZoomIntoView([newFrame]);
  
  figma.notify(`✅ Frame duplicado com ${children.length} elementos embaralhados!`);
}

// Escuta mensagens da UI
figma.ui.onmessage = (msg) => {
  if (msg.type === 'shuffle-elements') {
    shuffleFrameElements();
  } else if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};

// Função para executar automaticamente se houver seleção
const selection = figma.currentPage.selection;
if (selection.length > 0 && selection[0].type === "FRAME") {
  // Se já há um frame selecionado, podemos mostrar informações na UI
  figma.ui.postMessage({
    type: 'frame-selected',
    frameName: selection[0].name,
    childrenCount: selection[0].children.length
  });
}
