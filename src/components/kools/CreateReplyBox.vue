<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

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
        class="py-2 px-3 cursor-pointer select-none text-sm rounded-full w-full bg-gray-100 text-gray-500">
        <p>Responder {{ isOwnKool ? 'a si mesmo' : `ao: @${kool.author.username}` }}</p>
    </div>
</template>