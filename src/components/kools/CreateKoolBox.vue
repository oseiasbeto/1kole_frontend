<script setup>
import { useKool } from '@/repositories/kool-repository';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { toast } from "vue3-toastify";

const store = useStore();
const { createKool, loading } = useKool();

const user = computed(() => store.getters.user);

const props = defineProps({
    isReply: { type: Boolean, default: false },
    shouldAddReply: { type: Boolean, default: false },
    originalKool: { type: Object, default: () => ({}) } // Evita que seja `null`
});

// Inicializa corretamente o formulário
const form = ref({ content: "" });

const clearForm = () => {
    // Mantém a reatividade no Vue 3
    form.value.content = "";
};

const submit = async () => {
    if (!form.value.content.trim()) return; // Evita chamadas desnecessárias

    try {
        await createKool({
            content: form.value.content,
            parentKool: props.originalKool?.['_id'] ?? undefined, // Evita erro caso seja `null`
            isReply: props.isReply,
            shouldAddReply: props.shouldAddReply
        });
    } catch (err) {
        // Previne erro caso `err.response` seja `undefined`
        toast(err?.response?.data?.message || "Erro desconhecido", {
            theme: "colored",
            position: "bottom-center",
            autoClose: 1000,
            type: "info"
        });
    } finally {
        clearForm(); // Garante que o formulário seja limpo sempre
    }
};
</script>


<template>
    <div class="w-full p-4 bg-white leading-tight">
        <div class="flex space-x-3">
            <img class="w-10 h-10 rounded-full" :src="user.profileImage.url" alt="User avatar">
            <div class="w-full">
                <textarea v-model="form.content" maxlength="200"
                    class="w-full h-20 resize-none outline-none text-gray-700 text-lg p-2"
                    :placeholder="props.isReply ? 'Escreva a sua resposta' : 'O que está acontecendo?'"></textarea>
                <div class="flex items-center justify-between mt-2">
                    <div class="flex space-x-3 text-blue-500">

                    </div>
                    <button @click="submit" :disabled="!form.content.trim() || loading"
                        class="bg-blue-500 text-white font-bold px-4 py-2 rounded-full disabled:opacity-50">
                        {{ props.isReply ? 'Responder' : 'Postar' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>