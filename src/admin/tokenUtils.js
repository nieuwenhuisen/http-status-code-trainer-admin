import jwtDecode from "jwt-decode";

let payload = false;

function getPayload() {
    if (false === payload && getToken()) {
        const token = getToken();
        payload = jwtDecode(token);
    }

    return payload;
}

function clearPayload() {
    payload = false;
}

function isTokenExpired() {
    const decoded = getPayload();
    const now = Math.floor(Date.now() / 1000);

    return decoded.exp < now;
}

function isMultiFactorAuthenticationEnabled() {
    const decoded = getPayload();

    if (typeof decoded.mfa_enabled === 'undefined') {
        return false;
    }

    return true === decoded.mfa_enabled;
}

function isMultiFactorAuthenticationVerified() {
    const decoded = getPayload();

    if (typeof decoded.mfa_verified === 'undefined') {
        return false;
    }

    return true === decoded.mfa_verified;
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
    getRefreshToken,
    valid: isTokenValid,
    clear: clearToken,
    clearPayload,
    isExpired: isTokenExpired,
    isMultiFactorAuthenticationEnabled,
    isMultiFactorAuthenticationVerified,
};
