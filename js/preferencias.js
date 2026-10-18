import { injectSidebar } from "./utilities/sidebar.js"
import {
    salvarPreferenciaAPI,
    alterarPreferenciaAPI,
    listarPreferenciasAPI,
    deletarPreferenciaAPI
} from "./api/preferencias_api.js"

import { isAuthenticated } from "./utilities/token.js"

let preferencias = []
let preferenciaEmEdicao = null

document.addEventListener("DOMContentLoaded", () => {
    injectSidebar()

    isAuthenticated()
    document.getElementById("adicionarPreferencia").addEventListener("click", iniciarAdicao)
    document.getElementById("cancelarPreferencia").addEventListener("click", ocultarFormulario)
    document.getElementById("formPreferencia").addEventListener("submit", salvarPreferencia)
    document.getElementById("listaPreferencias").addEventListener("click", tratarAcaoPreferencia)

    carregarPreferencias()
})

/* Métodos utilitários */
function exibirLoading() {
    document.getElementById("loadingPreferencias").hidden = false
}

function ocultarLoading() {
    document.getElementById("loadingPreferencias").hidden = true
}

function exibirErro(mensagem) {
    const caixaErro = document.getElementById("mensagemErroPreferencias")
    caixaErro.textContent = mensagem
    caixaErro.hidden = false
}

function exibirSucesso(mensagem){
    const caixaSucesso = document.getElementById("mensagemSucessoPreferencias")
    caixaSucesso.textContent = mensagem
    caixaSucesso.hidden = false
}

function limparErro() {
    const caixaErro = document.getElementById("mensagemErroPreferencias")
    caixaErro.textContent = ""
    caixaErro.hidden = true
}

function limparMensagens() {
    const erro = document.getElementById("mensagemErroPreferencias")
    const sucesso = document.getElementById("mensagemSucessoPreferencias")

    erro.textContent = ""
    erro.hidden = true

    sucesso.textContent = ""
    sucesso.hidden = true
}

function exibirEstadoVazio(exibir) {
    document.getElementById("estadoVazioPreferencias").hidden = !exibir
}

/* Métodos funcionais */
function renderizarPreferencias() {
    const lista = document.getElementById("listaPreferencias")
    lista.replaceChildren() // Limpando a lista atual

    preferencias.forEach((preferencia, indice) => {
        const item = document.createElement("article")
        item.className = "item-preferencia"

        const nome = document.createElement("h3")
        nome.textContent = preferencia.nome

        const acoes = document.createElement("div")
        acoes.className = "acoes-preferencia"

        const botaoEditar = document.createElement("button")
        botaoEditar.type = "button"
        botaoEditar.className = "botao botao-link"
        botaoEditar.dataset.acao = "editar"
        botaoEditar.dataset.indice = indice
        botaoEditar.textContent = "Editar"

        const botaoExcluir = document.createElement("button")
        botaoExcluir.type = "button"
        botaoExcluir.className = "botao botao-link botao-excluir-preferencia"
        botaoExcluir.dataset.acao = "excluir"
        botaoExcluir.dataset.indice = indice
        botaoExcluir.textContent = "Excluir"

        acoes.append(botaoEditar, botaoExcluir)
        item.append(nome, acoes)
        lista.appendChild(item)
    })

    exibirEstadoVazio(preferencias.length === 0)
}

async function carregarPreferencias(){
    limparErro()
    exibirEstadoVazio(false)
    exibirLoading()
    document.getElementById("estadoErroPreferencias").hidden = true

    try{
        const response = await listarPreferenciasAPI()
        preferencias = await response.json()
        renderizarPreferencias()
        return true

    } catch(error){
        exibirErro(error.message)

    } finally{
        ocultarLoading()
    }
}

function iniciarAdicao() {
    preferenciaEmEdicao = null
    document.getElementById("formPreferencia").reset() // Rollback nos valores iniciais do formulário
    document.getElementById("salvarPreferencia").textContent = "Salvar preferência"
    document.getElementById("formPreferencia").hidden = false
    document.getElementById("nomePreferencia").focus()
    limparMensagens()
}

function iniciarEdicao(preferencia) {
    preferenciaEmEdicao = preferencia
    document.getElementById("nomePreferencia").value = preferencia.nome
    document.getElementById("salvarPreferencia").textContent = "Salvar alterações"
    document.getElementById("formPreferencia").hidden = false
    document.getElementById("nomePreferencia").focus()
    limparMensagens()
}

// Cancelamento de adição de preferência
function ocultarFormulario() {
    document.getElementById("formPreferencia").hidden = true
    document.getElementById("formPreferencia").reset()
    preferenciaEmEdicao = null
}

async function salvarPreferencia(event){
    event.preventDefault()
    limparMensagens()
    isAuthenticated()

    const nome = document.getElementById("nomePreferencia").value.trim().toLowerCase()
    if(!nome) {
        exibirErro("O nome da preferência é obrigatório.")
        document.getElementById("nomePreferencia").focus()
        return
    }

    const botaoSalvar = document.getElementById("salvarPreferencia")
    botaoSalvar.disabled = true

    try{
        if(preferenciaEmEdicao){
            await alterarPreferenciaAPI(nome, preferenciaEmEdicao.id)
            exibirSucesso("Preferência alterada com sucesso.")

        } else{
            await salvarPreferenciaAPI(nome)
            exibirSucesso("Preferência adicionada com sucesso.")
        }

        ocultarFormulario()
        await carregarPreferencias() // Atualizando a lista

    } catch(error) {
        exibirErro(error.message)

    } finally {
        botaoSalvar.disabled = false
    }
}

async function excluirPreferencia(preferenciaDeletar){
    await deletarPreferenciaAPI(preferenciaDeletar.id)
    exibirSucesso("A preferência foi excluída com sucesso.")
}

async function tratarAcaoPreferencia(event){
    const botao = event.target.closest("button[data-acao]")
    if(!botao){
        return
    }

    limparMensagens()
    const preferencia = preferencias[Number(botao.dataset.indice)]
    if (!preferencia) {
        return
    }

    if (botao.dataset.acao === "editar") {
        iniciarEdicao(preferencia)
        return
    }

    if (!confirm(`Tem certeza de que deseja excluir a preferência "${preferencia.nome}"?`)) {
        return
    }

    limparErro()
    botao.disabled = true
    try {
        await excluirPreferencia(preferencia)
        await carregarPreferencias()

    } catch (error) {
        exibirErro(error.message)

    } finally {
        botao.disabled = false
    }
}