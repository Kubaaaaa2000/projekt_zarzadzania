<!-- <script setup lang="ts">
  import type { NavigationMenuItem, SidebarProps,FormSubmitEvent, AuthFormField } from '@nuxt/ui'
  //import * as z from 'zod'


  // Ignore the props for the example
  // defineProps<Pick<SidebarProps, 'mode'>>()

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

//   const supabase = useSupabaseClient()

// const { data: users, pending, error, refresh } = await useAsyncData('users-list', async () => {
//   const response = await supabase
//     .from('uzytkownicy')
//     .select('id, name, surname')


//   if (response.error) throw response.error
//   return response.data

  

const toast = useToast()

const fields: AuthFormField[] = [{
  name: 'login',
  type: 'login',
  label: 'login',
  placeholder: 'Enter your login',
  required: true
}, {
  name: 'password',
  label: 'Password',
  type: 'password',
  placeholder: 'Enter your password',
  required: true
}, {
  name: 'remember',
  label: 'Remember me',
  type: 'checkbox'
}]








</script>

<template>
  <UApp>
    <UHeader title="witamy na stronie" class=" bg-blue-400 dark:bg-blue-900" >
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

    <UMain class="flex items-center justify-center">
      <div class="flex flex-col items-center justify-center gap-4 p-4 h-full">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
       
        title="Login"
        description="Enter your credentials to access your account."
        icon="i-lucide-user"
        :fields="fields"
        
        @submit="onSubmit"
      />
    </UPageCard>
  </div>
      <NuxtLayout>
        <p>
      </NuxtLayout>
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
  
</template> -->
<script setup lang="ts">
import type { NavigationMenuItem, SidebarProps } from '@nuxt/ui'

const loggedIn = ref(useSupabaseUser())

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

</script>
<template>
  <UHeader  title="Witamy na E-Wyścia" class=" bg-blue-400 dark:bg-blue-900" >
      <template #left>
          <!-- <img src="LOGO_SZKOŁY.png" alt="logo"> -->
          <!-- <img src="" class=" h-min w-min " alt="logo"> -->
      </template>
      <template #right>
        <UButton
          :icon="colorMode.value === 'dark' ? 'i-heroicons-moon' : 'i-heroicons-sun'"
          color="neutral"
          variant="ghost"
          @click="toggleColor"
        />
        <UButton
          v-show="loggedIn"
          icon="i-lucide-panel-left"
          color="neutral"
          variant="ghost"
          aria-label="Toggle sidebar"
          @click="open = !open"
        />
      </template>
    </UHeader>
  <NuxtPage></NuxtPage>
  <USidebar v-show="loggedIn" v-model:open="open" :mode="mode" title="Navigation">
    <UNavigationMenu
      v-show="loggedIn"
      :items="items"
      orientation="vertical"
      :ui="{ link: 'p-1.5 overflow-hidden' }"
    />
  </USidebar>
  <UFooter>
    <template #left>
      <p class="text-muted text-sm">
        Copyright © {{ new Date().getFullYear() }}
      </p>
    </template>
  </UFooter>
</template>