import api from "../api";
import { ref } from 'vue';
import { useStore } from "vuex";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import moment from "moment";

let refreshTimeout = null;

export function useAuth() {
    const loading = ref(false);
    const error = ref(false);

    const store = useStore()

    const register = async (data) => {
        try {
            loading.value = true
            const response = await api.post("/users/register", data)
            const user = response.data.user;
            return user
        } catch (err) {
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }

    const checkEmail = async (email) => {
        try {
            loading.value = true
            const response = await api.get("/users/check-email/" + email)

            return response
        } catch (err) {
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }
    const checkUsername = async (username) => {
        try {
            loading.value = true
            const response = await api.get("/users/check-username/" + username)

            return response
        } catch (err) {
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }
    const checkAccount = async (data) => {
        try {
            loading.value = true

            const response = await api.post("/users/check-account", {
                token: data.token
            })

            await auth({
                emailOrUsername: data.user.email,
                password: data.user.password
            })
            loading.value = false
            return response
        } catch (err) {
            loading.value = false
            console.log(err.message)
            throw err
        }
    }

    const auth = async (data) => {
        try {
            loading.value = true
            const response = await api.post("/users/login", data)

            const user = response.data.user
            const accessToken = response.data.accessToken
            const sessionId = response.data.sessionId

            store.dispatch("setUser", user)
            store.dispatch("setAccessToken", accessToken)

            scheduleTokenRefresh(accessToken)
            setRefreshTokenFromCookies(sessionId)

            return response
        } catch (err) {
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }

    const forgotPassword = async (email) => {
        try {
            loading.value = true
            const response = await api.post("/users/forgot-password", { email })
            return response
        } catch (err) {
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }

    const resetPassword = async (data) => {
        try {
            loading.value = true
            const response = await api.post("/users/reset-password", {
                newPassword: data.newPassword,
                token: data.token
            })

            const user = response.data.user
            const password = data.newPassword

            await auth({
                emailOrUsername: user.email,
                password
            })
            loading.value = false
            return response
        } catch (err) {
            loading.value = false
            console.log(err.message)
            throw err
        }
    }

    const logout = async (session_id) => {
        try {
            loading.value = true
            await api.delete("/users/session/"+session_id)

            store.dispatch("setUser", null)
            store.dispatch("setAccessToken", null)
            clearRefreshToken()
        } catch (err) {
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }

    }

    // tem como finalidade refrescar o token de acesso
    const refreshToken = async (sessionId) => {
        try {
            loading.value = true
            const res = await api.post("/users/refresh-token", {
                sessionId
            })
            const user = res.data.user
            const accessToken = res.data.accessToken
            store.dispatch("setUser", user)
            store.dispatch("setAccessToken", accessToken)
            
            scheduleTokenRefresh(accessToken)
        } catch (err) {
            if (err.response.status == 401) {
                clearRefreshToken()
            }
            console.log(err.message)
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        error,
        register,
        checkEmail,
        checkUsername,
        checkAccount,
        forgotPassword,
        resetPassword,
        refreshToken,
        logout,
        auth
    }
}

function clearRefreshToken() {
    Cookies.remove("session_id")
};

// descodifica o token
function decodeToken(token) {
    try {
        return jwtDecode(token);
    } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        return null;
    }
}

// Agenda a renovação automática do token
function scheduleTokenRefresh(token) {
    if (refreshTimeout) clearTimeout(refreshTimeout);

    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) {
        throw new Error("Token inválido ou sem campo exp.")
    }

    // Calcula o tempo até a expiração (em ms)
    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();
    const timeUntilRefresh = expirationTime - currentTime - 60 * 1000; // 1 minuto antes de expirar

    if (timeUntilRefresh > 0) {
        refreshTimeout = setTimeout(async () => {
            try {
                const session_id = Cookies.get("session_id")
                await refreshToken(session_id);
            } catch (error) {
                console.error("Erro ao renovar o token automaticamente:", error);
            }
        }, timeUntilRefresh);
    }
}

function setRefreshTokenFromCookies(token) {
    const refreshToken = String(token)
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getFullYear() + 1);
    Cookies.set("session_id", refreshToken, {
        secure: true,
        saneSite: "Strict",
        expires: expirationDate
    })
}