<script setup>
import { computed, onBeforeMount } from 'vue';
import { useAuth } from './repositories/auth-repository';
import Cookies from "js-cookie"
import SplashScreen from './components/UI/SplashScreen.vue';
import { useStore } from 'vuex';
import CreateKoolModal from '@/components/UI/modals/CreateKoolModal.vue';
import Sidebar from '@/components/UI/Sidebar.vue';
import Content from './components/UI/Content.vue';
const { refreshToken, loading } = useAuth()
loading.value = true

const store = useStore()
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
    <div class="box-border" v-if="!loading">
        <div class="flex w-full">
            <Sidebar v-if="isLogged" />

            <div class="mx-auto">
                <div class="flex grow">
                    <!--start content-->
                    <Content>
                        <router-view></router-view>
                    </Content>
                    <!--end content-->
                </div>
            </div>
        </div>


        <!--start modals-->
        <CreateKoolModal />
        <!--end modals-->
    </div>
    <div v-else>
        <SplashScreen />
    </div>
    <!-- end main app area-->
</template>
