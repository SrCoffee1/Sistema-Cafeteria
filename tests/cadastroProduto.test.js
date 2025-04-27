import { carregarCafes, excluirProduto, cadastrarProduto } from '../cadastroProduto.js';

// Mock das funções do Firebase
const getDocsMock = jest.fn();
const addDocMock = jest.fn();
const deleteDocMock = jest.fn();

describe('Testes de Cadastro de Produtos', () => {

  beforeEach(() => {
    // Limpar os mocks antes de cada teste
    jest.clearAllMocks();
  });

  test('carregarCafes deve retornar uma lista de produtos', async () => {
    // Mock do Firestore
    getDocsMock.mockResolvedValue({
      forEach: jest.fn((callback) => {
        callback({
          id: '1',
          data: () => ({ nome: 'Café Expresso', preco: '5.00', imagem: '', tipo: 'expresso' })
        });
      })
    });

    const produtos = await carregarCafes(getDocsMock);
    expect(produtos).toHaveLength(1); // Espera que tenha 1 produto
    expect(produtos[0]).toHaveProperty('nome', 'Café Expresso');
  });

  test('excluirProduto deve chamar deleteDoc com o id correto', async () => {
    const produtoId = '1';
    
    await excluirProduto(produtoId, deleteDocMock);

    expect(deleteDocMock).toHaveBeenCalledWith(produtoId); // Verifica se a função foi chamada com o id correto
  });

  test('cadastrarProduto deve chamar addDoc com os dados corretos', async () => {
    const novoProduto = {
      nome: 'Café Americano',
      preco: '4.50',
      imagem: 'imagem.jpg',
      tipo: 'americano'
    };
    
    await cadastrarProduto(novoProduto, addDocMock);

    expect(addDocMock).toHaveBeenCalledWith(novoProduto); // Verifica se a função foi chamada com os dados corretos
  });

});
