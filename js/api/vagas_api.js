import { callAPI } from "../utilities/api.js";

/**
 * Centraliza as chamadas de API
 * para o módulo de vagas
 */
export function buscarVagasAPI(body){
    return callAPI("vagas/pesquisar", 1, true, body)
}