export function getAccessToken(){
    return localStorage.getItem("accessToken")
}

export function isAuthenticated(){
    if (!localStorage.getItem("accessToken")) {
        location.href = "/pages/login.html"
        return
    }
}