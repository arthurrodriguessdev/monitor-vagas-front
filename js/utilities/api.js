import { getAccessToken } from "../utilities/token.js"

const BASE_URL = "http://localhost:8089"

// Mapeamento dos métodos HTTP
const methods = {
    1: "POST",
    2: "GET",
    3: "PUT",
    4: "PATCH",
    5: "DELETE"
}

/**
 * Executa uma requisição HTTP para a API.
 *
 * @param {string} urlComplemento - Caminho do endpoint da API.
 * @param {number} keyMethod - Código do método HTTP definido em `methods`.
 * @param {boolean} [temAutenticacao=true] - Indica se deve enviar o token JWT.
 * @param {Object|null} [body=null] - Dados enviados no corpo da requisição, em JSON.
 * @returns {Promise<Response>} Resposta HTTP retornada pelo servidor.
 * @throws {Error} Se o código do método HTTP for inválido.
 */
export async function callAPI(urlComplemento, keyMethod, temAutenticacao=true, body=null){
    if(typeof keyMethod !== "number" || !methods[keyMethod]){
        throw new Error("Método HTTP inválido.")
    }

    const headers = {}
    if(temAutenticacao){
        headers["Authorization"] = `Bearer ${getAccessToken()}`
    }

    if(body){
        headers["Content-Type"] = "application/json"
    }

    const URL_API = `${BASE_URL}/${urlComplemento}`
    const response = await fetch(URL_API, {
        method: methods[keyMethod],
        headers: headers,
        body: body != null ? JSON.stringify(body) : null
    })

    return tratarResponseAPI(response)
}

/**
 * Faz o tratamento default da response retornada pela API
 * @param {*} response - Retorno da requisição feita para algum endpoint
 * @returns
 * @throws {Error} Se !response.ok 
 */
export async function tratarResponseAPI(response){
    if(response.ok){
        return response
    }

    let message
    try{
        const dadosResponse = await response.json()
        message = dadosResponse.message

    } catch{
        message = ""
    }

    if(!message){
        const defaultMessages = {
            400: "Os dados enviados são inválidos.",
            401: "Sua sessão expirou. Faça login novamente.",
            403: "Você não tem permissão para realizar esta ação.",
            404: "O recurso solicitado não foi encontrado.",
            500: "Erro interno do servidor. Tente novamente."
        }

        message = defaultMessages[response.status]
    }

    throw new Error(message)
}