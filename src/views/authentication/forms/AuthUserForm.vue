<script setup>
import { computed, ref, watch } from 'vue';
import Input from '../components/UI/inputs/Input.vue';
import { useStore } from 'vuex';

const emit = defineEmits();

const form = ref({
    emailOrUsername: "",
    password: ""
})

const errors = ref({
    emailOrUsername: {
        show: false,
        message: ""
    },
    password: {
        show: false,
        message: ""
    }
})

const openModal = (name, data) => {
    store.dispatch("setModal", {
        show: true,
        name,
        data
    })
}

const props = defineProps({
    isLoading: {
        type: Boolean,
        default: false
    }
})

const store = useStore()

const isFormComplete = computed(() => {
    // Verificar se todos os campos do formulário estão preenchidos
    return form.value.emailOrUsername !== "" && form.value.password !== ""
});

watch(isFormComplete, (isValid) => {
    console.log(isValid)
    emit('formValid', isValid);

    if (isValid) {
        store.dispatch("setUser", form.value)
    }
});

</script>

<template>
    <div>
        <div class="mx-20 py-3">
            <div class="h-[50vh]">
                <div>
                    <div class="mb-8">
                        <h1 class="text-3xl font-bold">Fazer login</h1>
                    </div>

                    <div>
                        <div class="w-full flex flex-col gap-4">
                            <div>
                                <Input v-model="form.emailOrUsername"
                                    :error="{ show: errors.emailOrUsername.show, message: errors.emailOrUsername.message }"
                                    title="E-mail ou nome de usuário" label="email_or_username" />
                            </div>

                            <div>
                                <Input v-model="form.password" type="password"
                                    :error="{ show: errors.password.show, message: errors.password.message }"
                                    title="Senha" label="password" />

                                <button @click="openModal('forgot password', {})" class="hover:underline text-sm outline-none text-primary">Esqueceu sua
                                    senha?</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>