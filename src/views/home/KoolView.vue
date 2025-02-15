<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import moment from 'moment';
import { useKool } from '@/repositories/kool-repository';
import { useUser } from '@/repositories/user-repository';
import { toast } from "vue3-toastify"
import KoolList from '@/components/kools/KoolList.vue';
import CreateReplyBox from '@/components/kools/CreateReplyBox.vue';


// Obtendo funções do repositório de Kools e Usuários
const { getKoolById, loading: loadingKool } = useKool()
const { getKools: getReplies, loading: loadingReplies } = useKool()
const { followUser, loading: loadingFollow } = useUser()
const { toggleLike: handleToggleLike } = useKool();
const { createKool, loading: loadingCreateKool } = useKool();

// Definindo o estado inicial de carregamento do Kool
loadingKool.value = true

const route = useRoute();
const router = useRouter();
const store = useStore();

// Computed para acessar os estados globais do Vuex
const kool = computed(() => store.getters.kool);

// Computed properties para acessar as respostas e Kools do estado global
const replies = computed(() => store.getters.replies);

const user = computed(() => store.getters.user);

// Computed properties para verificar interações do usuário
const isLiked = computed(() => kool.value?.likes?.includes(user._id));
const isReposted = computed(() => kool.value?.reKools?.includes(user._id));
const likesCount = computed(() => kool.value?.likes?.length || 0);
const repostCount = computed(() => kool.value?.reKools?.length || 0);
const replyCount = computed(() => replies.value?.metadata?.totalDocuments || 0);
const postTime = computed(() => moment(kool.value?.createdAt).fromNow());
const koolId = ref(route.params.id)

// Verifica se o Kool pertence ao usuário logado
const isOwnKool = computed(() => kool.value?.author?._id === user.value?._id);

// Verifica se o usuário logado segue o autor do Kool
const isFollowing = computed(() => kool.value?.author?.followers.includes(user.value?._id));

// Função para voltar para a página anterior
const goback = () => {
  router.back()
}

// Alterna o like no Kool
const toggleLike = async () => {
  store.commit("UPDATE_KOOL_LIKES", user?.value._id)
  await handleToggleLike(kool?.value._id)
};

// Alterna o repost do Kool
const toggleReKool = async () => {
  store.commit("UPDATE_KOOL_REKOOLS", user?.value._id)

  if (!isReposted?.value) {
    await createKool({
      parentKool: kool?.value,
      isReKool: true
    })
  } else {
    console.log("Remover repostagem")
  }
};

// Armazena os Kools e suas respostas localmente
const storeKoolData = (kool, replies) => {
  store.commit('STORE_KOOL_DATA', { kool, replies });
};

const scrollOnTop = () => {
  window.scrollTo(0, 0)
}

// Recupera um Kool armazenado localmente pelo ID
const getStoredKool = (id) => store.getters.getViewedKool(id);



// Copia o link do Kool para a área de transferência
const copyLink = () => {
  navigator.clipboard.writeText(window.location.href);
  alert("Link copiado!");
};

const openCreateReplyModal = () => {
  store.dispatch("setModal", {
    show: true,
    name: "create kool",
    data: {
      parentKool: kool.value,
      isReply: true,
      shouldAddReply: true
    }
  })
}

// Seguir o autor do Kool
const followAuthor = async (authorId) => {
  await followUser(authorId).then((res) => {
    store.commit('FOLLOW_AUTHOR_KOOL', user.value._id);
    toast(res.data.message, {
      theme: "colored",
      position: "bottom-center",
      autoClose: 1500,
      type: "info"
    });
  });
};

// Obtém o Kool e seus replies ao montar o componente
onMounted(async () => {
  scrollOnTop()
  if (!kool.value._id) {
    await getKoolById(koolId.value);
    await getReplies({
      page: 1,
      limit: 10,
      populate: 'author, parentKool',
      parentKool: koolId.value
    }).then((replies) => {
      storeKoolData(kool.value, replies);
    });
  } else {
    loadingKool.value = false;
    await getReplies({
      page: 1,
      limit: 10,
      populate: 'author, parentKool',
      parentKool: koolId.value
    }).then((replies) => {
      storeKoolData(kool.value, replies);
    });
  }
});

watch(() => route.params.id, async (newId, oldId) => {
  if (!newId || newId === oldId) return; // Evita chamadas se o ID for inválido ou repetido

  scrollOnTop(); // Rola para o topo ao carregar um novo Kool

  // Obtém o Kool armazenado localmente, se existir
  const storedKool = getStoredKool(newId) || null;

  if (storedKool) {
    // Se o Kool já foi visualizado, carrega do cache local
    store.dispatch('setKool', storedKool);
    store.dispatch("setReplies", storedKool.replies || []);
  } else {
    try {
      if (!kool.value?.shouldNotMakeRequest) {
        await getKoolById(newId); // Busca na API se não estiver no cache
        await nextTick(); // Aguarda a atualização do estado antes de buscar as respostas
      }

      // Busca as respostas do Kool na API
      const replies = await getReplies({
        parentKool: newId,
        page: 1,
        limit: 10,
        populate: 'author, parentKool'
      });

      if (kool.value) {
        storeKoolData(kool.value, replies); // Armazena localmente o Kool e suas respostas
      }
    } catch (error) {
      console.error("Erro ao buscar Kool ou Replies:", error);
    }
  }
});

</script>


<template>
  <div>
    <button @click="goback()" class="text-blue-500 hover:underline">&larr; Voltar</button>

    <div v-if="loadingKool" class="text-center mt-4">Carregando...</div>

    <div v-else>
      <!--start kool content-->
      <div class="p-4 mb-3 mt-4">
        <div class="bg-white p-3 shadow-lg rounded-xl ">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <img :src="kool.author.profileImage.url" alt="Avatar" class="w-10 h-10 rounded-full">
              <div>
                <h2 class="font-bold">{{ kool.author.name }}</h2>
                <p class="text-gray-500 text-sm">@{{ kool.author.username }} • {{ postTime }}</p>
              </div>
            </div>

            <!-- Botão de Seguir (não aparece se for o próprio usuário) -->
            <button v-if="!isFollowing && !isOwnKool" :disabled="loadingFollow" @click="followAuthor(kool.author._id)"
              class="text-blue-500 border border-blue-500 px-3 py-1 rounded-full text-sm hover:bg-blue-500 hover:text-white">
              + Seguir
            </button>

          </div>

          <p class="mt-3 text-lg">{{ kool.content }}</p>

          <div class="flex gap-4 mt-4 text-gray-600">
            <button @click="toggleLike" class="flex items-center gap-1 hover:text-red-500">
              <span :class="{ 'text-red-500': isLiked }">❤️</span> {{ likesCount }}
            </button>
            <button @click="toggleReKool" class="flex items-center gap-1 hover:text-green-500">
              <span :class="{ 'text-green-500': isReposted }">🔄</span> {{ repostCount }}
            </button>
            <button @click="openCreateReplyModal" class="flex items-center gap-1 hover:text-blue-500">
              💬 {{ replyCount }}
            </button>
            <button @click="copyLink" class="flex items-center gap-1 hover:text-gray-700">
              🔗
            </button>
          </div>
        </div>
      </div>

      <!--end kool content-->

      <!--start reactions kool-->
      <!--end reactions kool-->

      <!--start reply create box-->
      <div class="px-4 space-y-8">
        <CreateReplyBox @openModal="openCreateReplyModal" :kool="kool" />
      </div>
      <!--end reply create box-->

      <!--start replies content-->
      <KoolList :kools="replies.data" :is-replies="true" :loading="loadingReplies" :metadata="replies.metadata" />
      <!--end replies content-->
    </div>
  </div>
</template>
