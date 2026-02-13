<script setup>
import { computed, onBeforeMount } from 'vue';
import { useAuth } from './repositories/auth-repository';
import Cookies from "js-cookie"
import SplashScreen from './components/UI/SplashScreen.vue';
import { useStore } from 'vuex';
import CreateKoolModal from '@/components/UI/modals/CreateKoolModal.vue';
import Sidebar from '@/components/UI/Sidebar.vue';
import Content from './components/UI/Content.vue';
import EditProfileModal from './components/UI/modals/EditProfileModal.vue';
import Header from './views/home/components/Header.vue';
import { useRoute } from 'vue-router';
const { refreshToken, loading } = useAuth()
loading.value = true

const store = useStore()
const route = useRoute()

const sessionId = Cookies.get("session_id")

const user = computed(() => {
    return store.getters.user
})

const isLogged = computed(() => {
    const accessToken = store.getters.accessToken

    if (accessToken) return true
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
    <div class="box-border select-none text-text-primary text-title font-primary overflow-x-hidden mb-14 lg:mb-0"
        v-if="!loading">
        <div class="flex flex-col lg:flex-row w-full">
            <div v-if="isLogged && route.meta?.rootPage == 'home'" class="mb-[88px]">
                <Header />
            </div>
            <div>
                <router-view v-slot="{ Component }">
                    <keep-alive :include="['Composer']">
                        <component :is="Component" />
                    </keep-alive>
                </router-view>
            </div>
        </div>


        <!--start modals-->
        <CreateKoolModal />
        <EditProfileModal />
        <!--end modals-->
    </div>
    <div v-else>
        <SplashScreen />
    </div>
    <!-- end main app area-->
</template>
