import api from "../api";
import { ref } from 'vue';
import { useStore } from "vuex";

export function useKool() {
    const loading = ref(false);
    const store = useStore()
    const modal = store.getters.modal

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
                    kools,
                    metadata
                })
            }
            return {
                kools,
                metadata
            }
        } catch (err) {
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }
    const loadMore = async ({ filter, isReplies }) => {
        try {
            loading.value = true
            const response = await api.get("/kools", {
                params: filter
            })

            const kools = response.data.kools
            const metadata = response.data.metadata

            if (!isReplies) {
                store.commit('ADD_KOOLS', {
                    kools,
                    metadata
                })
            } else {
                store.commit('ADD_REPLIES', {
                    kools,
                    metadata
                })
            }

        } catch (err) {
            console.log(err.message)
            throw err
        } finally {
            loading.value = false;
        }
    }

    const createKool = async (data) => {
        try {
            loading.value = true; // Ativa o estado de carregamento

            // Faz a requisição para criar um Kool
            const response = await api.post("/kools", data);

            if (!response.data.kool.parentKool) {
                const kools = store.getters.kools || { data: [], metadata: {} };
                const newKool = response.data.kool;

                // Garante que `kools.data` é um array antes de espalhá-lo
                store.dispatch("setKools", {
                    kools: [newKool, ...(Array.isArray(kools.data) ? kools.data : [])],
                    metadata: kools.metadata || {}
                });

                // Fecha o modal se estiver aberto
                if (modal?.show) {
                    store.dispatch("setModal", {
                        show: false,
                        name: modal.name,
                        data: modal.data
                    });
                }
            } else {
                const replies = store.getters.replies || { data: [] };
                const newReply = response.data.kool;
                const kool = store.getters.kool;

                // Verifica se `kool` está definido antes de acessar `_id`
                if (!kool || !kool._id) return;

                // Obtém a lista de Kools visualizados
                const viewedKools = store.getters.viewedKools || [];
                const index = viewedKools.findIndex(k => k._id === kool._id);

                if (data.shouldAddReply) {
                    // Se for uma resposta a um Kool visto, atualiza os estados corretamente
                    if (index !== -1) {
                        store.commit('ADD_REPLY_FROM_VIEWEDKOOLS', { index, newReply });
                        store.commit('ADD_REPLY_FROM_REPLIES', { index, newReply });
                    }
                } else {
                    // Atualiza a lista de replies se for uma resposta
                    const repliesData = Array.isArray(replies.data) ? replies.data : [];
                    const index = repliesData.findIndex(k => k._id === newReply.parentKool._id);

                    if (index !== -1) {
                        store.commit("UPDATE_REPLY_LIST", { index, newReplyId: newReply._id });
                    }

                    const index2 = viewedKools.findIndex(k => k._id === newReply.parentKool._id);

                    if (index2 !== -1) {
                        store.commit('ADD_REPLY_FROM_VIEWEDKOOLS', { index: index2, newReply });
                    }
                }

                // Fecha o modal se estiver aberto
                if (modal?.show) {
                    store.dispatch("setModal", {
                        show: false,
                        name: modal.name,
                        data: modal.data
                    });
                }

                return newReply;
            }
        } catch (err) {
            console.error("Erro ao criar Kool:", err.message || err);
        } finally {
            loading.value = false; // Desativa o estado de carregamento
        }
    };

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

    const deleteKoolById = async (data) => {
        try {
            loading.value = true
            await api.delete("/kools/" + data.kool._id)

            if (!data.isReply) {
                store.commit("REMOVE_KOOL_FROM_KOOLS", data.kool._id)
            } else {
                store.commit("REMOVE_REPLY_FROM_REPLIES", data.kool._id)
                store.commit("REMOVE_KOOL_FROM_VIEWED_KOOLS", { koolId: store.getters.kool._id, replyId: data.kool._id })
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
        createKool,
        getKools,
        loadMore,
        toggleLike,
        getKoolById,
        deleteKoolById
    }
}