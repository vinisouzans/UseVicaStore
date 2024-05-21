$(function(){

    $(".div-produto").click(function(){       
        var idElementoClicado = this.id;
        var srcImg1 = $(this).find("img").attr("src");
        var srcImg2 = $(this).find("input").attr("value");
        abrirModal(idElementoClicado, srcImg1, srcImg2 )
    });
    atualizarIconeCarrinho()
    function abrirModal(idProduto, img1, img2){
        var idProdutoOculto = document.getElementById("id-Produto");
        idProdutoOculto.value = idProduto

        var idNome = "nome-" + idProduto
        var nomeProdutoElement = document.getElementById(idNome);
        var nomeProdutoTexto = nomeProdutoElement.textContent
        $("#nome-item-modal").text(nomeProdutoTexto)

        var idDesc = "descricao-" + idProduto
        var descrProdElement = document.getElementById(idDesc);
        var descProdutoTexto = descrProdElement.textContent || descrProdElement.innerText;
        $("#descricao-modal").text(descProdutoTexto)

        var idPreco = "preco-" + idProduto
        var precoProdElement = document.getElementById(idPreco);
        var precoProdutoTexto = precoProdElement.textContent || precoProdElement.innerText;
        $("#preco-modal").text(precoProdutoTexto)

        var valorSemSimbolo = precoProdutoTexto.replace("R$", "")
        valorSemSimbolo = valorSemSimbolo.replace(",", ".")
        var numero = parseFloat(valorSemSimbolo)
        numero = numero / 10
        numero = numero.toFixed(2);
        var fraseParcela = "ou em 10x de " + numero + " no Cartão de Crédito"
        fraseParcela = fraseParcela.replace(".", ",")
        $("#frase-parcela").text(fraseParcela)

        var img1Element = document.getElementById('img-1');
        img1Element.src = img1;

        var img2Element = document.getElementById('img-2');
        img2Element.src = img2;

        $("#myModal").show()
    }

    $(document).ready(function(){
        $("#btnFecharModal").click(function(){
            $("#myModal").hide()            
        });
    });

    // Selecionar o tamanho da roupa
    $(".tamanho").click(function(){       
        var tamanhoSelecionado = $(this).data('tamanho');
        selecionarTamanho(tamanhoSelecionado)
    });

    function selecionarTamanho(tamanho) {
    var opcoes = document.getElementsByClassName('tamanho');
    for (var i = 0; i < opcoes.length; i++) {
        opcoes[i].classList.remove('selecionado');
    }
    var elementoSelecionado = document.querySelector('.tamanho[data-tamanho="' + tamanho + '"]');
    elementoSelecionado.classList.add('selecionado');
    }

    $("#btn-adicionar").click(function(){
        // Obtém o nome do produto
        var nomeProduto = document.getElementById('nome-item-modal').innerText;
        var precoProduto = document.getElementById('preco-modal').innerText;
        precoProduto = precoProduto.replace("R$","")

        // Define o nome do produto na sessão de armazenamento local
        localStorage.setItem('nomeProdutoEscolhido', nomeProduto);
        localStorage.setItem('precoProdutoEscolhido', precoProduto);

        var textarea = document.getElementById('obs-produto');
        var textoDigitado = textarea.value;
        localStorage.setItem('obsProdutoEscolhido', textoDigitado);

        localStorage.setItem('qtdProdutoEscolhido', "1"); 
        
        var foto = document.getElementById('img-1')
        var srcFoto = foto.src;
        srcFoto = srcFoto.replace("file:///C:/Users/vini_/Documents/Estudos/ModaFitnes/","")
        localStorage.setItem('srcFotoProdutoEscolhido', srcFoto); 
        

        var tamanhoSelecionado = obterTamanhoSelecionado();
        if (tamanhoSelecionado !== null) {
            localStorage.setItem('tamanhoProdutoEscolhido', tamanhoSelecionado);
            var mensagem = document.getElementById('msg-tamanho-selecionar');
            mensagem.style.visibility = 'hidden';

            var idProdutoOculto = document.getElementById('id-Produto')
            // Cria um objeto para o produto
            var produto = {
                id: idProdutoOculto.value,
                nome: nomeProduto,
                preco: precoProduto,
                observacoes: textoDigitado,
                quantidade: "1",
                srcFoto: srcFoto,
                tamanho: tamanhoSelecionado
            };

            var produtos = [];
            // Recupera o array de produtos do localStorage
            if (localStorage.getItem('produtos') !== null){
                produtos = JSON.parse(localStorage.getItem('produtos')) || [];
            }             

            // Adiciona o novo produto ao array
            produtos.push(produto);

            // Salva o array atualizado de volta no localStorage
            localStorage.setItem('produtos', JSON.stringify(produtos));            
            $("#myModal").hide()
            showSuccessBalloon()   
            
            var qtdCar = "0"
            if (localStorage.getItem('qtdTotalPecas') !== null){
                qtdCar = localStorage.getItem('qtdTotalPecas')
            }
            
            var qtdCarInt = parseInt(qtdCar)
            qtdCarInt = qtdCarInt + 1
            localStorage.setItem('qtdTotalPecas', qtdCarInt)
            atualizarIconeCarrinho()
            
        } else {
            var mensagem = document.getElementById('msg-tamanho-selecionar');
            mensagem.style.visibility = 'visible';
        }       
        
    });

    function obterTamanhoSelecionado() {
        // Obtém todos os elementos com a classe "tamanho"
        var opcoesTamanho = document.querySelectorAll('#opcoesTamanho .tamanho');

        // Itera sobre cada elemento
        for (var i = 0; i < opcoesTamanho.length; i++) {
            // Verifica se o elemento atual tem a classe "selecionado"
            if (opcoesTamanho[i].classList.contains('selecionado')) {
                // Retorna o valor do atributo data-tamanho do elemento
                return opcoesTamanho[i].getAttribute('data-tamanho');
            }
        }
        
        // Se nenhum tamanho estiver selecionado, retorna null ou outra indicação de sua escolha
        return null;
    }

    function showSuccessBalloon() {
        var balloon = document.getElementById('successBalloon');
        balloon.style.display = 'block';
        setTimeout(function() {
            balloon.style.display = 'none';
        }, 2000); // 2000 ms = 2 segundos
    }

    function atualizarIconeCarrinho(){
        var qtdCarrinho = 0
        if (localStorage.getItem('qtdTotalPecas') !== null){
            qtdCarrinho = localStorage.getItem('qtdTotalPecas');
        }
        
        if (qtdCarrinho > 0){
            var spanQtdcar = document.getElementById('cartCount');
            spanQtdcar.removeAttribute('hidden')

            var pQtdeCar = document.getElementById('qtdCarrinhoIcone')
            pQtdeCar.innerText = qtdCarrinho
        } else {
            var spanQtdcar = document.getElementById('cartCount');
            spanQtdcar.setAttribute('hidden', 'hidden')
        }
    }

    //
    // Inicio do código do carrinho 
    //

    $(document).ready(function(){
        $("#btnFecharModal").click(function(){
            $("#myModal").hide()
        });
    });

    $(document).ready(function(){
        $("#btnFecharModalEndereco").click(function(){
            $("#modalEndereco").hide()
        });
    });

    $(document).ready(function(){
        $("#btnFecharModalPagamento").click(function(){
            $("#modalFormaPagamento").hide()
        });
    });


    function preencherProdutoSelecionado(){

        var nomeProd = document.getElementById('nome-prod-sel');
        nomeProd.innerText = localStorage.getItem('nomeProdutoEscolhido')
        
        var qtdProd  = document.getElementById('qtd-prod-sel');  
        qtdProd.innerText = localStorage.getItem('qtdProdutoEscolhido');

        var tamanhoProd = document.getElementById('tamanho-prod-sel');
        tamanhoProd.innerText = localStorage.getItem('tamanhoProdutoEscolhido');

        var obsProd = document.getElementById('obs-prod-sel');
        obsProd.innerText = localStorage.getItem('obsProdutoEscolhido');

        var foto = document.getElementById('foto-prod-sel');
        foto.src = localStorage.getItem('srcFotoProdutoEscolhido')

        var preco = document.getElementById('preco-prod-sel'); //preco-prod-sel
        preco.innerText = localStorage.getItem('precoProdutoEscolhido')

    }

    if (window.location.pathname.includes('/carrinho.html')) {
        percorrerArrayProdutosSel()

        // Seleciona o input pelo ID
        var inputNumero = document.getElementById('numero-cep');

        // Adiciona um event listener para o evento 'input'
        inputNumero.addEventListener('input', function(event) {
            // Obtém o valor atual do input
            var valor = event.target.value;

            // Remove todos os caracteres não numéricos do valor
            var numeros = valor.replace(/\D/g, '');

            // Formata o valor com a máscara "99999-999"
            var valorFormatado = '';
            for (var i = 0; i < numeros.length; i++) {
                valorFormatado += numeros[i];
                if (i === 4) {
                    valorFormatado += '-';
                }
            }

            // Atualiza o valor do input com a máscara aplicada
            event.target.value = valorFormatado;
        });

        // Seleciona o input pelo ID
        var telefoneInput = document.getElementById('telefoneInput');

        // Adiciona um event listener para o evento 'input'
        telefoneInput.addEventListener('input', function(event) {
            // Obtém o valor atual do input
            var valor = event.target.value;

            // Remove todos os caracteres não numéricos do valor
            var numeros = valor.replace(/\D/g, '');

            // Formata o valor com a máscara "(99) 99999-9999"
            var valorFormatado = '(' + numeros.slice(0, 2) + ') ' + numeros.slice(2, 7) + '-' + numeros.slice(7, 11);

            // Atualiza o valor do input com a máscara aplicada
            event.target.value = valorFormatado;
        });

        // Obtendo o elemento <a> pelo seu ID
        var linkWhatsapp = document.getElementById("link-whatsapp");

        // Adicionando um evento de clique ao elemento <a>
        linkWhatsapp.addEventListener("click", function(event) {
            // Evitando que o link seja seguido
            event.preventDefault();

            // Obtendo o texto dinâmico do JavaScript
            var texto = montarTextoEnviar();

            // Concatenando o texto dinâmico ao URL do WhatsApp
            var url = "https://api.whatsapp.com/send?phone=5518997732200&text=" + encodeURIComponent(texto);

            limparProdutosCarrinho()
            // Redirecionando para o URL do WhatsApp
            window.open(url, '_blank');
            //window.location.href = url;
        });

        // Função para formatar o número do telefone
        function formatarTelefone(telefone) {
            telefone = telefone.replace(/\D/g, ''); // Remove caracteres não numéricos
            telefone = telefone.replace(/^(\d{2})(\d)/g, '($1) $2'); // Coloca parênteses em volta dos dois primeiros dígitos
            telefone = telefone.replace(/(\d)(\d{4})$/, '$1-$2'); // Coloca hífen entre o quinto e o sexto dígitos
            return telefone;
        }

        // Seleciona o elemento de input
        var inputTelefone = document.getElementById('telefoneInput');

        // Adiciona um ouvinte de evento de entrada para formatar o número conforme o usuário digita
        inputTelefone.addEventListener('input', function() {
            inputTelefone.value = formatarTelefone(inputTelefone.value);
        });

    }
   
    function percorrerArrayProdutosSel() {
        // Recupera o array de produtos do localStorage
        if (localStorage.getItem('produtos') !== null){        
            var produtos = JSON.parse(localStorage.getItem('produtos')) || [];

            var texto = ""
            var qtdTotalPecas = 0
            var valorTotal = 0.00

            // Percorre o array de produtos
            for (var i = 0; i < produtos.length; i++) {
                var idProd = produtos[i].id
                var nomeProd = produtos[i].nome
                var qtdProd =  produtos[i].quantidade
                var tamanhoProd = produtos[i].tamanho
                var precoProd = produtos[i].preco
                var obsProd = produtos[i].observacoes
                var srcFoto = produtos[i].srcFoto

                plotarNaTela(idProd, nomeProd, qtdProd, tamanhoProd, obsProd, precoProd, srcFoto)

                texto = texto + "---------------\n"
                texto = texto + "*Produto:* " + nomeProd + "\n"
                texto = texto + "*Tamanho:* " + tamanhoProd + "\n"
                texto = texto + "*Quantidade:* " + qtdProd + "\n"
                texto = texto + "*Observação:* " + obsProd + "\n"
                texto = texto + "*Preço:* R$" + precoProd + "\n"

                qtdTotalPecas = qtdTotalPecas +  parseInt(qtdProd)

                precoProd =  precoProd.replace("R$", "")
                precoProd =  precoProd.replace(",", ".")
                var precoNumber = parseFloat(precoProd)
                valorTotal = valorTotal + precoNumber            
            }        

            localStorage.setItem('textoProdutosCarrinho', texto);
            localStorage.setItem('qtdTotalPecas', qtdTotalPecas);
            localStorage.setItem('valorTotal', valorTotal.toFixed(2));

            adicionarValorTotalTela()
            adicionarTotalPecasTela()
            montarTextoEnviar()
            verificarDadosCliente()
            verificarDadosPagamento()
            verificaHabilitarBtnWhats()
            atualizarIconeCarrinho()
        }
    }

    function adicionarValorTotalTela(){
        var valorTotal = document.getElementById('valor-total');
        var valor = "0"
        if (localStorage.getItem('valorTotal') !== null){
            valor = localStorage.getItem('valorTotal').replace("R$", "")
        }
        var totalFloat = parseFloat(valor)
        totalFloat = totalFloat.toFixed(2)
        var valorTotalFormatado = totalFloat.replace(".", ",")
        valorTotal.innerText = "R$ " + valorTotalFormatado
    }

    function adicionarTotalPecasTela(){
        var qtdTotalPecas = document.getElementById('qtd-total-pecas');        
        if(localStorage.getItem('qtdTotalPecas') !== null){
            qtdTotalPecas.innerText = localStorage.getItem('qtdTotalPecas')
        }
    }


    function plotarNaTela(idProduto, nomeProd, quantidade, tamanho, obs, preco, foto){
        // Quantidade de elementos a serem adicionados
        var quantidadeElementos = 5;

        // Seleciona o elemento pai onde os novos elementos serão adicionados
        var listaProdCarrinho = document.getElementById("lista-prod-carrinho");

        // Loop para adicionar os novos elementos
        
        // Cria um novo elemento div
        var novoElementoDiv = document.createElement("div"); //esse envolve todos
        
        // Define o ID para o novo elemento div
        novoElementoDiv.id = idProduto
        novoElementoDiv.className = "container";
        novoElementoDiv.style.marginLeft = "0";
        novoElementoDiv.style.marginRight = "0";
        novoElementoDiv.style.maxWidth = "100%";
        novoElementoDiv.style.paddingRight = "15px";

        var div2 = document.createElement("div"); //abaixo da q envolve todos
        div2.className = "row span_12 componente-produto"
        div2.style.margin = "1em"

        var div3 = document.createElement("div")
        div3.className = "col span_1"
        div3.style.maxWidth = "21em"

        var img = document.createElement("img");
        img.id = "foto-prod-sel"
        img.src = foto
        img.style.maxWidth = "21em"

        div3.appendChild(img)

        div2.appendChild(div3)

        var div4 = document.createElement("div");
        div4.className = "col span_10"
        div4.style.paddingRight = "0"

        var div5 = document.createElement("div");
        div5.className = "col span_12"
        div5.style.paddingRight = "0"
        div5.style.paddingLeft = "0"

        var bNomeProduto = document.createElement("b");
        bNomeProduto.id = "nome-prod-sel"
        bNomeProduto.style.color = "#df1e33"
        bNomeProduto.style.fontSize = "30px"
        bNomeProduto.innerText = nomeProd

        div5.appendChild(bNomeProduto)
        div4.appendChild(div5)

        var div6 = document.createElement("div");
        div6.className = "col span_12"
        div6.style.paddingRight = "0"
        div6.style.paddingLeft = "0"
        div6.style.marginTop = "15px"

        var bQuantidade = document.createElement("b");
        bQuantidade.style.fontSize = "27px"
        bQuantidade.style.display = "inline-block"
        bQuantidade.innerText = "Quantidade: "

        var pQuantidade = document.createElement("p");
        pQuantidade.id = "qtd-prod-sel"
        pQuantidade.style.textDecoration = "none"
        pQuantidade.style.fontSize = "27px"
        pQuantidade.style.display = "inline-block"
        pQuantidade.style.marginLeft = "5px"
        pQuantidade.innerText = quantidade

        div6.appendChild(bQuantidade)
        div6.appendChild(pQuantidade)
        div4.appendChild(div6)


        var div7 = document.createElement("div");
        div7.className = "col span_12"
        div7.style.paddingRight = "0"
        div7.style.paddingLeft = "0"

        var bTamanho = document.createElement("b");
        bTamanho.style.fontSize = "27px"
        bTamanho.style.display = "inline-block"
        bTamanho.innerText = "Tamanho: "

        var pTamanho = document.createElement("p");
        pTamanho.id = "tamanho-prod-sel"
        pTamanho.style.textDecoration = "none"
        pTamanho.style.fontSize = "27px"
        pTamanho.style.display = "inline-block"
        pTamanho.style.marginLeft = "5px"
        pTamanho.innerText = tamanho

        div7.appendChild(bTamanho)
        div7.appendChild(pTamanho)
        div4.appendChild(div7)

        var div8 = document.createElement("div");
        div8.className = "col span_12"
        div8.style.paddingRight = "0"
        div8.style.paddingLeft = "0"

        var bObs = document.createElement("b");
        bObs.style.fontSize = "27px"
        bObs.style.display = "inline-block"
        bObs.innerText = "Observação: "

        var pObs = document.createElement("p");
        pObs.id = "obs-prod-sel"
        pObs.style.textDecoration = "none"
        pObs.style.fontSize = "27px"
        pObs.style.display = "inline-block"
        pObs.style.marginLeft = "5px"
        pObs.innerText = obs

        div8.appendChild(bObs)
        div8.appendChild(pObs)
        div4.appendChild(div8)

        var div9 = document.createElement("div");
        div9.className = "col-md-auto ms-auto"
        div9.style.backgroundColor = "#df1e33"
        div9.style.maxWidth = "15em"
        div9.style.borderRadius = "5px"

        var bPreco = document.createElement("b");
        bPreco.className = "fs-6"
        bPreco.style.fontSize = "25px"
        bPreco.style.color = "white"
        bPreco.innerText = "Preço: "

        var pPreco = document.createElement("p");
        pPreco.id = "obs-prod-sel"
        pPreco.style.textDecoration = "none"
        pPreco.style.fontSize = "27px"
        pPreco.style.display = "inline-block"
        pPreco.style.marginLeft = "5px"
        pPreco.style.color = "white"
        pPreco.innerText = "R$ " + preco

        div9.appendChild(bPreco)
        div9.appendChild(pPreco)
        div4.appendChild(div9)

        div2.appendChild(div4)


        var div10 = document.createElement("div");
        div10.className = "col span_1"
        div10.style.maxWidth = "8em"

        var imgExcluir = document.createElement("img");
        imgExcluir.src = "img/excluir.png"
        imgExcluir.className = "img-fluid"
        imgExcluir.style.marginTop = "160%"
        imgExcluir.style.height = "60px"
        imgExcluir.style.width = "60px"
        imgExcluir.setAttribute("data-value", idProduto)
        imgExcluir.onclick = function() {
            excluirItemCarrinho(imgExcluir.getAttribute("data-value"));
            atualizarIconeCarrinho()
        };

        div10.appendChild(imgExcluir)
        div2.appendChild(div10)


        novoElementoDiv.appendChild(div2)


        // Conteúdo interno do novo elemento div (o conteúdo que você quer adicionar)

        // Adiciona o novo elemento como filho do elemento pai
        listaProdCarrinho.appendChild(novoElementoDiv);                
        
    }
    


    // Função para formatar o número do telefone
    function formatarTelefone(telefone) {
        telefone = telefone.replace(/\D/g, ''); // Remove caracteres não numéricos
        telefone = telefone.replace(/^(\d{2})(\d)/g, '($1) $2'); // Coloca parênteses em volta dos dois primeiros dígitos
        telefone = telefone.replace(/(\d)(\d{4})$/, '$1-$2'); // Coloca hífen entre o quinto e o sexto dígitos
        return telefone;
    }


    //imgModalEndereco
    $("#imgModalEndereco").click(function(){  
        verificaDadosEnderecoPreenche() 
        $("#modalEndereco").show()
    });

    function verificaDadosEnderecoPreenche(){
        if (localStorage.getItem('nomeCliente') !== null){
            if (localStorage.getItem('nomeCliente').length !== 0){
                var nomeCli = document.getElementById("inpt-nome")
                nomeCli.value = localStorage.getItem('nomeCliente')
            }
        }

        if (localStorage.getItem('sobrenomeCliente') !== null){
            if (localStorage.getItem('sobrenomeCliente').length !== 0){
                var sobreNomeCli = document.getElementById("inpt-sobrenome")
                sobreNomeCli.value = localStorage.getItem('sobrenomeCliente')
            }
        }
                
        if (localStorage.getItem('whatsCliente') !== null){
            if (localStorage.getItem('whatsCliente').length !== 0){
                var wahtsCli = document.getElementById("telefoneInput")
                wahtsCli.value = localStorage.getItem('whatsCliente')
            }
        }
        
        if (localStorage.getItem('ruaCliente') !== null){
            if (localStorage.getItem('ruaCliente').length !== 0 ){
                var ruaCli = document.getElementById("inpt-rua")
                ruaCli.value = localStorage.getItem('ruaCliente')
            }
        }  

        if (localStorage.getItem('numeroCliente') !== null){
            if (localStorage.getItem('numeroCliente').length !== 0 ){
                var numeroCli = document.getElementById("inpt-numero")
                numeroCli.value = localStorage.getItem('numeroCliente')
            }
        }
        
        if (localStorage.getItem('cepCliente') !== null){
            if (localStorage.getItem('cepCliente').length !== 0 ){
                var cepCli = document.getElementById("numero-cep")
                cepCli.value = localStorage.getItem('cepCliente')
            }
        }
        
        
    }

    $("#imgModalPagamento").click(function(){   
        $("#modalFormaPagamento").show()
    });

    $("#btnConfirmarModalEndereco").click(function(){   
        adicionarEndereco()
    });
    function adicionarEndereco(){
        var nomeInput = document.getElementById('inpt-nome');
        var valorNome = nomeInput.value;

        if (valorNome.length > 0) {
            var msgNome = document.getElementById('msg-nome');
            msgNome.style.visibility = 'hidden';
            localStorage.setItem('nomeCliente', valorNome);  
        } else {
            var msgNome = document.getElementById('msg-nome');
            msgNome.style.visibility = 'visible';
        }

        var sobrenomeInput =  document.getElementById('inpt-sobrenome');
        var valorSobrenome = sobrenomeInput.value;
        localStorage.setItem('sobrenomeCliente', valorSobrenome); 


        var whatsInput = document.getElementById('telefoneInput');
        var valorWhats = whatsInput.value;

        if (valorWhats.length > 14){
            var msgWhats = document.getElementById('msg-whats');
            msgWhats.style.visibility = 'hidden';
            localStorage.setItem('whatsCliente', valorWhats);
        } else {
            var msgWhats = document.getElementById('msg-whats');
            msgWhats.style.visibility = 'visible';
        }


        var ruaInput = document.getElementById('inpt-rua');
        var valorRua = ruaInput.value;
        if (valorRua.length > 0){
            var msgRua = document.getElementById('msg-rua');
            msgRua.style.visibility = 'hidden';
            localStorage.setItem('ruaCliente', valorRua);
        } else {
            var msgRua = document.getElementById('msg-rua');
            msgRua.style.visibility = 'visible';
        }

        var numeroInput = document.getElementById('inpt-numero');
        var valorNumero = numeroInput.value;

        if (valorNumero.length > 0){
            var msgNumero = document.getElementById('msg-numero');
            msgNumero.style.visibility = 'hidden';
            localStorage.setItem('numeroCliente', valorNumero);
            $("#modalEndereco").hide()
        } else {
            var msgNumero = document.getElementById('msg-numero');
            msgNumero.style.visibility = 'visible';
        }

        var cepInput = document.getElementById('numero-cep');
        var valorCep = cepInput.value;
        localStorage.setItem('cepCliente', valorCep);
        plotarDadosEntrega()
        verificaHabilitarBtnWhats()
    }

    function plotarDadosEntrega(){
        var rua = document.getElementById('nome-rua');
        if (localStorage.getItem('ruaCliente') !== null){
            rua.innerText = localStorage.getItem('ruaCliente') + ", N° "
        }
        
        var numero = document.getElementById('numero'); 
        if(localStorage.getItem('numeroCliente') !== null){
            numero.innerText = localStorage.getItem('numeroCliente') + ", CEP "
        }        

        var cep = document.getElementById('cep'); 
        if (localStorage.getItem('cepCliente') !== null){
            cep.innerText = localStorage.getItem('cepCliente')
        }        
    }

    function plotarDadosPagemento(){
        var formaPagamento = document.getElementById('pagamento');
        if (localStorage.getItem('formaPagamento') !== null){
            formaPagamento.innerText = localStorage.getItem('formaPagamento')            
        }        
    }

    
    //Waldir Terence, N° 611, CEP 16201-237
    function verificarDadosCliente(){
        var faltaDados = 0

        if (localStorage.getItem('nomeCliente') !== null){
            if (localStorage.getItem('nomeCliente').length = 0){
                faltaDados = faltaDados + 1 
            }
        }
        
        if (localStorage.getItem('whatsCliente') !== null){
            if (localStorage.getItem('whatsCliente').length = 0){
                faltaDados = faltaDados + 1 
            }
        }
        
        if (localStorage.getItem('ruaCliente') !== null){
            if (localStorage.getItem('ruaCliente').length = 0 ){
                faltaDados = faltaDados + 1 
            }
        }  

        if (localStorage.getItem('numeroCliente') !== null){
            if (localStorage.getItem('numeroCliente').length = 0 ){
                faltaDados = faltaDados + 1 
            }
        }
        
        if (localStorage.getItem('cepCliente') !== null){
            if (localStorage.getItem('cepCliente').length = 0 ){
                faltaDados = faltaDados + 1 
            }
        }
        
        if (faltaDados == 0){
            plotarDadosEntrega()
        }

    }

    function verificarDadosPagamento(){
        var faltaDados = 0
        if(localStorage.getItem('formaPagamento') !== null){
            if (localStorage.getItem('formaPagamento').length = 0 ){
                faltaDados = faltaDados + 1 
            }
        }
        
        if (faltaDados == 0){
            plotarDadosPagemento()            
        }

        verificaHabilitarBtnWhats()
        
    }

    function verificaHabilitarBtnWhats(){

        var faltaDados = 0
        
        if (localStorage.getItem('nomeCliente') == null){
            faltaDados = faltaDados + 1 
        }else if (localStorage.getItem('nomeCliente').length == 0 ){
            faltaDados = faltaDados + 1 
        }   

        if (localStorage.getItem('whatsCliente') == null){
            faltaDados = faltaDados + 1 
        } else if (localStorage.getItem('whatsCliente').length == 0){
            faltaDados = faltaDados + 1 
        }    

        if (localStorage.getItem('ruaCliente') == null){
            faltaDados = faltaDados + 1 
        } else if (localStorage.getItem('ruaCliente').length == 0){
            faltaDados = faltaDados + 1 
        }
        
        if (localStorage.getItem('numeroCliente') == null){
            faltaDados = faltaDados + 1 
        } else if (localStorage.getItem('numeroCliente').length == 0){
            faltaDados = faltaDados + 1 
        }
        
        if (localStorage.getItem('cepCliente') == null){
            faltaDados = faltaDados + 1 
        } else if (localStorage.getItem('cepCliente').length == 0){
            faltaDados = faltaDados + 1 
        }

        if (localStorage.getItem('formaPagamento') == null){
            faltaDados = faltaDados + 1 
        } else if (localStorage.getItem('formaPagamento').length == 0){
            faltaDados = faltaDados + 1 
        }     

        var produtos = []
        if (localStorage.getItem('produtos') !== null){
            produtos = JSON.parse(localStorage.getItem('produtos')) || [];
        }
        if (produtos.length == 0){
            faltaDados = faltaDados + 1 
        }
        
        if (faltaDados == 0){
            var botao = document.getElementById('btn-whats');
            // Remove o atributo 'disabled'
            botao.removeAttribute('disabled');
            document.getElementById('link-whatsapp').style.pointerEvents = 'auto';            
        } else {
            var botao = document.getElementById('btn-whats');
            // Adiciona o atributo 'disabled'
            botao.setAttribute('disabled', 'disabled');
            document.getElementById('link-whatsapp').style.pointerEvents = 'none';
        }        
        
    }

    function limparProdutosCarrinho(){
        var produtos

        if (localStorage.getItem('produtos') !== null){
            produtos = JSON.parse(localStorage.getItem('produtos')) || [];
        }

        // Remove todos os itens do array mantendo a referência
        produtos.splice(0, produtos.length);

        // Atualiza o localStorage com o array vazio
        localStorage.setItem('produtos', JSON.stringify(produtos));
    }  

    // Seleciona o formulário pelo ID
    var formulario = document.querySelector('form');

    //btnConfirmarFormaPagt

    $("#btnConfirmarFormaPagt").click(function(){   
        obterOpcaoSelecionada()
        verificaHabilitarBtnWhats()
    });
    // Função para percorrer os elementos de entrada e obter o valor selecionado
    function obterOpcaoSelecionada() {
        // Obtém todos os elementos de entrada dentro do formulário
        var elementosInput = formulario.elements;

        // Itera sobre os elementos de entrada
        for (var i = 0; i < elementosInput.length; i++) {
            var elemento = elementosInput[i];

            // Verifica se o elemento é um input do tipo radio e se está selecionado
            if (elemento.type === 'radio' && elemento.checked) {
                // Retorna o valor do input selecionado
                var formaPagamento = document.getElementById('pagamento');
                formaPagamento.innerText = elemento.value
                localStorage.setItem('formaPagamento', elemento.value);
                $("#modalFormaPagamento").hide()
            }
        }
    }

    function montarTextoEnviar() {
        var textoProdutoCarrinho = ""
        if (localStorage.getItem('textoProdutosCarrinho') !== null){
            textoProdutoCarrinho = localStorage.getItem('textoProdutosCarrinho')
        }

        var valorTotalFormatado
        if (localStorage.getItem('valorTotal')){
            valorTotalFormatado = localStorage.getItem('valorTotal').replace(".", ",")
        }

        var qtdTotalPecas =""
        if (localStorage.getItem('qtdTotalPecas') !== null){
            qtdTotalPecas = localStorage.getItem('qtdTotalPecas')
        }

        var formaPagamento = ""
        if (localStorage.getItem('formaPagamento') !== null){
            formaPagamento = localStorage.getItem('formaPagamento')
        }

        var nomeCliente = ""
        if (localStorage.getItem('nomeCliente') !== null){
            nomeCliente = localStorage.getItem('nomeCliente')
        }

        var whatsCliente = ""
        if (localStorage.getItem('whatsCliente') !== null){
            whatsCliente = localStorage.getItem('whatsCliente')
        }

        var ruaClinte = ""
        if (localStorage.getItem('ruaCliente') !== null){
            ruaClinte = localStorage.getItem('ruaCliente')
        }

        var numeroCliente = ""
        if (localStorage.getItem('numeroCliente') !== null){
            numeroCliente = localStorage.getItem('numeroCliente')
        }

        var cepCliente = ""
        if (localStorage.getItem('cepCliente') !== null){
            cepCliente = localStorage.getItem('cepCliente')
        }

        var texto = ""
        texto = "*Meu Pedido* \n \n"
        texto = texto + textoProdutoCarrinho + "\n"
        texto = texto + "----------------\n"
        texto = texto + "*Total de peças:* " + qtdTotalPecas + "\n"
        texto = texto + "*Valor Total:* R$ " + valorTotalFormatado + "\n"
        texto = texto + "*Forma de Pagamento:* " + formaPagamento + "\n \n"
        texto = texto + "*Nome:* " + nomeCliente + "\n"
        texto = texto + "*Celular:* " + whatsCliente + "\n"
        texto = texto + "*Endereço:* " + ruaClinte
        texto = texto + ", *N°* " + numeroCliente
        texto = texto + ", *CEP* " + cepCliente + "\n"
        return texto
    }

    function excluirItemCarrinho(idProdutodataValue){
        percorreProdutosCarrinhoExclui(idProdutodataValue)

        // Recarrega a página atual
        location.reload();

    }

    function percorreProdutosCarrinhoExclui(idProdutoExcluir){
        if (localStorage.getItem('produtos') !== null){

            var produtos = JSON.parse(localStorage.getItem('produtos')) || [];
            // Percorre o array de produtos
            for (var i = 0; i < produtos.length; i++) {

                if (produtos[i].id == idProdutoExcluir){
                    produtos.splice(i, 1);
                    // Saí do loop pois o item foi encontrado e removido
                    break;
                }

            }

            // Atualiza o localStorage com o novo array de produtos
            localStorage.setItem('produtos', JSON.stringify(produtos));
            atualizarIconeCarrinho()
        }        
    }


});