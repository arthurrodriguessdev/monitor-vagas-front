// const API_URL = "http://localhost:8089"

// const OPERACOES = Object.freeze({
//     listar: { metodo: "GET", endpoint: null },
//     adicionar: { metodo: "POST", endpoint: null },
//     editar: { metodo: "PUT", endpoint: null },
//     excluir: { metodo: "DELETE", endpoint: null }
// })

// async function requisitarPreferencias(operacao, dados) {
//     const configuracao = OPERACOES[operacao]
//     const accessToken = localStorage.getItem("accessToken")
//     if (!accessToken) {
//         location.href = "/pages/login.html"
//         throw new Error("É necessário entrar para gerenciar preferências.")
//     }

//     if (!configuracao.endpoint) {
//         throw new Error("A integração da API de preferências ainda não está configurada.")
//     }

//     const headers = {
//         "Authorization": `Bearer ${accessToken}`
//     }
//     const opcoes = { method: configuracao.metodo, headers }

//     if (dados !== undefined) {
//         headers["Content-Type"] = "application/json"
//         opcoes.body = JSON.stringify(dados)
//     }

//     let response
//     try {
//         response = await fetch(`${API_URL}${configuracao.endpoint}`, opcoes)
//     } catch {
//         throw new Error("Não foi possível conectar ao servidor. Tente novamente mais tarde.")
//     }

//     if (!response.ok) {
//         throw new Error(`Não foi possível concluir a operação de preferências (HTTP ${response.status}).`)
//     }

//     if (response.status === 204) {
//         return null
//     }

//     return response.json()
// }

// export function listarPreferencias() {
//     return requisitarPreferencias("listar")
// }

// export function adicionarPreferencia(preferencia) {
//     return requisitarPreferencias("adicionar", preferencia)
// }

// export function editarPreferencia(nome) {
//     return requisitarPreferencias("editar", { nome })
// }

// export function excluirPreferencia() {
//     return requisitarPreferencias("excluir")
// }
