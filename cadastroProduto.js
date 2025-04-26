import { db } from './firebase.js';
import { collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const container = document.querySelector(".produtos-container");


export async function carregarCafes() {
  const snapshot = await getDocs(collection(db, "cafes"));
  container.innerHTML = "";

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

  for (let produto of Object.values(produtos)) {
    const { nome, preco, imagem, tipo, id, quantidade } = produto;

    const card = document.createElement("div");
    card.classList.add("card-produto");
    card.setAttribute("data-id", id);

    card.innerHTML = `
      <img src="${imagem}" alt="${nome}" />
      <div class="info-produto">
        <h3>${nome}</h3>
        <p class="preco">R$ ${parseFloat(preco).toFixed(2)}</p>
        <div class="quantidade">
          <span class="qtd">Quantidade:</span>
          <span class="valor qtd">${quantidade}</span>
        </div>
        <button class="btn-excluir" data-id="${id}">
          <i class="fas fa-trash"></i> Excluir
        </button>
      </div>
    `;

    container.appendChild(card);
  }

  adicionarEventosExcluir();
}


function adicionarEventosExcluir() {
  const botoesExcluir = document.querySelectorAll(".btn-excluir");

  botoesExcluir.forEach(botao => {
    botao.addEventListener("click", async () => {
      const id = botao.getAttribute("data-id");

      try {
        await deleteDoc(doc(db, "cafes", id));
        carregarCafes();
      } catch (error) {
        console.error("Erro ao excluir item:", error);
      }
    });
  });
}


function configurarCadastro() {
  const btnCadastrarCafe = document.getElementById("btnCadastrarCafe");
  const modalCadastro = document.getElementById("modalCadastroCafe");
  const fecharModal = document.getElementById("fecharCadastroCafe");
  const form = document.getElementById("formCadastroCafe");

  if (!btnCadastrarCafe || !modalCadastro || !fecharModal || !form) {
    console.error("Elementos de cadastro não encontrados.");
    return;
  }

  btnCadastrarCafe.addEventListener("click", () => modalCadastro.style.display = "block");
  fecharModal.addEventListener("click", () => modalCadastro.style.display = "none");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nomeCafe").value;
    const preco = document.getElementById("precoCafe").value;
    const imagem = document.getElementById("imagemCafe").value;
    const tipo = document.getElementById("tipoProduto").value;

    try {
      await addDoc(collection(db, "cafes"), { nome, preco, imagem, tipo });
      modalCadastro.style.display = "none";
      form.reset();
      carregarCafes();
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
    }
  });
}


function configurarEstoque() {
  const btnEstoque = document.getElementById("btnEstoque");
  const modalEstoque = document.getElementById("modalEstoque");
  const fecharEstoque = document.getElementById("fecharEstoque");
  const listaEstoque = document.getElementById("listaEstoque");

  if (!btnEstoque || !modalEstoque || !fecharEstoque || !listaEstoque) {
    console.error("Elementos de estoque não encontrados.");
    return;
  }

  btnEstoque.addEventListener("click", async () => {
    modalEstoque.style.display = "block";
    await carregarEstoque();
  });

  fecharEstoque.addEventListener("click", () => {
    modalEstoque.style.display = "none";
  });

  async function carregarEstoque() {
    const snapshot = await getDocs(collection(db, "cafes"));
    const contagem = {};

    snapshot.forEach((docSnap) => {
      const { tipo, quantidade = 1 } = docSnap.data();
      if (tipo) {
        contagem[tipo] = (contagem[tipo] || 0) + quantidade;
      }
    });

    listaEstoque.innerHTML = "";

    for (let tipo in contagem) {
      const li = document.createElement("li");
      li.textContent = `${tipo.charAt(0).toUpperCase() + tipo.slice(1)}: ${contagem[tipo]} item(ns)`;
      listaEstoque.appendChild(li);
    }
  }
}


document.addEventListener("DOMContentLoaded", () => {
  carregarCafes();
  configurarCadastro();
  configurarEstoque();
});
