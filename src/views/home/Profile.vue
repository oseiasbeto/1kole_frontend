<script setup>
import { useRouter, useRoute, onBeforeRouteLeave } from "vue-router";
import Avatar from "@/components/UI/Avatar";
import Tabs from "@/components/tabs/Tabs";
import TabItem from "@/components/tabs/TabItem";
import formatCount from "@/utils/formatCount";
import Paragraph from "@/components/UI/Paragraph.vue";
import { ref, onMounted, computed, watch } from "vue";
import { toast } from "vue3-toastify"
import { useUser } from "@/repositories/user-repository";
import { useStore } from "vuex";
import CreateKoolBtn from "@/components/UI/buttons/CreateKoolBtn.vue";
import SpinnerNormal from "@/components/UI/spinners/SpinnerNormal.vue";
import KoolList from "@/components/kools/KoolList.vue";
import { useKool } from "@/repositories/kool-repository";
import EmptyKools from "@/components/kools/EmptyKools.vue";
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { useAuth } from "@/repositories/auth-repository";
const { getUserByUsername, loading } = useUser()
const { followUser, loading: followUserLoading } = useUser()
const { logout, loading: logoutLoading } = useAuth()
loading.value = true
const router = useRouter()
const route = useRoute()
const store = useStore()
const tabView = ref('kools')
const profileUsername = ref(route.params.username || null)
const user = computed(() => store.getters.user)
import Cookies from "js-cookie"
const profile = computed(() => store.getters.profile)
const followersCount = computed(() => profile.value?.followers?.length || 0);
const followingCount = computed(() => profile.value?.following?.length || 0);
const isFollowing = computed(() => profile.value?.followers.includes(user.value?._id));
const itsMe = computed(() => profile?.value?._id === user?.value?._id);
const { getKools, loading: getKoolsLoading } = useKool()
const { loadMore, loading: loadMoreLoading } = useKool()

const sessionId = Cookies.get("session_id")

const goBack = () => {
    router.back()
}

const filter = ref({
    page: 1,
    limit: 10,
    author: profile.value._id,
    populate: 'author, parentKool, media',
    isReply: false
})

const kools = computed(() => {
    return store.getters.kools
})

const editProfile = () => {
    store.dispatch("setModal", {
        show: true,
        name: 'edit profile',
        data: {}
    });
}

const onLoadMore = async (page) => {
    filter.value.page = page;
    await loadMore({
        filter: filter.value,
        isReplies: false
    })
}
const scrollOnTop = () => {
    window.scrollTo(0, 0)
}

// Seguir o autor do Kool
const followAuthor = async (profile) => {
    await followUser(profile).then((res) => {
        store.commit('FOLLOW_USER', user.value._id);
        toast(res.data.message, {
            theme: "colored",
            position: "bottom-center",
            autoClose: 1500,
            type: "info"
        });
    }).catch(err => {
        toast(err.response.data.message, {
            theme: "colored",
            position: "bottom-center",
            autoClose: 1500,
            hideProgressBar: true,
            type: "info"
        });
    });
};

onMounted(async () => {
    scrollOnTop()
    await getUserByUsername(profileUsername?.value).then(async user => {
        filter.value.author = user._id
        await getKools(filter.value)
    })
})


// Copia o link do Kool para a área de transferência
const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast("Link copiado!", {
        theme: "colored",
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: true,
        type: "info"
    })
};

const closeSession = async () => {
    await logout(sessionId).then(() => {
        router.replace("/")
    })
}

onBeforeRouteLeave((to, from, next) => {
    store.commit("RESET_KOOLS")
    next(); // Lembre-se de chamar next() para permitir a navegação
});

watch(tabView, async (newVal, oldVal) => {
    // Remove filtros anteriores que podem ter sido adicionados
    delete filter.value['media[exists]'];
    delete filter.value['rekools'];
    delete filter.value['likes'];

    switch (newVal) {
        case "kools":
            // Remove a propriedade 'author' do filtro
            filter.value.author = profile.value._id;
            break;
        case "media":
            filter.value['media[exists]'] = true;
            break;
        case "rekools":
            filter.value['rekools'] = true;
            break;
        case "liked":
            // Remove a propriedade 'author' do filtro
            delete filter.value.author;
            filter.value['likes'] = { in: [profile.value._id] };
            break;
        default:
            // Para outras tabs, não adiciona nenhum filtro específico
            break;
    }

    // Chama a API com os filtros atualizados
    await getKools(filter.value);
});

watch(() => route.params.username, async (newId, oldId) => {
    if (newId !== oldId) {
        scrollOnTop()
        tabView.value = 'kools'
        await getUserByUsername(newId).then(async user => {
            filter.value.author = user._id
            await getKools(filter.value)
        })
    }
});
</script>

<template>
    <div>
        <div v-if="!loading" class="relative">
            <!--start background image area-->
            <div class="w-full h-[150px] bg-light relative">
                <button @click="goBack"
                    class="absolute z-[11] flex justify-center text-muted items-center rounded-full w-[30px] h-[30px] top-[10px] left-[10px] bg-black/[0.5]">
                    <svg fill="none" viewBox="0 0 24 24" width="24" height="24">
                        <path fill="white" fill-rule="evenodd" clip-rule="evenodd"
                            d="M3 12a1 1 0 0 1 .293-.707l6-6a1 1 0 0 1 1.414 1.414L6.414 11H20a1 1 0 1 1 0 2H6.414l4.293 4.293a1 1 0 0 1-1.414 1.414l-6-6A1 1 0 0 1 3 12Z">
                        </path>
                    </svg>
                </button>
                <img class="w-full h-full z-[1px] pointer-events-none object-cover absolute top-0 right-0 left-0"
                    v-if="profile?.coverPhoto.url" v-lazy="profile?.coverPhoto.url">
            </div>
            <!--end background image area-->

            <!--start content area-->
            <div class="px-4 pb-2 pt-3">
                <!--start actions area-->
                <div class="pl-[90px] gap-1.5 flex items-center justify-end">
                    <Menu as="div" @click.stop class="relative inline-block text-left">
                        <div class="z-[10px]">
                            <MenuButton id="more" @click.stop
                                class="flex justify-center text-muted items-center border border-border hover:bg-light rounded-full w-[34px] h-[32px]">
                                <svg fill="none" width="16" viewBox="0 0 24 24" height="16">
                                    <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                                        d="M2 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm16 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm-6-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z">
                                    </path>
                                </svg>
                            </MenuButton>
                        </div>
                        <Transition enter-active-class="transition duration-100 ease-out"
                            enter-from-class="transform scale-95 opacity-0"
                            enter-to-class="transform scale-100 opacity-100"
                            leave-active-class="transition duration-75 ease-in"
                            leave-from-class="transform scale-100 opacity-100"
                            leave-to-class="transform scale-95 opacity-0">
                            <MenuItems
                                class="absolute right-0 bottom-full mb-2 w-48 origin-bottom-right divide-y divide-gray-200 z-[100] rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div class="py-1">
                                    <MenuItem v-slot="{ active }">
                                    <button @click="copyLink" type="button"
                                        class="w-full flex items-center justify-between text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Compartilhar

                                        <svg fill="none" viewBox="0 0 24 24" width="20" height="20">
                                            <path fill="hsl(211, 24%, 34.2%)" fill-rule="evenodd" clip-rule="evenodd"
                                                d="M12.707 3.293a1 1 0 0 0-1.414 0l-4.5 4.5a1 1 0 0 0 1.414 1.414L11 6.414v8.836a1 1 0 1 0 2 0V6.414l2.793 2.793a1 1 0 1 0 1.414-1.414l-4.5-4.5ZM5 12.75a1 1 0 1 0-2 0V20a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-7.25a1 1 0 1 0-2 0V19H5v-6.25Z">
                                            </path>
                                        </svg>
                                    </button>
                                    </MenuItem>

                                    <!-- Renderiza a opção "Eliminar" somente se o usuário for o autor -->
                                    <MenuItem v-if="itsMe" v-slot="{ active }">
                                    <button @click="closeSession()" type="button"
                                        class="w-full flex items-center justify-between text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100">
                                        Encerrar Sessão
                                        <svg fill="none" viewBox="0 0 24 24" width="20" height="20">
                                            <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                                                d="M7.416 5H3a1 1 0 0 0 0 2h1.064l.938 14.067A1 1 0 0 0 6 22h12a1 1 0 0 0 .998-.933L19.936 7H21a1 1 0 1 0 0-2h-4.416a5 5 0 0 0-9.168 0Zm2.348 0h4.472c-.55-.614-1.348-1-2.236-1-.888 0-1.687.386-2.236 1Zm6.087 2H6.07l.867 13h10.128l.867-13h-2.036a1 1 0 0 1-.044 0ZM10 10a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1Zm4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1Z">
                                            </path>
                                        </svg>
                                    </button>
                                    </MenuItem>
                                </div>
                            </MenuItems>
                        </Transition>
                    </Menu>

                    <button @click="followAuthor(profile?._id)" :disabled="followUserLoading" v-if="!itsMe"
                        class="flex text-sm border bg-primary border-primary text-white font-semibold gap-2 justify-center  items-center bg-light-dark hover:opacity-80 rounded-full py-1 px-5"
                        :class="{ 'bg-white hover:bg-light !text-title !border-border': isFollowing }">
                        <p class="mb-[3px]">{{ isFollowing ? 'Seguindo' : '+Seguir' }}</p>
                    </button>
                    <button v-else @click="editProfile"
                        class="flex text-sm border bg-white hover:bg-light text-title border-border font-semibold gap-2 justify-center  items-center bg-light-dark hover:opacity-80 rounded-full py-1 px-5">
                        <p class="mb-[3px]">Editar perfil</p>
                    </button>
                </div>
                <!--end actions area-->

                <!--start content area-->
                <div class="pt-4 gap-0.5 w-full pb-2">
                    <div
                        class="text-title flex items-center gap-0.5 truncate text-[26px] lg:text-[32px] leading-10 font-bold">
                        <p class=" leading-8 whitespace-break-spaces">
                            {{ profile.name }}
                            <span v-if="profile.verified"
                                class="max-w-[24px] text-[#1d9bf0] inline-flex ml-0.5 items-center justify-center h-[24px]">
                                <svg viewBox="0 0 22 22" fill="currentColor" width="22px" height="22px"
                                    aria-label="Conta verificada" role="img" class="mt-[2px]"
                                    data-testid="icon-verified">
                                    <g>
                                        <path
                                            d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z">
                                        </path>
                                    </g>
                                </svg>
                            </span>
                        </p>

                    </div>
                    <div class="text-base truncate overflow-hidden break-words text-ellipsis max-w-full text-muted">
                        @{{ profile.username }}
                    </div>
                </div>

                <div class="flex items-center gap-2">
                    <router-link class="flex text-base hover:underline items-center gap-1" to="#">
                        <span class="font-semibold text-light-text">{{ formatCount(followersCount) }}</span>
                        <span class="text-muted">{{ followersCount == 1 ? 'Seguidor' : 'seguidores' }}</span>
                    </router-link>
                    <router-link class="flex text-base hover:underline items-center gap-1" to="#">
                        <span class="font-semibold text-light-text">{{ formatCount(followingCount) }}</span>
                        <span class="text-muted">seguindo</span>
                    </router-link>
                </div>

                <div v-if="profile.bio.length" class="pt-2 pb-1">
                    <paragraph custom="text-base text-light-text leading-[21px]" :txt="profile.bio" />
                </div>
                <!--end content area-->
            </div>
            <!--end content area-->

            <!--start tabs area-->
            <tabs>
                <tab-item title="Kools" @onpress="tabView = 'kools'" :active="tabView == 'kools'" />
                <tab-item title="Rekools" @onpress="tabView = 'rekools'" :active="tabView == 'rekools'" />
                <tab-item title="Mídia" @onpress="tabView = 'media'" :active="tabView == 'media'" />
                <tab-item title="Curtidas" @onpress="tabView = 'liked'" :active="tabView == 'liked'" />
            </tabs>
            <!--end tabs area-->

            <!--start posts area-->
            <div class="z-[100]">
                <div v-if="!getKoolsLoading">
                    <KoolList v-if="kools.data.length" :load-more-loading="loadMoreLoading" :kools="kools.data"
                        :is-replies="false" :metadata="kools.metadata" @load-more="onLoadMore" />
                    <div class="h-[40vh]" v-else>
                        <EmptyKools />
                    </div>
                </div>

                <div v-else class="flex justify-center items-center my-10">
                    <SpinnerNormal />
                </div>
            </div>

            <!--end posts area-->

            <!--start avatar area-->
            <div class="absolute rounded-full w-[90px] h-[90px] top-[110px] left-[10px]">
                <avatar :url="profile.profileImage.url" custom="w-full h-full" />
            </div>
            <!--end avatar area-->
        </div>
        <div class="flex justify-center items-center h-screen" v-else>
            <SpinnerNormal />
        </div>

        <div v-if="itsMe">
            <CreateKoolBtn />
        </div>
    </div>
</template>