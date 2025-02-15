<script setup>
import { defineProps, computed } from 'vue';
import { useStore } from 'vuex';
import Reactions from './Reactions.vue';
import { useKool } from '@/repositories/kool-repository';
import { useRoute, useRouter } from 'vue-router';

const { toggleLike, loading: toggleLikeLoading } = useKool();

const props = defineProps({
    kool: {
        type: Object,
        required: true
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
    isReply: {
        type: Boolean,
        required: true
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
    <div @click="goToView" class="p-4 border-b border-gray-200 flex gap-3"
        :class="{ 'cursor-pointer': !props.readonly }">
        <!-- Foto de perfil -->
        <img :src="kool.author?.profileImage?.url || '/default-avatar.png'" alt="Profile"
            class="w-10 h-10 rounded-full" />

        <div class="w-full">
            <!-- Nome e usuário -->
            <div @click.stop class="flex items-center gap-2">
                <span class="font-bold">{{ kool.author?.name || 'Usuário Desconhecido' }}</span>
                <span v-if="props.showAuthorUsername && kool.author?.username" class="text-gray-500 text-sm">
                    @{{ kool.author.username }}
                </span>
            </div>

            <!-- Conteúdo do post -->
            <div>
                <p class="text-gray-800 select-none">{{ kool.content || '' }}</p>
            </div>

            <!-- Botões de reação -->
            <div @click.stop v-if="props.showReactions">
                <Reactions 
                @update:like="handleLikeUpdate" 
                :kool="props.kool" :user="user"
                :like-loading="toggleLikeLoading" 
                :is-reply="props.isReply" 
                @openModal="handleOpenModal" 
                />
            </div>
        </div>
    </div>
</template>
