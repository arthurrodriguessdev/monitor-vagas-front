import { cadastrarUsuarioAPI } from "./api/usuario_api.js"

document.addEventListener("DOMContentLoaded", ()=>{
    const formCadastro = document.getElementById("cadastroForm")
    formCadastro.addEventListener("submit", cadastroUsuario)
})

function exibirMensagemErro(message){
    const error = document.getElementById("errorMessage")
    error.innerText = message
    error.hidden = false
}

function limparMensagemErro() {
    const error = document.getElementById("errorMessage")
    error.innerText = ""
    error.hidden = true
}

/**
 * Faz a validação dos dados enviados para cadastro
 * @param {*} nome - Nome do usuário
 * @param {*} email - E-mail do usuário
 * @param {*} senha - Senha de acesso
 * @param {*} senhaConfirmacao - Confirmação da senha
 * @returns 
 */
function validarDados(nome, email, senha, senhaConfirmacao) {
    if (!nome.trim() || !email.trim() || !senha || !senhaConfirmacao) {
        exibirMensagemErro("Todos os campos são obrigatórios.")
        return false
    }

    if (senha.length < 8) {
        exibirMensagemErro("A senha deve ter, no mínimo, 8 caracteres.")
        return false
    }

    if (senha !== senhaConfirmacao) {
        exibirMensagemErro("As senhas não coincidem.")
        return false
    }

    return true;
}

async function cadastroUsuario(e){
    e.preventDefault()
    limparMensagemErro()

    const nomeUsuario = document.getElementById("nomeCadastro").value
    const emailUsuario = document.getElementById("emailCadastro").value
    const senhaUsuario = document.getElementById("senhaCadastro").value
    const confirmacaoSenha = document.getElementById("confirmarSenhaCadastro").value
    const ehValido = validarDados(nomeUsuario, emailUsuario, senhaUsuario, confirmacaoSenha) 

    if(ehValido){
        const dadosCadastro = {
            "nome": nomeUsuario.trim(),
            "email": emailUsuario.trim(),
            "senha": senhaUsuario
        }

        try{
            await cadastrarUsuarioAPI(dadosCadastro)

            // Guarda identificador para a mensagem de sucesso e faz o redirect
            localStorage.setItem("usuarioCriado", true)
            location.href = "/pages/login.html"

        } catch(error){
            exibirMensagemErro(error.message)
        }
    }
}