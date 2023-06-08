// auth.js

export function saveAccessToken(accessToken) {
    localStorage.setItem('accessToken', accessToken);
}

export function getAccessToken() {
    return localStorage.getItem('accessToken');
}

export function removeAccessToken() {
    localStorage.removeItem('accessToken');
}
