<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import moment from 'moment';
import { useKool } from '@/repositories/kool-repository';

const { getKoolById, loading } = useKool()
loading.value = true

const route = useRoute();
const router = useRouter();
const store = useStore();

const kool = computed(() => {
  return store.getters.kool
});
const user = computed(() => {
  return store.getters.user
});

// Computed properties
const isLiked = computed(() => kool.value?.likes?.includes(user._id));
const isReposted = computed(() => kool.value?.reKools?.includes(user._id));
const likesCount = computed(() => kool.value?.likes?.length || 0);
const repostCount = computed(() => kool.value?.reKools?.length || 0);
const replyCount = computed(() => kool.value?.replies?.length || 0);
const postTime = computed(() => moment(kool.value?.createdAt).fromNow());

const isOwnKool = computed(() => {
  return kool.value && kool.value.author && kool.value.author._id
    ? kool.value.author._id === user.value?._id
    : false;
}); // Verifica se o post é do usuário logado

// Alternar Like
const toggleLike = () => {
  if (!kool.value) return;

  if (isLiked.value) {
    kool.value.likes = kool.value.likes.filter(id => id !== user._id);
  } else {
    kool.value.likes.push(user._id);
  }
};

// Alternar Repost
const toggleRepost = () => {
  if (!kool.value) return;

  if (isReposted.value) {
    kool.value.reKools = kool.value.reKools.filter(id => id !== user._id);
  } else {
    kool.value.reKools.push(user._id);
  }
};

// Copiar Link do Kool
const copyLink = () => {
  navigator.clipboard.writeText(window.location.href);
  alert("Link copiado!");
};

onMounted(async () => {
  if (!kool.value._id) {
    const koolId = route.params.id
    await getKoolById(koolId)
  } else {
    loading.value = false;
  }
});
</script>

<template>
  <div class="max-w-xl mx-auto p-4">
    <button @click="$router.back()" class="text-blue-500 hover:underline">&larr; Voltar</button>

    <div v-if="loading" class="text-center mt-4">Carregando...</div>

    <div v-else class="bg-white shadow-lg rounded-xl p-4 mt-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img :src="kool.author.profileImage.url" alt="Avatar" class="w-10 h-10 rounded-full">
          <div>
            <h2 class="font-bold">{{ kool.author.name }}</h2>
            <p class="text-gray-500 text-sm">@{{ kool.author.username }} • {{ postTime }}</p>
          </div>
        </div>

        <!-- Botão de Seguir (não aparece se for o próprio usuário) -->
        <button v-if="!isOwnKool"
          class="text-blue-500 border border-blue-500 px-3 py-1 rounded-full text-sm hover:bg-blue-500 hover:text-white">
          Seguir
        </button>
      </div>

      <p class="mt-3 text-lg">{{ kool.content }}</p>

      <div class="flex gap-4 mt-4 text-gray-600">
        <button @click="toggleLike" class="flex items-center gap-1 hover:text-red-500">
          <span :class="{ 'text-red-500': isLiked }">❤️</span> {{ likesCount }}
        </button>
        <button @click="toggleRepost" class="flex items-center gap-1 hover:text-green-500">
          <span :class="{ 'text-green-500': isReposted }">🔄</span> {{ repostCount }}
        </button>
        <button class="flex items-center gap-1 hover:text-blue-500">
          💬 {{ replyCount }}
        </button>
        <button @click="copyLink" class="flex items-center gap-1 hover:text-gray-700">
          🔗
        </button>
      </div>
    </div>
  </div>
</template>
