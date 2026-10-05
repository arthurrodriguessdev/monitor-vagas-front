document.addEventListener("DOMContentLoaded", ()=>{
    const form = document.getElementById('loginForm')
    form.addEventListener("submit", login)
})

async function login(event){
    event.preventDefault()
    const email = document.getElementById("emailLogin").value
    const password = document.getElementById("passwordLogin").value

    const accessToken = await getAuthenticateToken(email, password)
    console.log(accessToken)
}

async function getAuthenticateToken(email, password){
    const URL = "http://localhost:8089"
    const body = {
        "email": email,
        "senha": password
    }

    return fetch(`${URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
    .then(response =>{
        if(!response.ok){
            console.log("fudeu")
        }

        return response
    })
    .then(data =>{
        return data;
    })
    .catch(error =>{
        console.log(error)
    })
}