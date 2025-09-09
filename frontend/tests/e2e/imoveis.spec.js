// tests/e2e/imoveis.spec.js
import { test, expect } from '@playwright/test';

test.describe('Gestão de Imóveis', () => {
  test.beforeEach(async ({ page }) => {
    // Fazer login antes de cada teste
    await page.goto('/');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/senha/i).fill('password123');
    await page.getByRole('button', { name: /entrar/i }).click();
    
    // Navegar para a página de imóveis
    await page.getByRole('link', { name: /imóveis/i }).click();
  });

  test('deve listar imóveis existentes', async ({ page }) => {
    // Verificar se a tabela de imóveis está visível
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /proprietário/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /sítio/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /status/i })).toBeVisible();
  });

  test('deve adicionar novo imóvel', async ({ page }) => {
    // Clicar no botão de adicionar imóvel
    await page.getByRole('button', { name: /adicionar imóvel/i }).click();
    
    // Verificar se o modal foi aberto
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: /adicionar novo imóvel/i })).toBeVisible();
    
    // Preencher formulário
    await page.getByLabel(/proprietário/i).fill('João Silva');
    await page.getByLabel(/sítio/i).fill('Fazenda São José');
    await page.getByLabel(/endereço/i).fill('Rua das Flores, 123');
    await page.getByLabel(/cpf/i).fill('123.456.789-00');
    await page.getByLabel(/telefone/i).fill('(11) 99999-9999');
    await page.getByLabel(/valor/i).fill('1500');
    await page.getByLabel(/status/i).selectOption('PENDENTE');
    
    // Salvar
    await page.getByRole('button', { name: /salvar/i }).click();
    
    // Verificar se o modal foi fechado e o imóvel foi adicionado
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByText('João Silva')).toBeVisible();
  });

  test('deve editar imóvel existente', async ({ page }) => {
    // Clicar no botão de editar do primeiro imóvel
    await page.getByRole('button', { name: /editar imóvel de/i }).first().click();
    
    // Verificar se o modal foi aberto com dados preenchidos
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: /editar imóvel/i })).toBeVisible();
    
    // Modificar dados
    await page.getByLabel(/proprietário/i).fill('João Silva Atualizado');
    
    // Salvar
    await page.getByRole('button', { name: /atualizar/i }).click();
    
    // Verificar se as alterações foram salvas
    await expect(page.getByText('João Silva Atualizado')).toBeVisible();
  });

  test('deve excluir imóvel', async ({ page }) => {
    // Clicar no botão de excluir do primeiro imóvel
    await page.getByRole('button', { name: /excluir imóvel de/i }).first().click();
    
    // Verificar se o modal de confirmação foi aberto
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(/tem certeza/i)).toBeVisible();
    
    // Confirmar exclusão
    await page.getByRole('button', { name: /excluir/i }).click();
    
    // Verificar se o imóvel foi removido
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('deve filtrar imóveis por busca', async ({ page }) => {
    // Preencher campo de busca
    await page.getByPlaceholder(/buscar/i).fill('João');
    
    // Verificar se apenas imóveis com "João" são exibidos
    const rows = page.getByRole('row');
    await expect(rows).toHaveCount(2); // 1 cabeçalho + 1 resultado
  });

  test('deve filtrar imóveis por status', async ({ page }) => {
    // Selecionar filtro de status
    await page.getByLabel(/status/i).selectOption('PAGO');
    
    // Verificar se apenas imóveis com status "PAGO" são exibidos
    const badges = page.getByText('PAGO');
    await expect(badges).toBeVisible();
  });

  test('deve navegar com teclado', async ({ page }) => {
    // Usar Tab para navegar
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Verificar se o foco está no botão de adicionar
    await expect(page.getByRole('button', { name: /adicionar imóvel/i })).toBeFocused();
    
    // Usar Enter para ativar o botão
    await page.keyboard.press('Enter');
    
    // Verificar se o modal foi aberto
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('deve ser acessível para leitores de tela', async ({ page }) => {
    // Verificar se a tabela tem os atributos ARIA corretos
    const table = page.getByRole('table');
    await expect(table).toHaveAttribute('aria-label', 'Lista de imóveis');
    
    // Verificar se os cabeçalhos têm os atributos corretos
    const headers = page.getByRole('columnheader');
    await expect(headers).toHaveCount(7);
    
    // Verificar se os botões têm labels acessíveis
    const addButton = page.getByRole('button', { name: /adicionar imóvel/i });
    await expect(addButton).toHaveAttribute('aria-label', 'Adicionar novo imóvel');
  });
});
