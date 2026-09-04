function finalizarPedidio() {
    
    const totalPedido = 53.30; 

    let vendasTotais = Number(localStorage.getItem('vendasTotais')) || 0;
    
    vendasTotais += totalPedido;
    
    localStorage.setItem('vendasTotais', vendasTotais.toFixed(2));

    atualizarVendasTotais();

    alert('Pedido finalizado com sucesso! Total do pedido: R$ ' + totalPedido.toFixed(2));
}


function atualizarVendasTotais() {

    const vendasTotais =  Number(localStorage.getItem('vendasTotais')) || 0;
    
    document.getElementById("vensdas-totais").textContent = 
    vendasTotais.toLocaleString("pt-BR", { 
        style: "currency", 
        currency: "BRL" 
    });
}

document
    .getElementById("btn-finalizar-pedido")
    .addEventListener("click", finalizarPedido);