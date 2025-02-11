<script setup>
import { useStore } from 'vuex';
import RegisterUserModal from './components/modals/RegisterUserModal.vue';
import CheckAccountModal from './components/modals/CheckAccountModal.vue';
import AuthUserModal from './components/modals/AuthUserModal.vue';
import ForgotPasswordModal from './components/modals/ForgotPasswordModal.vue';

const store = useStore()

const openModal = (name, data) => {
    store.dispatch("setModal", {
        show: true,
        name,
        data
    })
}


</script>

<template>
    <!--start content home page area-->
    <div>
        <div>
            <h1>Acontecendo agora</h1>
            <h3>Inscreva-se hoje</h3>

            <div class="flex gap-2 flex-col justify-start">
                <button @click="openModal('register user', {})"
                    class="w-min whitespace-nowrap text-sm font-semibold rounded-full px-4 py-2 bg-[rgb(29,155,240)] text-white hover:bg-blue-500 active:bg-[rgb(29,155,240)] transition">
                    Criar uma conta
                </button>

                <button @click="openModal('auth user', {})"
                    class="w-min whitespace-nowrap text-sm font-semibold rounded-full px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 transition">
                    Entrar
                </button>

            </div>

        </div>
    </div>

    <!--start modals area-->
    <div>
        <RegisterUserModal />
        <CheckAccountModal />
        <AuthUserModal/>
        <ForgotPasswordModal/>
    </div>
    <!--end modals area-->
    <!--end content home page area-->
</template>