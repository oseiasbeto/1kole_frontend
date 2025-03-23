<script setup>
import { defineProps, computed, ref } from 'vue';
import { useStore } from 'vuex'; // Importa o Vuex Store
import formatCount from "../../utils/formatCount";
import { toast } from "vue3-toastify"
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'

// Acessa o Vuex store
const store = useStore();

// Define as propriedades que o componente recebe
const props = defineProps({
    kool: {
        type: Object,
        required: true
    },
    isReply: {
        type: Boolean,
        required: true
    },
    isLoading: {
        type: Boolean,
        required: false
    },
    user: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(["update:like", "update:rekool", "copyText", "deleteKool", "openModal"]);
const showMenu = ref(false)

// Computed para verificar se o usuário já deu like ou repost
const isLiked = computed(() => props.kool?.likes?.includes(props.user._id) || false);
const isReposted = computed(() => props.kool?.reKools?.includes(props.user._id) || false);
const isAuthor = computed(() => props.user._id === props.kool.author._id)
// Computed para contar interações
const likesCount = computed(() => props.kool?.likes?.length || 0);
const repostCount = computed(() => props.kool?.reKools?.length || 0);
const replyCount = computed(() => props.kool?.replies?.length || 0);

// Alternar like com Vuex
const toggleLike = () => {
    if (!props.kool || !props.user) return;

    // Envia a mutação para atualizar o estado global corretamente
    if (!props.isReply) {
        store.commit('TOGGLE_LIKE_KOOLS', { koolId: props.kool._id, userId: props.user._id });
    } else {
        store.commit('TOGGLE_LIKE_REPLIES', { replyId: props.kool._id, userId: props.user._id });
    }
    // Atualiza a versão local do Kool e emite evento
    emit("update:like", isLiked.value);
};

// Alternar repost com Vuex
const toggleRepost = () => {
    toast("Recurso Indisponível!", {
        theme: "colored",
        position: "bottom-center",
        autoClose: 1000,
        type: "info",
        hideProgressBar: true
    })
    /* 
    if (!props.kool || !props.user) return;
    if (props.kool.isRekool) return

    // Envia a mutação para atualizar o estado global corretamente
    if (!props.isReply) {
        store.commit('TOGGLE_REPOST_KOOLS', { koolId: props.kool._id, userId: props.user._id });
    } else {
        store.commit('TOGGLE_REPOST_REPLIES', { replyId: props.kool._id, userId: props.user._id });
    }

    if (isReposted?.value) {
        toast("Repostado com sucesso!", {
            theme: "colored",
            position: "bottom-center",
            autoClose: 1000,
            type: "info",
            hideProgressBar: true,
        })
    } else {
        toast("Rekool removido!", {
            theme: "colored",
            position: "bottom-center",
            autoClose: 1000,
            type: "info",
            hideProgressBar: true
        })
    }

    // Atualiza a versão local do Kool e emite evento
    emit("update:rekool", props.kool._id);*/
};

const openModal = (name, data) => {
    emit("openModal", ({ name, data }));
}

const copyText = () => {
    emit("copyText");
}
const deleteKool = () => {
    const data = {
        kool: props.kool,
        isReply: props.isReply
    }
    emit("deleteKool", data);
}

// Copia o link do Kool para a área de transferência
const copyLink = (id) => {
    navigator.clipboard.writeText(`https://1kole.com/kool/${id}`);
    toast("Link copiado!", {
        theme: "colored",
        position: "bottom-center",
        autoClose: 1000,
        type: "info"
    })
};

</script>

<template>
    <div class="pt-4">
        <div data-testid="status-action-bar" class="flex rtl:space-x-reverse">
            <div class="flex rtl:space-x-reverse items-center space-x-2">
                <button @click.stop @click="openModal('create kool', { parentKool: props.kool, isReply: true })"
                    type="button"
                    class="flex items-center rounded-full p-1 rtl:space-x-reverse focus:outline-none   focus:ring-offset-2 dark:ring-offset-0 text-gray hover:text-gray/80 space-x-1"
                    title="Reply">
                    <div class="relative flex shrink-0 flex-col" data-testid="icon"><svg width="24" height="24"
                            viewBox="0 0 24 24" stroke="currentColor" stroke-linejoin="round" fill="none"
                            xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 stroke-2" data-testid="svg-icon">
                            <path
                                d="M11.8184 4C16.2366 4 19.8184 7.58172 19.8184 12C19.8184 13.3762 19.4709 14.6711 18.8589 15.802L19.9998 20.5L15.8172 18.9304C14.6408 19.6107 13.275 20 11.8184 20C7.40008 20 3.81836 16.4183 3.81836 12C3.81836 7.58172 7.40008 4 11.8184 4Z">
                            </path>
                        </svg></div>
                    <p
                        class="text-sm text-inherit font-semibold tracking-normal font-sans normal-case [&amp;_span.invisible]:inline-block [&amp;_span.invisible]:w-0">
                        <span v-if="replyCount > 0" class="font-normal text-[15px]">
                            {{ formatCount(replyCount) }}
                        </span>
                    </p>
                </button>
                <button @click.stop @click="toggleRepost" type="button"
                    class="flex items-center rounded-full p-1 rtl:space-x-reverse focus:outline-none   focus:ring-offset-2 dark:ring-offset-0 text-gray hover:text-gray/80 space-x-1"
                    title="ReTruth">
                    <div class="relative flex shrink-0 flex-col" data-testid="icon"><svg width="24" height="24"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"
                            class="w-6 h-6 stroke-2" data-testid="svg-icon">
                            <path d="M17.2793 3L20.5444 6.26506L17.2793 9.53011"></path>
                            <path
                                d="M4.87305 11.1622V9.52971C4.87305 8.66376 5.21704 7.83328 5.82936 7.22096C6.44168 6.60864 7.27216 6.26465 8.1381 6.26465H19.5658">
                            </path>
                            <path d="M7.16154 21.1639L3.89648 17.8988L7.16154 14.6338"></path>
                            <path
                                d="M19.5658 13V14.6325C19.5658 15.4985 19.2218 16.329 18.6095 16.9413C17.9972 17.5536 17.1667 17.8976 16.3007 17.8976H4.87305">
                            </path>
                        </svg></div>
                    <p
                        class="text-sm text-inherit font-semibold tracking-normal font-sans normal-case [&amp;_span.invisible]:inline-block [&amp;_span.invisible]:w-0">
                        <span v-if="repostCount !== 0" class="font-normal text-[15px]">
                            {{ formatCount(repostCount) }}
                        </span>
                    </p>
                </button>
                <button @click.stop @click="toggleLike" id="like" type="button"
                    class="flex items-center rounded-full p-1 rtl:space-x-reverse focus:outline-none   focus:ring-offset-2 dark:ring-offset-0 text-gray hover:text-gray/80 space-x-1"
                    title="Like">
                    <div class="relative flex shrink-0 flex-col" data-testid="icon">
                        <svg v-if="!isLiked" width="24" height="24" viewBox="0 0 24 24" stroke-linecap="round"
                            stroke-width="2" stroke-linejoin="round" stroke="currentColor" fill="none"
                            xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 stroke-2" data-testid="svg-icon">
                            <path
                                d="M20.2328 6.4701L20.3952 6.76689C21.1597 8.35418 21.2151 10.1379 20.4969 12.0001C19.8211 13.7477 18.4642 15.4911 16.8514 16.9462C15.2519 18.3891 13.4816 19.4756 12.0396 19.9822C12.0257 19.9854 12.0153 19.9874 12.0078 19.9886C12.0025 19.9895 11.9992 19.9898 11.9978 19.99C11.9913 19.9899 11.986 19.9898 11.9818 19.9897C10.5425 19.492 8.76501 18.4026 7.15788 16.9505C5.54593 15.494 4.18855 13.7476 3.51269 11.9994L3.51157 11.9965C2.74033 10.0196 2.85032 8.13081 3.75666 6.47098C5.06362 4.09997 7.22019 3.72893 8.84915 4.14799C9.84987 4.40896 10.6764 4.94172 11.2355 5.60466L12 6.51106L12.7644 5.60466C13.3271 4.93741 14.1541 4.39928 15.1444 4.14962L15.1444 4.14963L15.1494 4.14835C16.7797 3.72842 18.9355 4.10012 20.2328 6.4701Z">
                            </path>
                        </svg>
                        <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-liked" data-testid="svg-icon">
                            <path
                                d="M21.11 5.98996C19.55 3.13996 16.88 2.66996 14.9 3.17996C13.71 3.47996 12.7 4.12996 12 4.95996C11.3 4.12996 10.29 3.48996 9.09996 3.17996C7.11996 2.66996 4.44996 3.13996 2.87996 5.98996C1.81996 7.92996 1.70996 10.13 2.57996 12.36C4.07996 16.24 8.46996 19.84 11.67 20.94C11.78 20.98 11.89 20.99 12 20.99C12.11 20.99 12.22 20.97 12.33 20.94C15.54 19.83 19.93 16.24 21.43 12.36C22.29 10.13 22.18 7.92996 21.12 5.98996H21.11Z">
                            </path>
                        </svg>
                    </div>
                    <p
                        class="text-sm text-inherit font-semibold tracking-normal font-sans normal-case [&amp;_span.invisible]:inline-block [&amp;_span.invisible]:w-0">
                        <span v-if="likesCount > 0" class="font-normal text-[15px]">
                            {{ formatCount(likesCount) }}
                        </span>
                    </p>
                </button>
                <button @click.stop @click="toggleRepost" type="button"
                    class="flex items-center rounded-full p-1 rtl:space-x-reverse focus:outline-none   focus:ring-offset-2 dark:ring-offset-0 text-gray hover:text-gray/80 space-x-1"
                    title="Bookmark">
                    <div class="relative flex shrink-0 flex-col" data-testid="icon"><svg class="w-6 h-6 stroke-2"
                            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            data-testid="svg-icon">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M18 7v14l-6 -4l-6 4v-14a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4z"></path>
                        </svg></div>
                </button>
                <button @click.stop @click="copyLink(props.kool._id)" type="button"
                    class="flex items-center rounded-full p-1 rtl:space-x-reverse focus:outline-none   focus:ring-offset-2 dark:ring-offset-0 text-gray hover:text-gray/80 space-x-1"
                    title="Share">
                    <div class="relative flex shrink-0 flex-col" data-testid="icon"><svg width="24" height="24"
                            viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"
                            class="w-6 h-6 stroke-2" data-testid="svg-icon">
                            <path
                                d="M12.7149 2.30076C12.5333 2.11518 12.2801 2 12 2L11.9905 2.00004C11.7684 2.00211 11.5635 2.07662 11.3985 2.20108C11.3614 2.22902 11.326 2.25967 11.2928 2.29289L7.6928 5.89291C7.30227 6.28343 7.30227 6.91659 7.6928 7.30712C8.08332 7.69764 8.71649 7.69764 9.10701 7.30712L11 5.41413V14.7C11 15.2523 11.4477 15.7 12 15.7C12.5523 15.7 13 15.2523 13 14.7V5.4143L14.8928 7.30712C15.2833 7.69764 15.9165 7.69764 16.307 7.30712C16.6976 6.91659 16.6976 6.28343 16.307 5.89291L12.7149 2.30076Z">
                            </path>
                            <path
                                d="M5.80029 12C5.80029 11.4477 5.35258 11 4.80029 11C4.24801 11 3.80029 11.4477 3.80029 12V19.2C3.80029 19.9426 4.09529 20.6548 4.6204 21.1799C5.1455 21.705 5.85769 22 6.6003 22H17.4003C18.1429 22 18.8551 21.705 19.3802 21.1799C19.9053 20.6548 20.2003 19.9426 20.2003 19.2V12C20.2003 11.4477 19.7526 11 19.2003 11C18.6481 11 18.2003 11.4477 18.2003 12V19.2C18.2003 19.4122 18.1161 19.6157 17.966 19.7657C17.816 19.9157 17.6125 20 17.4003 20H6.6003C6.38812 20 6.18464 19.9157 6.03461 19.7657C5.88458 19.6157 5.80029 19.4122 5.80029 19.2V12Z">
                            </path>
                        </svg></div>
                </button>
                <Menu as="div" @click.stop class="relative flex">
                    <div class="z-[10px]">
                        <MenuButton @click.stop
                            class="flex items-center rounded-full p-1 rtl:space-x-reverse focus:outline-none   focus:ring-offset-2 dark:ring-offset-0 text-gray hover:text-gray/80 space-x-1"
                            title="More">
                            <div class="relative flex shrink-0 flex-col" data-testid="icon"><svg
                                    class="w-6 h-6 stroke-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round" data-testid="svg-icon">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                                    <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                                    <path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                                </svg></div>
                        </MenuButton>
                    </div>
                    <Transition enter-active-class="transition duration-100 ease-out"
                        enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                        leave-active-class="transition duration-75 ease-in"
                        leave-from-class="transform scale-100 opacity-100"
                        leave-to-class="transform scale-95 opacity-0">
                        <MenuItems
                            class="absolute right-0 bottom-full mb-2 w-48 origin-bottom-right divide-y divide-gray-200 z-[100] rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div class="py-1">
                                <MenuItem v-slot="{ active }">
                                <button @click="copyText" type="button"
                                    class="w-full flex items-center justify-between text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Compartilhar

                                    <svg fill="none" viewBox="0 0 24 24" width="20" height="20">
                                        <path fill="hsl(211, 24%, 34.2%)" fill-rule="evenodd" clip-rule="evenodd"
                                            d="M12.707 3.293a1 1 0 0 0-1.414 0l-4.5 4.5a1 1 0 0 0 1.414 1.414L11 6.414v8.836a1 1 0 1 0 2 0V6.414l2.793 2.793a1 1 0 1 0 1.414-1.414l-4.5-4.5ZM5 12.75a1 1 0 1 0-2 0V20a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-7.25a1 1 0 1 0-2 0V19H5v-6.25Z">
                                        </path>
                                    </svg>
                                </button>
                                </MenuItem>
                                <MenuItem v-slot="{ active }">
                                <button @click="toggleLike" type="button"
                                    class="w-full flex items-center justify-between text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    {{ isLiked ? 'Descurtir' : 'Curtir' }}
                                    <svg fill="none" width="18" viewBox="0 0 24 24" height="18">
                                        <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                                            d="M16.734 5.091c-1.238-.276-2.708.047-4.022 1.38a1 1 0 0 1-1.424 0C9.974 5.137 8.504 4.814 7.266 5.09c-1.263.282-2.379 1.206-2.92 2.556C3.33 10.18 4.252 14.84 12 19.348c7.747-4.508 8.67-9.168 7.654-11.7-.541-1.351-1.657-2.275-2.92-2.557Zm4.777 1.812c1.604 4-.494 9.69-9.022 14.47a1 1 0 0 1-.978 0C2.983 16.592.885 10.902 2.49 6.902c.779-1.942 2.414-3.334 4.342-3.764 1.697-.378 3.552.003 5.169 1.286 1.617-1.283 3.472-1.664 5.17-1.286 1.927.43 3.562 1.822 4.34 3.764Z">
                                        </path>
                                    </svg>
                                </button>
                                </MenuItem>
                                <MenuItem v-slot="{ active }">
                                <button @click="openModal('create kool', { parentKool: props.kool, isReply: true })"
                                    type="button"
                                    class="w-full flex items-center justify-between text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Responder
                                    <svg fill="none" width="18" viewBox="0 0 24 24" height="18">
                                        <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                                            d="M2.002 6a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H12.28l-4.762 2.858A1 1 0 0 1 6.002 21v-2h-1a3 3 0 0 1-3-3V6Zm3-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2a1 1 0 0 1 1 1v1.234l3.486-2.092a1 1 0 0 1 .514-.142h7a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-14Z">
                                        </path>
                                    </svg>
                                </button>
                                </MenuItem>
                                <!-- Renderiza a opção "Eliminar" somente se o usuário for o autor -->
                                <MenuItem v-if="isAuthor" v-slot="{ active }">
                                <button @click="deleteKool(kool._id)" type="button"
                                    class="w-full flex items-center justify-between text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100">
                                    Eliminar
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
               
            </div>
        </div>
    </div>
</template>