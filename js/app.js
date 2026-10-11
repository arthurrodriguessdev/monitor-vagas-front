import { injectSidebar } from "./utilities/sidebar.js"

document.addEventListener("DOMContentLoaded", ()=>{
    injectSidebar()

    const formBuscarVagas = document.getElementById("formBuscaVagas")
    formBuscarVagas.addEventListener("submit", buscarVagas)
})

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
}

function injetarVagas(vagas){
    // Cria os elementos na interface e faz a injeção dos dados
    const contadorVagas = document.querySelector("#contadorVagas")
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

        divInfoVagas.appendChild(divTituloVaga)
        divInfoVagas.appendChild(nomeEmpresa)
        articleVaga.appendChild(divInfoVagas)
        divListaVagas.appendChild(articleVaga);
    })

    contadorVagas.textContent = `${vagas.length} ${vagas.length === 1 ? "vaga" : "vagas"}`
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

            } else if(response.status === 403){
                // tratar
                return
            }

            throw new Error("Erro ao pesquisar vagas")
        }

        const vagasJson = await response.json()
        if(vagasJson.length === 0){
            exibirEstadoBusca("vazio")
            return
        }

        injetarVagas(vagasJson)
        
    } catch(error) {
        console.error(error)
        exibirEstadoBusca("erro")

    } finally {
        loading.hidden = true
    }
}