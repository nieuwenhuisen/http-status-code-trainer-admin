import jwtDecode from "jwt-decode";

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
    return localStorage.getItem('token');
}

function isTokenValid() {
    return getToken() && !isTokenExpired();
}

function clearToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
}

function getRefreshToken() {
    return localStorage.getItem('refresh_token');
}

export default {
    get: getToken,
    getRefreshToken: getRefreshToken,
    valid: isTokenValid,
    clear: clearToken,
    isExpired: isTokenExpired,
};
