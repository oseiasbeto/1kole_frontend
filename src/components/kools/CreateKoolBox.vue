<script setup>
import { useKool } from '@/repositories/kool-repository';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { toast } from "vue3-toastify";
import Avatar from '../UI/Avatar.vue';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Configuração do store e repositório
const store = useStore();
const { createKool, loading: createKoolLoading } = useKool();
const user = computed(() => store.getters.user);

const props = defineProps({
  isReply: { type: Boolean, default: false },
  shouldAddReply: { type: Boolean, default: false },
  originalKool: { type: Object, default: () => ({}) },
});

const emit = defineEmits(['close']);

// Estado do formulário
const form = ref({ content: "" });
const mediaPreviews = ref([]);
const uploadProgress = ref({});
const cancelTokens = ref({});
const fileInputImage = ref(null);
const fileInputVideo = ref(null);

// Constantes para upload
const MAX_IMAGES = 4;
const MAX_VIDEO_SIZE_MB = 50;
const CLOUD_NAME = 'daujoblcc';
const UPLOAD_PRESET = 'social_media_upload';

const clearForm = () => {
  form.value.content = "";
  mediaPreviews.value = [];
  uploadProgress.value = {};
  cancelTokens.value = {};
  if (fileInputImage.value) fileInputImage.value.value = "";
  if (fileInputVideo.value) fileInputVideo.value.value = "";
};

// Computed para desabilitar inputs
const hasImages = computed(() => mediaPreviews.value.some(m => m.type === 'image'));
const hasVideo = computed(() => mediaPreviews.value.some(m => m.type === 'video'));
const isImageDisabled = computed(() => hasVideo.value);
const isVideoDisabled = computed(() => hasImages.value);
const isUploading = computed(() => Object.values(uploadProgress.value).some(progress => progress < 100));

// Funções de manipulação de mídia
const handleImageUpload = (e) => {
  const files = Array.from(e.target.files || []);
  const availableSlots = MAX_IMAGES - mediaPreviews.value.length;
  if (files.length > availableSlots) {
    toast(`Você pode adicionar no máximo ${MAX_IMAGES} imagens`, { type: "error", autoClose: 2000 });
    return;
  }

  files.slice(0, availableSlots).forEach(file => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const id = uuidv4();
      mediaPreviews.value.push({
        id,
        url: e.target.result,
        type: 'image',
        format: file.type.split('/')[1],
        file
      });
    };
    reader.readAsDataURL(file);
  });

  e.target.value = '';
};

const handleVideoUpload = (e) => {
  const file = e.target.files?.[0];
  if (!file || !file.type.startsWith('video/')) return;

  if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
    toast(`O vídeo deve ter no máximo ${MAX_VIDEO_SIZE_MB}MB`, { type: "error", autoClose: 2000 });
    return;
  }

  const video = document.createElement('video');
  const url = URL.createObjectURL(file);
  video.src = url;

  video.onloadedmetadata = () => {
    const duration = video.duration;
    URL.revokeObjectURL(url);

    if (duration > 120) {
      toast("O vídeo excede o limite de 2 minutos!", { type: "error", autoClose: 2000 });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const id = uuidv4();
      mediaPreviews.value = [{
        id,
        url: e.target.result,
        type: 'video',
        format: file.type.split('/')[1],
        file
      }];
    };
    reader.readAsDataURL(file);
  };

  video.onerror = () => {
    toast("Erro ao carregar o vídeo para validação!", { type: "error", autoClose: 2000 });
    URL.revokeObjectURL(url);
  };

  e.target.value = '';
};

const removeMedia = (index) => {
  const media = mediaPreviews.value[index];
  if (uploadProgress.value[media.id] !== undefined && cancelTokens.value[media.id]) {
    cancelTokens.value[media.id].cancel('Upload cancelado pelo usuário');
    delete cancelTokens.value[media.id];
  }

  mediaPreviews.value.splice(index, 1);
  const newProgress = { ...uploadProgress.value };
  delete newProgress[media.id];
  uploadProgress.value = newProgress;
};

const getVideoDuration = (url) => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.src = url;
    video.onloadedmetadata = () => {
      resolve(video.duration);
    };
    video.onerror = () => {
      resolve(null);
    };
  });
};

const uploadMedia = async (media) => {
  const source = axios.CancelToken.source();
  cancelTokens.value[media.id] = source;

  try {
    const formData = new FormData();
    formData.append('file', media.file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('cloud_name', CLOUD_NAME);
    formData.append('folder', media.type === 'video' ? 'videos' : 'images');

    if (media.type === 'video') {
      formData.append('resource_type', 'video');
      const publicId = `video_${Date.now()}`;
      formData.append('public_id', publicId);
    }

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
      formData,
      {
        cancelToken: source.token,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          uploadProgress.value = { ...uploadProgress.value, [media.id]: progress };
        },
      }
    );

    delete cancelTokens.value[media.id];

    if (!response.data) return null;

    const hlsUrl = media.type === 'video'
      ? `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/sp_hd/${response.data.public_id}.m3u8`
      : null;


    const thumbnailUrl = media.type === 'video' ?
      `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/w_${response.data.width},h_${response.data.height},c_fill,q_auto,f_jpg,so_2/${response.data.public_id}.jpg` :
      null;

    return {
      public_id: response.data.public_id,
      url: media.type === 'video'
        ? hlsUrl
        : `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_80,w_1200/${response.data.public_id}`,
      thumbnail: thumbnailUrl,
      type: media.type,
      format: media.type === 'video' ? 'm3u8' : response.data.format,
      duration: media.type === 'video' ? await getVideoDuration(response.data.secure_url) : null
    };
  } catch (error) {
    if (axios.isCancel(error)) return null;
    throw error;
  }
};

const removeHtmlTags = (html) => {
  const div = document.createElement("a");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

const submit = async () => {
  if (!form.value.content.trim() && !mediaPreviews.value.length) return;
  createKoolLoading.value = true
  // Dados a serem enviados
  const postData = {
    content: removeHtmlTags(form.value.content),
    media: [],
  };

  if (props.isReply) {
    postData.parentKool = props.originalKool?._id ?? "";
  }

  // Upload de mídias para Cloudinary
  if (mediaPreviews.value.length) {
    try {
      const mediaUploads = mediaPreviews.value.map(media => uploadMedia(media));
      const uploadedMedia = (await Promise.all(mediaUploads)).filter(Boolean);
      postData.media = uploadedMedia.map(media => ({
        public_id: media.public_id,
        url: media.url,
        type: media.type,
        format: media.format,
        thumbnail: media.thumbnail,
        duration: media.duration
      }));
    } catch (err) {

      createKoolLoading.value = false
      return;
    }
  }
  try {
    await createKool({ ...postData, shouldAddReply: props.shouldAddReply });
    toast.update(`${props.isReply ? "Resposta enviada com sucesso!" : "Kool criado com sucesso!"}`, {
      type: "success",
      autoClose: 2000
    });
    emit('close');
    clearForm();
  } catch (err) {
    const errorMessage = err?.response?.data?.message || "Erro ao enviar o Kool";
    toast.update(errorMessage, {
      type: "error",
      autoClose: 2000
    });
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
        <div v-if="mediaPreviews.length" class="grid grid-cols-2 gap-2 mt-2">
          <div v-for="(media, index) in mediaPreviews" :key="media.id" class="relative rounded-lg overflow-hidden"
            :class="{ 'col-span-2': mediaPreviews.length === 1, 'h-32': mediaPreviews.length > 1, 'h-48': mediaPreviews.length === 1 }">
            <img v-if="media.type === 'image'" :src="media.url" alt="Preview" class="w-full h-full object-cover" />
            <video v-else-if="media.type === 'video'" :src="media.url" controls
              class="w-full h-full object-cover"></video>
            <button @click="removeMedia(index)"
              class="absolute top-0.5 right-0 bg-black text-white py-[6px] px-[10px] rounded-full text-sm">✕</button>
          </div>
        </div>

        <!-- Indicador de progresso de upload -->
        <div v-if="isUploading" class="flex items-center mt-2 p-2 bg-primary/10 rounded-lg">
          <div class="relative w-7 h-7 mr-2">
            <svg class="w-full h-full" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" class="stroke-primary/10" stroke-width="3"></circle>
              <circle cx="18" cy="18" r="16" fill="none" class="stroke-primary" stroke-width="3" stroke-dasharray="100"
                stroke-dashoffset="100" :style="{
                  'stroke-dashoffset': 100 - Math.max(...Object.values(uploadProgress)),
                  'transition': 'stroke-dashoffset 0.3s ease'
                }"></circle>
            </svg>
            <span class="absolute inset-0 flex items-center justify-center text-xs font-bold text-primary">
              {{ Math.max(...Object.values(uploadProgress)) }}
            </span>
          </div>
          <span class="text-sm text-primary">Enviando...</span>
        </div>

        <div class="flex items-center justify-between mt-2">
          <div class="flex space-x-3 text-primary">
            <!-- Ícone para upload de imagem -->
            <label :class="['cursor-pointer py-1.5 font-medium gap-1.5 rounded-full px-3 flex items-center',
              isImageDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/10']">
              <input type="file" ref="fileInputImage" accept="image/*" multiple class="hidden"
                :disabled="isImageDisabled" @change="handleImageUpload" />
              <svg fill="none" class="text-primary" viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                  d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4Zm2 1v7.213l1.246-.932.044-.03a3 3 0 0 1 3.863.454c1.468 1.58 2.941 2.749 4.847 2.749 1.703 0 2.855-.555 4-1.618V5H5Zm14 10.357c-1.112.697-2.386 1.097-4 1.097-2.81 0-4.796-1.755-6.313-3.388a1 1 0 0 0-1.269-.164L5 14.712V19h14v-3.643ZM15 8a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm-3 1a3 3 0 1 1 6 0 3 3 0 0 1-6 0Z">
                </path>
              </svg>
            </label>

            <!-- Ícone para upload de vídeo -->
            <label :class="['cursor-pointer py-1.5 font-medium gap-1.5 rounded-full px-3 flex items-center',
              isVideoDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/10']">
              <input type="file" ref="fileInputVideo" accept="video/mp4,video/webm,video/ogg,video/quicktime"
                class="hidden" :disabled="isVideoDisabled" @change="handleVideoUpload" />
              <svg fill="none" class="text-primary" viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                  d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Zm2 2v10h14V7H5Zm3 2v6l5-3-5-3Z">
                </path>
              </svg>
            </label>
          </div>
          <button @click="submit"
            :disabled="(!form.content.trim() && !mediaPreviews.length) || isUploading || createKoolLoading"
            class="bg-black text-white font-bold px-4 py-2 rounded-full disabled:opacity-50">
            {{ props.isReply ? 'Responder' : 'Postar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>