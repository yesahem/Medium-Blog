import axios from 'axios';
import { SyntheticEvent } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { USER_API_ENDPOINT_LOCAL } from './env';

interface loginProp{
    e?: SyntheticEvent,
    email: string,
    password: string,
    token: string,
    navigate: NavigateFunction,
    alertSuccess: AlertFunction,
    alertError: AlertFunction
}
type AlertFunction = any;

export const LoginHandler = async ({ e,email, password, token, navigate, alertSuccess, alertError}: loginProp
): Promise<void> => {
    e?.preventDefault();

    try {
        const res = await axios.post(
            `${USER_API_ENDPOINT_LOCAL}/signin`,
            { email, password },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log("Response: ", res);

        if (res.data.getUser.email === email) {
            console.log(`email: ${email}`);

            localStorage.setItem("isLogin", "false");
            if (res.data.getUser.password === password) {
                console.log("Login Response is:", res);
                alertSuccess();
                localStorage.setItem("jwt-token", res.data.token);
                localStorage.setItem("isLogin", "true");
                navigate("/blog");
            } else {
                alertError("Incorrect Password");
            }
        } else {
            alertError("Incorrect Email");
        }
    } catch (err) {
        console.error("Login Error", err);
        if (axios.isAxiosError(err) && err.response?.data?.message) {
            alertError(err.response.data.message);
        } else {
            alertError("Invalid Credentials");
        }
    }
};
