<script setup>
import { ref } from 'vue';
import Input from '@/components/UI/inputs/Input.vue';
import { useStore } from 'vuex';

const emit = defineEmits();

const props = defineProps({
    isLoading: {
        type: Boolean,
        default: false
    }
})

const form = ref({
    token: ""
})

const store = useStore()

const errors = ref({
    token: {
        show: false,
        message: ""
    }
})

const handleIsTokenValid = () => {
    if (form.value.token.length) {
        emit('formValid', true);
        store.state.modal.data.token = form.value.token
    } else {
        emit('formValid', false);
    }
}

</script>

<template>
    <div>
        <div class="lg:mx-20 py-3">
            <div class="h-[50vh] pb-8">
                <div>
                    <h1 class="text-3xl text-title mb-3 font-bold">
                        Enviamos um código para você
                    </h1>

                    <p class="text-gray leading-tight text-sm">Para garantir a segurança da sua conta, precisamos
                        verificar seu e-mail. Digite o código de verificação que enviamos para o seu endereço
                        cadastrado.</p>
                </div>

                <div class="mt-3">
                    <div class="w-full mb-20 flex flex-col gap-4">
                        <div>
                            <Input @input="handleIsTokenValid" v-model="form.token"
                                :error="{ show: errors.token.show, message: errors.token.message }"
                                title="Digite o código" label="token" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>