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
    <div @click="goToView" class="border-b border-border/50 p-4 cursor-pointer"
        :class="{ 'border-none': !props.showBorder, 'pointer-events-none': isBlocked }">

        <div class="relative">
            <!--start contents area-->
            <div class="flex flex-1 flex-col">
                <!--start header content area-->
                <div class="flex mb-2.5 flex-row">
                    <!--start avatar area-->
                    <router-link @click.stop :to="'/' + props.kool.author.username"
                        class="flex flex-col relative pr-[10px]">
                        <avatar size="w-[42px] flex-shrink-0 h-[42px]" 
                        :url="props.kool?.author?.profileImage.url || props.kool?.author?.profileImage.low" />
                        <div v-if="props.showLineThread" class="w-0.5 flex-shrink-0 bg-border mt-1 mx-auto grow"></div>
                    </router-link>
                    <!--end avatar area-->

                    <!--start header content area-->
                    <div class="flex w-full mb-1 flex-col text-sm leading-5">
                        <!-- Container flexível para nome e username -->
                        <div @click.stop class="shrink-1">
                            <div
                                class="flex whitespace-nowrap truncate overflow-hidden max-w-full items-center min-w-0 shrink-1">
                                <router-link class="font-semibold text-sm text-title hover:underline"
                                    :to="'/' + props.kool.author.username">
                                    {{ props.kool.author.name }}
                                </router-link>

                                <!-- Selo de verificado -->
                                <svg v-if="props?.kool?.author?.verified" width="24" height="24" viewBox="0 0 20 20"
                                    fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4 text-verified ml-1.5"
                                    data-testid="svg-icon">
                                    <title>Verified Account</title>
                                    <path
                                        d="M8.82.521a1.596 1.596 0 012.36 0l.362.398c.42.46 1.07.635 1.664.445l.512-.163a1.596 1.596 0 012.043 1.18l.115.525a1.596 1.596 0 001.218 1.218l.525.115a1.596 1.596 0 011.18 2.043l-.163.513a1.596 1.596 0 00.446 1.663l.397.362a1.596 1.596 0 010 2.36l-.397.362c-.461.42-.635 1.07-.446 1.664l.163.512a1.596 1.596 0 01-1.18 2.043l-.525.115a1.596 1.596 0 00-1.218 1.218l-.115.525a1.596 1.596 0 01-2.043 1.18l-.512-.163a1.596 1.596 0 00-1.664.445l-.362.398a1.596 1.596 0 01-2.36 0l-.362-.398a1.596 1.596 0 00-1.663-.445l-.513.163a1.596 1.596 0 01-2.043-1.18l-.115-.525a1.596 1.596 0 00-1.218-1.218l-.525-.115a1.596 1.596 0 01-1.18-2.043l.164-.512a1.596 1.596 0 00-.446-1.664L.52 11.18a1.596 1.596 0 010-2.36l.398-.362c.46-.42.635-1.07.446-1.663L1.2 6.282a1.596 1.596 0 011.18-2.043l.525-.115a1.596 1.596 0 001.218-1.218l.115-.525A1.596 1.596 0 016.282 1.2l.513.163c.594.19 1.244.015 1.663-.445L8.821.52z"
                                        fill="currentColor"></path>
                                    <path
                                        d="M6.66 7.464L5.012 9.111l3.85 3.85 5.483-5.481-1.966-1.966L8.544 9.35 6.66 7.464z"
                                        fill="#fff"></path>
                                    <path opacity=".5"
                                        d="M11.25 15.55l-1.646-1.848 1.646-1.646 1.887 1.887-1.887 1.606z" fill="#fff">
                                    </path>
                                </svg>
                            </div>
                        </div>

                        <div class="flex items-center font-sm">
                            <!-- Username, que acompanha o nome -->
                            <router-link v-if="showUsername && props.kool.author.name.length < 20"
                                class="text-gray min-w-0" :to="'/' + props.kool.author.username">
                                @{{ props.kool.author.username }}
                            </router-link>
                            <!-- Data de criação do Kool -->
                            <div class="flex flex-row text-gray items-center flex-shrink-0">
                                <div class="mx-1">·</div>
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
                <Paragraph v-if="props.kool.content.length" class="mb-1" :txt="props.kool.content" />
                <!--end body content area-->

                <!--start media area-->
                <div  @click.stop v-if="props.kool?.media && props.kool?.media.length && props.showMedia">
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
