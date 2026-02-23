<template>
  <div ref="container" class="video-wrapper">
    <div class="video-container">
      <video
        ref="videoRef"
        class="video"
        :poster="video.thumbnail"
        playsinline
      ></video>

      <!-- Botão central só antes de iniciar -->
      <div v-if="!hasLoaded" class="play-overlay" @click.stop="startVideo">
        ▶
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, nextTick } from 'vue'
import Hls from 'hls.js'
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'
import { useIntersectionObserver } from '@vueuse/core'

const props = defineProps({
  video: {
    type: Object,
    required: true,
  },
})

const videoRef = ref(null)
const container = ref(null)

const hasLoaded = ref(false)

let hls = null
let player = null

async function startVideo() {
  if (hasLoaded.value) return

  const video = videoRef.value

  // 🔥 Inicializa HLS primeiro
  if (Hls.isSupported()) {
    hls = new Hls({ enableWorker: true })
    hls.loadSource(props.video.url)
    hls.attachMedia(video)
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = props.video.url
  }

  await nextTick()

  // 🔥 Agora inicializa Plyr
  player = new Plyr(video, {
    autoplay: true,
    controls: [
      'play',
      'progress',
      'current-time',
      'mute',
      'volume',
      'fullscreen'
    ],
  })

  player.play()
  hasLoaded.value = true
}

/**
 * 🔥 Pausar quando sair da tela
 */
useIntersectionObserver(
  container,
  ([{ isIntersecting }]) => {
    if (!player) return

    if (!isIntersecting && player.playing) {
      player.pause()
    }
  },
  { threshold: 0.5 }
)

onBeforeUnmount(() => {
  if (player) player.destroy()
  if (hls) hls.destroy()
})
</script>

<style scoped>
.video-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.video-container {
  width: 100%;
  background: black;
  position: relative;
  overflow: hidden;
}

.video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 70px;
  color: white;
  background: rgba(0,0,0,0.4);
  cursor: pointer;
}
</style>