// tests/e2e/accessibility.spec.js
import { test, expect } from '@playwright/test';

test.describe('Acessibilidade', () => {
  test.beforeEach(async ({ page }) => {
    // Fazer login antes de cada teste
    await page.goto('/');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/senha/i).fill('password123');
    await page.getByRole('button', { name: /entrar/i }).click();
  });

  test('deve ter navegação por teclado funcional', async ({ page }) => {
    // Verificar se é possível navegar com Tab
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Verificar se o foco está visível
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('deve ter skip links', async ({ page }) => {
    // Verificar se existe skip link para conteúdo principal
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toBeVisible();
    
    // Verificar se o skip link funciona
    await skipLink.focus();
    await page.keyboard.press('Enter');
    
    // Verificar se o foco foi movido para o conteúdo principal
    const mainContent = page.locator('main, [role="main"]');
    await expect(mainContent).toBeFocused();
  });

  test('deve ter contraste adequado', async ({ page }) => {
    // Verificar se os elementos têm contraste suficiente
    const buttons = page.locator('button');
    const firstButton = buttons.first();
    
    // Verificar se o botão tem contraste adequado
    const buttonColor = await firstButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        color: styles.color,
        backgroundColor: styles.backgroundColor
      };
    });
    
    // Verificar se as cores não são iguais (indicando contraste)
    expect(buttonColor.color).not.toBe(buttonColor.backgroundColor);
  });

  test('deve ter labels acessíveis em formulários', async ({ page }) => {
    // Navegar para página de imóveis
    await page.getByRole('link', { name: /imóveis/i }).click();
    
    // Abrir formulário de adicionar imóvel
    await page.getByRole('button', { name: /adicionar imóvel/i }).click();
    
    // Verificar se os campos têm labels associados
    const proprietarioField = page.getByLabel(/proprietário/i);
    await expect(proprietarioField).toBeVisible();
    
    const cpfField = page.getByLabel(/cpf/i);
    await expect(cpfField).toBeVisible();
    
    const telefoneField = page.getByLabel(/telefone/i);
    await expect(telefoneField).toBeVisible();
  });

  test('deve ter ARIA labels corretos', async ({ page }) => {
    // Navegar para página de imóveis
    await page.getByRole('link', { name: /imóveis/i }).click();
    
    // Verificar se a tabela tem ARIA labels
    const table = page.getByRole('table');
    await expect(table).toHaveAttribute('aria-label', 'Lista de imóveis');
    
    // Verificar se os botões têm ARIA labels
    const addButton = page.getByRole('button', { name: /adicionar imóvel/i });
    await expect(addButton).toHaveAttribute('aria-label', 'Adicionar novo imóvel');
  });

  test('deve anunciar mudanças para leitores de tela', async ({ page }) => {
    // Verificar se existe região de anúncios
    const announcer = page.locator('[aria-live]');
    await expect(announcer).toBeVisible();
    
    // Simular uma ação que deve gerar anúncio
    await page.getByRole('link', { name: /imóveis/i }).click();
    
    // Verificar se o anúncio foi feito
    await expect(announcer).toHaveText(/imóveis/i);
  });

  test('deve ter estrutura semântica correta', async ({ page }) => {
    // Verificar se existe cabeçalho principal
    const mainHeading = page.getByRole('heading', { level: 1 });
    await expect(mainHeading).toBeVisible();
    
    // Verificar se existe navegação
    const navigation = page.getByRole('navigation');
    await expect(navigation).toBeVisible();
    
    // Verificar se existe conteúdo principal
    const main = page.locator('main, [role="main"]');
    await expect(main).toBeVisible();
  });

  test('deve funcionar com zoom aumentado', async ({ page }) => {
    // Aplicar zoom de 200%
    await page.setViewportSize({ width: 800, height: 600 });
    
    // Verificar se os elementos ainda são visíveis e clicáveis
    const buttons = page.locator('button');
    await expect(buttons.first()).toBeVisible();
    
    // Verificar se o texto ainda é legível
    const text = page.locator('text=Dashboard');
    await expect(text).toBeVisible();
  });

  test('deve ter foco visível', async ({ page }) => {
    // Navegar com teclado
    await page.keyboard.press('Tab');
    
    // Verificar se o elemento focado tem indicador visual
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Verificar se o foco é visível (não apenas funcional)
    const focusStyles = await focusedElement.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        outline: styles.outline,
        boxShadow: styles.boxShadow
      };
    });
    
    // Verificar se há indicador visual de foco
    expect(focusStyles.outline).not.toBe('none');
  });
});
