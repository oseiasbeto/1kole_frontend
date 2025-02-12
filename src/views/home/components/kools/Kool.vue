<script setup>
import { defineProps, ref, computed, readonly } from 'vue';
import { useStore } from 'vuex';
import Reactions from './Reactions.vue';
import { useKool } from '@/repositories/kool-repository';
import { useRoute, useRouter } from 'vue-router';

const { toggleLike, loading: toggleLikeLoading } = useKool()

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

const store = useStore()
const router = useRouter()
const route = useRoute()

const user = computed(() => {
    return store.getters.user
})

const goToView = () => {
    if (!props.readonly) {
        if (route.name !== 'View kool') {
            store.dispatch("setKool", props.kool)
        }
        router.push(`/kool/${props.kool._id}`)
    } else return
}

const handleRekoolUpdate = (status) => {
    console.log("Actualizar o Rekool")
}

const handleLikeUpdate = async (status) => {
    await toggleLike(props.kool._id)
}

const handleOpenModal = (data) => {
    store.dispatch("setModal", {
        show: true,
        name: data.name,
        data: {
            ...data.data,
            isReply: props.isReply
        }
    })
}

</script>

<template>
    <div @click="goToView" class="p-4  flex gap-3"
        :class="{ 'border-b border-gray-200': props.showBorder, 'cursor-pointer': !props.readonly }">
        <!-- Foto de perfil -->
        <img :src="kool.author.profileImage.url" alt="Profile" class="w-10 h-10 rounded-full" />

        <div class="w-full">
            <!-- Nome e usuário -->
            <div @click.stop class="flex items-center gap-2">
                <span class="font-bold">{{ kool.author.name }}</span>
                <span v-if="props.showAuthorUsername" class="text-gray-500 text-sm">@{{ kool.author.username }}</span>
            </div>

            <!-- Conteúdo do post -->
            <div>
                <p class="text-gray-800 select-none">{{ kool.content }}</p>
            </div>


            <!-- Botões de reação -->
            <div @click.stop v-if="props.showReactions">
                <Reactions @update:rekool="handleRekoolUpdate" @update:like="handleLikeUpdate" :kool="props.kool"
                    :user="user" :like-loading="toggleLikeLoading" :is-reply="props.isReply"
                    @openModal="handleOpenModal" />
            </div>
        </div>
    </div>
</template>
