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
    
    const getUserByUsername = async (username) => {
        try {
            loading.value = true
            const response = await api.get("/users/"+username)

            const user = response.data.user

            store.dispatch("setUser", user)
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
        getUserByUsername
    }
}