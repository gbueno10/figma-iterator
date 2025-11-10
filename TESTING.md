# Como Testar o Plugin Localmente

## ⚠️ IMPORTANTE

Para testar o plugin durante o desenvolvimento, você deve:

1. Compilar o código primeiro:
   ```bash
   npm run build
   ```

2. No Figma Desktop:
   - Vá em **Plugins → Development → Import plugin from manifest**
   - Selecione o arquivo **`manifest.json`** da **RAIZ** do projeto
   - Caminho: `/Users/gbuenos/Documents/Projetos.nosync/figma-iterator/manifest.json`

## ❌ Erro Comum

**NÃO** importe o `manifest.json` de dentro das pastas:
- ❌ `release/manifest.json` 
- ❌ `frame-iterator-plugin/manifest.json` (pasta extraída do ZIP)

Esses manifestos não têm os arquivos `dist/code.js` e `dist/ui.html` no lugar correto.

## ✅ Estrutura Correta

Quando você importa o manifest da raiz, o Figma encontra:
```
/Users/gbuenos/Documents/Projetos.nosync/figma-iterator/
├── manifest.json          ← Importar este arquivo
├── dist/
│   ├── code.js           ← O Figma encontra aqui
│   └── ui.html           ← O Figma encontra aqui
```

## 🔄 Desenvolvimento

Para desenvolvimento com hot reload:
```bash
npm run build:watch
```

Depois de importar o plugin uma vez, as mudanças serão refletidas automaticamente no Figma.

## 📦 Para Distribuição

O arquivo `frame-iterator-plugin.zip` já contém tudo que os usuários precisam.
Eles devem:
1. Baixar e extrair o ZIP
2. Importar o `manifest.json` da pasta extraída
3. Tudo funcionará porque os arquivos estão incluídos no ZIP
