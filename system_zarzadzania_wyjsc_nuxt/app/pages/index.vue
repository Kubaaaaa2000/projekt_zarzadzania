
<script setup lang="ts">
import type { NavigationMenuItem, SidebarProps, FormSubmitEvent, AuthFormField } from '@nuxt/ui'

// Ignore the props for the example
// defineProps<Pick<SidebarProps, 'mode'>>()
const mode = ref<SidebarProps['mode']>('slideover')

const open = ref(true)

const items: NavigationMenuItem[] = [{
  label: 'Home',
  icon: 'i-lucide-house',
  active: true
}, {
  label: 'Inbox',
  icon: 'i-lucide-inbox',
  badge: '4'
}, {
  label: 'Contacts',
  icon: 'i-lucide-users'
}]

const colorMode = useColorMode()

function toggleColor() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const toast = useToast()
const supabase = useSupabaseClient()
const loading = ref(false)

const fields: AuthFormField[] = [{
  name: 'email',
  type: 'text',
  label: 'E-mail',
  placeholder: 'Wpisz swój e-mail',
  required: true
}, {
  name: 'password',
  label: 'Hasło',
  type: 'password',
  placeholder: 'Wpisz hasło',
  required: true
}, {
  name: 'remember',
  label: 'Zapamiętaj mnie',
  type: 'checkbox'
}]

type FormSchema = {
  email: string
  password: string
  remember?: boolean
}

async function onSubmit(payload: FormSubmitEvent<FormSchema>) {
  loading.value = true

  const { error } = await supabase.auth.signInWithPassword({
    email: payload.data.email,
    password: payload.data.password,
  })

  loading.value = false

  if (error) {
    toast.add({
      title: 'Błąd logowania',
      description: error.message,
      color: 'error',
    })
    return
  }

  toast.add({
    title: 'Zalogowano pomyślnie',
    color: 'success',
  })

  await navigateTo('/klasy')
}
</script>

<template>
  <UApp>
    

    <UMain class="flex flex-col items-center justify-center">
      <div class="flex flex-col items-center justify-center gap-4 p-4 h-full">
        <UPageCard class="w-full max-w-md">
          <UAuthForm
            title="Logowanie"
            description="Wpisz swoje dane, aby uzyskać dostęp do konta."
            icon="i-lucide-user"
            :fields="fields"
            :loading="loading"
            @submit="onSubmit"
          />
        </UPageCard>
      </div>

      

      <NuxtLayout />

      
    </UMain>


    
  </UApp>
</template>