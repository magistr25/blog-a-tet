import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {Navigate} from "react-router-dom";

import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {useForm} from "react-hook-form";

import styles from "./Login.module.scss";
import { fetchAuthUserData, selectIsAuthData } from "../../redux/slices/auth";


export const Login = () => {
    const isAuth = useSelector(selectIsAuthData)
    const dispatch = useDispatch();
    console.log(isAuth)
    const {
        register,
        handleSubmit,
        setError,
        formState: {errors, isValid}
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onChange',
    });

    const onSubmit = async (values) => {
        try {
            const data = await dispatch(fetchAuthUserData(values));

            // Логируем ответ для диагностики
            console.log('Data from fetchAuthUserData:', data);

            if (data.payload) {
                if ('token' in data.payload) {
                    window.localStorage.setItem('token', data.payload.token);
                } else {
                    console.error('Токен не найден в ответе:', data.payload);
                    return alert('Токен не найден в ответе');
                }
            } else {
                console.error('Не удалось авторизоваться:', data);
                return alert('Не удалось авторизоваться');
            }
        } catch (error) {
            console.error('Error during submission:', error);
            alert('Произошла ошибка при авторизации');
        }
    };

    console.log(isAuth);


    if (isAuth) {
        return <Navigate to="/" />
    }
    return (
        <Paper classes={{root: styles.root}}>
            <Typography classes={{root: styles.title}} variant="h5">
                Вход в аккаунт
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    className={styles.field}
                    label="E-Mail"
                    type="email"
                    error={Boolean(errors.email?.message)}
                    helperText={errors.email?.message}
                    {...register("email", {required: 'Укажите почту'})}
                    fullWidth
                />
                <TextField className={styles.field}
                           label="Пароль"
                           error={Boolean(errors.password?.message)}
                           helperText={errors.password?.message}
                           {...register("password", {required: 'Укажите пароль'})}
                           fullWidth = 'true'
                />
                <Button type="submit" size="large" variant="contained" fullWidth >
                    Войти
                </Button>
            </form>
        </Paper>
    );
};
