document.addEventListener("DOMContentLoaded", ()=>{
    const form = document.getElementById('loginForm')
    form.addEventListener("submit", login)
})

async function login(event){
    event.preventDefault()
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
        // Fazer tratativa de null
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

    const response = await fetch(`${URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })

    if(!response.ok){
        // Fazer tratativa dos status (400, 403, 500)
        return null;
    }

    return response.json()
}

function storageAccessToken(accessToken){
    localStorage.setItem('accessToken', accessToken)
}