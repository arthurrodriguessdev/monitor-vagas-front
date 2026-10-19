import { callAPI } from "../utilities/api.js"

/**
 * Centraliza as chamadas de API
 * para o módulo de usuários
 */
export function cadastrarUsuarioAPI(body){
    return callAPI("auth/register", 1, false, body)
}

export function loginUsuarioAPI(body){
    return callAPI("auth/login", 1, false, body)
}