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

// Emite evento para fechar o modal (assumindo que o componente pai lida com isso)
const emit = defineEmits(['close']);

// Estado do formulário
const form = ref({ content: "", media: null });
const previewUrl = ref(null);
const mediaType = ref(null); // 'image' ou 'video'
const fileInputImage = ref(null);
const fileInputVideo = ref(null);

const clearForm = () => {
    form.value.content = "";
    removeMedia();
};

// Lidar com a seleção de arquivos com validação
const handleFileChange = (event, type) => {
    const file = event.target.files[0];
    if (file) {
        if (file.size > 50 * 1024 * 1024) {
            toast("O arquivo excede o limite de 50MB!", { type: "error", autoClose: 2000 });
            return;
        }
        if (type === 'video' && !['video/mp4', 'video/webm', 'video/ogg'].includes(file.type)) {
            toast("Formato de vídeo não suportado! Use MP4, WebM ou OGG.", { type: "error", autoClose: 2000 });
            return;
        }
        form.value.media = file;
        previewUrl.value = URL.createObjectURL(file);
        mediaType.value = type;
    }
};

// Remover mídia e resetar inputs
const removeMedia = () => {
    form.value.media = null;
    previewUrl.value = null;
    mediaType.value = null;
    if (fileInputImage.value) fileInputImage.value.value = "";
    if (fileInputVideo.value) fileInputVideo.value.value = "";
};

const removeHtmlTags = (html) => {
    const div = document.createElement("a");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
};

// Enviar post em segundo plano
const submit = async () => {
    if (!form.value.content.trim() && !form.value.media) return;

    // Fecha o modal imediatamente
    emit('close');

    // Exibe toast de carregamento persistente
    const toastId = toast.loading("Enviando seu Kool...", {
        position: "bottom-center",
        theme: "colored",
        type: "info",
        dangerouslyHTMLString: true,
        autoClose: false, // Não fecha automaticamente
    });

    try {
        const formData = new FormData();
        formData.append("content", removeHtmlTags(form.value.content));
        if (form.value.media) {
            formData.append("media", form.value.media);
        }
        if (props.isReply) {
            formData.append("parentKool", props.originalKool?._id ?? "");
        }

        const config = {
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                // Opcional: atualizar o toast com progresso, se desejar
                toast.update(toastId, { render: `Enviando seu Kool... ${percentCompleted}%` });
            },
        };

        const response = await createKool({
            formData,
            shouldAddReply: props.shouldAddReply,
            config,
        });

        // Atualiza o toast para sucesso
        toast.update(toastId, {
            render: props.isReply ? "Resposta enviada com sucesso!" : "Kool criado com sucesso!",
            type: "info",
            autoClose: 2000,
            isLoading: false,
        });

    } catch (err) {
        const errorMessage = err?.response?.data?.message;
        // Atualiza o toast para erro
        toast.update(toastId, {
            render: errorMessage === "O arquivo excede o limite de 50MB" 
                ? "O arquivo é muito grande! Máximo de 50MB permitido." 
                : errorMessage || "Erro ao enviar o Kool",
            type: "error",
            autoClose: 2000,
            isLoading: false,
        });
    } finally {
        clearForm();
    }
};

// Computed para desabilitar inputs
const isImageDisabled = computed(() => mediaType.value === 'video');
const isVideoDisabled = computed(() => mediaType.value === 'image');
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
                    <img v-if="mediaType === 'image'" :src="previewUrl" alt="Preview" class="w-full h-full object-cover" />
                    <video v-else-if="mediaType === 'video'" :src="previewUrl" controls class="w-full h-full object-cover"></video>
                    <button @click="removeMedia"
                        class="absolute top-0.5 right-0 bg-black text-white py-[6px] px-[10px] rounded-full text-sm">✕</button>
                </div>

                <div class="flex items-center justify-between mt-2">
                    <div class="flex space-x-3 text-primary">
                        <!-- Ícone para upload de imagem -->
                        <label :class="['cursor-pointer py-1.5 font-medium gap-1.5 rounded-full px-3 flex items-center', isImageDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/10']">
                            <input type="file" ref="fileInputImage" accept="image/*" class="hidden"
                                :disabled="isImageDisabled" @change="handleFileChange($event, 'image')" />
                            <svg fill="none" class="text-primary" viewBox="0 0 24 24" width="24" height="24">
                                <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4Zm2 1v7.213l1.246-.932.044-.03a3 3 0 0 1 3.863.454c1.468 1.58 2.941 2.749 4.847 2.749 1.703 0 2.855-.555 4-1.618V5H5Zm14 10.357c-1.112.697-2.386 1.097-4 1.097-2.81 0-4.796-1.755-6.313-3.388a1 1 0 0 0-1.269-.164L5 14.712V19h14v-3.643ZM15 8a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm-3 1a3 3 0 1 1 6 0 3 3 0 0 1-6 0Z">
                                </path>
                            </svg>
                           
                        </label>

                        <!-- Ícone para upload de vídeo -->
                        <label :class="['cursor-pointer py-1.5 font-medium gap-1.5 rounded-full px-3 flex items-center', isVideoDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/10']">
                            <input type="file" ref="fileInputVideo" accept="video/mp4,video/webm,video/ogg" class="hidden"
                                :disabled="isVideoDisabled" @change="handleFileChange($event, 'video')" />
                            <svg fill="none" class="text-primary" viewBox="0 0 24 24" width="24" height="24">
                                <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Zm2 2v10h14V7H5Zm3 2v6l5-3-5-3Z">
                                </path>
                            </svg>
                            
                        </label>
                    </div>
                    <button @click="submit" :disabled="(!form.content.trim() && !form.media) || loading"
                        class="bg-black text-white font-bold px-4 py-2 rounded-full disabled:opacity-50">
                        {{ props.isReply ? 'Responder' : 'Postar' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>