document.addEventListener("DOMContentLoaded", ()=>{
    const form = document.getElementById('loginForm')
    form.addEventListener("submit", login)
})

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

    const URL_REDIRECT = "http://localhost:5500/pages/vagas.html"
    const accessToken = response.accessToken
    if(!accessToken){
        errorMessage.innerText = "Não foi possível realizar o login. Tente novamente."
        errorMessage.hidden = false
        return null
    }
    
    storageAccessToken(accessToken)

    // Verifica e redireciona o usuário
    if(localStorage.getItem('accessToken')){
        location.href = URL_REDIRECT
    }
}

async function getAccessToken(email, password){
    const URL = "http://localhost:8089"
    const body = {
        "email": email,
        "senha": password
    }

    try{
        const response = await fetch(`${URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })

        if(!response.ok){
            const errorMessage = document.getElementById("errorMessage")
            let messageError = ""
            
            // Tratando mensagens de erro
            switch(response.status){
                case 400:
                    messageError = "Verifique os dados informados e tente novamente."
                    break
                case 401:
                case 403:
                    messageError = "E-mail ou senha incorretos. Verifique suas credenciais e tente novamente."
                    break
                case 404:
                    messageError = "Serviço de login indisponível temporariamente. Tente novamente mais tarde."
                    break
                default:
                    messageError = "Ocorreu um erro inesperado. Tente novamente mais tarde." 
            }

            errorMessage.innerText = messageError
            errorMessage.hidden = false
            return null;
        }

        return await response.json()

    } catch(error){
        const errorMessage = document.getElementById("errorMessage")
        errorMessage.innerText = "Não foi possível conectar ao servidor. Tente novamente mais tarde." 
        errorMessage.hidden = false
        return null
    }
}

function storageAccessToken(accessToken){
    localStorage.setItem('accessToken', accessToken)
}