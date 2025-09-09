// UI TypeScript code
console.log('UI loaded');

// Elementos DOM
const infoCard = document.getElementById('info-card') as HTMLElement;
const instructions = document.getElementById('instructions') as HTMLElement;
const frameNameEl = document.getElementById('frame-name') as HTMLElement;
const childrenCountEl = document.getElementById('children-count') as HTMLElement;
const unlockedCountEl = document.getElementById('unlocked-count') as HTMLElement;
const lockedCountEl = document.getElementById('locked-count') as HTMLElement;
const lockedRowEl = document.getElementById('locked-row') as HTMLElement;
const shuffleBtn = document.getElementById('shuffle-btn') as HTMLButtonElement;
const cancelBtn = document.getElementById('cancel-btn') as HTMLButtonElement;

// Event listeners
shuffleBtn.addEventListener('click', () => {
  parent.postMessage({ pluginMessage: { type: 'shuffle-elements' } }, '*');
});

cancelBtn.addEventListener('click', () => {
  parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
});

// Escuta mensagens do plugin
window.onmessage = (event) => {
  const msg = event.data.pluginMessage;
  
  if (msg.type === 'frame-selected') {
    // Mostra informações do frame selecionado
    frameNameEl.textContent = msg.frameName;
    childrenCountEl.textContent = msg.childrenCount;
    unlockedCountEl.textContent = msg.unlockedCount;
    lockedCountEl.textContent = msg.lockedCount;
    
    // Mostra linha de elementos bloqueados se existirem
    if (msg.lockedCount > 0) {
      lockedRowEl.style.display = 'flex';
    } else {
      lockedRowEl.style.display = 'none';
    }
    
    if (msg.childrenCount > 0) {
      infoCard.classList.add('visible');
      instructions.style.display = 'none';
      
      // Habilita/desabilita botão baseado na quantidade de elementos desbloqueados
      if (msg.unlockedCount < 2) {
        shuffleBtn.disabled = true;
        shuffleBtn.innerHTML = '⚠️ Precisa de 2+ elementos desbloqueados';
        shuffleBtn.style.background = '#ccc';
      } else {
        shuffleBtn.disabled = false;
        shuffleBtn.innerHTML = '<span class="emoji">🔀</span> Permutar Elementos';
        shuffleBtn.style.background = '#18a0fb';
      }
    }
  }
};
