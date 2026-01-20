#!/bin/bash
# 📋 Script de Verificação das Melhorias
# Este script valida que todas as melhorias foram implementadas corretamente

echo "🔍 Verificando Melhorias Implementadas..."
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contadores
TOTAL=0
PASSED=0
FAILED=0

# Função para verificar arquivo
check_file() {
    local file=$1
    local name=$2
    TOTAL=$((TOTAL+1))
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $name"
        PASSED=$((PASSED+1))
    else
        echo -e "${RED}✗${NC} $name não encontrado"
        FAILED=$((FAILED+1))
    fi
}

# Função para verificar conteúdo em arquivo
check_content() {
    local file=$1
    local content=$2
    local name=$3
    TOTAL=$((TOTAL+1))
    
    if grep -q "$content" "$file" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $name"
        PASSED=$((PASSED+1))
    else
        echo -e "${RED}✗${NC} $name"
        FAILED=$((FAILED+1))
    fi
}

echo "📁 Verificando Arquivos Criados:"
echo "────────────────────────────────"
check_file "frontend/src/utils/logger.js" "Logger Centralizado"
check_file "frontend/src/utils/formatters.js" "Formatadores"
check_file "frontend/src/utils/companyFactory.js" "Factory Pattern"
check_file "frontend/src/hooks/useAsyncOperation.js" "useAsyncOperation"
check_file "BEST_PRACTICES.md" "Guia de Boas Práticas"
check_file "IMPROVEMENTS.md" "Documentação de Melhorias"
check_file "QUICK_START.md" "Quick Start Guide"
check_file "README_IMPROVEMENTS.md" "README de Melhorias"

echo ""
echo "🔧 Verificando Conteúdo dos Arquivos:"
echo "──────────────────────────────────────"
check_content "frontend/src/hooks/useCompanies.js" "companyFactory" "useCompanies usando factory"
check_content "frontend/src/hooks/useCompanies.js" "logger" "useCompanies usando logger"
check_content "frontend/src/components/ErrorBoundary.jsx" "retry" "ErrorBoundary com retry"
check_content "frontend/src/components/ErrorBoundary.jsx" "logger" "ErrorBoundary com logger"
check_content "frontend/src/constants/index.js" "REGIME_TYPES" "Constantes de regime"
check_content "frontend/src/constants/index.js" "BOLETO_STATUS" "Constantes de boleto"

echo ""
echo "📊 Resultado da Verificação:"
echo "────────────────────────────"
echo "Total de verificações: $TOTAL"
echo -e "Passou: ${GREEN}$PASSED${NC}"
echo -e "Falhou: ${RED}$FAILED${NC}"

if [ $FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ TODAS AS MELHORIAS FORAM IMPLEMENTADAS COM SUCESSO!${NC}"
    exit 0
else
    echo ""
    echo -e "${RED}❌ Algumas verificações falharam${NC}"
    exit 1
fi
