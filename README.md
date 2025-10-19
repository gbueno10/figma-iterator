# 🔀 Frame Iterator - Figma Plugin

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Figma](https://img.shields.io/badge/Figma-F24E1E?logo=figma&logoColor=white)](https://www.figma.com/)

Um plugin avançado para Figma que permite permutar elementos dentro de frames, criando variações de layout automaticamente. Perfeito para designers que precisam gerar múltiplas versões de templates, cards ou interfaces.

## ✨ Funcionalidades

### 🔀 **Permuta Simples**
- Embaralha todos os elementos dentro de um frame
- Cria uma nova versão com elementos reorganizados
- Mantém todas as propriedades visuais (cores, fontes, etc.)

### 🔄 **Múltiplas Trocas**
- Selecione um elemento específico para trocar de posição
- Gera até 5 variações onde o elemento escolhido troca com cada um dos outros
- Ideal para testar diferentes hierarquias visuais

### 🎯 **Detecção Inteligente**
- **Modo Auto**: Detecta automaticamente o elemento principal (maior ou mais central)
- **Modo Manual**: Você escolhe qual elemento será o foco das trocas
- Suporte completo a elementos bloqueados

### 🎨 **Ajustes Dinâmicos**
- Redimensionamento proporcional de elementos
- Ajuste automático de estilos de texto
- Carregamento inteligente de fontes
- Preservação da hierarquia visual

## 🚀 Como Usar

### Instalação
1. **Clone ou baixe** este repositório
2. **Abra o Figma Desktop**
3. Vá em `Plugins > Development > Import plugin from manifest`
4. Selecione o arquivo `manifest.json` deste projeto

### Uso Básico
1. **Selecione um frame** no seu arquivo Figma
2. **Execute o plugin** através do menu Plugins
3. **Escolha o modo**:
   - **🔀 Permuta Simples**: Embaralha todos os elementos
   - **🔄 Múltiplas Trocas**: Selecione um elemento para gerar variações
4. **Aprove as variações** criadas automaticamente!

## 📋 Requisitos

- **Figma Desktop** (versão mais recente recomendada)
- **Frame selecionado** com pelo menos 2 elementos
- **Elementos desbloqueados** para permutação

## 🛠️ Tecnologias

- **TypeScript** - Tipagem forte e desenvolvimento moderno
- **Figma Plugin API** - Integração nativa com o Figma
- **Webpack** - Build e bundling otimizado
- **HTML/CSS/JavaScript** - Interface responsiva

## 📁 Estrutura do Projeto

```
figma-iterator/
├── src/
│   ├── code.ts          # Lógica principal do plugin
│   ├── ui.html          # Interface do usuário
│   └── ui.ts            # Script da interface
├── dist/                # Arquivos compilados
│   ├── code.js
│   ├── ui.html
│   └── ui.js
├── manifest.json        # Configuração do plugin Figma
├── package.json         # Dependências e scripts
├── tsconfig.json        # Configuração TypeScript
└── webpack.config.js    # Configuração de build
```

## 🎯 Casos de Uso

### 🎨 **Design de Templates**
- Crie variações de cards de produto
- Teste diferentes layouts de landing pages
- Gere versões alternativas de interfaces

### 📱 **Design de Apps**
- Teste diferentes hierarquias de informação
- Crie variações de telas de onboarding
- Experimente layouts de dashboards

### 🛍️ **E-commerce**
- Varie posições de elementos em cards de produto
- Teste diferentes layouts de vitrines
- Crie versões A/B de anúncios

## 🔧 Desenvolvimento

### Pré-requisitos
```bash
npm install
```

### Build
```bash
npm run build
```

### Desenvolvimento
```bash
npm run dev  # Com watch mode
```

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:

- 🐛 **Reportar bugs** abrindo uma issue
- 💡 **Sugerir features** através de pull requests
- 📖 **Melhorar documentação**
- 🔧 **Otimizar código**

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- **Figma** pela incrível API de plugins
- **Comunidade de designers** que inspiram melhorias constantes
- **Open source** por tornar tudo isso possível

---

**Feito com ❤️ para designers que querem trabalhar mais rápido!**

⭐ **Dê uma estrela se este plugin te ajudou!**
