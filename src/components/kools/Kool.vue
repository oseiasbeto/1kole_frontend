<script setup>
import { defineProps, computed } from 'vue';
import { useStore } from 'vuex';
import Reactions from './Reactions.vue';
import Avatar from '@/components/UI/Avatar.vue';
import Paragraph from '@/components/UI/Paragraph.vue';
import formatTime from "@/utils/formatTime.js";
import { useKool } from '@/repositories/kool-repository';
import { toast } from "vue3-toastify";
import { useRoute, useRouter } from 'vue-router';
import Media from './Media.vue';

const { toggleLike, loading: toggleLikeLoading } = useKool();
const { createKool } = useKool();
const { deleteKoolById } = useKool();

const props = defineProps({
    kool: {
        type: Object,
        required: true
    },
    index: {
        type: Number,
        default: 0
    },
    showMedia: {
        type: Boolean,
        default: true
    },
    lastIndex: {
        type: Number,
        default: null
    },
    showLineThread: {
        type: Boolean,
        default: false
    },
    showReactions: {
        type: Boolean,
        default: true
    },
    showAuthorUsername: {
        type: Boolean,
        default: true
    },
    readonly: {
        type: Boolean,
        default: false
    },
    showUsername: {
        type: Boolean,
        default: true
    },
    isReply: {
        type: Boolean,
        required: true
    },
    isBlocked: {
        type: Boolean,
        required: false
    },
    showBorder: {
        type: Boolean,
        default: true
    }
});

const store = useStore();
const router = useRouter();
const route = useRoute();

// ✅ Usa `store.state` para garantir reatividade
const user = computed(() => store.state.user);

// ✅ Evita erros se `props.kool` for `null` ou `undefined`
const goToView = () => {
    if (props.readonly || !props.kool?._id) return;

    store.dispatch("setKool", {
        ...props.kool,
        shouldNotMakeRequest: true
    });
    router.push(`/kool/${props.kool._id}`);
};

// ✅ Adiciona tratamento de erro para evitar falhas silenciosas
const handleLikeUpdate = async () => {
    if (!props.kool?._id) return;

    try {
        await toggleLike(props.kool._id);
    } catch (error) {
        console.error("Erro ao curtir o Kool:", error);
    }
};

const handleDeleteKool = async (data) => {
    await deleteKoolById(data).then(() => {
        toast("Kool eliminado com sucesso!", {
            show: true,
            theme: "colored",
            position: "bottom-center",
            type: "info",
            hideProgressBar: true
        })
    })
}
const handleRekoolUpdate = async (koolId) => {
    if (!koolId) return;
    await createKool({
        parentKool: koolId,
        isReKool: true
    })

};

// ✅ Evita mutações diretas no objeto `data.data`
const handleOpenModal = (data) => {
    const modalData = JSON.parse(JSON.stringify(data.data)); // Cria uma cópia profunda

    store.dispatch("setModal", {
        show: true,
        name: data.name,
        data: {
            ...modalData,
            shouldAddReply: false
        }
    });
};
</script>


<template>
    <div @click="goToView"
        class="pl-[10px] border-b border-border/50 pr-[15px] cursor-pointer hover:bg-[rgba(0,0,0,0.04)]"
        :class="{ 'border-none': !props.showBorder, 'pointer-events-none': isBlocked }">
        <div v-if="props.showLineThread && props.index !== 0" class="pl-[7px] h-4">
            <div class="w-[42px] h-full flex flex-col">
                <div class="w-0.5 mb-1 mx-auto flex-shrink-0 bg-border grow"></div>
            </div>
        </div>
        <div v-else class="p-1.5"></div>
        <div class="flex flex-row">
            <!--start avatar area-->
            <router-link @click.stop :to="'/' + props.kool.author.username"
                class="pl-2 flex flex-col relative pr-[10px]">
                <avatar size="w-[42px] flex-shrink-0 h-[42px]" :url="props.kool?.author?.profileImage.url" />
                <div v-if="props.showLineThread" class="w-0.5 flex-shrink-0 bg-border mt-1 mx-auto grow"></div>
            </router-link>
            <!--end avatar area-->

            <!--start contents area-->
            <div class="flex flex-1 flex-col">
                <!--start header content area-->
                <div class="flex w-full mb-0.5 flex-row items-center text-[14px]">
                    <!-- Container flexível para nome e username -->
                    <div @click.stop class="shrink-1">
                        <div class="flex whitespace-nowrap truncate overflow-hidden max-w-full items-center min-w-0 shrink-1 ">
                            <router-link class="font-semibold text-title hover:underline"
                                :to="'/' + props.kool.author.username">
                                {{ props.kool.author.name }}
                            </router-link>

                            <!-- Selo de verificado -->
                            <span v-if="props.kool.author.verified"
                                class="shrink-0 text-[#1d9bf0] ml-0.5 flex items-center justify-center h-[20px]">
                                <svg viewBox="0 0 22 22" fill="currentColor" width="17px" height="17px"
                                    aria-label="Conta verificada" role="img" class="mt-[2px]"
                                    data-testid="icon-verified">
                                    <g>
                                        <path
                                            d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z">
                                        </path>
                                    </g>
                                </svg>
                            </span>

                            <!-- Username, que acompanha o nome -->
                            <router-link v-if="showUsername && props.kool.author.name.length < 20" class="text-[#536471] min-w-0 ml-1"
                                :to="'/' + props.kool.author.username">
                                @{{ props.kool.author.username }}
                            </router-link>
                        </div>
                    </div>

                    <!-- Data de criação do Kool -->
                    <div class="flex flex-row text-[#536471] items-center flex-shrink-0">
                        <div class="mx-1">·</div>
                        <div class="flex-shrink-0">
                            {{ formatTime(props.kool.createdAt) }}
                        </div>
                    </div>
                </div>
                <!--end header content area-->

                <!--start body content area-->
                <Paragraph :txt="props.kool.content" />
                <!--end body content area-->

                <!--start media area-->
                <div v-if="props.kool?.media && props.kool?.media.length && props.showMedia">
                    <Media v-for="media in props.kool?.media" :key="media._id" :media="media" />
                </div>
                <!--end media area-->

                <!--start footer area-->
                <div class="py-2">
                    <reactions v-if="props.showReactions" @update:like="handleLikeUpdate"
                        @update:rekool="handleRekoolUpdate" :kool="props.kool" :user="user"
                        @deleteKool="handleDeleteKool" :like-loading="toggleLikeLoading" :is-reply="props.isReply"
                        @openModal="handleOpenModal" />
                </div>
                <!--end footer area-->
            </div>
            <!--end contents area-->
        </div>
    </div>
</template>
