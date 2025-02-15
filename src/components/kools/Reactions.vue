<script setup>
import { defineProps, defineEmits, computed } from 'vue';
import { useStore } from 'vuex'; // Importa o Vuex Store

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
    user: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(["update:like", "update:rekool", "openModal"]);

// Computed para verificar se o usuário já deu like ou repost
const isLiked = computed(() => props.kool?.likes?.includes(props.user._id) || false);
const isReposted = computed(() => props.kool?.reKools?.includes(props.user._id) || false);

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
    if (!props.kool || !props.user) return;

    // Envia a mutação para atualizar o estado global corretamente
    if (!props.isReply) {
        store.commit('TOGGLE_REPOST_KOOLS', { koolId: props.kool._id, userId: props.user._id });
    } else {
        store.commit('TOGGLE_REPOST_REPLIES', { replyId: props.kool._id, userId: props.user._id });
    }

    // Atualiza a versão local do Kool e emite evento
    emit("update:rekool", isReposted.value);
};

const openModal = (name, data) => {
    emit("openModal", ({ name, data }));
}
</script>

<template>
    <div class="flex justify-between mt-2 text-gray-500">
        <!-- Reply -->
        <button @click="openModal('create kool', { parentKool: props.kool, isReply: true })"
            class="flex items-center gap-1 hover:text-blue-500 transition">
            <svg fill="none" width="18" viewBox="0 0 24 24" height="18"
                style="color: rgb(111, 134, 159); pointer-events: none;">
                <path fill="hsl(211, 20%, 53%)" fill-rule="evenodd" clip-rule="evenodd"
                    d="M2.002 6a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H12.28l-4.762 2.858A1 1 0 0 1 6.002 21v-2h-1a3 3 0 0 1-3-3V6Zm3-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2a1 1 0 0 1 1 1v1.234l3.486-2.092a1 1 0 0 1 .514-.142h7a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-14Z">
                </path>
            </svg>
            <span class="text-sm">{{ replyCount }}</span>
        </button>

        <!-- Repost -->
        <button @click="toggleRepost" class="flex items-center gap-1 hover:text-green-500 transition">
            <svg fill="none" width="18" viewBox="0 0 24 24" height="18" style="color: rgb(111, 134, 159);">
                <path fill="hsl(211, 20%, 53%)" fill-rule="evenodd" clip-rule="evenodd"
                    d="M17.957 2.293a1 1 0 1 0-1.414 1.414L17.836 5H6a3 3 0 0 0-3 3v3a1 1 0 1 0 2 0V8a1 1 0 0 1 1-1h11.836l-1.293 1.293a1 1 0 0 0 1.414 1.414l2.47-2.47a1.75 1.75 0 0 0 0-2.474l-2.47-2.47ZM20 12a1 1 0 0 1 1 1v3a3 3 0 0 1-3 3H6.164l1.293 1.293a1 1 0 1 1-1.414 1.414l-2.47-2.47a1.75 1.75 0 0 1 0-2.474l2.47-2.47a1 1 0 0 1 1.414 1.414L6.164 17H18a1 1 0 0 0 1-1v-3a1 1 0 0 1 1-1Z">
                </path>
            </svg>
            <span class="text-sm">{{ repostCount }}</span>
        </button>

        <!-- Like -->
        <button @click="toggleLike" class="flex items-center gap-1 transition" :class="{ 'text-liked': isLiked }">
            <svg v-if="!isLiked" fill="none" width="18" viewBox="0 0 24 24" height="18"
                style="color: rgb(111, 134, 159); pointer-events: none;">
                <path fill="hsl(211, 20%, 53%)" fill-rule="evenodd" clip-rule="evenodd"
                    d="M16.734 5.091c-1.238-.276-2.708.047-4.022 1.38a1 1 0 0 1-1.424 0C9.974 5.137 8.504 4.814 7.266 5.09c-1.263.282-2.379 1.206-2.92 2.556C3.33 10.18 4.252 14.84 12 19.348c7.747-4.508 8.67-9.168 7.654-11.7-.541-1.351-1.657-2.275-2.92-2.557Zm4.777 1.812c1.604 4-.494 9.69-9.022 14.47a1 1 0 0 1-.978 0C2.983 16.592.885 10.902 2.49 6.902c.779-1.942 2.414-3.334 4.342-3.764 1.697-.378 3.552.003 5.169 1.286 1.617-1.283 3.472-1.664 5.17-1.286 1.927.43 3.562 1.822 4.34 3.764Z">
                </path>
            </svg>
            <svg v-else fill="none" width="18" viewBox="0 0 24 24" height="18" class="r-84gixx">
                <path fill="#ec4899" fill-rule="evenodd" clip-rule="evenodd"
                    d="M12.489 21.372c8.528-4.78 10.626-10.47 9.022-14.47-.779-1.941-2.414-3.333-4.342-3.763-1.697-.378-3.552.003-5.169 1.287-1.617-1.284-3.472-1.665-5.17-1.287-1.927.43-3.562 1.822-4.34 3.764-1.605 4 .493 9.69 9.021 14.47a1 1 0 0 0 .978 0Z">
                </path>
            </svg>
            <span class="text-sm">{{ likesCount }}</span>
        </button>

        <!-- More -->
        <button class="hover:text-gray-800 transition">
            <svg fill="none" viewBox="0 0 24 24" width="20" height="20" style="pointer-events: none;">
                <path fill="hsl(211, 20%, 53%)" fill-rule="evenodd" clip-rule="evenodd"
                    d="M2 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm16 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm-6-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z">
                </path>
            </svg>
        </button>
    </div>
</template>