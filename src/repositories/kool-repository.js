import router from "@/router";
import api from "../api";
import { ref } from 'vue';
import { useStore } from "vuex";
import { useRoute } from "vue-router";

export function useKool() {
    const loading = ref(false);
    const error = ref(false);

    const store = useStore()
    const router = useRoute()

    const getKools = async (filter) => {
        try {
            loading.value = true
            const response = await api.get("/kools", {
                params: filter
            })

            const kools = response.data.kools
            const metadata = response.data.metadata

            if (!filter.parentKool) {
                store.dispatch("setKools", {
                    kools,
                    metadata
                })
            } else {
                store.dispatch("setReplies", {
                    replies: kools,
                    metadata
                })
            }
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

            if (!response.data.kool.parentKool) {
                const kools = store.getters.kools
                const newKool = response.data.kool;

                // Atualiza a state kools
                store.dispatch("setKools", {
                    kools: [newKool, ...kools.data],
                    metadata: kools.metadata
                })
            } else {
                const replies = store.getters.replies
                const newReply = response.data.kool;

                // Atualiza a state kools
                if (!data.isReply) {
                    store.dispatch("setReplies", {
                        replies: [newReply, ...replies.data],
                        metadata: replies.metadata
                    })
                } 
                const modal = store.getters.modal
                store.dispatch("setModal", {
                    show: false,
                    name: modal.name,
                    data: modal.data
                })
                return newReply
            }
        } catch (err) {
            console.log(err)
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
            const response = await api.get("/kools/" + koolId)

            const kool = response.data.kool

            store.dispatch("setKool", kool)
            return kool
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