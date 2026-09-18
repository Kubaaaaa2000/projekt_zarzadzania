
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
    <UHeader title="witamy na stronie" class="bg-blue-400 dark:bg-blue-900">
      <template #right>
        <UButton
          :icon="colorMode.value === 'dark' ? 'i-heroicons-moon' : 'i-heroicons-sun'"
          color="neutral"
          variant="ghost"
          @click="toggleColor"
        />
        <UButton
          icon="i-lucide-panel-left"
          color="neutral"
          variant="ghost"
          aria-label="Toggle sidebar"
          @click="open = !open"
        />
      </template>
    </UHeader>

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

      <USidebar v-model:open="open" :mode="mode" title="Navigation">
        <UNavigationMenu
          :items="items"
          orientation="vertical"
          :ui="{ link: 'p-1.5 overflow-hidden' }"
        />
      </USidebar>
    </UMain>

    <USeparator icon="i-simple-icons-nuxtdotjs" type="dashed" class="h-px" />

    <UFooter>
      <template #left>
        <p class="text-muted text-sm">
          Copyright © {{ new Date().getFullYear() }}
        </p>
      </template>

      <template #right>
        <UButton
          icon="i-simple-icons-discord"
          color="neutral"
          variant="ghost"
          to="https://go.nuxt.com/discord"
          target="_blank"
          aria-label="Discord"
        />
        <UButton
          icon="i-simple-icons-x"
          color="neutral"
          variant="ghost"
          to="https://go.nuxt.com/x"
          target="_blank"
          aria-label="X"
        />
        <UButton
          icon="i-simple-icons-github"
          color="neutral"
          variant="ghost"
          to="https://github.com/nuxt/nuxt"
          target="_blank"
          aria-label="GitHub"
        />
      </template>
    </UFooter>
  </UApp>
</template>