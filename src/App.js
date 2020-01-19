import React from "react";
import { HydraAdmin } from "@api-platform/admin";
import { Layout, Resource } from 'react-admin';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import messages from 'ra-language-dutch';
import { Route } from 'react-router-dom';

// Import pages
import { LoginPage, LoginVerifyPage } from './pages/login';
import { UserListPage, UserEditPage } from './pages/user';
import { StatusCodeListPage, StatusCodeEditPage } from './pages/status_code';

import { authProvider, dataProvider } from './admin';

const entrypoint = process.env.REACT_APP_API_ENTRYPOINT;

const customRoutes = [
    <Route
        key="login_verify"
        path="/verify"
        component={LoginVerifyPage}
        noLayout
    />
];

export default () => (
    <HydraAdmin
        i18nProvider={polyglotI18nProvider(() => messages, 'nl')}
        dataProvider={dataProvider}
        loginPage={LoginPage}
        authProvider={authProvider}
        entrypoint={entrypoint}
        layout={Layout}
        customRoutes={customRoutes}>
            <Resource name="users" list={UserListPage} edit={UserEditPage} />
            <Resource name="status_codes" list={StatusCodeListPage} edit={StatusCodeEditPage} />
    </HydraAdmin>
);
