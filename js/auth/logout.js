function confirmar(){
    return confirm("Tem certeza de que deseja sair da sua conta?");
}

function logout(){
    if(confirmar()){
        sessionStorage.clear()
        location.href = "/pages/login.html"
    }
}