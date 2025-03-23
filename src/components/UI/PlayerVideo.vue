<script setup>
import { ref, watch, onMounted, computed, onUnmounted } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';
import Hls from 'hls.js';
import { debounce } from 'lodash';
import Avatar from './Avatar.vue';

// Estado global para rastrear o vídeo ativo (singleton)
const globalVideoState = (() => {
  const activeVideo = ref(null);
  return {
    getActiveVideo: () => activeVideo.value,
    setActiveVideo: (video) => {
      // Pausa o vídeo ativo atual antes de definir um novo
      if (activeVideo.value && activeVideo.value !== video) {
        activeVideo.value.pause();
      }
      activeVideo.value = video;
    },
    clearActiveVideo: () => {
      if (activeVideo.value) {
        activeVideo.value.pause(); // Garante que o vídeo seja pausado ao limpar
      }
      activeVideo.value = null;
    },
  };
})();

// Definição das props com duração
const props = defineProps({
  video: {
    type: Object,
    required: true,
    default: () => ({
      url: 'https://res.cloudinary.com/daujoblcc/video/upload/sp_hd/v1742742887/videos/u7rstwjmqeejj7qxdg86.m3u8',
      thumbnail: 'https://res.cloudinary.com/daujoblcc/video/upload/c_fill,h_640,w_360/q_80/f_auto/dpr_auto/so_1/v1/videos/u7rstwjmqeejj7qxdg86?_a=BAMCkGOY0',
      authorImage: 'https://aws-br-pic.kwai.net/bs2/overseaHead/20240918040035_BMTUwMDAwMDU1Nzc4NDk0_t.jpg',
      likes: 100,
      comments: 50,
      shares: 25,
      duration: 0,
    }),
  },
});

// Fallback para thumbnail inválida
const defaultThumb = 'https://via.placeholder.com/400x400?text=Thumbnail+Indisponível';

// Estados reativos
const videoRef = ref(null);
const isPlaying = ref(false);
const isMuted = ref(false);
const isBuffering = ref(false);
const progress = ref(0);
const videoLoaded = ref(false);
const hlsInstance = ref(null);
const showLikeEffect = ref(false);
const likePosition = ref(null);
const likes = ref(props.video.likes || 0);
const isFullscreen = ref(false);
const currentTime = ref(0);
const duration = ref(props.video.duration || 0);
const isVisible = ref(false);

// Carregar vídeo com HLS.js
const loadHls = () => {
  if (videoLoaded.value) return;
  const video = videoRef.value;
  if (!video || !props.video.url) return;

  if (hlsInstance.value) {
    hlsInstance.value.destroy();
    hlsInstance.value = null;
  }

  if (Hls.isSupported()) {
    hlsInstance.value = new Hls({
      autoStartLoad: false,
      startLevel: -1,
      maxBufferLength: 10,
      maxMaxBufferLength: 20,
      lowLatencyMode: true,
      enableWorker: true,
    });
    hlsInstance.value.loadSource(props.video.url);
    hlsInstance.value.attachMedia(video);
    hlsInstance.value.on(Hls.Events.MANIFEST_PARSED, () => {
      videoLoaded.value = true;
      video.muted = isMuted.value;
    });
    hlsInstance.value.on(Hls.Events.ERROR, (event, data) => {
      console.error('Erro HLS:', data);
      isBuffering.value = true;
      if (data.fatal) {
        hlsInstance.value.destroy();
        hlsInstance.value = null;
        setTimeout(loadHls, 1000);
      }
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = props.video.url;
    video.muted = isMuted.value;
    videoLoaded.value = true;
  }
};

// Função para tocar o vídeo
const playVideo = async () => {
  const video = videoRef.value;
  if (!video || isPlaying.value) return;

  // Verifica e pausa qualquer vídeo ativo antes de prosseguir
  const currentActiveVideo = globalVideoState.getActiveVideo();
  if (currentActiveVideo && currentActiveVideo !== video) {
    currentActiveVideo.pause();
    globalVideoState.clearActiveVideo(); // Limpa o estado global
  }

  if (!videoLoaded.value) {
    loadHls();
    hlsInstance.value?.startLoad();
    await new Promise((resolve) => {
      video.addEventListener('canplay', resolve, { once: true });
    });
  }

  try {
    await video.play();
    isPlaying.value = true;
    isBuffering.value = false;
    globalVideoState.setActiveVideo(video); // Define este vídeo como ativo
  } catch (err) {
    console.error('Erro ao reproduzir:', err);
    if (err.name === 'NotAllowedError') {
      isMuted.value = true;
      video.muted = true;
      await video.play();
      isPlaying.value = true;
      globalVideoState.setActiveVideo(video);
    } else {
      isBuffering.value = true;
    }
  }
};

// Pausar o vídeo
const pauseVideo = () => {
  const video = videoRef.value;
  if (video && !video.paused) {
    video.pause();
    isPlaying.value = false;
    if (globalVideoState.getActiveVideo() === video) {
      globalVideoState.clearActiveVideo();
    }
  }
};

// Alternar reprodução manual
const togglePlay = () => {
  if (isPlaying.value) {
    pauseVideo();
  } else {
    playVideo();
  }
};

// Alternar mute
const toggleMute = () => {
  isMuted.value = !isMuted.value;
  if (videoRef.value) videoRef.value.muted = isMuted.value;
};

// Alternar fullscreen
const toggleFullscreen = () => {
  const video = videoRef.value.parentElement;
  if (!isFullscreen.value) {
    if (video.requestFullscreen) video.requestFullscreen();
    else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
    else if (video.msRequestFullscreen) video.msRequestFullscreen();
    isFullscreen.value = true;
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
    isFullscreen.value = false;
  }
};

// Atualizar progresso com debounce
const updateProgress = debounce(() => {
  const video = videoRef.value;
  if (video && video.duration) {
    progress.value = (video.currentTime / video.duration) * 100;
    currentTime.value = video.currentTime;
  }
}, 100);

// Buscar posição no vídeo
const seekVideo = (event) => {
  const video = videoRef.value;
  if (!video || !videoLoaded.value) return;

  const rect = event.target.getBoundingClientRect();
  const clickPosition = event.clientX - rect.left;
  const percentage = clickPosition / rect.width;

  video.currentTime = percentage * (props.video.duration || video.duration) || 0;
  progress.value = percentage * 100;
  if (!isPlaying.value) playVideo();
};

// Efeito de like com duplo clique
const doubleClickLike = (event) => {
  likes.value += 1;
  const rect = event.target.getBoundingClientRect();
  likePosition.value = { x: event.clientX - rect.left - 25, y: event.clientY - rect.top - 25 };
  showLikeEffect.value = true;
  setTimeout(() => (showLikeEffect.value = false), 1000);
};

// Eventos do vídeo
const onVideoEnded = () => {
  videoRef.value.currentTime = 0;
  progress.value = 0;
  isPlaying.value = false;
  if (globalVideoState.getActiveVideo() === videoRef.value) {
    globalVideoState.clearActiveVideo();
  }
};

const onWaiting = () => {
  isBuffering.value = true;
};

const onPlaying = () => {
  isBuffering.value = false;
};

// Adicionar listener para pausar outros vídeos automaticamente
const onPlayAttempt = () => {
  const video = videoRef.value;
  const currentActiveVideo = globalVideoState.getActiveVideo();
  if (currentActiveVideo && currentActiveVideo !== video) {
    currentActiveVideo.pause();
    globalVideoState.clearActiveVideo();
  }
  if (!isPlaying.value) {
    playVideo(); // Só chama playVideo se não estiver tocando
  }
};

// Formatar tempo
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' + secs : secs}`;
};

const currentTimeFormatted = computed(() => formatTime(currentTime.value));
const durationFormatted = computed(() => formatTime(duration.value));

// Configuração do IntersectionObserver e listeners
onMounted(() => {
  const videoEl = videoRef.value;
  if (videoEl) {
    useIntersectionObserver(
      videoEl,
      ([{ isIntersecting }]) => {
        isVisible.value = isIntersecting;
        if (!isIntersecting && isPlaying.value) {
          pauseVideo();
        }
      },
      { threshold: 0.5 }
    );
    // Adiciona listener para tentativas de play nativas
    videoEl.addEventListener('play', onPlayAttempt);
  }
});

onUnmounted(() => {
  pauseVideo();
  if (hlsInstance.value) {
    hlsInstance.value.destroy();
    hlsInstance.value = null;
  }
  if (videoRef.value) {
    videoRef.value.removeEventListener('play', onPlayAttempt);
    videoRef.value.src = '';
    videoRef.value.load();
  }
});

// Monitorar troca de vídeo
watch(() => props.video.url, (newUrl, oldUrl) => {
  if (newUrl !== oldUrl) {
    pauseVideo();
    videoLoaded.value = false;
    isPlaying.value = false;
    progress.value = 0;
    currentTime.value = 0;
    duration.value = props.video.duration || 0;
  }
});
</script>

<template>
  <div class="relative w-full max-h-[506px] bg-black">
    <!-- Vídeo -->
    <video ref="videoRef" :poster="props.video.thumbnail || defaultThumb" class="w-full h-full object-cover"
      @click="togglePlay" @dblclick="doubleClickLike" @timeupdate="updateProgress" @ended="onVideoEnded"
      @waiting="onWaiting" @playing="onPlaying" preload="metadata"></video>

    <!-- Efeito de like -->
    <div v-if="showLikeEffect" class="absolute w-12 h-12 bg-red-500 bg-center bg-contain opacity-90 animate-like"
      :style="{ top: likePosition?.y + 'px', left: likePosition?.x + 'px' }"></div>

    <!-- Botão de play/pause -->
    <div v-if="!isPlaying" @click="togglePlay" class="absolute inset-0 flex items-center justify-center"
      :class="{ 'pointer-events-none opacity-50': globalVideoState.getActiveVideo() && globalVideoState.getActiveVideo() !== videoRef.value }">
      <div class="bg-black bg-opacity-50 rounded-full p-4">
        <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 3l14 9-14 9V3z" />
        </svg>
      </div>
    </div>

    <!-- Barra de progresso e tempo -->
    <div class="absolute bottom-0 w-full px-4 pb-4 flex items-center gap-2">
      <div class="text-white text-sm">
        {{ currentTimeFormatted }} / {{ durationFormatted }}
      </div>
      <div class="flex-1 h-1 bg-white bg-opacity-30 cursor-pointer" @click="seekVideo">
        <div v-if="isBuffering" class="h-full bg-white bg-opacity-50 animate-pulse"></div>
        <div v-else :style="{ width: progress + '%' }" class="h-full bg-white rounded-lg transition-all duration-100">
        </div>
      </div>
    </div>

    <!-- Botão de mute -->
    <button @click="toggleMute" class="absolute top-4 right-12 text-white bg-black bg-opacity-50 rounded-full p-2">
      <svg v-if="isMuted" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="-0.5 0 25 25" fill="none">
        <path
          d="M10.9395 17.72C12.9395 19.5 15.3895 20.72 16.5495 20.33C18.6495 19.55 18.9995 15.3299 18.9995 12.4099C18.9995 11.5999 18.9995 10.68 18.8895 9.77002"
          stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path
          d="M18.1292 6.28008C18.0012 5.89129 17.795 5.53273 17.5233 5.22661C17.2516 4.9205 16.9201 4.67327 16.5493 4.50005C15.3193 4.04005 12.7093 5.49996 10.5493 7.40996H8.94922C7.88835 7.40996 6.87093 7.83145 6.12079 8.58159C5.37064 9.33174 4.94922 10.3491 4.94922 11.41V13.41C4.9489 14.1811 5.17151 14.936 5.59021 15.5835C6.00892 16.2311 6.60585 16.7438 7.3092 17.06"
          stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M22 2.42004L2 22.42" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>

      <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="-0.5 0 25 25" fill="none">
        <path
          d="M12.5493 4.50005C11.3193 4.04005 8.70926 5.49996 6.54926 7.40996H4.94922C3.88835 7.40996 2.87093 7.83145 2.12079 8.58159C1.37064 9.33174 0.949219 10.3491 0.949219 11.41V13.41C0.949219 14.4708 1.37064 15.4883 2.12079 16.2385C2.87093 16.9886 3.88835 17.41 4.94922 17.41H6.54926C8.65926 19.35 11.2693 20.78 12.5493 20.33C14.6493 19.55 14.9992 15.33 14.9992 12.41C14.9992 9.48996 14.6493 5.28005 12.5493 4.50005Z"
          stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path
          d="M20.6602 6.71997C22.1593 8.22011 23.0015 10.2542 23.0015 12.375C23.0015 14.4958 22.1593 16.5299 20.6602 18.03"
          stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path
          d="M18.5391 15.95C19.4764 15.0123 20.003 13.7407 20.003 12.4149C20.003 11.0891 19.4764 9.81764 18.5391 8.88"
          stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <!-- Botão de fullscreen -->
    <button @click="toggleFullscreen" class="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path d="M6 9.99739C6.01447 8.29083 6.10921 7.35004 6.72963 6.72963C7.35004 6.10921 8.29083 6.01447 9.99739 6"
          stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
        <path
          d="M6 14.0007C6.01447 15.7072 6.10921 16.648 6.72963 17.2684C7.35004 17.8888 8.29083 17.9836 9.99739 17.998"
          stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
        <path
          d="M17.9976 9.99739C17.9831 8.29083 17.8883 7.35004 17.2679 6.72963C16.6475 6.10921 15.7067 6.01447 14.0002 6"
          stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
        <path
          d="M17.9976 14.0007C17.9831 15.7072 17.8883 16.648 17.2679 17.2684C16.6475 17.8888 15.7067 17.9836 14.0002 17.998"
          stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
        <path
          d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8"
          stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    </button>
  </div>
</template>