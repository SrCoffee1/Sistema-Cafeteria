let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

const carrinhoContainer = document.getElementById('carrinho');
const totalElement = document.getElementById('total');
const entregaSelect = document.getElementById('entrega');
const pagamentoSelect = document.getElementById('pagamento');
const btnEnviar = document.querySelector('.btn-enviar');


function renderizarCarrinho() {
    carrinhoContainer.innerHTML = '';

    carrinho.forEach((item, index) => {
        const div = document.createElement('div');
        div.classList.add('item-carrinho');

        div.innerHTML = `
            <img src="${item.imagem}" alt="${item.nome}">
            <div class="item-info">
                <h3>${item.nome}</h3>
                <p>R$ ${(item.preco * item.quantidade).toFixed(2)}</p>
                <div class="qtd-controles">
                    <button class="btn-decrementar" data-index="${index}">-</button>
                    <span>${item.quantidade}</span>
                    <button class="btn-incrementar" data-index="${index}">+</button>
                </div>
            </div>
        `;

        carrinhoContainer.appendChild(div);
    });

    atualizarTotal();
}


function atualizarTotal() {
    let total = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

    if (entregaSelect.value === 'entrega') {
        total += 5.00; 
    }

    totalElement.textContent = `R$ ${total.toFixed(2)}`;
}


function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}


carrinhoContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-incrementar')) {
        const index = e.target.dataset.index;
        carrinho[index].quantidade++;
        salvarCarrinho();
        renderizarCarrinho();
    }

    if (e.target.classList.contains('btn-decrementar')) {
        const index = e.target.dataset.index;
        if (carrinho[index].quantidade > 1) {
            carrinho[index].quantidade--;
        } else {
            carrinho.splice(index, 1); 
        }
        salvarCarrinho();
        renderizarCarrinho();
    }
});


entregaSelect.addEventListener('change', atualizarTotal);

btnEnviar.addEventListener('click', () => {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    let mensagem = '🛒 *Pedido Cafeteria Aromas*%0A%0A';

    carrinho.forEach(item => {
        mensagem += `🍽️ ${item.nome} - Quantidade: ${item.quantidade}%0A`;
    });

    mensagem += `%0ATotal: ${totalElement.textContent}`;
    mensagem += `%0AEntrega: ${entregaSelect.options[entregaSelect.selectedIndex].text}`;
    mensagem += `%0APagamento: ${pagamentoSelect.options[pagamentoSelect.selectedIndex].text}`;

    const whatsappUrl = `https://wa.me/991220830?text=${mensagem}`;

    window.open(whatsappUrl, '_blank');
});


renderizarCarrinho();
