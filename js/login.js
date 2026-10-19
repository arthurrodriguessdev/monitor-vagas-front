import { loginUsuarioAPI } from "./api/usuario_api.js"
import { toStorageAccessToken } from "./utilities/token.js"

document.addEventListener("DOMContentLoaded", ()=>{
    const messageSuccess = document.getElementById("successMessage")
    if(messageSuccess && localStorage.getItem("usuarioCriado")){
        messageSuccess.innerText = "Cadastro realizado com sucesso! Faça login para continuar."
        messageSuccess.hidden = false
        localStorage.removeItem("usuarioCriado")
    }

    const form = document.getElementById('loginForm')
    form.addEventListener("submit", login)
})

function exibirMensagemErro(message){
    const errorMessage = document.getElementById("errorMessage")
    errorMessage.innerText = message
    errorMessage.hidden = false
}

async function login(event){
    event.preventDefault()
    
    const errorMessage = document.getElementById("errorMessage")
    errorMessage.innerText = ""
    errorMessage.hidden = true
    
    const email = document.getElementById("emailLogin").value
    const password = document.getElementById("passwordLogin").value

    const response = await getAccessToken(email, password)
    if(!response){
        // Fazer tratativa do nulo
        return null
    }

    const accessToken = response.accessToken
    if(!accessToken){
        exibirMensagemErro("Não foi possível realizar o login. Tente novamente.")
        return null
    }
    
    toStorageAccessToken(accessToken)
    location.href = "/pages/vagas.html" // Redirecionamento do usuário
}

async function getAccessToken(email, password){
    const body = {
        "email": email,
        "senha": password
    }

    try{
        const response = await loginUsuarioAPI(body)
        return await response.json()

    } catch(error){
        exibirMensagemErro(error.message)
        return null
    }
}