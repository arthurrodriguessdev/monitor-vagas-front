export function getAccessToken(){
    return localStorage.getItem("accessToken")
}

export function isAuthenticated(){
    if (!getAccessToken()) {
        location.href = "/pages/login.html"
        return
    }
}

export function toStorageAccessToken(accessToken){
    localStorage.setItem('accessToken', accessToken)
}