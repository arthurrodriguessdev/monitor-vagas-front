import { callAPI } from "../utilities/api.js";

export function buscarVagasAPI(body){
    return callAPI("vagas/pesquisar", 1, true, body)
}