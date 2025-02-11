<script setup>
// Importe os pacotes necessários para o bom funcionamento deste componente.
import { useStore } from "vuex"
import { computed } from "vue"

import {
    Dialog,
    DialogPanel,
    TransitionRoot,
    TransitionChild
} from '@headlessui/vue'
import RegisterUserForn from "../../forms/RegisterUserForn.vue"

// Importe as referências necessários para o bom funcionamento deste componente.
const store = useStore()

// Esta função computada tem como finalidade retornar os dados da caixa de diálogo aberta.
const modal = computed(() => {
    return store.getters.modal
})

// Esta função tem como finalidade fechar a caixa de diálogo aberta.
const close = (name) => {
    store.dispatch("setModal", {
        show: false,
        name,
        data: {}
    })
}
</script>

<template>
    <TransitionRoot appear :show="modal.show && modal.name == 'register user'" as="div">
        <Dialog as="div" class="relative z-[111]" @close="close(modal.name)">
            <TransitionChild as="div" enter="duration-300 ease-out" enter-from="opacity-100"
                leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-black bg-opacity-25"></div>
            </TransitionChild>

            <!--start body-->
            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex items-center justify-center min-h-full p-4 text-center">
                    <TransitionChild as="div" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95">
                        <!--start body content-->
                        <DialogPanel class="w-full overflow-hidden text-left align-middle transition-all transform">
                            <div class="bg-white min-w-[600px] rounded-[16px] shadow-lg flex flex-col max-h-[80vh]">
                                <!--start header body-->
                                <div class="p-4 border-b border-gray-200 flex justify-between items-center">
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
                                <div
                                    class="p-4 overflow-y-auto flex-1 max-h-[60vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                                    <!-- Custom scrollbar styles -->
                                    <RegisterUserForn />
                                </div>
                                <!--end content body-->

                                <!--start footer body-->
                                <div class="p-4 border-t border-gray-200 flex justify-end">
                                    <button @click="close(modal.name)"
                                        class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none">
                                        Avançar
                                    </button>
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
