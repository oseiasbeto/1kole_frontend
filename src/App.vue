<script setup>
import { computed, onBeforeMount } from 'vue';
import Container from './components/UI/Container.vue';
import { useAuth } from './repositories/auth-repository';
import Cookies from "js-cookie"
import SplashScreen from './components/UI/SplashScreen.vue';
import { useStore } from 'vuex';
const { refreshToken, loading } = useAuth()
loading.value = true

const store = useStore()
const sessionId = Cookies.get("session_id")

const user = computed(() => {
    return store.getters.user
})

const isLogged = computed(() => {
    const accessToken = store.getters.accessToken

    if(accessToken) return true
    else return false
})

onBeforeMount(async () => {
    if (sessionId) {
        await refreshToken(sessionId)
    } else {
        setTimeout(() => {
            loading.value = false
        }, 1500);
    }
})
</script>

<template>
    <!-- start main app area-->
    <div v-if="!loading">
        <Container>
        <router-view></router-view>
        </Container>
    </div>
    <div v-else>
        <SplashScreen/>
    </div>
    <!-- end main app area-->
</template>
