<script setup>
import { useKool } from '@/repositories/kool-repository';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { toast } from "vue3-toastify";
import Avatar from '../UI/Avatar.vue';

const store = useStore();
const { createKool, loading } = useKool();

const user = computed(() => store.getters.user);

const props = defineProps({
    isReply: { type: Boolean, default: false },
    shouldAddReply: { type: Boolean, default: false },
    originalKool: { type: Object, default: () => ({}) },
});

// Estado do formulário
const form = ref({ content: "", media: null });
const previewUrl = ref(null);
const fileInput = ref(null); // Referência para o input

const clearForm = () => {
    form.value.content = "";
    removeMedia();
};

// Lidar com a seleção de arquivos
const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        form.value.media = file;
        previewUrl.value = URL.createObjectURL(file);
    }
};

// Remover mídia e resetar input
const removeMedia = () => {
    form.value.media = null;
    previewUrl.value = null;
    if (fileInput.value) {
        fileInput.value.value = ""; // Reseta o input para permitir reenvio do mesmo arquivo
    }
};

const removeHtmlTags = (html) => {
    const div = document.createElement("a");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
};

// Enviar post
const submit = async () => {
    if (!form.value.content.trim() && !form.value.media) return;

    try {
        const formData = new FormData();
        formData.append("content", removeHtmlTags(form.value.content));
        if (form.value.media) {
            formData.append("media", form.value.media);
        }
        if (props.isReply) {
            formData.append("parentKool", props.originalKool?._id ?? "");
        }

        await createKool({
            formData,
            shouldAddReply: props.shouldAddReply
        });

        if (props.isReply) {
            toast("Resposta enviada!", { theme: "colored", position: "bottom-center", autoClose: 1000, type: "info", hideProgressBar: true });
        } else {
            toast("Kool criado com sucesso!", { theme: "colored", position: "bottom-center", autoClose: 1000, type: "info", hideProgressBar: true });
        }
    } catch (err) {
        toast(err?.response?.data?.message || "Erro desconhecido", { theme: "colored", position: "bottom-center", autoClose: 1000, type: "info" });
    } finally {
        clearForm();
    }
};
</script>

<template>
    <div class="w-full p-4 bg-white leading-tight">
        <div class="flex space-x-3">
            <div class="shrink-0">
                <Avatar :url="user.profileImage.url" alt="User avatar" />
            </div>

            <div class="w-full">
                <textarea v-model="form.content" maxlength="200"
                    class="w-full h-20 resize-none outline-none text-gray-700 text-lg p-2"
                    :placeholder="props.isReply ? 'Escreva a sua resposta' : 'O que está acontecendo?'"></textarea>

                <!-- Preview da mídia selecionada -->
                <div v-if="previewUrl" class="relative mt-2 w-32 h-32 rounded-lg overflow-hidden">
                    <img :src="previewUrl" alt="Preview" class="w-full h-full object-cover">
                    <button @click="removeMedia"
                        class="absolute top-0.5 right-0 bg-black text-white py-[6px] px-[10px] rounded-full text-sm">✕</button>
                </div>

                <div class="flex items-center justify-between mt-2">
                    <div class="flex space-x-3 text-primary">
                        <!-- Ícone para upload de imagem -->
                        <label class="cursor-pointer py-1.5 font-medium gap-1.5 rounded-full px-3 flex items-center hover:bg-primary/10">
                            <input type="file" ref="fileInput" accept="image/*" class="hidden"
                                @change="handleFileChange">
                            <svg fill="none" class="text-primary" viewBox="0 0 24 24" width="24" height="24">
                                <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4Zm2 1v7.213l1.246-.932.044-.03a3 3 0 0 1 3.863.454c1.468 1.58 2.941 2.749 4.847 2.749 1.703 0 2.855-.555 4-1.618V5H5Zm14 10.357c-1.112.697-2.386 1.097-4 1.097-2.81 0-4.796-1.755-6.313-3.388a1 1 0 0 0-1.269-.164L5 14.712V19h14v-3.643ZM15 8a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm-3 1a3 3 0 1 1 6 0 3 3 0 0 1-6 0Z">
                                </path>
                            </svg>
                            <p>Carregar uma foto</p>
                        </label>
                    </div>
                    <button @click="submit" :disabled="(!form.content.trim() && !form.media) || loading"
                        class="bg-black text-white font-bold px-4 py-2 rounded-full disabled:opacity-50">
                        <p v-if="!loading"> {{ props.isReply ? 'Responder' : 'Postar' }}</p>
                        <p v-else> Carregando...</p>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
