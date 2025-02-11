import api from "../api";
import { ref } from 'vue';
import { useStore } from "vuex";


export function useKool() {
    const loading = ref(false);
    const error = ref(false);

    const store = useStore()
    const getKools = async (filter) => {
        try {
            loading.value = true
            const response = await api.get("/kools", {
                params: filter
            })

            const kools = response.data.kools
            const metadata = response.data.metadata

            store.dispatch("setKools", {
                kools,
                metadata
            })
            return response
        } catch (err) {
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }

    const createKool = async (data) => {
        try {
            loading.value = true
            const response = await api.post("/kools", data)

            if (response.data) {
                const kools = store.getters.kools

                const newKool = response.data.kool;

                console.log(newKool)

                // Atualiza a state kools
                kools.data = [newKool, ...kools.data]
            }
        } catch (err) {
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }

    const toggleLike = async (koolId) => {
        try {
            loading.value = true
            const response = await api.put("/kools/like/" + koolId)
            return response
        } catch (err) {
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }
    
    const getKoolById = async (koolId) => {
        try {
            loading.value = true
            const response = await api.get("/kools/"+koolId)

            const kool = response.data.kool

            store.dispatch("setKool", kool)
        } catch (err) {
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }

    return {
        loading,
        error,
        createKool,
        getKools,
        toggleLike,
        getKoolById
    }
}