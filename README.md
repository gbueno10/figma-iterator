# Frame Iterator - Plugin Figma

Um plugin para Figma que embaralha elementos dentro de um frame selecionado, criando uma nova versão reorganizada.

## 🎯 Funcionalidades

- Selecione um frame no Figma
- O plugin embaralha todos os elementos filhos do frame
- Cria uma cópia do frame com os elementos na nova ordem
- Interface simples e intuitiva

## 🚀 Como usar

1. **Instalação**: Importe o plugin no Figma através do menu `Plugins > Development > Import plugin from manifest`
2. **Seleção**: Selecione um frame que contenha elementos (quadrados, cards, etc.)
3. **Execução**: Execute o plugin e clique em "Embaralhar Elementos"
4. **Resultado**: Um novo frame será criado ao lado do original com os elementos embaralhados

## 📋 Requisitos

- O frame deve conter pelo menos 2 elementos para poder embaralhar
- Funciona com qualquer tipo de elemento filho (retângulos, textos, grupos, etc.)

## 🔧 Estrutura do projeto

```
figma-iterator/
├── manifest.json    # Configuração do plugin
├── code.js         # Lógica principal
├── ui.html         # Interface do usuário
└── README.md       # Este arquivo
```

## ⚡ Fluxo de funcionamento

1. **Seleção**: Pega o frame selecionado pelo usuário
2. **Validação**: Verifica se é um frame válido com elementos
3. **Embaralhamento**: Usa algoritmo Fisher-Yates para embaralhar os elementos
4. **Duplicação**: Cria uma cópia do frame original
5. **Reorganização**: Aplica a nova ordem dos elementos no frame duplicado
6. **Finalização**: Posiciona o novo frame ao lado do original

## 🎨 Características da UI

- Design limpo e moderno
- Feedback visual em tempo real
- Instruções claras para o usuário
- Validação automática da seleção

## 🛠 Tecnologias utilizadas

- **Figma Plugin API**: Para interação com o Figma
- **JavaScript**: Lógica de embaralhamento e manipulação de elementos
- **HTML/CSS**: Interface do usuário responsiva

---

Desenvolvido para simplificar o processo de criar variações de layout com elementos reorganizados no Figma! 🚀
