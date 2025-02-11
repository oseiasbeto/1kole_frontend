<script setup>
import { useKool } from '@/repositories/kool-repository';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { toast } from "vue3-toastify"

const store = useStore()
const { createKool, loading } = useKool()

const user = computed(() => {
    return store.getters.user
})

const form = ref({
    content: ""
})

const clearForm = () => {
    form.value = {
        content: ""
    }
}

const submit = () => {
    if (form.value.content.trim()) {
        createKool(form.value).then(() => {
            toast("Kool criado com sucesso!", {
                theme: "colored",
                position: "bottom-center",
                autoClose: 3000,
                type: "info"
            })
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
    <div class="w-full max-w-xl mx-auto p-4 bg-white rounded-2xl mt-2 leading-tight border border-gray-200">
        <div class="flex space-x-3">
            <img class="w-10 h-10 rounded-full" :src="user.profileImage.url" alt="User avatar">
            <div class="w-full">
                <textarea v-model="form.content" maxlength="200" class="w-full h-20 resize-none outline-none text-gray-700 text-lg p-2"
                    placeholder="O que está acontecendo?"></textarea>
                <div class="flex items-center justify-between mt-2">
                    <div class="flex space-x-3 text-blue-500">

                    </div>
                    <button @click="submit" :disabled="!form.content.trim() || loading"
                        class="bg-blue-500 text-white font-bold px-4 py-2 rounded-full disabled:opacity-50">Postar</button>
                </div>
            </div>
        </div>
    </div>
</template>