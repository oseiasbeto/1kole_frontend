<script setup>
// Importe os pacotes necessários para o bom funcionamento deste componente.
import { useStore } from "vuex"
import { computed, ref } from "vue"
import { toast } from "vue3-toastify"
import {
    Dialog,
    DialogPanel,
    TransitionRoot,
    TransitionChild
} from '@headlessui/vue'
import CheckAccountForm from "../../forms/CheckAccountForm.vue"

import { useAuth } from '@/repositories/auth-repository';
import SmallSpinner from "@/components/UI/spinners/SmallSpinner.vue";
import { useRouter } from "vue-router"

const { checkAccount, loading, error } = useAuth()

// Importe as referências necessários para o bom funcionamento deste componente.
const store = useStore()

const isFormValid = ref(false)

const router = useRouter()

const handleFormValid = (isValid) => {
    isFormValid.value = isValid
}

// Esta função computada tem como finalidade retornar os dados da caixa de diálogo aberta.
const modal = computed(() => {
    return store.getters.modal
})

const user = computed(() => {
    return store.getters.user
})

const submit = async () => {
    if (isFormValid.value) {
        const token = modal.value.data.token
        await checkAccount({
            token,
            user: user.value
        }).then(() => {
            close()
            store.dispatch("setToast", {
                show: true,
                message: "Verificação concluída!",
                position: "bottom-center",
                hideProgressBar: true,
                autoClose: 3000,
                type: "info"
            })
            router.replace('/')
        }).catch((err) => {
            isFormValid.value = false
            toast(err.response.data.message, {
                theme: "colored",
                position: "bottom-center",
                hideProgressBar: true,
                autoClose: 3000,
                type: "info"
            })
        })
    } else return
}

// Esta função tem como finalidade fechar a caixa de diálogo aberta.
const close = (name) => {
    isFormValid.value = false
    store.dispatch("setModal", {
        show: false,
        name,
        data: {}
    })
}
</script>

<template>
    <TransitionRoot appear :show="modal.show && modal.name == 'check account'" as="div">
        <Dialog as="div" class="relative z-[111]">
            <TransitionChild as="div" enter="duration-300 ease-out" enter-from="opacity-100"
                leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-black bg-opacity-25"></div>
            </TransitionChild>

            <!--start body-->
            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex items-center justify-center min-h-full text-center">
                    <TransitionChild as="div" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95">
                        <!--start body content-->
                        <DialogPanel class="w-full overflow-hidden text-left align-middle transition-all transform">
                            <div class="bg-white w-screen h-screen lg:h-auto lg:w-[600px] lg:rounded-[16px] shadow-lg flex flex-col lg:max-h-[90vh]">
                                <!--start header body-->
                                <div v-if="!loading" class="px-3 py-1 flex justify-between items-center">
                                    <div>
                                        <button @click="close(modal.name)"
                                            class="flex items-center justify-center p-2 bg-white rounded-full hover:bg-gray-100 focus:outline-none transition-colors">
                                            <svg viewBox="0 0 24 24" aria-hidden="true" class="w-5 h-5 text-gray-800">
                                                <g>
                                                    <path
                                                        d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z">
                                                    </path>
                                                </g>
                                            </svg>
                                        </button>
                                    </div>

                                </div>
                                <!--end header body-->

                                <!--start content body-->
                                <div v-if="!loading"
                                    class="p-4 overflow-y-auto flex-1 max-h-[80vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                                    <!-- Custom scrollbar styles -->
                                    <CheckAccountForm :is-loading="loading" @formValid="handleFormValid" />
                                </div>
                                <!--end content body-->

                                <!--start loading body-->
                                <div v-if="loading" class="flex justify-center items-center h-[80vh]">
                                    <SmallSpinner />
                                </div>
                                <!--end loading body-->

                                <!--start footer body-->
                                <div v-if="!loading" class="p-4 border-t border-gray-200">
                                    <div class="lg:mx-20">
                                        <button :disabled="!isFormValid" @click="submit"
                                            class="px-6 select-none mb-2 disabled:pointer-events-none disabled:bg-gray-300 disabled:text-gray-500 py-2.5 font-bold w-full rounded-full bg-black text-white  hover:opacity-80 focus:outline-none">
                                            Avançar
                                        </button>
                                    </div>

                                </div>
                                <!--end footer body-->
                            </div>
                        </DialogPanel>
                        <!--end body content-->
                    </TransitionChild>
                </div>
            </div>
            <!--end body-->
        </Dialog>
    </TransitionRoot>
</template>
