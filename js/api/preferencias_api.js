import { callAPI } from "../utilities/api.js";

/**
 * Centraliza as chamadas de API
 * para o módulo de preferências
 */
export function salvarPreferenciaAPI(nomePreferencia){
    const URL_COMPLEMENTO = `preferencia?nomePreferencia=${encodeURIComponent(nomePreferencia)}`
    return callAPI(URL_COMPLEMENTO, 1, true, null)
}

export function alterarPreferenciaAPI(nomePreferencia, idPreferencia){
    const URL_COMPLEMENTO = `preferencia/${idPreferencia}?nomeAtualizado=${encodeURIComponent(nomePreferencia)}`
    return callAPI(URL_COMPLEMENTO, 4, true, null)
}

export function listarPreferenciasAPI(){
    return callAPI("preferencia", 2, true, null)
}

export function deletarPreferenciaAPI(idPreferencia){
    const URL_COMPLEMENTO = `preferencia/${idPreferencia}`
    return callAPI(URL_COMPLEMENTO, 5, true, null)
}