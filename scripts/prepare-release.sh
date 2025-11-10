#!/bin/bash

# Script para preparar release do plugin Figma
# Uso: npm run release

set -e  # Para em caso de erro

echo "🚀 Preparando release do Frame Iterator..."

# Limpa pasta de release se existir
if [ -d "release" ]; then
  echo "🧹 Limpando pasta release anterior..."
  rm -rf release
fi

# Remove ZIP anterior se existir
if [ -f "frame-iterator-plugin.zip" ]; then
  echo "🗑️  Removendo ZIP anterior..."
  rm frame-iterator-plugin.zip
fi

# Cria pasta de release
echo "📁 Criando pasta release..."
mkdir -p release

# Build de produção
echo "🔨 Compilando código (modo produção)..."
npm run build

# Copia arquivos compilados para release (sem pasta dist/)
echo "📦 Copiando arquivos para release..."
cp dist/code.js release/
cp dist/ui.html release/

# Cria manifest.json específico para distribuição (sem dist/ no path)
echo "📝 Criando manifest.json para distribuição..."
cat > release/manifest.json << 'EOF'
{
  "name": "Frame Iterator",
  "id": "frame-iterator",
  "api": "1.0.0",
  "main": "code.js",
  "ui": "ui.html",
  "capabilities": [],
  "enableProposedApi": false,
  "editorType": [
    "figma"
  ],
  "networkAccess": {
    "allowedDomains": [
      "none"
    ]
  }
}
EOF

echo "📂 Arquivos em ./release:"
ls -lh release/

# Cria arquivo ZIP para o GitHub Release
echo ""
echo "🗜️  Criando arquivo ZIP..."
cd release
zip -r ../frame-iterator-plugin.zip *
cd ..

echo ""
echo "✅ Release preparado com sucesso!"
echo ""
echo "📦 Arquivo ZIP criado: frame-iterator-plugin.zip"
ls -lh frame-iterator-plugin.zip
echo ""
echo "🎉 Pronto para upload no GitHub Release!"
echo "   Faça upload do arquivo 'frame-iterator-plugin.zip' no release"
echo ""
echo "   Os usuários devem:"
echo "   1. Baixar e extrair o frame-iterator-plugin.zip"
echo "   2. No Figma Desktop: Plugins → Development → Import plugin from manifest"
echo "   3. Selecionar o manifest.json da pasta extraída"
echo "   4. Pronto! O plugin funcionará automaticamente ✅"
