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

</script>

<template>
    <div class="flex justify-between items-center">
        <div class="flex-1">
            <button id="reply" @click.stop @click="openModal('create kool', { parentKool: props.kool, isReply: true })"
                class="px-[5px] w-min py-1 gap-1 text-[rgb(83,100,113)] hover:text-primary hover:bg-primary/10 cursor-pointer rounded-[30px] flex justify-center items-center">
                <svg fill="none" width="18" viewBox="0 0 24 24" height="18">
                    <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                        d="M2.002 6a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H12.28l-4.762 2.858A1 1 0 0 1 6.002 21v-2h-1a3 3 0 0 1-3-3V6Zm3-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2a1 1 0 0 1 1 1v1.234l3.486-2.092a1 1 0 0 1 .514-.142h7a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-14Z">
                    </path>
                </svg>
                <div v-if="replyCount > 0" class="font-normal text-[15px]">
                    {{ formatCount(replyCount) }}
                </div>
            </button>
        </div>

        <div class="flex-1">
            <button @click="toggleRepost" @click.stop
                class="px-[5px] w-min py-1 gap-1 text-[rgb(83,100,113)] hover:text-reKooled hover:bg-reKooled/10 cursor-pointer rounded-[30px] flex justify-center items-center"
                :class="{ 'text-reKooled': isReposted }">
                <svg fill="none" width="18" viewBox="0 0 24 24" height="18">
                    <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                        d="M17.957 2.293a1 1 0 1 0-1.414 1.414L17.836 5H6a3 3 0 0 0-3 3v3a1 1 0 1 0 2 0V8a1 1 0 0 1 1-1h11.836l-1.293 1.293a1 1 0 0 0 1.414 1.414l2.47-2.47a1.75 1.75 0 0 0 0-2.474l-2.47-2.47ZM20 12a1 1 0 0 1 1 1v3a3 3 0 0 1-3 3H6.164l1.293 1.293a1 1 0 1 1-1.414 1.414l-2.47-2.47a1.75 1.75 0 0 1 0-2.474l2.47-2.47a1 1 0 0 1 1.414 1.414L6.164 17H18a1 1 0 0 0 1-1v-3a1 1 0 0 1 1-1Z">
                    </path>
                </svg>
                <div v-if="repostCount !== 0" class="font-normal text-[15px]">
                    {{ formatCount(repostCount) }}
                </div>
            </button>
        </div>

        <div class="flex-1">
            <button @click="toggleLike" id="like" @click.stop
                class="px-[5px] py-1 gap-1 text-[rgb(83,100,113)] hover:text-liked hover:bg-liked/10 cursor-pointer rounded-[30px] flex justify-center items-center"
                :class="{ 'text-liked': isLiked }">
                <svg v-if="!isLiked" fill="none" width="18" viewBox="0 0 24 24" height="18">
                    <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                        d="M16.734 5.091c-1.238-.276-2.708.047-4.022 1.38a1 1 0 0 1-1.424 0C9.974 5.137 8.504 4.814 7.266 5.09c-1.263.282-2.379 1.206-2.92 2.556C3.33 10.18 4.252 14.84 12 19.348c7.747-4.508 8.67-9.168 7.654-11.7-.541-1.351-1.657-2.275-2.92-2.557Zm4.777 1.812c1.604 4-.494 9.69-9.022 14.47a1 1 0 0 1-.978 0C2.983 16.592.885 10.902 2.49 6.902c.779-1.942 2.414-3.334 4.342-3.764 1.697-.378 3.552.003 5.169 1.286 1.617-1.283 3.472-1.664 5.17-1.286 1.927.43 3.562 1.822 4.34 3.764Z">
                    </path>
                </svg>
                <svg v-else fill="none" width="18" viewBox="0 0 24 24" height="18" class="r-84gixx">
                    <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                        d="M12.489 21.372c8.528-4.78 10.626-10.47 9.022-14.47-.779-1.941-2.414-3.333-4.342-3.763-1.697-.378-3.552.003-5.169 1.287-1.617-1.284-3.472-1.665-5.17-1.287-1.927.43-3.562 1.822-4.34 3.764-1.605 4 .493 9.69 9.021 14.47a1 1 0 0 0 .978 0Z">
                    </path>
                </svg>
                <div v-if="likesCount > 0" class="font-normal text-[15px]">
                    {{ formatCount(likesCount) }}
                </div>
            </button>
        </div>

        <div class="flex-1 justify-start">
            <Menu as="div" @click.stop class="relative inline-block text-left">
                <div class="z-[10px]">
                    <MenuButton id="more" @click.stop
                        class="px-1 py-1 flex items-center gap-1 text-gray-600 hover:text-blue-600 hover:bg-primary/10 rounded-full">
                        <svg fill="none" viewBox="0 0 24 24" width="20" height="20" class="w-5 h-5">
                            <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                                d="M2 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm16 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm-6-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
                        </svg>
                    </MenuButton>
                </div>
                <Transition enter-active-class="transition duration-100 ease-out"
                    enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-75 ease-in"
                    leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
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

</template>