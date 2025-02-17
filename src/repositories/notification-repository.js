import api from "../api";
import { ref } from 'vue';
import { useStore } from "vuex";

export function useNotifications() {
    const loading = ref(false);
    const store = useStore()

    const getNotifications = async (filter) => {
        try {
            loading.value = true
            const response = await api.get("/notifications", {
                params: filter
            })

            const data = response.data.notifications
            const metadata = response.data.metadata
            store.commit("SET_NOTIFICATIONS", {
                data,
                metadata
            })
            return {
                data,
                metadata
            }
        } catch (err) {
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }
  
    return {
        loading,
        getNotifications
    }
}