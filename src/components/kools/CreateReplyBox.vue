<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import Avatar from '../UI/Avatar.vue';

const props = defineProps({
    kool: {
        type: Object,
        required: true
    }
});

// Define eventos corretamente
const emit = defineEmits(['openModal']);
const store = useStore();

// Usa `store.state` para garantir reatividade
const user = computed(() => store.state.user);

// Função que emite evento para abrir o modal com o Kool atual
const replyTo = () => {
    emit("openModal", props.kool);
};

// Verifica se o Kool pertence ao usuário logado
const isOwnKool = computed(() => {
    return props.kool?.author?._id === user.value?._id;
});
</script>


<template>
    <div @click="replyTo"
        class="py-2 px-2 bg-white lg:hover:bg-light w-screen lg:w-full lg:relative flex items-center gap-1.5 cursor-pointer select-none text-sm lg:rounded-full text-gray-500">
        <Avatar custom="w-6 h-6" :url="user?.profileImage.url"/>
        <p>Responder {{ isOwnKool ? 'a si mesmo' : `ao: @${kool.author.username}` }}</p>
    </div>
</template>