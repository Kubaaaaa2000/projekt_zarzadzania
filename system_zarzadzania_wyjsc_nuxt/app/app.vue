<script setup lang="ts">
  import type { NavigationMenuItem, SidebarProps } from '@nuxt/ui'

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

    <UMain>
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
</template>
