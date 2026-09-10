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

  const supabase = useSupabaseClient()

const { data: users, pending, error, refresh } = await useAsyncData('users-list', async () => {
  const response = await supabase
    .from('uzytkownicy')
    .select('id, name, surname')


  if (response.error) throw response.error
  return response.data
})


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
  <div class="max-w-3xl mx-auto my-10 px-5 font-sans text-gray-800">
    <div class="flex justify-between items-center mb-5">
      <h1 class="text-2xl font-bold">Lista Użytkowników</h1>
      <button 
        class="bg-[#00dc82] hover:bg-[#00b368] disabled:bg-gray-300 text-white border-none py-2.5 px-4 rounded-md font-bold cursor-pointer transition-colors duration-200 disabled:cursor-not-allowed" 
        :disabled="pending" 
        @click="refresh"
      >
        {{ pending ? 'Ładowanie...' : 'Odśwież' }}
      </button>
    </div>

    <!-- Stan ładowania -->
    <div v-if="pending" class="p-4 bg-gray-100 rounded-md text-center text-gray-600">
      Pobieranie danych z bazy...
    </div>

    <!-- Komunikat błędu -->
    <div v-else-if="error" class="p-4 bg-red-100 text-red-600 border border-red-200 rounded-md text-center">
      <strong>Błąd podczas pobierania danych:</strong>
      <p class="mt-1">{{ error.message }}</p>
    </div>

    <!-- Tabela z danymi -->
    <div v-else class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <table v-if="users && users.length > 0" class="w-full border-collapse text-left">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <th class="py-3 px-4 font-semibold text-gray-700">ID</th>
            <th class="py-3 px-4 font-semibold text-gray-700">Imię</th>
            <th class="py-3 px-4 font-semibold text-gray-700">Nazwisko</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition-colors">
            <td class="py-3 px-4">{{ user.id }}</td>
            <td class="py-3 px-4"><strong>{{ user.name || '-' }}</strong></td>
            <td class="py-3 px-4">{{ user.surname || '-' }}</td>
          </tr>
        </tbody>
      </table>

      <p v-else class="p-5 text-center text-gray-500">Brak użytkowników w bazie danych.</p>
    </div>
  </div>
</template>