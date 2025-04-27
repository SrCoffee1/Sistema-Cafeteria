// cadastroProduto.js
export async function carregarCafes(getDocsMock) {
  // Simulando a consulta aos produtos
  const snapshot = await getDocsMock();
  
  const produtos = {};

  snapshot.forEach((docSnap) => {
    const { nome, preco, imagem, tipo } = docSnap.data();
    const id = docSnap.id;
    const chaveProduto = `${nome}-${tipo}`;

    if (!produtos[chaveProduto]) {
      produtos[chaveProduto] = { nome, preco, imagem, tipo, id, quantidade: 1 };
    } else {
      produtos[chaveProduto].quantidade++;
    }
  });

  return Object.values(produtos); // Retorna os produtos
}

export async function excluirProduto(id, deleteDocMock) {
  // Simulando a exclusão do produto
  await deleteDocMock(id);
}

export async function cadastrarProduto({ nome, preco, imagem, tipo }, addDocMock) {
  // Simulando a adição de um novo produto
  await addDocMock({ nome, preco, imagem, tipo });
}
