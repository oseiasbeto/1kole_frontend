<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useKool } from '@/repositories/kool-repository';
import { useUser } from '@/repositories/user-repository';
import { toast } from "vue3-toastify"
import KoolList from '@/components/kools/KoolList.vue';
import CreateReplyBox from '@/components/kools/CreateReplyBox.vue';
import Navbar from '@/components/UI/Navbar.vue';
import Paragraph from '@/components/UI/Paragraph.vue';
import Avatar from '@/components/UI/Avatar.vue';
import formatDate from '@/utils/formatDate';
import formatCount from '@/utils/formatCount';
import SpinnerNormal from '@/components/UI/spinners/SpinnerNormal.vue';
import Media from '@/components/kools/Media.vue';


// Obtendo funções do repositório de Kools e Usuários
const { getKoolById, loading: loadingKool } = useKool()
const { getKools: getReplies, loading: loadingReplies } = useKool()
const { followUser, loading: loadingFollow } = useUser()
const { toggleLike: handleToggleLike } = useKool();
const { loadMore } = useKool();

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
const isLiked = computed(() => kool.value?.likes?.includes(user?.value._id));
const isReposted = computed(() => kool.value?.reKools?.includes(user?.value._id));
const likesCount = computed(() => kool.value?.likes?.length || 0);
const repostCount = computed(() => kool.value?.reKools?.length || 0);
const viewsCount = computed(() => kool.value?.views || 0);
const replyCount = computed(() => replies.value?.metadata?.totalDocuments || 0);
const koolId = ref(route.params.id)

// Verifica se o Kool pertence ao usuário logado
const isOwnKool = computed(() => kool.value?.author?._id === user.value?._id);
const isFollowing = computed(() => kool.value?.author.followers.includes(user.value?._id));

const filter = ref({
  page: 1,
  limit: 10,
  populate: 'author, parentKool',
  isReKool: false,
  parentKool: koolId.value
})

// Alterna o like no Kool
const toggleLike = async () => {
  store.commit("UPDATE_KOOL_LIKES", user?.value._id)
  await handleToggleLike(kool?.value._id)
};

// Alterna o repost do Kool
const toggleReKool = async () => {
  toast("Recurso Indisponível!", {
    theme: "colored",
    position: "bottom-center",
    autoClose: 1000,
    type: "info",
    hideProgressBar: true
  })
  /* 
  store.commit("UPDATE_KOOL_REKOOLS", user?.value._id)
  await createKool({
    parentKool: kool?.value,
    isReKool: true
  })
  if (isReposted?.value) {
    toast("Repostado com sucesso!", {
      theme: "colored",
      position: "bottom-center",
      autoClose: 1000,
      type: "info",
      hideProgressBar: true,
    })
  } else {
    toast("Rekool removido!", {
      theme: "colored",
      position: "bottom-center",
      autoClose: 1000,
      type: "info",
      hideProgressBar: true
    })
  }*/
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
  toast("Link copiado!", {
    theme: "colored",
    position: "bottom-center",
    autoClose: 1000,
    type: "info"
  })
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
      isReKool: false,
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
      isReKool: false,
      parentKool: koolId.value
    }).then((replies) => {
      storeKoolData(kool.value, replies);
    });
  }
});

const onLoadMore = async (page) => {
  filter.value.page = page
  await loadMore({
    filter: filter.value,
    isReplies: true
  })
}

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
        populate: 'author, parentKool',
        isReKool: false
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
    <Navbar title="Kool" />
    <div v-if="loadingKool" class="flex justify-center my-10 h-screen">
      <SpinnerNormal />
    </div>
    <div v-else>
      <!--start kool content-->
      <div class="px-4 py-4 pb-0">
        <div class="flex mb-3 items-center justify-between">
          <div class="flex gap-2 flex-row items-center">
            <router-link :to="'/' + kool?.author.username" class="flex-1">
              <Avatar size="w-[42px] flex-shrink-0 h-[42px]" :url="kool?.author?.profileImage?.url || kool?.author?.profileImage.low" />
            </router-link>
            <div class="block">
              <div class="flex items-center">
                <p class="text-base text-title leading-[21px] font-semibold">{{ kool?.author.name }}</p>
                <span v-if="kool.author.verified"
                  class="max-w-[20px] text-verified ml-0.5 flex items-center justify-center h-[20px]">
                  <svg viewBox="0 0 22 22" fill="currentColor" width="17px" height="17px" aria-label="Conta verificada"
                    role="img" class="mt-[2px]" data-testid="icon-verified">
                    <g>
                      <path
                        d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z">
                      </path>
                    </g>
                  </svg>
                </span>
              </div>

              <p class="text-[rgb(83,100,113)] leading-[21px] text-sm">@{{ kool?.author.username }}</p>
            </div>
          </div>
          <div>
            <button v-if="!isOwnKool && !isFollowing" @click="followAuthor(kool?.author._id)"
              class="py-[6px] leading-5 flex items-center font-bold gap-1.5 text-sm px-4 rounded-full bg-black hover:opacity-80 text-white">
              <p class="mb-0.5">+ Seguir</p>
            </button>
          </div>
        </div>

        <div>
          <Paragraph :txt="kool?.content" custom="text-xl leading-[26px]" />
        </div>

        <!--start media area-->
        <div v-if="kool?.media && kool?.media.length">
          <Media v-for="media in kool?.media" :key="media._id" :media="media" />
        </div>
        <!--end media area-->

        <div class="mt-3 flex text-[rgb(83,100,113)] text-sm items-center gap-2">
          <p>{{ formatDate(kool?.createdAt) }}</p>
        </div>

        <div class="flex gap-3 border-t border-b border-border mt-3 py-3">
          <p class="text-[rgb(83,100,113)] text-base">
            <strong class="text-title font-semibold">{{ formatCount(repostCount) }}</strong>
            <span class="ml-1">{{ repostCount === 1 ? 'rekool' : 'rekools' }}</span>
          </p>
          <p class="text-[rgb(83,100,113)] text-base">
            <strong class="text-title font-semibold">{{ formatCount(viewsCount) }}</strong>
            <span class="ml-1"> {{ viewsCount !== 1 ? 'visualizações' : 'visualização' }} </span>
          </p>
        </div>

        <div class="pt-2 pb-0.5">
          <!--<reactions :is-view-page="true" /> -->
        </div>
      </div>
      <!--end kool content-->

      <!--start reactions kool-->
      <div class="flex px-4 justify-between items-center">
        <div @click="openCreateReplyModal" class="flex-shrink-0 ml-[-6px]">
          <button id="reply"
            class="px-[5px] py-1 gap-1 text-[#6f869f] hover:text-primary hover:bg-primary/10 cursor-pointer rounded-[30px] flex justify-center items-center">
            <svg fill="none" width="22" viewBox="0 0 24 24" height="22">
              <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                d="M2.002 6a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H12.28l-4.762 2.858A1 1 0 0 1 6.002 21v-2h-1a3 3 0 0 1-3-3V6Zm3-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2a1 1 0 0 1 1 1v1.234l3.486-2.092a1 1 0 0 1 .514-.142h7a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-14Z">
              </path>
            </svg>
            <div v-if="replyCount || 0" class="font-normal text-base">
              {{ formatCount(replyCount) }}
            </div>
          </button>
        </div>

        <div class="flex-shrink-0">
          <button @click="toggleReKool" id="rekool"
            class="px-[5px] py-1 gap-1 text-[#6f869f] hover:text-reKooled hover:bg-reKooled/10 cursor-pointer rounded-[30px] flex justify-center items-center"
            :class="{ 'text-reKooled': isReposted }">
            <svg fill="none" width="22" viewBox="0 0 24 24" height="22">
              <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                d="M17.957 2.293a1 1 0 1 0-1.414 1.414L17.836 5H6a3 3 0 0 0-3 3v3a1 1 0 1 0 2 0V8a1 1 0 0 1 1-1h11.836l-1.293 1.293a1 1 0 0 0 1.414 1.414l2.47-2.47a1.75 1.75 0 0 0 0-2.474l-2.47-2.47ZM20 12a1 1 0 0 1 1 1v3a3 3 0 0 1-3 3H6.164l1.293 1.293a1 1 0 1 1-1.414 1.414l-2.47-2.47a1.75 1.75 0 0 1 0-2.474l2.47-2.47a1 1 0 0 1 1.414 1.414L6.164 17H18a1 1 0 0 0 1-1v-3a1 1 0 0 1 1-1Z">
              </path>
            </svg>
            <div v-if="repostCount !== 0" class="font-normal text-base">
              {{ formatCount(repostCount) }}
            </div>
          </button>
        </div>

        <div class="flex-shrink-0">
          <button @click="toggleLike" id="like"
            class="px-[5px] py-1 gap-1 text-[#6f869f] hover:text-liked hover:bg-liked/10 hover:bg-light-bg-light cursor-pointer rounded-[30px] flex justify-center items-center"
            :class="{ '!text-liked': isLiked }">
            <svg v-if="!isLiked" fill="none" width="22" viewBox="0 0 24 24" height="22">
              <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                d="M16.734 5.091c-1.238-.276-2.708.047-4.022 1.38a1 1 0 0 1-1.424 0C9.974 5.137 8.504 4.814 7.266 5.09c-1.263.282-2.379 1.206-2.92 2.556C3.33 10.18 4.252 14.84 12 19.348c7.747-4.508 8.67-9.168 7.654-11.7-.541-1.351-1.657-2.275-2.92-2.557Zm4.777 1.812c1.604 4-.494 9.69-9.022 14.47a1 1 0 0 1-.978 0C2.983 16.592.885 10.902 2.49 6.902c.779-1.942 2.414-3.334 4.342-3.764 1.697-.378 3.552.003 5.169 1.286 1.617-1.283 3.472-1.664 5.17-1.286 1.927.43 3.562 1.822 4.34 3.764Z">
              </path>
            </svg>
            <svg v-else fill="none" width="22" viewBox="0 0 24 24" height="22" class="r-84gixx">
              <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                d="M12.489 21.372c8.528-4.78 10.626-10.47 9.022-14.47-.779-1.941-2.414-3.333-4.342-3.763-1.697-.378-3.552.003-5.169 1.287-1.617-1.284-3.472-1.665-5.17-1.287-1.927.43-3.562 1.822-4.34 3.764-1.605 4 .493 9.69 9.021 14.47a1 1 0 0 0 .978 0Z">
              </path>
            </svg>

            <div v-if="likesCount !== 0" class="font-normal text-base">
              {{ formatCount(likesCount) }}
            </div>
          </button>
        </div>

        <div class="flex-shrink-0">
          <button @click="copyLink" id="copy"
            class="px-[5px] py-1 gap-1 text-[#6f869f] hover:text-primary hover:bg-primary/10 cursor-pointer rounded-[30px] flex justify-center items-center">
            <svg fill="none" width="22" viewBox="0 0 24 24" height="22">
              <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                d="M12.707 3.293a1 1 0 0 0-1.414 0l-4.5 4.5a1 1 0 0 0 1.414 1.414L11 6.414v8.836a1 1 0 1 0 2 0V6.414l2.793 2.793a1 1 0 1 0 1.414-1.414l-4.5-4.5ZM5 12.75a1 1 0 1 0-2 0V20a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-7.25a1 1 0 1 0-2 0V19H5v-6.25Z">
              </path>
            </svg>
          </button>
        </div>

      </div>
      <!--end reactions kool-->

      <!--start reply create box-->
      <div class="lg:px-4 border-t mt-2 lg:mb-0 border-border border-b lg:py-2">
        <CreateReplyBox @openModal="openCreateReplyModal" :kool="kool" />
      </div>
      <!--end reply create box-->

      <!--start replies content-->
      <KoolList :kools="replies.data" :is-replies="true" :loading="loadingReplies" :metadata="replies.metadata"
        @load-more="onLoadMore" />
      <!--end replies content-->
    </div>
  </div>
</template>
