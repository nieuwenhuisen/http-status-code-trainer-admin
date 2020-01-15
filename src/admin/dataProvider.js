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

const logout = () => {
    console.log('logout');
    // localStorage.removeItem('token');
    // window.location.href = '/#/login';
};

const fetchHydra = (url, options = {}) => baseFetchHydra(url, {
    ...options,
    headers: headers(),
})
    .catch((data) => {
        if (typeof data.response !== 'undefined' && typeof data.response.status !== 'undefined' && data.response.status === 401) {
            console.log('fetchHydra', data);
            logout();
            return Promise.resolve();
        }

        return Promise.reject(data);
    });

const apiDocumentationParser = (entrypoint) => parseHydraDocumentation(entrypoint, { headers: headers() })
    .then(
        ({ api }) => ({ api }),
        (result) => {
            if (result.status === 401) {
                console.log('apiDocumentationParser');
                logout();
                return Promise.resolve();
            }
            return Promise.reject(result);
        },
    );

export default baseDataProvider(entrypoint, fetchHydra, apiDocumentationParser);
