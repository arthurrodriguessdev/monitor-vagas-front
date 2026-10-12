import { injectSidebar } from "./utilities/sidebar.js"

let paginaAtual = 1
let todasVagas = []
const quantidadeVagasPagina = 5
let btnAnterior, btnProxima

document.addEventListener("DOMContentLoaded", ()=>{
    injectSidebar()
    document.querySelector("#paginacao").classList.add("sem-resultados")

    btnAnterior = document.getElementById("paginaAnterior")
    btnProxima = document.getElementById("proximaPagina")

    // Eventos da paginação
    btnAnterior.addEventListener("click", retornarPaginaAnterior)
    btnProxima.addEventListener("click", retornarProximaPagina)

    const formBuscarVagas = document.getElementById("formBuscaVagas")
    formBuscarVagas.addEventListener("submit", buscarVagas)
})

function retornarPaginaAnterior(){
    if(paginaAtual > 1){
        paginaAtual--
        renderizarPagina()
    }
}

function retornarProximaPagina(){
    const quantidadeMaximaPagina = todasVagas.length / quantidadeVagasPagina
    if(paginaAtual < quantidadeMaximaPagina){
        paginaAtual++
        renderizarPagina()
    }
}

function exibirEstadoBusca(estado){
    const estados = {
        inicial: document.querySelector("#estadoInicial"),
        vazio: document.querySelector("#estadoVazio"),
        erro: document.querySelector("#estadoErroBusca")
    }

    Object.values(estados).forEach(estado => {
        estado.hidden = true
    })

    // Habilita o estado para aparecer
    if(estado){
        estados[estado].hidden = false
    }
}

function limparResultados(){
    document.querySelector(".lista-vagas").replaceChildren()
    document.querySelector("#contadorVagas").textContent = ""
    document.querySelector("#paginacao").classList.add("sem-resultados")
    desabilitarBotoesPaginacao()
}

function habilitarBotoesPaginacao(){
    document.querySelector("#paginacao").classList.remove("sem-resultados")
    btnAnterior.hidden = false
    btnProxima.hidden = false
}

function desabilitarBotoesPaginacao(){
    btnAnterior.hidden = true
    btnProxima.hidden = true
}

function atualizarContadorPaginacao(quantidadeVagas){
    const contadorVagas = document.querySelector("#contadorVagas")
    let quantidadeTotalVagas = todasVagas.length
    let quantidadeVagasPorPagina = quantidadeVagas * paginaAtual

    if(quantidadeVagas != quantidadeVagasPagina){
        quantidadeVagasPorPagina = todasVagas.length
    }

    contadorVagas.textContent = `
        ${quantidadeVagasPorPagina} de ${quantidadeTotalVagas} ${quantidadeTotalVagas === 1 ? "vaga" : "vagas"}
    `
}

function injetarVagas(vagas){
    // Cria os elementos na interface e faz a injeção dos dados
    const divListaVagas = document.querySelector(".lista-vagas")

    vagas.forEach(vaga =>{
        const articleVaga = document.createElement("article")
        articleVaga.classList.add("card-vaga")

        const divInfoVagas = document.createElement("div")
        divInfoVagas.classList.add("info-vaga")

        // Título da vaga
        const divTituloVaga = document.createElement("div")
        divTituloVaga.classList.add("titulo-vaga")

        const tituloVaga = document.createElement("h3")
        tituloVaga.textContent = vaga.tituloVaga
        divTituloVaga.appendChild(tituloVaga)

        // Nome da empresa
        const nomeEmpresa = document.createElement("p")
        nomeEmpresa.classList.add("empresa")
        nomeEmpresa.textContent = vaga.nomeEmpresa

        // URL da vaga
        const urlVaga = document.createElement("a")
        urlVaga.classList.add("botao", "botao-link")
        urlVaga.href = vaga.urlVaga
        urlVaga.target = "_blank"
        urlVaga.textContent = "Ver vaga"

        divInfoVagas.appendChild(divTituloVaga)
        divInfoVagas.appendChild(nomeEmpresa)
        articleVaga.appendChild(divInfoVagas)
        articleVaga.appendChild(urlVaga)
        divListaVagas.appendChild(articleVaga);
    })

    atualizarContadorPaginacao(vagas.length)
    if(todasVagas.length > quantidadeVagasPagina){
        habilitarBotoesPaginacao()
    }
}

function renderizarPagina(){
    const inicio = (paginaAtual - 1) * quantidadeVagasPagina
    const fim = inicio + quantidadeVagasPagina

    limparResultados()
    injetarVagas(todasVagas.slice(inicio, fim))
}

async function buscarVagas(event){
    event.preventDefault()

    const accessToken = localStorage.getItem("accessToken")
    if(!accessToken) {
        window.location.href = "/pages/login.html"
        return null
    }

    const campoBusca = document.getElementById("palavraVaga")
    const palavraVagaBuscar = campoBusca.value.trim()
    if(!palavraVagaBuscar){
        return null
    }

    const loading = document.querySelector("#loading")
    const URL = 'http://localhost:8089'

    exibirEstadoBusca(null)
    limparResultados()
    loading.hidden = false // Habilitando loading

    try{
        const response = await fetch(`${URL}/vagas/pesquisar`, {
            method: 'POST',
            body: JSON.stringify([palavraVagaBuscar]),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        
        if(!response.ok){
            if(response.status === 404){
                exibirEstadoBusca("vazio")
                return

            } 

            throw new Error("Erro ao pesquisar vagas")
        }

        todasVagas = await response.json()
        if(todasVagas.length === 0){
            exibirEstadoBusca("vazio")
            return
        }

        paginaAtual = 1
        renderizarPagina()
        
    } catch(error) {
        console.error(error)
        exibirEstadoBusca("erro")

    } finally {
        loading.hidden = true
    }
}