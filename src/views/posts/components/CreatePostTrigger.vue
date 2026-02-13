<template>
    <div class="flex pb-2 border-b-[6px] border-border-light items-center px-[10px] pt-2.5 gap-2">
        <Avatar custom="h-8 w-8" :url="user?.profileImage?.url || user?.profileImage?.low" />
        <button
            class="qu-tapHighlight--white h-8 flex items-center flex-1 border border-border-light dark:border-border-dark rounded-2xl bg-secondary-500"
            @click="goToPost(postModule)">
            <p class="text-[13px] text-text-light px-[10px]">O que você quer compartilhar?</p>
        </button>
    </div>
</template>

<script setup>
import Avatar from '@/components/UI/Avatar.vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const user = computed(() => store?.getters?.user)

const props = defineProps({
    postModule: {
        type: String,
        required: true
    }
})

const router = useRouter()

const goToPost = (postModule) => {
    router.push({
        path: '/composer',
        query: {
            post_module: postModule
        }
    })
}
</script>