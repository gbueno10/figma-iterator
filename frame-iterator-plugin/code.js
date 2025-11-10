/******/ (() => { // webpackBootstrap
// Plugin principal que permuta posições de elementos dentro de um frame
figma.showUI(__html__, { width: 350, height: 300 });
// Função para detectar o grupo principal (maior elemento ou mais central)
function detectMainGroup(children) {
    if (children.length === 0)
        return null;
    // Estratégia 1: Maior área
    const byArea = [...children].sort((a, b) => (b.width * b.height) - (a.width * a.height));
    // Estratégia 2: Mais central (baseado na posição no frame)
    const frameCenter = {
        x: Math.min(...children.map(c => c.x)) + (Math.max(...children.map(c => c.x + c.width)) - Math.min(...children.map(c => c.x))) / 2,
        y: Math.min(...children.map(c => c.y)) + (Math.max(...children.map(c => c.y + c.height)) - Math.min(...children.map(c => c.y))) / 2
    };
    const byPosition = [...children].sort((a, b) => {
        const distA = Math.sqrt(Math.pow(a.x + a.width / 2 - frameCenter.x, 2) + Math.pow(a.y + a.height / 2 - frameCenter.y, 2));
        const distB = Math.sqrt(Math.pow(b.x + b.width / 2 - frameCenter.x, 2) + Math.pow(b.y + b.height / 2 - frameCenter.y, 2));
        return distA - distB;
    });
    // Combina as estratégias: se o maior também está entre os 2 mais centrais, é o principal
    const topByArea = byArea[0];
    const topTwoCentral = byPosition.slice(0, 2);
    if (topTwoCentral.includes(topByArea)) {
        return topByArea;
    }
    // Senão, usa o mais central
    return byPosition[0];
}
// Função para gerar múltiplas permutações
function generateMultiplePermutations(transforms, count = 5) {
    const permutations = [];
    for (let i = 0; i < count; i++) {
        permutations.push(shuffleArray(transforms));
    }
    return permutations;
}
// Função para carregar uma fonte específica
async function loadFont(fontName) {
    try {
        await figma.loadFontAsync(fontName);
        return true;
    }
    catch (error) {
        console.warn(`Não foi possível carregar a fonte: ${fontName.family} ${fontName.style}`);
        return false;
    }
}
// Função para coletar todas as fontes únicas de um elemento
function collectFonts(element) {
    const fonts = new Set();
    function collectFromNode(node) {
        if (node.type === "TEXT") {
            // Para textos com fonte única
            if (typeof node.fontName === 'object' && 'family' in node.fontName) {
                fonts.add(`${node.fontName.family}|${node.fontName.style}`);
            }
            // Para textos com fontes mistas (mixed)
            else if (node.fontName === figma.mixed) {
                // Percorre os caracteres para pegar todas as fontes
                const textLength = node.characters.length;
                for (let i = 0; i < textLength; i++) {
                    const charFont = node.getRangeFontName(i, i + 1);
                    fonts.add(`${charFont.family}|${charFont.style}`);
                }
            }
        }
        if ('children' in node) {
            node.children.forEach(child => collectFromNode(child));
        }
    }
    collectFromNode(element);
    return fonts;
}
// Função para ajustar estilos de texto proporcionalmente
async function adjustTextStyles(element, originalSize, newSize) {
    const scaleX = newSize.width / originalSize.width;
    const scaleY = newSize.height / originalSize.height;
    const averageScale = (scaleX + scaleY) / 2; // Usa escala média para manter legibilidade
    // Primeiro, coleta e carrega todas as fontes necessárias
    const fontStrings = collectFonts(element);
    const fontPromises = Array.from(fontStrings).map(fontString => {
        const [family, style] = fontString.split('|');
        return loadFont({ family, style });
    });
    // Aguarda todas as fontes serem carregadas
    await Promise.all(fontPromises);
    // Função recursiva para ajustar textos em todos os níveis
    function adjustTextInNode(node) {
        if (node.type === "TEXT") {
            // Ajusta o tamanho da fonte proporcionalmente
            const currentFontSize = node.fontSize;
            const newFontSize = Math.round(currentFontSize * averageScale);
            // Garante que o tamanho mínimo seja 6px e máximo 200px
            const clampedFontSize = Math.max(6, Math.min(200, newFontSize));
            node.fontSize = clampedFontSize;
            // Ajusta espaçamento de linha se necessário
            if (node.lineHeight && typeof node.lineHeight === 'object' && node.lineHeight.unit === 'PIXELS') {
                node.lineHeight = {
                    unit: 'PIXELS',
                    value: Math.round(node.lineHeight.value * averageScale)
                };
            }
            // Ajusta espaçamento de caracteres se necessário
            if (node.letterSpacing && typeof node.letterSpacing === 'object' && node.letterSpacing.unit === 'PIXELS') {
                node.letterSpacing = {
                    unit: 'PIXELS',
                    value: Math.round(node.letterSpacing.value * averageScale)
                };
            }
            // Ajusta espaçamento de parágrafo se necessário
            if (node.paragraphSpacing) {
                node.paragraphSpacing = Math.round(node.paragraphSpacing * averageScale);
            }
        }
        // Ajusta propriedades de layout para frames e grupos
        if (node.type === "FRAME" || node.type === "GROUP") {
            // Ajusta padding se for um auto layout
            if ('paddingTop' in node && node.paddingTop !== undefined) {
                node.paddingTop = Math.round(node.paddingTop * averageScale);
                node.paddingBottom = Math.round(node.paddingBottom * averageScale);
                node.paddingLeft = Math.round(node.paddingLeft * averageScale);
                node.paddingRight = Math.round(node.paddingRight * averageScale);
            }
            // Ajusta espaçamento entre itens se for auto layout
            if ('itemSpacing' in node && node.itemSpacing !== undefined) {
                node.itemSpacing = Math.round(node.itemSpacing * averageScale);
            }
        }
        // Ajusta propriedades de stroke
        if ('strokeWeight' in node && node.strokeWeight) {
            if (typeof node.strokeWeight === 'number') {
                node.strokeWeight = Math.max(0.5, Math.round(node.strokeWeight * averageScale));
            }
        }
        // Ajusta corner radius
        if ('cornerRadius' in node && node.cornerRadius && 'topLeftRadius' in node) {
            const scaledRadius = Math.round(node.cornerRadius * averageScale);
            node.topLeftRadius = scaledRadius;
            node.topRightRadius = scaledRadius;
            node.bottomLeftRadius = scaledRadius;
            node.bottomRightRadius = scaledRadius;
        }
        // Se o nó tem filhos, aplica recursivamente
        if ('children' in node) {
            node.children.forEach(child => adjustTextInNode(child));
        }
    }
    adjustTextInNode(element);
}
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
    duplicatedFrame.name = `${originalFrame.name} - Permuted`;
    return duplicatedFrame;
}
// Função principal para gerar múltiplas variações
async function generateMultipleVariations(selectedElementId) {
    const selection = figma.currentPage.selection;
    // Validações básicas
    if (selection.length === 0) {
        figma.notify("❌ Selecione um frame para gerar variações!");
        return;
    }
    const selectedNode = selection[0];
    if (selectedNode.type !== "FRAME") {
        figma.notify("❌ Por favor, selecione um frame!");
        return;
    }
    const originalFrame = selectedNode;
    const children = [...originalFrame.children].filter(child => !child.locked);
    if (children.length < 2) {
        figma.notify("❌ Precisa de pelo menos 2 elementos para gerar variações!");
        return;
    }
    // Determina qual elemento vai trocar de posição
    let elementToSwap = null;
    if (selectedElementId) {
        // Usa o elemento especificado pelo usuário
        elementToSwap = children.find(child => child.id === selectedElementId) || null;
        if (!elementToSwap) {
            figma.notify("❌ Elemento especificado não encontrado!");
            return;
        }
    }
    else {
        // Detecta automaticamente o elemento principal
        elementToSwap = detectMainGroup(children);
        if (!elementToSwap) {
            figma.notify("❌ Não foi possível detectar o elemento principal!");
            return;
        }
    }
    // Elementos que podem receber a posição do elemento selecionado
    const otherElements = children.filter(child => child.id !== elementToSwap.id);
    if (otherElements.length < 1) {
        figma.notify("❌ Precisa de pelo menos 1 outro elemento para trocar!");
        return;
    }
    const notificationText = selectedElementId
        ? `🔄 "${elementToSwap.name}" vai trocar de posição com cada um dos outros elementos...`
        : `🤖 Elemento principal "${elementToSwap.name}" vai trocar de posição com cada um dos outros...`;
    figma.notify(notificationText, { timeout: 3000 });
    // Cria uma variação para cada elemento com o qual vai trocar
    const maxVariations = Math.min(5, otherElements.length);
    for (let i = 0; i < maxVariations; i++) {
        const newFrame = originalFrame.clone();
        newFrame.x = originalFrame.x + (originalFrame.width + 100) * (i + 1);
        newFrame.y = originalFrame.y;
        newFrame.name = `${originalFrame.name} - Troca ${i + 1}`;
        // Encontra os elementos correspondentes no novo frame
        const newElementToSwap = newFrame.children.find(child => {
            return child.name === elementToSwap.name &&
                Math.abs(child.x - elementToSwap.x) < 1 &&
                Math.abs(child.y - elementToSwap.y) < 1;
        });
        const targetElement = otherElements[i];
        const newTargetElement = newFrame.children.find(child => {
            return child.name === targetElement.name &&
                Math.abs(child.x - targetElement.x) < 1 &&
                Math.abs(child.y - targetElement.y) < 1;
        });
        if (newElementToSwap && newTargetElement) {
            // Armazena as transformações originais
            const swapTransform = {
                x: newElementToSwap.x,
                y: newElementToSwap.y,
                width: newElementToSwap.width,
                height: newElementToSwap.height
            };
            const targetTransform = {
                x: newTargetElement.x,
                y: newTargetElement.y,
                width: newTargetElement.width,
                height: newTargetElement.height
            };
            // Realiza a troca de posições e dimensões
            try {
                // Move o elemento principal para a posição do alvo
                newElementToSwap.x = targetTransform.x;
                newElementToSwap.y = targetTransform.y;
                if ('resize' in newElementToSwap) {
                    const originalSize = { width: swapTransform.width, height: swapTransform.height };
                    const newSize = { width: targetTransform.width, height: targetTransform.height };
                    newElementToSwap.resize(targetTransform.width, targetTransform.height);
                    if (originalSize.width !== newSize.width || originalSize.height !== newSize.height) {
                        await adjustTextStyles(newElementToSwap, originalSize, newSize);
                    }
                }
                // Move o elemento alvo para a posição original do principal
                newTargetElement.x = swapTransform.x;
                newTargetElement.y = swapTransform.y;
                if ('resize' in newTargetElement) {
                    const originalSize = { width: targetTransform.width, height: targetTransform.height };
                    const newSize = { width: swapTransform.width, height: swapTransform.height };
                    newTargetElement.resize(swapTransform.width, swapTransform.height);
                    if (originalSize.width !== newSize.width || originalSize.height !== newSize.height) {
                        await adjustTextStyles(newTargetElement, originalSize, newSize);
                    }
                }
            }
            catch (error) {
                console.warn(`Erro ao trocar elementos:`, error);
            }
        }
    }
    figma.notify(`✅ ${maxVariations} variações criadas! "${elementToSwap.name}" trocou de posição com diferentes elementos.`);
}
// Função para incrementar a versão no nome do frame (v1 -> v2, v2 -> v3, etc.)
function incrementFrameVersion(frameName, iteration) {
    // Regex para encontrar padrões como v1, v2, v3a, v10b, etc.
    const versionRegex = /(_v)(\d+)([a-z]?)/i;
    const match = frameName.match(versionRegex);
    if (match) {
        // Se encontrou uma versão, incrementa o número
        const currentVersion = parseInt(match[2]);
        const newVersion = currentVersion + iteration;
        const letter = match[3]; // Preserva letra se existir (a, b, c...)
        return frameName.replace(versionRegex, `${match[1]}${newVersion}${letter}`);
    }
    else {
        // Se não encontrou versão, adiciona no final
        return `${frameName}_v${iteration + 1}`;
    }
}
// Nova função para criar UMA variação de destaque
async function createSpotlightVariation(originalFrame, mainElementTransform, promotedElementIndex, // Índice do elemento que será promovido
promotedElementName, // Nome do elemento para referência
iteration // Para posicionamento do novo frame
) {
    const newFrame = originalFrame.clone();
    // Posiciona os novos frames em uma linha horizontal ao lado do original
    newFrame.x = originalFrame.x + (originalFrame.width + 100) * (iteration + 1);
    newFrame.y = originalFrame.y;
    // Incrementa a versão no nome do frame
    newFrame.name = incrementFrameVersion(originalFrame.name, iteration + 1);
    // Pega os elementos desbloqueados do NOVO frame
    const newUnlockedChildren = newFrame.children.filter(c => !c.locked);
    if (promotedElementIndex >= newUnlockedChildren.length) {
        return newFrame;
    }
    const newPromotedElement = newUnlockedChildren[promotedElementIndex];
    // Encontra o elemento que está atualmente na posição principal
    const currentElementInMainSpot = newUnlockedChildren.find(c => Math.abs(c.x - mainElementTransform.x) < 1 &&
        Math.abs(c.y - mainElementTransform.y) < 1 &&
        Math.abs(c.width - mainElementTransform.width) < 1 &&
        Math.abs(c.height - mainElementTransform.height) < 1);
    if (currentElementInMainSpot && currentElementInMainSpot !== newPromotedElement) {
        // Guarda as posições originais
        const originalPromotedTransform = {
            x: newPromotedElement.x,
            y: newPromotedElement.y,
            width: newPromotedElement.width,
            height: newPromotedElement.height
        };
        // 1. Elemento promovido vai para a posição principal
        newPromotedElement.x = mainElementTransform.x;
        newPromotedElement.y = mainElementTransform.y;
        newPromotedElement.resize(mainElementTransform.width, mainElementTransform.height);
        await adjustTextStyles(newPromotedElement, originalPromotedTransform, mainElementTransform);
        // 2. Elemento que estava no main vai para a posição do promovido
        currentElementInMainSpot.x = originalPromotedTransform.x;
        currentElementInMainSpot.y = originalPromotedTransform.y;
        currentElementInMainSpot.resize(originalPromotedTransform.width, originalPromotedTransform.height);
        await adjustTextStyles(currentElementInMainSpot, mainElementTransform, originalPromotedTransform);
    }
    // Se o elemento já é o principal, mantém o nome com versão incrementada
    return newFrame;
}
// Função principal para gerar todas as variações de destaque
async function generateAllSpotlightVariations() {
    const selection = figma.currentPage.selection;
    if (selection.length === 0 || selection[0].type !== "FRAME") {
        figma.notify("❌ Selecione um frame para gerar as variações de destaque!", { error: true });
        return;
    }
    const originalFrame = selection[0];
    // Pegamos TODOS os filhos para garantir que todos tenham uma chance de serem o principal
    const allChildren = [...originalFrame.children];
    const unlockedChildren = allChildren.filter(child => !child.locked);
    if (unlockedChildren.length < 1) { // Precisa de pelo menos 1 elemento para ser principal
        figma.notify("❌ O frame não possui elementos desbloqueados para testar.", { error: true });
        return;
    }
    // 1. Detecta qual é o elemento principal atual, e guarda sua posição/tamanho de "trono"
    const currentMainElement = detectMainGroup(unlockedChildren);
    if (!currentMainElement) {
        figma.notify("❌ Não foi possível detectar um elemento principal para usar como base.", { error: true });
        return;
    }
    const mainElementTransform = {
        x: currentMainElement.x, y: currentMainElement.y,
        width: currentMainElement.width, height: currentMainElement.height,
        name: currentMainElement.name // Para referência
    };
    figma.notify(`👑 Gerando variações, promovendo cada elemento à posição de destaque de "${currentMainElement.name}"...`, { timeout: 3000 });
    const newFrames = [];
    // Itera sobre CADA elemento desbloqueado para que ele se torne o "principal"
    for (let i = 0; i < unlockedChildren.length; i++) {
        const elementToPromote = unlockedChildren[i];
        const newFrame = await createSpotlightVariation(originalFrame, mainElementTransform, i, // Índice do elemento
        elementToPromote.name, // Nome do elemento
        i // Índice para posicionamento
        );
        newFrames.push(newFrame);
    }
    figma.currentPage.selection = newFrames;
    figma.viewport.scrollAndZoomIntoView(newFrames);
    figma.notify(`✅ ${newFrames.length} variações de destaque criadas! Cada elemento foi promovido à posição principal.`);
}
// Função principal para permutar posições dos elementos (versão original)
async function permuteElementPositions() {
    const selection = figma.currentPage.selection;
    // Verifica se há algo selecionado
    if (selection.length === 0) {
        figma.notify("❌ Selecione um frame para permutar as posições dos elementos!");
        return;
    }
    // Verifica se o primeiro item selecionado é um frame
    const selectedNode = selection[0];
    if (selectedNode.type !== "FRAME") {
        figma.notify("❌ Por favor, selecione um frame!");
        return;
    }
    const originalFrame = selectedNode;
    // Filtra apenas elementos desbloqueados
    const children = [...originalFrame.children].filter(child => !child.locked);
    if (children.length === 0) {
        figma.notify("❌ O frame não possui elementos desbloqueados para permutar!");
        return;
    }
    if (children.length < 2) {
        figma.notify("❌ O frame precisa ter pelo menos 2 elementos desbloqueados para permutar!");
        return;
    }
    // Mostra feedback de carregamento
    figma.notify("🔄 Carregando fontes e processando...", { timeout: 2000 });
    // Coleta as posições e dimensões originais dos elementos
    const originalTransforms = children.map(child => ({
        x: child.x,
        y: child.y,
        width: child.width,
        height: child.height
    }));
    // Embaralha as transformações (posições + dimensões)
    const shuffledTransforms = shuffleArray(originalTransforms);
    // Duplica o frame original
    const newFrame = duplicateFrame(originalFrame);
    // Atualiza as posições e dimensões apenas dos elementos desbloqueados no frame duplicado
    let transformIndex = 0;
    for (const child of newFrame.children) {
        // Só atualiza se o elemento não está bloqueado
        if (!child.locked) {
            const transform = shuffledTransforms[transformIndex];
            const originalSize = {
                width: child.width,
                height: child.height
            };
            const newSize = {
                width: transform.width,
                height: transform.height
            };
            // Ajusta posição
            child.x = transform.x;
            child.y = transform.y;
            // Redimensiona o elemento
            child.resize(transform.width, transform.height);
            // Ajusta estilos de texto proporcionalmente se houve mudança de tamanho
            if (originalSize.width !== newSize.width || originalSize.height !== newSize.height) {
                await adjustTextStyles(child, originalSize, newSize);
            }
            transformIndex++;
        }
    }
    // Seleciona o novo frame criado
    figma.currentPage.selection = [newFrame];
    // Centraliza a visualização no novo frame
    figma.viewport.scrollAndZoomIntoView([newFrame]);
    const lockedCount = originalFrame.children.length - children.length;
    const message = lockedCount > 0
        ? `✅ Frame duplicado! ${children.length} elementos permutados (${lockedCount} bloqueados ignorados)`
        : `✅ Frame duplicado com ${children.length} elementos com posições e dimensões permutadas!`;
    figma.notify(message);
}
// Escuta mensagens da UI
figma.ui.onmessage = async (msg) => {
    if (msg.type === 'shuffle-elements') {
        await permuteElementPositions();
    }
    else if (msg.type === 'generate-variations') {
        await generateMultipleVariations(msg.selectedElementId);
    }
    else if (msg.type === 'generate-spotlight-variations') {
        await generateAllSpotlightVariations();
    }
    else if (msg.type === 'cancel') {
        figma.closePlugin();
    }
};
// Função para enviar informações do frame para a UI
function sendFrameInfoToUI() {
    const selection = figma.currentPage.selection;
    if (selection.length > 0 && selection[0].type === "FRAME") {
        const frame = selection[0];
        const totalChildren = frame.children.length;
        const unlockedChildren = frame.children.filter(child => !child.locked);
        const lockedChildren = totalChildren - unlockedChildren.length;
        // Detecta o grupo principal
        const mainGroup = detectMainGroup(unlockedChildren);
        const permuteCount = mainGroup ? unlockedChildren.length - 1 : unlockedChildren.length;
        // Cria array com informações dos elementos para a UI
        const elementsInfo = frame.children.map(child => ({
            id: child.id,
            name: child.name,
            locked: child.locked || false,
            x: child.x,
            y: child.y,
            width: child.width,
            height: child.height
        }));
        // Envia informações para a UI
        figma.ui.postMessage({
            type: 'frame-selected',
            frameName: frame.name,
            childrenCount: totalChildren,
            unlockedCount: unlockedChildren.length,
            lockedCount: lockedChildren,
            mainGroupName: mainGroup ? mainGroup.name : 'Nenhum detectado',
            permuteCount: permuteCount,
            elements: elementsInfo
        });
    }
    else {
        // Nenhum frame selecionado
        figma.ui.postMessage({
            type: 'no-frame-selected'
        });
    }
}
// Listener para mudanças na seleção
figma.on("selectionchange", () => {
    sendFrameInfoToUI();
});
// Executa uma vez ao carregar o plugin
sendFrameInfoToUI();

/******/ })()
;