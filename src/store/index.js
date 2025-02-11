import { createStore } from 'vuex'

export default createStore({
    state: {
        kool: {},
        kools: {
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
        ["TOGGLE_REPOST_KOOLS"](state, { koolId, userId }) {
            const kool = state.kools.data.find(k => k._id === koolId);
            if (!kool) return;

            const index = kool.reKools.indexOf(userId);
            if (index === -1) {
                kool.reKools.push(userId);
            } else {
                kool.reKools.splice(index, 1);
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
        setUser({ commit }, payload) {
            commit('SET_USER', payload)
        },
        setAccessToken({ commit }, payload) {
            commit('SET_ACCESS_TOKEN', payload)
        },
        setModal({ commit }, payload) {
            commit('SET_MODAL', payload)
        },
        setToast({ commit }, payload) {
            commit('SET_TOAST', payload)
        }
    },
    getters: {
        kool: (state) => state.kool,
        kools: (state) => state.kools,
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