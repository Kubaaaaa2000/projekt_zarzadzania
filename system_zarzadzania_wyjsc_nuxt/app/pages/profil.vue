<script setup lang="ts">
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const toast = useToast()

const pokazForm = ref(false)
const noweHaslo = ref('')
const powtorzHaslo = ref('')
const loading = ref(false)

const pokazHaslo1 = ref(false)
const pokazHaslo2 = ref(false)

function togglForm() {
  pokazForm.value = !pokazForm.value
  noweHaslo.value = ''
  powtorzHaslo.value = ''
}

async function onSubmit() {
  if (noweHaslo.value !== powtorzHaslo.value) {
    toast.add({
      title: 'Hasła nie są identyczne',
      color: 'error',
    })
    return
  }

  if (noweHaslo.value.length < 8) {
    toast.add({
      title: 'Hasło musi mieć minimum 8 znaków',
      color: 'error',
    })
    return
  }

  loading.value = true
  const { error } = await supabase.auth.updateUser({
    password: noweHaslo.value,
  })
  loading.value = false

  if (error) {
    toast.add({
      title: 'Błąd zmiany hasła',
      description: error.message,
      color: 'error',
    })
    return
  }

  toast.add({
    title: 'Hasło zostało zmienione',
    color: 'success',
  })

  noweHaslo.value = ''
  powtorzHaslo.value = ''
  pokazForm.value = false
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4 h-full">
    <UPageCard class="w-full max-w-md text-center">
      
      <h1 v-if="user">{{ user.email }}</h1>

      <UButton
        label="Zmień hasło"
        color="success"
        @click="togglForm"
      />

      <UForm
        v-if="pokazForm"
        :state="{ noweHaslo, powtorzHaslo }"
        class="space-y-4 mt-4"
        @submit="onSubmit"
      >
        <UFormField label="Nowe hasło">
          <UInput
            v-model="noweHaslo"
            placeholder="Nowe hasło"
            :type="pokazHaslo1 ? 'text' : 'password'"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="pokazHaslo1 ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="pokazHaslo1 ? 'Ukryj hasło' : 'Pokaż hasło'"
                @click="pokazHaslo1 = !pokazHaslo1"
              />
            </template>
          </UInput>
        </UFormField>

        <UFormField label="Powtórz hasło">
          <UInput
            v-model="powtorzHaslo"
            placeholder="Powtórz nowe hasło"
            :type="pokazHaslo2 ? 'text' : 'password'"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="pokazHaslo2 ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="pokazHaslo2 ? 'Ukryj hasło' : 'Pokaż hasło'"
                @click="pokazHaslo2 = !pokazHaslo2"
              />
            </template>
          </UInput>
        </UFormField>

        <UButton
          type="submit"
          label="Zapisz nowe hasło"
          color="primary"
          block
          :loading="loading"
        />
      </UForm>
    </UPageCard>
  </div>
</template>