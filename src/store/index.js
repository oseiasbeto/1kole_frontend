import { createStore } from 'vuex'

export default createStore({
    state: {
        kool: {},
        kools: {
            data: [],
            metadata: {}
        },
        viewedKools: [],
        replies: {
            data: [],
            metadata: {}
        },
        user: {},
        accessToken: null,
        modal: {
            show: false,
            name: "",
            data: {}
        },
        toast: {
            show: false,
            message: "",
            autoClose: 2500,
            position: "bottom-center",
            type: "info"
        }
    },
    mutations: {
        ["SET_KOOL"](state, payload) {
            state.kool = payload
        },
        ['SET_KOOLS'](state, payload) {
            state.kools = {
                data: payload.kools,
                metadata: payload.metadata
            }
        },
        ['STORE_KOOL_DATA'](state, { kool, replies }) {
            if (!kool || !kool._id) return;

            const existingKoolIndex = state.viewedKools.findIndex(k => k._id === kool._id);

            if (existingKoolIndex === -1) {
                state.viewedKools.push({ ...kool, replies });
            } else {
                state.viewedKools[existingKoolIndex].replies = replies;
            }
        },
        ['ADD_REPLY_FROM_VIEWEDKOOLS'](state, { index, newReply }) {
            // Verifica se o índice é válido e se o array existe para evitar erros
            if (index === -1 || !state.viewedKools || !state.viewedKools[index]) return;

            const viewedKools = state.viewedKools[index];

            // Se `replies` não existir, inicializa corretamente
            if (!viewedKools.replies) {
                viewedKools.replies = { kools: [], metadata: { totalDocuments: 0, limit: 10, currentPage: 1, totalPages: 1 } };
            }

            // Referência ao array de replies carregadas
            const items = viewedKools.replies.kools;

            // Define um limite fixo para paginação
            const limit = 10;

            // Atualiza o total de replies garantindo que sempre seja um número válido
            const totalDocuments = (viewedKools.replies.metadata?.totalDocuments || 0) + 1;

            // Calcula a página atual corretamente, garantindo que novos itens sejam contabilizados
            const currentPage = Math.ceil((items.length + 1) / limit);

            // Calcula o total de páginas baseando-se no total de replies
            const totalPages = Math.ceil(totalDocuments / limit);

            // Cria um novo objeto para evitar mutação direta do estado Vuex
            state.viewedKools[index] = {
                ...viewedKools,
                replies: {
                    ...viewedKools.replies,
                    kools: [newReply, ...items], // Adiciona o novo reply no início da lista
                    metadata: { totalDocuments, limit, currentPage, totalPages } // Atualiza os metadados corretamente
                }
            };
        },
        ['SET_REPLIES'](state, payload) {
            state.replies = {
                data: payload.kools,
                metadata: payload.metadata
            }
        },
        ['ADD_REPLY_FROM_REPLIES'](state, { index, newReply }) {
            const replies = state.replies
            const items = replies.data; // Lista de replies carregados
            const limit = 10; // Tamanho da página (fixo)
            const totalDocuments = (replies.metadata.totalDocuments || 0) + 1; // Atualiza o total de replies

            // Calcula a página atual corretamente
            const currentPage = items.length > 0 ? Math.ceil((items.length + 1) / limit) : 1;
            const totalPages = Math.ceil(totalDocuments / limit);

            // Criar novo array para evitar mutação direta
            replies.data = [newReply, ...items];
            replies.metadata = {
                totalDocuments,
                limit,
                currentPage,
                totalPages
            }
        },
        ['UPDATE_REPLY_LIST'](state, { index, newReplyId }) {
            if (!state.replies || !state.replies.data || !Array.isArray(state.replies.data)) {
                console.warn("Tentativa de atualizar replies em um estado inválido.");
                return;
            }

            if (index === -1 || !state.replies.data[index]) {
                console.warn("Índice inválido para atualização de replies.");
                return;
            }

            // Garante que a chave `replies` exista e seja um array
            if (!state.replies.data[index].replies) {
                state.replies.data[index].replies = [];
            }

            // Adiciona a nova resposta à lista de replies
            state.replies.data[index].replies.push(newReplyId);
        },
        ["SET_USER"](state, payload) {
            state.user = payload
        },
        ["SET_ACCESS_TOKEN"](state, payload) {
            state.accessToken = payload
        },
        ["SET_MODAL"](state, payload) {
            state.modal = payload
        },
        ["SET_TOAST"](state, payload) {
            state.toast = payload
        },
        ["TOGGLE_LIKE_KOOLS"](state, { koolId, userId }) {
            const kool = state.kools.data.find(k => k._id === koolId);
            if (!kool) return;

            const index = kool.likes.indexOf(userId);
            if (index === -1) {
                kool.likes.push(userId);
            } else {
                kool.likes.splice(index, 1);
            }
        },
        ["UPDATE_KOOL_LIKES"](state, userId) {
            const kool = state.kool
            if (!kool) return;

            const index = kool.likes.indexOf(userId);

            if (index === -1) {
                kool.likes.push(userId);
            } else {
                kool.likes.splice(index, 1);
            }
        },
        ["UPDATE_KOOL_REKOOLS"](state, userId) {
            const kool = state.kool
            if (!kool) return;

            const index = kool.reKools.indexOf(userId);

            if (index === -1) {
                kool.reKools.push(userId);
            } else {
                kool.reKools.splice(index, 1);
            }
        },
        ["TOGGLE_REPOST_KOOLS"](state, { koolId, userId }) {
            const kool = state.kools.data.find(k => k._id === koolId);
            if (!kool) return;

            const index = kool.reKools.indexOf(userId);
            if (index === -1) {
                kool.reKools.push(userId);
            } else {
                kool.reKools.splice(index, 1);
            }
        },
        ["TOGGLE_LIKE_REPLIES"](state, { replyId, userId }) {
            const reply = state.replies.data.find(r => r._id === replyId);
            if (!reply) return;

            const index = reply.likes.indexOf(userId);
            if (index === -1) {
                reply.likes.push(userId);
            } else {
                reply.likes.splice(index, 1);
            }
        },
        ["TOGGLE_REPOST_REPLIES"](state, { replyId, userId }) {
            const reply = state.replies.data.find(r => r._id === replyId);
            if (!reply) return;

            const index = reply.reKools.indexOf(userId);
            if (index === -1) {
                reply.reKools.push(userId);
            } else {
                reply.reKools.splice(index, 1);
            }
        },
        ["FOLLOW_AUTHOR_KOOL"](state, followerId) {
            const kool = state.kool;
            if (!kool) return;
            else {
                kool.author.followers.push(followerId);
            }
        }
    },
    actions: {
        setKool({ commit }, payload) {
            commit('SET_KOOL', payload)
        },
        setKools({ commit }, payload) {
            commit('SET_KOOLS', payload)
        },
        setReplies({ commit }, payload) {
            commit('SET_REPLIES', payload)
        },
        setUser({ commit }, payload) {
            commit('SET_USER', payload)
        },
        setAccessToken({ commit }, payload) {
            commit('SET_ACCESS_TOKEN', payload)
        },
        setModal({ commit }, payload) {
            commit('SET_MODAL', payload)
        },
        storeKoolData({ commit }, { kool, replies }) {
            commit("STORE_KOOL_DATA", { kool, replies });
        },
        setToast({ commit }, payload) {
            commit('SET_TOAST', payload)
        }
    },
    getters: {
        kool: (state) => state.kool,
        kools: (state) => state.kools,
        replies: (state) => state.replies,
        viewedKools: (state) => state.viewedKools,
        getViewedKool: (state) => (id) => {
            return state.viewedKools.find(k => k._id === id) || null;
        },
        user: (state) => state.user,
        accessToken: (state) => state.accessToken,
        modal: (state) => state.modal,
        toast: (state) => state.toast,
        hasLogged: (state) => {
            if (!state.accessToken) return false
            else return true
        }
    }
})