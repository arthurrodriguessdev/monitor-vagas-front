import { injectSidebar } from "./utilities/sidebar.js"

document.addEventListener("DOMContentLoaded", ()=>{
    injectSidebar()
})

async function buscarVagas() {
    const URL = 'http://localhost:8089';
    const listaPreferencias = ['Python'];

    const response = await fetch(`${URL}/vagas/pesquisar`, {
        method: 'POST',
        body: JSON.stringify(listaPreferencias),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJtb25pdG9yLXZhZ2FzLWFwaSIsInN1YiI6ImNhbmFsZG90dTA1MEBnbWFpbC5jb20iLCJleHAiOjE3OTEwNjQ5NTB9.rXsDnoKS54jwbuZp3lrob7n0MFQTI-00eDOeAchN5Eg'
        }
    })
    .then(response =>{return response.json()})
    .then(data =>{
        console.log('Entrou')

        data.forEach(vaga =>{

            const cardVaga = document.createElement("div")
            cardVaga.classList.add("card-vaga")

            const infoVaga = document.createElement("div")
            infoVaga.classList.add("info-vaga")

            const titulo = document.createElement("h2")
            titulo.textContent = vaga.tituloVaga

            const empresa = document.createElement("p")
            empresa.classList.add("empresa")
            empresa.textContent = vaga.nomeEmpresa

            const dataPublicacao = document.createElement("p")
            dataPublicacao.classList.add("data")
            dataPublicacao.textContent = vaga.dataPublicacao

            const link = document.createElement("a")
            link.classList.add("btn-vaga")
            link.textContent = "Ver vaga"
            link.href = vaga.urlVaga
            link.target = "_blank"

            infoVaga.appendChild(titulo)
            infoVaga.appendChild(empresa)
            infoVaga.appendChild(dataPublicacao)

            cardVaga.appendChild(infoVaga)
            cardVaga.appendChild(link)

            document.querySelector(".container-list-vagas").appendChild(cardVaga)
        })

    })
    .catch(error =>{
        console.log('Erro ao pesquisar vagas: ', error)
    })
}

// injectSidebar()
// buscarVagas()