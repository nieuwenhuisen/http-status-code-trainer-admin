import token from './tokenUtils';

const entrypoint = process.env.REACT_APP_API_ENTRYPOINT;

export default {
    login: ({ username, password }) =>  {
        const request = new Request(`${entrypoint}/login`, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });

        return fetch(request)
            .then((response) => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error('ra.auth.sign_in_error');
                }
                return response.json();
            })
            .then(({ token, refresh_token }) => {
                localStorage.setItem('token', token);
                localStorage.setItem('refresh_token', refresh_token);
            });
    },
    logout: () => {
        token.clear();
        return Promise.resolve();
    },
    checkAuth: () => token.get() ? Promise.resolve() : Promise.reject(),
    checkError: (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem('token');
            return Promise.reject();
        }
        return Promise.resolve();
    },
    getPermissions: () => Promise.resolve(),
};
