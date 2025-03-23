import { createStore } from 'vuex'

export default createStore({
    state: {
        kool: {},
        kools: {
            data: [],
            metadata: {}
        },
        users: {
            data: [],
            metadata: {}
        },
        usersSearch: {
            data: [],
            metadata: {}
        },
        notifications: {
            data: [],
            metadata: {}
        },
        viewedKools: [],
        replies: {
            data: [],
            metadata: {}
        },
        activeUploads: [], // Array de Promises de upload
        user: {},
        profile: {},
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
        ['SET_NOTIFICATIONS'](state, payload) {
            state.notifications = {
                data: payload.data,
                metadata: payload.metadata
            }
        },
        ['RESET_KOOLS'](state, payload) {
            state.kools = {
                data: [],
                metadata: {}
            }
        },
        ['SET_USERS_SEARCH'](state, payload) {
            state.usersSearch = {
                data: payload.users,
                metadata: payload.metadata
            }
        },
        ['SET_USERS_SEARCH'](state, payload) {
            state.usersSearch = {
                data: [],
                metadata: {}
            }
        },
        ['SET_USERS'](state, payload) {
            state.users = {
                data: payload.users,
                metadata: payload.metadata
            }
        },
        ['ADD_USER'](state, payload) {
            state.users.data = [...state.users.data, ...payload.data]; // Adiciona os novos Kools
            state.users.metadata = payload.metadata; // Atualiza metadados
        },
        ['ADD_KOOLS'](state, payload) {
            state.kools.data = [...state.kools.data, ...payload.kools]; // Adiciona os novos Kools
            state.kools.metadata = payload.metadata; // Atualiza metadados
        },
        ['RESET_KOOLS'](state, payload) {
            state.kools.data = []; // Adiciona os novos Kools
            state.kools.metadata = {}; // Atualiza metadados
        },
        ['REMOVE_KOOL_FROM_KOOLS'](state, koolId) {
            // Filtra a lista para manter apenas os kools cujo _id não seja o koolId a remover
            state.kools.data = state.kools.data.filter(k => k._id !== koolId);

            // Atualize os metadados conforme necessário
            state.kools.metadata.totalDocuments = state.kools.metadata.totalDocuments - 1;
            // Recalcule currentPage e totalPages, se necessário:
            const limit = state.kools.metadata.limit || 10;
            state.kools.metadata.currentPage = state.kools.data.length > 0 ? Math.ceil(state.kools.data.length / limit) : 1;
            state.kools.metadata.totalPages = Math.ceil(state.kools.metadata.totalDocuments / limit);
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
        ['REMOVE_KOOL_FROM_VIEWED_KOOLS'](state, { koolId, replyId }) {
            console.log(koolId, replyId)
            console.log(state.viewedKools)
            // Verifica se existe a estrutura esperada
            if (!state.viewedKools) return;

            // Remove o kool cujo _id seja igual a koolId
            const index = state.viewedKools.findIndex(kool => kool._id === koolId)
            console.log(index)
            if (index === -1) return
            // Atualiza o total de documentos
            const viewedKools = state.viewedKools[index]


            viewedKools.replies.kools = viewedKools.replies.kools.filter(kool => kool._id !== replyId);

            /* 
            viewedKools.replies.metadata.totalDocuments = viewedKools.replies.metadata.totalDocuments - 1;

            // Recalcula currentPage e totalPages com base no novo array e no limite
            const limit = viewedKools.replies.metadata.limit || 10;
            viewedKools.replies.metadata.currentPage = viewedKools.replies.data.length > 0
                ? Math.ceil(viewedKools.replies.data.length / limit)
                : 1;
            viewedKools.replies.metadata.totalPages = Math.ceil(viewedKools.replies.metadata.totalDocuments / limit);*/
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
        ['REMOVE_REPLY_FROM_REPLIES'](state, replyId) {
            // Filtra a lista para manter apenas os replies cujo _id não seja o replyId a remover
            state.replies.data = state.replies.data.filter(reply => reply._id !== replyId);

            // Atualiza os metadados conforme necessário
            state.replies.metadata.totalDocuments = state.replies.metadata.totalDocuments - 1;

            // Recalcula currentPage e totalPages
            const limit = state.replies.metadata.limit || 10;
            state.replies.metadata.currentPage = state.replies.data.length > 0 ? Math.ceil(state.replies.data.length / limit) : 1;
            state.replies.metadata.totalPages = Math.ceil(state.replies.metadata.totalDocuments / limit);
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

            console.log(replies)
        },
        ['ADD_REPLIES'](state, payload) {
            state.replies.data = [...state.replies.data, ...payload.kools]; // Adiciona os novos Kools
            state.replies.metadata = {
                currentPage: payload.metadata.currentPage,
                totalDocuments: state.replies.metadata.totalDocuments,
                totalPages: payload.metadata.totalPages,
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
        ["SET_PROFILE"](state, payload) {
            state.profile = payload
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
            console.log(kool)
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
        ADD_UPLOAD(state, uploadPromise) {
            state.activeUploads.push(uploadPromise);
        },
        REMOVE_UPLOAD(state, uploadPromise) {
            state.activeUploads = state.activeUploads.filter(p => p !== uploadPromise);
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
                console.log("Aki")
                reply.reKools.splice(index, 1);
            }
        },
        ["FOLLOW_AUTHOR_KOOL"](state, followerId) {
            const kool = state.kool;
            if (!kool) return;
            else {
                kool.author.followers.push(followerId);
            }
        },
        ["FOLLOW_USER"](state, followerId) {
            const profile = state.profile;
            if (!profile) return;
            else {

                if (!profile.followers.includes(followerId)) {
                    profile.followers.push(followerId);
                } else {
                    profile.followers = profile.followers.filter(userId => userId !== followerId)
                }
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
        setProfile({ commit }, payload) {
            commit('SET_PROFILE', payload)
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
        addUpload({ commit }, uploadPromise) {
            commit('ADD_UPLOAD', uploadPromise);
            uploadPromise
                .then(() => {
                    commit('REMOVE_UPLOAD', uploadPromise);
                })
                .catch(() => {
                    commit('REMOVE_UPLOAD', uploadPromise);
                });
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
        notifications: (state) => state.notifications,
        users: (state) => state.users,
        usersSearch: (state) => state.usersSearch,
        profile: (state) => state.profile,
        accessToken: (state) => state.accessToken,
        modal: (state) => state.modal,
        toast: (state) => state.toast,
        hasLogged: (state) => {
            if (!state.accessToken) return false
            else return true
        }
    }
})