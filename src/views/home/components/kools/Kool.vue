<script setup>
import { defineProps, ref, computed } from 'vue';
import { useStore } from 'vuex';
import Reactions from './Reactions.vue';
import { useKool } from '@/repositories/kool-repository';
import { useRouter } from 'vue-router';

const { toggleLike, loading: toggleLikeLoading } = useKool()

const props = defineProps({
    kool: {
        type: Object,
        required: true
    }
});

const store = useStore()
const router = useRouter()

const user = computed(() => {
    return store.getters.user
})

const goToView = () => {
    store.dispatch("setKool", props.kool)
    router.push(`/kool/${props.kool._id}`)
}

const handleRekoolUpdate = (status) => {
    console.log("Actualizar o Rekool")
}

const handleLikeUpdate = async (status) => {
    await toggleLike(props.kool._id)
}

</script>

<template>
    <div class="p-4 border-b border-gray-200 flex gap-3">
        <!-- Foto de perfil -->
        <img :src="kool.author.profileImage.url" alt="Profile" class="w-10 h-10 rounded-full" />

        <div class="w-full">
            <!-- Nome e usuário -->
            <div class="flex items-center gap-2">
                <span class="font-bold">{{ kool.author.name }}</span>
                <span class="text-gray-500 text-sm">@{{ kool.author.username }}</span>
            </div>

            <!-- Conteúdo do post -->
            <div @click="goToView">
                <p class="text-gray-800">{{ kool.content }}</p>
            </div>


            <!-- Botões de reação -->
            <Reactions @update:rekool="handleRekoolUpdate" @update:like="handleLikeUpdate" :kool="props.kool"
                :user="user" />
        </div>
    </div>
</template>
