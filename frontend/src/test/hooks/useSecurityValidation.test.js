// src/test/hooks/useSecurityValidation.test.js
import { renderHook } from '@testing-library/react';
import { useSecurityValidation } from '../../hooks/useSecurityValidation';

describe('useSecurityValidation', () => {
  test('deve sanitizar entrada de dados', () => {
    const { result } = renderHook(() => useSecurityValidation());

    const input = '<script>alert("xss")</script>Hello World';
    const sanitized = result.current.sanitizeInput(input);

    expect(sanitized).toBe('Hello World');
  });

  test('deve validar dados do imóvel', () => {
    const { result } = renderHook(() => useSecurityValidation());

    const validData = {
      proprietario: 'João Silva',
      cpf: '123.456.789-00',
      telefone: '(11) 99999-9999',
      valor: 1000
    };

    const validation = result.current.validateImovelData(validData);
    expect(validation.isValid).toBe(true);
    expect(validation.errors).toEqual({});
  });

  test('deve detectar dados inválidos', () => {
    const { result } = renderHook(() => useSecurityValidation());

    const invalidData = {
      proprietario: '', // Campo obrigatório vazio
      cpf: '123', // CPF inválido
      telefone: '123', // Telefone inválido
      valor: -100 // Valor negativo
    };

    const validation = result.current.validateImovelData(invalidData);
    expect(validation.isValid).toBe(false);
    expect(validation.errors).toHaveProperty('proprietario');
    expect(validation.errors).toHaveProperty('cpf');
    expect(validation.errors).toHaveProperty('telefone');
    expect(validation.errors).toHaveProperty('valor');
  });

  test('deve sanitizar dados do imóvel', () => {
    const { result } = renderHook(() => useSecurityValidation());

    const data = {
      proprietario: '<script>alert("xss")</script>João Silva',
      endereco: 'Rua das Flores, 123',
      cpf: '123.456.789-00'
    };

    const sanitized = result.current.sanitizeImovelData(data);
    expect(sanitized.proprietario).toBe('João Silva');
    expect(sanitized.endereco).toBe('Rua das Flores, 123');
    expect(sanitized.cpf).toBe('123.456.789-00');
  });

  test('deve validar permissões do usuário', () => {
    const { result } = renderHook(() => useSecurityValidation());

    const user = { id: '123', email: 'test@example.com' };
    const validation = result.current.validateUserPermissions(user, 'create');
    
    expect(validation.allowed).toBe(true);
  });

  test('deve rejeitar usuário não autenticado', () => {
    const { result } = renderHook(() => useSecurityValidation());

    const validation = result.current.validateUserPermissions(null, 'create');
    
    expect(validation.allowed).toBe(false);
    expect(validation.error).toBe('Usuário não autenticado');
  });

  test('deve implementar rate limiting', () => {
    const { result } = renderHook(() => useSecurityValidation());

    // Primeira tentativa deve ser permitida
    const check1 = result.current.checkRateLimit('test_action', 2, 60000);
    expect(check1.allowed).toBe(true);

    // Segunda tentativa deve ser permitida
    const check2 = result.current.checkRateLimit('test_action', 2, 60000);
    expect(check2.allowed).toBe(true);

    // Terceira tentativa deve ser bloqueada
    const check3 = result.current.checkRateLimit('test_action', 2, 60000);
    expect(check3.allowed).toBe(false);
  });
});
