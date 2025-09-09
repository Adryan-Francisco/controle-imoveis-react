// tests/e2e/auth.spec.js
import { test, expect } from '@playwright/test';

test.describe('Autenticação', () => {
  test('deve permitir login com credenciais válidas', async ({ page }) => {
    await page.goto('/');
    
    // Verificar se está na página de login
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
    
    // Preencher formulário de login
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/senha/i).fill('password123');
    
    // Clicar no botão de login
    await page.getByRole('button', { name: /entrar/i }).click();
    
    // Verificar se foi redirecionado para o dashboard
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  });

  test('deve mostrar erro com credenciais inválidas', async ({ page }) => {
    await page.goto('/');
    
    // Preencher com credenciais inválidas
    await page.getByLabel(/email/i).fill('invalid@example.com');
    await page.getByLabel(/senha/i).fill('wrongpassword');
    
    // Clicar no botão de login
    await page.getByRole('button', { name: /entrar/i }).click();
    
    // Verificar se aparece mensagem de erro
    await expect(page.getByText(/credenciais inválidas/i)).toBeVisible();
  });

  test('deve permitir registro de novo usuário', async ({ page }) => {
    await page.goto('/');
    
    // Clicar no link de registro
    await page.getByRole('link', { name: /criar conta/i }).click();
    
    // Preencher formulário de registro
    await page.getByLabel(/email/i).fill('newuser@example.com');
    await page.getByLabel(/senha/i).fill('password123');
    await page.getByLabel(/confirmar senha/i).fill('password123');
    
    // Clicar no botão de registro
    await page.getByRole('button', { name: /criar conta/i }).click();
    
    // Verificar se foi redirecionado para o dashboard
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  });

  test('deve permitir logout', async ({ page }) => {
    // Fazer login primeiro
    await page.goto('/');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/senha/i).fill('password123');
    await page.getByRole('button', { name: /entrar/i }).click();
    
    // Verificar se está no dashboard
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
    
    // Clicar no botão de logout
    await page.getByRole('button', { name: /sair/i }).click();
    
    // Verificar se foi redirecionado para a página de login
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
  });
});
