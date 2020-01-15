import React, { useState } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { useLogin, useNotify } from 'react-admin';
import { ThemeProvider } from '@material-ui/styles';
import classnames from 'classnames';
import {CircularProgress, TextField, Button, CardActions, Card, withStyles} from '@material-ui/core';
import styles from './login.styles';
import { withTranslate } from 'ra-core';
import { Notification } from 'react-admin';

const LoginPageComponent = ({ isLoading, classes, translate, className, theme }) => {
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);

    const login = useLogin();
    const notify = useNotify();

    const submit = (e) => {
        e.preventDefault();

        let valid = true;

        if (username.length === 0) {
            setUsernameError(translate('ra.validation.required'));
            valid = false;
        }

        if (password.length === 0) {
            setPasswordError(translate('ra.validation.required'));
            valid = false;
        }

        if (valid) {
            login({ username, password })
                .catch(() => notify('ra.auth.sign_in_error'));
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Notification />

            <div className={classnames(classes.main, className)}>
                <Card className={classes.card}>
                    <div className={classes.logo}>
                        ADMIN
                    </div>

                    <form onSubmit={submit} className="form-signin" autoComplete="off">
                        <div className={classes.form}>
                            <div className={classes.input}>
                                <TextField
                                    id="username"
                                    name="username"
                                    label={translate('ra.auth.username')}
                                    type="text"
                                    error={!!usernameError}
                                    helperText={usernameError}
                                    disabled={isLoading}
                                    autoComplete="username"
                                    value={username}
                                    fullWidth
                                    onChange={e => setUsername(e.target.value)}
                                />
                            </div>

                            <div className={classes.input}>
                                <TextField
                                    id="password"
                                    name="password"
                                    label={translate('ra.auth.password')}
                                    error={!!passwordError}
                                    helperText={passwordError}
                                    type="password"
                                    disabled={isLoading}
                                    value={password}
                                    autoComplete="current-password"
                                    fullWidth
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <CardActions>
                            <Button
                                variant="contained"
                                type="submit"
                                color="primary"
                                disabled={isLoading}
                                className={classes.button}
                            >
                                {isLoading && (
                                    <CircularProgress
                                        className={classes.icon}
                                        size={18}
                                        thickness={2}
                                    />
                                )}
                                {translate('ra.auth.sign_in')}
                            </Button>
                        </CardActions>
                    </form>
                </Card>
            </div>
        </ThemeProvider>
    );
};

const mapStateToProps = (state) => ({
    isLoading: state.admin.loading > 0,
});

export default compose(
    withStyles(styles),
    withTranslate,
    connect(mapStateToProps),
)(LoginPageComponent);
