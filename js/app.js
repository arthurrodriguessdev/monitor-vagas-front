import { injectSidebar } from "./utilities/sidebar.js"

document.addEventListener("DOMContentLoaded", ()=>{
    injectSidebar()

    const formBuscarVagas = document.getElementById("formBuscaVagas")
    formBuscarVagas.addEventListener("submit", buscarVagas)
})

function injetarVagas(vagas){
    if(!vagas){
        return null
    }

    // Cria os elementos na interface e faz a injeção dos dados
    const contadorVagas = document.querySelector("#contadorVagas")
    const divListaVagas = document.querySelector(".lista-vagas")
    divListaVagas.innerHTML = ""
    contadorVagas.innerHTML = ""

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

    contadorVagas.innerHTML = `${vagas.length} vagas` // Atualiza o contador de vagas
}

async function buscarVagas(event){
    event.preventDefault()

    const URL = 'http://localhost:8089';
    const palavraVagaBuscar = document.getElementById("palavraVaga").value
    const listaPreferencias = [palavraVagaBuscar]

    const accessToken = localStorage.getItem("accessToken")
    if(!accessToken) {
        window.location.href = "/pages/login.html"
        return null
    }

    try{
        const response = await fetch(`${URL}/vagas/pesquisar`, {
            method: 'POST',
            body: JSON.stringify(listaPreferencias),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })

        if(!response.ok){
            console.log('nao ok')
            return null
        }

        const vagasJson = await response.json()
        injetarVagas(vagasJson)

    } catch(error){
        console.log(error)
        return null
    }
}