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
import PlayerVideo from '../UI/PlayerVideo.vue';

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
    <div @click="goToView" class="border-b-[6px] border-border-light cursor-pointer"
        :class="{ 'border-none': !props.showBorder, 'pointer-events-none': isBlocked }">

        <div class="relative">
            <!--start contents area-->
            <div class="flex flex-1 flex-col">
                <!--start header content area-->
                <div class="flex px-[10px] pt-[10px] mb-2.5 flex-row">
                    <!--start avatar area-->
                    <router-link @click.stop :to="'/' + props.kool.author.username" class="flex flex-col relative pr-2">
                        <avatar custom="w-[38px] flex-shrink-0 h-[38px]"
                            :url="props.kool?.author?.profileImage.url || props.kool?.author?.profileImage.low" />
                    </router-link>
                    <!--end avatar area-->

                    <!--start header content area-->
                    <div class="flex w-full flex-col text-sm leading-5">
                        <!-- Container flexível para nome e username -->
                        <div @click.stop class="shrink-1">
                            <div
                                class="flex whitespace-nowrap truncate overflow-hidden max-w-full items-center min-w-0 shrink-1">
                                <router-link class="font-semibold text-[13px] text-text-primary hover:underline"
                                    :to="'/' + props.kool.author.username">
                                    {{ props.kool.author.name }}
                                </router-link>

                                <!-- Selo de verificado -->
                                <svg v-if="props?.kool?.author?.verified" aria-label="Verificado" role="img" viewBox="0 0 40 40"
                                    class=" shrink-0 w-[14px] ml-1 text-primary-500">
                                    <title>Verificado</title>
                                    <path
                                        fill="currentColor"
                                        d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z">
                                    </path>
                                </svg>
                            </div>
                        </div>

                        <div class="flex items-center text-[13px]">
                            <!-- Data de criação do Kool -->
                            <div class="flex flex-row text-text-secondary items-center flex-shrink-0">
                                <!--<div class="mx-1">·</div>-->
                                <div class="flex-shrink-0">
                                    {{ formatTime(props.kool.createdAt) }}
                                </div>
                            </div>
                        </div>

                    </div>
                    <!--end header content area-->
                </div>
                <!--end header content area-->

                <!--start body content area-->
                <Paragraph v-if="props.kool.content.length" class="mb-0.5 px-[10px]" :txt="props.kool.content" />
                <!--end body content area-->

                <!--start media area-->
                <div @click.stop v-if="props.kool?.media && props.kool?.media.length && props.showMedia">
                    <Media v-for="media in props.kool?.media" :key="media._id" :media="media" />
                </div>

                <!--end media area-->

                <!--start footer area-->
                <div>
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
