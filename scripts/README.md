# Scripts de Release

## Como usar

Para preparar os arquivos do plugin para distribuição, execute:

```bash
npm run release
```

Este script irá:
1. Limpar a pasta `release/` (se existir)
2. Compilar o código em modo produção
3. Copiar os arquivos necessários (`manifest.json`, `code.js`, `ui.html`) para a pasta `release/`
4. Criar um arquivo ZIP `frame-iterator-plugin.zip` pronto para upload no GitHub Release

## Arquivos gerados

Os seguintes arquivos serão gerados na pasta `release/`:
- `manifest.json` - Manifesto do plugin
- `code.js` - Código compilado do plugin
- `ui.html` - Interface do usuário

## Como instalar no Figma

1. Abra o Figma Desktop
2. Vá em **Plugins → Development → Import plugin from manifest**
3. Selecione o arquivo `manifest.json` da pasta `release/`

## Distribuição

Para distribuir o plugin no GitHub:
1. O script já criou o arquivo `frame-iterator-plugin.zip`
2. Vá até o release no GitHub
3. Faça upload do arquivo `frame-iterator-plugin.zip` como asset do release
4. Os usuários poderão baixar e instalar diretamente no Figma
