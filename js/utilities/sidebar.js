function getSidebar(){
    return fetch("/pages/components/menu.html")
        .then(response => response.text())
        .catch(error =>{
            console.log("Erro ao buscar menu: ", error)
        })
}

function ativarOpcaoSelecionadaMenu(){
    const opcaoMenuAtiva = document.querySelector('.active')
    if(opcaoMenuAtiva){
        opcaoMenuAtiva.classList.remove('active')
    }

    const opcaoClicada = document.querySelector(`a[href="${location.pathname}"]`)
    if(opcaoClicada){
        opcaoClicada.classList.add('active')
    }
}

export async function injectSidebar(){
    document.getElementById("sidebar").innerHTML = await getSidebar()
    ativarOpcaoSelecionadaMenu()
}