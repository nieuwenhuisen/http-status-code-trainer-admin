import { fetchHydra as baseFetchHydra } from '@api-platform/admin';
import parseHydraDocumentation from '@api-platform/api-doc-parser/lib/hydra/parseHydraDocumentation';
import baseDataProvider from '@api-platform/admin/src/hydra/dataProvider';
import token from './tokenUtils';

const entrypoint = process.env.REACT_APP_API_ENTRYPOINT;

const headers = () => {
    const values = {};

    if (token.get() && !token.isExpired()) {
        values.Authorization = `Bearer ${token.get()}`;
    }

    return new Headers(values);
};

async function refreshToken()
{
    const request = new Request(`${entrypoint}/token/refresh`, {
        method: 'POST',
        body: JSON.stringify({refresh_token: token.getRefreshToken()}),
        headers: new Headers({'Content-Type': 'application/json'}),
    });

    const response = await fetch(request);
    const json = await response.json();

    localStorage.setItem('token', json.token);
    localStorage.setItem('refresh_token', json.refresh_token);
}

const fetchHydra = async (url, options = {}) => {
    if (token.isExpired() && token.getRefreshToken()) {
        await refreshToken();
    }

    if (token.isMultiFactorAuthenticationEnabled() && !token.isMultiFactorAuthenticationVerified()) {
        return;
    }

    return baseFetchHydra(url, {
        ...options,
        headers: headers(),
    });
};

const apiDocumentationParser = (url) => parseHydraDocumentation(url);
export default baseDataProvider(entrypoint, fetchHydra, apiDocumentationParser);
