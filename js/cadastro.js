document.addEventListener("DOMContentLoaded", ()=>{
    const formCadastro = document.getElementById("cadastroForm")
    formCadastro.addEventListener("submit", cadastroUsuario)
})

// Realiza a validação dos dados no front para uma melhor experiência do usuário (também realizadas no back)
function validarDados(nome, email, senha, senhaConfirmacao) {
    const error = document.getElementById("errorMessage")
    let errorMessage = ""

    if (!nome.trim() || !email.trim() || !senha || !senhaConfirmacao) {
        errorMessage = "Todos os campos são obrigatórios."
        error.innerText = errorMessage
        error.hidden = false
        return false;
    }

    if (senha.length < 8) {
        errorMessage = "A senha deve ter, no mínimo, 8 caracteres."
        error.innerText = errorMessage
        error.hidden = false
        return false;
    }

    if (senha !== senhaConfirmacao) {
        errorMessage = "As senhas não coincidem"
        error.innerText = errorMessage
        error.hidden = false
        return false;
    }

    return true;
}

async function cadastroUsuario(e){
    e.preventDefault()

    const nomeUsuario = document.getElementById("nomeCadastro").value
    const emailUsuario = document.getElementById("emailCadastro").value
    const senhaUsuario = document.getElementById("senhaCadastro").value
    const confirmacaoSenha = document.getElementById("confirmarSenhaCadastro").value

    const error = document.getElementById("errorMessage")
    error.hidden = true;

    const ehValido = validarDados(nomeUsuario, emailUsuario, senhaUsuario, confirmacaoSenha) 
    const URL = "http://localhost:8089"

    if(ehValido){
        const dadosCadastro = {
            "nome": nomeUsuario.trim(),
            "email": emailUsuario.trim(),
            "senha": senhaUsuario
        }

        try{
            const response = await fetch(`${URL}/auth/register`, {
                method: "POST",
                body: JSON.stringify(dadosCadastro),
                headers: {
                    "Content-Type": "application/json"
                }
            })

            // Guarda identificador para a mensagem de sucesso e faz o redirect
            if(response.ok){
                localStorage.setItem("usuarioCriado", true)
                location.href = "http://localhost:5500/pages/login.html"
                return
            }

            const dadosErro = await response.json()
            error.innerText = dadosErro.message;
            error.hidden = false;

        } catch(error){
            console.log(error)
            error.innerText = "Não foi possível conectar ao servidor. Tente novamente."
            error.hidden = false
        }
    }
}