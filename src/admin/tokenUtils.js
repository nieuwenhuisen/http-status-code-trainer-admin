import jwtDecode from "jwt-decode";

const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refresh_token';

function isTokenExpired() {
    const token = getToken();

    if (!token) {
        return false;
    }

    const decoded = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);

    return decoded.exp < now;
}

function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function setToken(token, refreshToken) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

function isTokenValid() {
    return getToken() && !isTokenExpired();
}

function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
}

function getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export default {
    get: getToken,
    getRefreshToken: getRefreshToken,
    valid: isTokenValid,
    clear: clearToken,
    isExpired: isTokenExpired,
};
