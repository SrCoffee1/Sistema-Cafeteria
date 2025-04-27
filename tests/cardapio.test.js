// cardapio.test.js

import { addToCart } from '../cardapio.js';

// Mock do alert para não disparar popup durante os testes
global.alert = jest.fn();

// Mock do localStorage
beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

describe('Função addToCart', () => {
  test('Deve adicionar um novo produto ao carrinho se ele não existir', () => {
    const produto = { id: 'cafes-capuccino', nome: 'Capuccino', preco: 10.00, imagem: 'imagem.jpg' };

    addToCart(produto);

    const carrinho = JSON.parse(localStorage.getItem('carrinho'));
    expect(carrinho.length).toBe(1);
    expect(carrinho[0].id).toBe('cafes-capuccino');
    expect(carrinho[0].quantidade).toBe(1);
    expect(alert).toHaveBeenCalledWith('Capuccino adicionado ao carrinho!');
  });

  test('Deve incrementar a quantidade se o produto já existir no carrinho', () => {
    const produto = { id: 'cafes-capuccino', nome: 'Capuccino', preco: 10.00, imagem: 'imagem.jpg' };
    localStorage.setItem('carrinho', JSON.stringify([{ ...produto, quantidade: 1 }]));

    addToCart(produto);

    const carrinho = JSON.parse(localStorage.getItem('carrinho'));
    expect(carrinho.length).toBe(1);
    expect(carrinho[0].quantidade).toBe(2);
  });
});
