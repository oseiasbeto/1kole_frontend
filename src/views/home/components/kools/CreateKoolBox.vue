<script setup>
import { useKool } from '@/repositories/kool-repository';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { toast } from "vue3-toastify"
import { useRouter } from 'vue-router';

const store = useStore()
const router = useRouter()
const route = useRouter()
const { createKool, loading } = useKool()

const user = computed(() => {
    return store.getters.user
})

const props = defineProps({
    isReply: {
        type: Boolean,
        default: false
    },
    originalKool: {
        type: Object,
        default: {}
    }
});

const form = ref({
    content: ""
})

const clearForm = () => {
    form.value = {
        content: ""
    }
}

const submit = async () => {
    if (form.value.content.trim()) {
        await createKool({
            content: form.value.content,
            parentKool: props.originalKool._id ? props.originalKool._id : undefined,
            isReply: props.isReply
        }).then((newKool) => {
            if (props.isReply) {
                router.push('/kool/' + newKool.parentKool)
            } else {
                if (props.originalKool._id !== undefined) {
                    router.push('/kool/' + props.originalKool._id)
                }
            }
        }).catch(err => {
            toast(err.response.data.message, {
                theme: "colored",
                position: "bottom-center",
                autoClose: 1000,
                type: "info"
            })
        }).finally(() => {
            clearForm()
        })
    } else return
}
</script>

<template>
    <div class="w-full p-4 bg-white leading-tight">
        <div class="flex space-x-3">
            <img class="w-10 h-10 rounded-full" :src="user.profileImage.url" alt="User avatar">
            <div class="w-full">
                <textarea v-model="form.content" maxlength="200"
                    class="w-full h-20 resize-none outline-none text-gray-700 text-lg p-2"
                    placeholder="O que está acontecendo?"></textarea>
                <div class="flex items-center justify-between mt-2">
                    <div class="flex space-x-3 text-blue-500">

                    </div>
                    <button @click="submit" :disabled="!form.content.trim() || loading"
                        class="bg-blue-500 text-white font-bold px-4 py-2 rounded-full disabled:opacity-50">
                        {{ isReply ? 'Responder' : 'Postar' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>