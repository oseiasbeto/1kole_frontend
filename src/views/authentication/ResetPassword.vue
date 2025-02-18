<script setup>
import { useStore } from 'vuex';
import Input from '@/components/UI/inputs/Input.vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '@/repositories/auth-repository';
import { toast } from "vue3-toastify"

const { resetPassword, loading } = useAuth()

const store = useStore()
const route = useRoute()
const router = useRouter()

const form = ref({
    newPassword: "",
    confirmPassword: ""
})

const errors = ref({
    newPassword: {
        show: false,
        message: ""
    },
    confirmPassword: {
        show: false,
        message: ""
    }
})

const token = computed(() => {
    return route.query.token
})

const isFormComplete = computed(() => {
    // Verificar se todos os campos do formulário estão preenchidos
    return form.value.newPassword !== "" &&
        form.value.confirmPassword !== "" &&
        !errors.value.confirmPassword.show &&
        !errors.value.newPassword.show
})

const validatePassword = (newPassword) => {
    const newPasswordRegex = /(?=.*[A-Z])(?=.*\d)/;
    if (newPassword && newPassword.length < 6 || !newPasswordRegex.test(newPassword)) {
        errors.value.newPassword.show = true;
        errors.value.newPassword.message = "Deve ter 6 a 30 caracteres, incluindo pelo menos uma letra e um número.";
    } else {
        errors.value.newPassword.show = false;
        errors.value.newPassword.message = "";
    }
};

const validateConfirmPassword = (newPassword, confirmPassword) => {
    if (!confirmPassword) {
        errors.value.confirmPassword.show = true;
        errors.value.confirmPassword.message = "A confirmação de senha é obrigatória.";
    } else if (confirmPassword !== newPassword) {
        errors.value.confirmPassword.show = true;
        errors.value.confirmPassword.message = "As senhas não coincidem.";
    } else {
        errors.value.confirmPassword.show = false;
        errors.value.confirmPassword.message = "";
    }
};

const resetForms = () => {
    form.value = {
        newPassword: "",
        confirmPassword: ""
    }
    errors.value = {
        newPassword: {
            show: false,
            message: ""
        },
        confirmPassword: {
            show: false,
            message: ""
        }
    }
}

const submit = () => {
    if (isFormComplete.value) {
        resetPassword({
            newPassword: form.value.newPassword,
            token: token.value
        }).then(() => {
            router.replace("/")
        }).catch(err => {
            resetForms()
            toast(err.response.data.message, {
                theme: "colored",
                position: "bottom-center",
                autoClose: 3000,
                type: "info"
            })
        })
    } else {
        validatePassword(form.value.newPassword)
        validateConfirmPassword(form.value.confirmPassword)
    }
}

onMounted(() => {
    if (!token.value) {
        router.replace('/404')
    } else return
})
</script>

<template>
    <!--start content reset password page area-->
    <div>
        <div class="p-5">
            <div class="mb-5">
                  <h1 class="text-2xl font-semibold mb-2">Redefinir sua senha</h1>
                  <p class="text-muted text-base">Recupere o acesso à sua conta redefinindo sua senha com segurança.</p>
            </div>
          

            <div class="flex gap-2 flex-col justify-start">
                <div class="w-full flex flex-col gap-4">
                    <div>
                        <Input @input="validatePassword(form.newPassword)" v-model="form.newPassword" type="password"
                            :error="{ show: errors.newPassword.show, message: errors.newPassword.message }"
                            title="Digite a nova senha" label="new_password" />
                    </div>

                    <div>
                        <Input @input="validateConfirmPassword(form.newPassword, form.confirmPassword)"
                            v-model="form.confirmPassword" type="password"
                            :error="{ show: errors.confirmPassword.show, message: errors.confirmPassword.message }"
                            title="Digite sua senha novamente" label="confirm_password" />
                    </div>

                    <button :disabled="loading" @click="submit"
                        class="w-min whitespace-nowrap text-sm font-semibold rounded-full px-4 py-2 bg-[rgb(29,155,240)] text-white hover:bg-blue-500 disabled:opacity-80 active:bg-[rgb(29,155,240)] transition">
                        {{ loading ? 'Processando...' : 'Redefinir a senha' }}
                    </button>
                </div>
            </div>

        </div>
    </div>
    <!--end content reset password page area-->
</template>