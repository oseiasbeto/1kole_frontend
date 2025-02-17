import api from "../api";
import { ref } from 'vue';
import { useStore } from "vuex";

export function useUser() {
    const loading = ref(false);
    const store = useStore()

    const followUser = async (followingId) => {
        try {
            loading.value = true
            const response = await api.put("/users/follow/" + followingId)
            return response
        } catch (err) {
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }

    const getUsers = async (filter) => {
        try {
            loading.value = true
            const response = await api.get("/users", {
                params: filter
            })

            const users = response.data.users
            const metadata = response.data.metadata
            store.commit("SET_USERS", {
                users,
                metadata
            })
            return {
                users,
                metadata
            }
        } catch (err) {
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }

    const loadMore = async (filter) => {
        try {
            loading.value = true
            const response = await api.get("/users", {
                params: filter
            })

            const users = response.data.users
            const metadata = response.data.metadata

            store.commit('ADD_USER', {
                users,
                metadata
            })
        } catch (err) {
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }
    const getUserByUsername = async (username) => {
        try {
            loading.value = true
            const response = await api.get("/users/" + username)

            const user = response.data.user

            store.dispatch("setProfile", user)
            return user
        } catch (err) {
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }
    const updateProfile = async (formData) => {
        try {
            loading.value = true
            const response = await api.put("/users", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
            store.dispatch("setUser", response.data.user)
            store.dispatch("setProfile", response.data.user)
        } catch (err) {
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }

    return {
        loading,
        followUser,
        getUserByUsername,
        getUsers,
        loadMore,
        updateProfile
    }
}