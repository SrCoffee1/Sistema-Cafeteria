// cardapio.js

import { db } from './firebase.js';
import { collection, getDocs } from "firebase/firestore";

const container = document.querySelector(".produtos-container");

async function carregarCardapio() {
    try {
        const snapshot = await getDocs(collection(db, "cafes"));
        container.innerHTML = "";

        const produtosAgrupados = {};

        snapshot.forEach((docSnap) => {
            const { nome, preco, imagem, tipo } = docSnap.data();
            const chaveProduto = `${tipo}-${nome}`;

            if (!produtosAgrupados[chaveProduto]) {
                produtosAgrupados[chaveProduto] = { nome, preco, imagem, tipo, quantidade: 1 };
            } else {
                produtosAgrupados[chaveProduto].quantidade++;
            }
        });

        const categorias = {};

        Object.values(produtosAgrupados).forEach(produto => {
            if (!categorias[produto.tipo]) {
                categorias[produto.tipo] = [];
            }
            categorias[produto.tipo].push(produto);
        });

        for (let [tipo, produtos] of Object.entries(categorias)) {
            const tituloCategoria = document.createElement("h2");
            tituloCategoria.classList.add("categoria");
            tituloCategoria.textContent = tipo.charAt(0).toUpperCase() + tipo.slice(1);
            container.appendChild(tituloCategoria);

            produtos.forEach(produto => {
                const { nome, preco, imagem, quantidade } = produto;

                const card = document.createElement("div");
                card.classList.add("card-produto");
                card.dataset.id = `${tipo}-${nome}`;

                card.innerHTML = `
                    <img src="${imagem}" alt="${nome}" onerror="this.src='https://via.placeholder.com/300x200?text=Sem+Imagem'" />
                    <div class="info-produto">
                        <h3>${nome}</h3>
                        <p class="preco">R$ ${parseFloat(preco).toFixed(2)}</p>
                        <div class="quantidade">
                            <span>Disponível:</span> <span class="valor">${quantidade}</span>
                        </div>
                        <button class="btn-comprar"><i class="fas fa-cart-plus"></i> Adicionar ao Pedido</button>
                    </div>
                `;

                container.appendChild(card);
            });
        }

        adicionarEventosCompra();
        
    } catch (error) {
        console.error("Erro ao carregar cardápio:", error);
        container.innerHTML = `<p class="erro-carregamento">Erro ao carregar cardápio. Tente novamente.</p>`;
    }
}

function adicionarEventosCompra() {
    document.querySelectorAll('.btn-comprar').forEach(btn => {
        btn.addEventListener('click', function () {
            const produto = this.closest('.card-produto');
            const nome = produto.querySelector('h3').textContent;
            const preco = parseFloat(produto.querySelector('.preco').textContent.replace('R$ ', '').replace(',', '.'));
            const imagem = produto.querySelector('img').src;
            const id = produto.dataset.id;

            addToCart({ id, nome, preco, imagem });
        });
    });
}

function addToCart(produto) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    const existente = carrinho.find(item => item.id === produto.id);

    if (existente) {
        existente.quantidade += 1;
    } else {
        produto.quantidade = 1;
        carrinho.push(produto);
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    alert(`${produto.nome} adicionado ao carrinho!`);
}

// Aqui exportamos as funções para poder testá-las
export { carregarCardapio, adicionarEventosCompra, addToCart };
