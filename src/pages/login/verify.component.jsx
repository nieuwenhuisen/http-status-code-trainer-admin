import React, { useState } from 'react';
import compose from 'recompose/compose';
import { ThemeProvider } from '@material-ui/styles';
import classnames from 'classnames';
import { CircularProgress, TextField, Button, CardActions, Card, withStyles } from '@material-ui/core';
import styles from './login.styles';
import { withTranslate } from 'ra-core';
import { Notification } from 'react-admin';

import { createMuiTheme } from '@material-ui/core/styles';
import authProvider from '../../admin/authProvider';

const theme = createMuiTheme({
    palette: {
        primary: {
            contrastText: '#ffffff',
            main: '#38a9b4',
        },
        secondary: {
            main: '#288690',
        },
    },
});

const LoginVerifyPageComponent = ({ classes, translate, history, className }) => {
    const [code, setCode] = useState('');
    const [codeError, setCodeError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        setIsLoading(true);
        let valid = true;

        if (code.length === 0) {
            setCodeError(translate('ra.validation.required'));
            valid = false;
        } else if (code.length !== 6) {
            setCodeError('Ongeldige verificatiecode!');
            valid = false;
        }

        if (valid) {
            authProvider.verify(code)
                .then(() => {
                    history.push('/');
                    setIsLoading(false);
                })
                .catch((error) => {
                    setCodeError(error.message);
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
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

                    <p>Open uw tweestapsverificatie app op uw telefoon en vul de hieronder de<br /> verificatiecode in.</p>

                    <form onSubmit={submit} className="form-signin" autoComplete="off">
                        <div className={classes.form}>
                            <div className={classes.input}>
                                <TextField
                                    id="code"
                                    name="code"
                                    label="verificatiecode"
                                    type="text"
                                    error={!!codeError}
                                    helperText={codeError}
                                    disabled={isLoading}
                                    value={code}
                                    inputProps={{maxLength: 6}}
                                    fullWidth
                                    onChange={e => setCode(e.target.value.replace(/[\D ]/g,''))}
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
                                Verifi&euml;ren
                            </Button>
                        </CardActions>
                    </form>
                </Card>
            </div>
        </ThemeProvider>
    );
};

export default compose(
    withStyles(styles),
    withTranslate
)(LoginVerifyPageComponent);
