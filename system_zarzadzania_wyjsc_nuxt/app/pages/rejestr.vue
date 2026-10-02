<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui'

const route = useRoute()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const items = ref<SelectItem[]>([
  {
    label: 'wc',
    value: 'wc'
  },
  {
    label: 'sekretariat',
    value: 'sekretariat'
  },
  {
    label: 'pielęgniarka',
    value: 'pielegniarka'
  },
  {
    label: 'inne',
    value: 'inne'
  }
])
const reson = ref("wc")


const { data: uczniowie, pending, error, refresh } = await useAsyncData('uczniowie-mojej-klasy', async () => {
  const { data, error } = await supabase
    .from('uczniowie')
    .select(`
      id, name, surname,
      klasy!inner(
        id, nazwa,
        wychowawcy!inner(
          uzytkownicy!inner(id_auth)
        )
      )
    `)
    .eq('klasy.wychowawcy.uzytkownicy.id_auth', user.value!.sub)

    
  if (error) throw error
  return data
})

// nazwa klasy do nagłówka
const klasa = computed(() => uczniowie.value?.[0]?.klasy ?? null)
const toast = useToast()
</script>

<template>
  <div class="max-w-4xl mx-auto my-10 px-5 font-sans text-gray-800">
    <div class="flex justify-between items-center mb-5">
      <h1 class="text-2xl font-bold text-default">
        Uczniowie klasy {{ klasa?.nazwa }}
      </h1>
      <UButton
        class="bg-[#00dc82] hover:bg-[#00b368] disabled:bg-gray-300 text-white border-none py-2.5 px-4 rounded-md font-bold cursor-pointer transition-colors duration-200 disabled:cursor-not-allowed"
        :disabled="pending"
        @click="refresh"
      >
        {{ pending ? 'Ładowanie...' : 'Odśwież' }}
      </UButton>
    </div>

    <div v-if="pending" class="p-4 bg-gray-100 rounded-md text-center text-gray-600">
      Pobieranie danych z bazy...
    </div>

    <div v-else-if="error" class="p-4 bg-red-100 text-red-600 border border-red-200 rounded-md text-center">
      <strong>Błąd podczas pobierania danych:</strong>
      <p class="mt-1">{{ error.message }}</p>
    </div>

    <div v-else class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm overflow-x-auto">
      <table v-if="uczniowie && uczniowie.length > 0" class="w-full border-collapse text-left">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <th class="py-3 px-4 font-semibold text-gray-700">ID</th>
            <th class="py-3 px-4 font-semibold text-gray-700">Imię</th>
            <th class="py-3 px-4 font-semibold text-gray-700">Nazwisko</th>
            
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="uczen in uczniowie" :key="uczen.id" class="hover:bg-gray-50 transition-colors">
            <td class="py-3 px-4">{{ uczen.id % 20 > 0 ? uczen.id % 20 : uczen.id % 20 + 20 }}</td>
            <td class="py-3 px-4">{{ uczen.name }}</td>
            <td class="py-3 px-4">{{ uczen.surname }}</td>
            
          </tr>
        </tbody>
      </table>

      <p v-else class="p-5 text-center text-gray-500">Brak uczniów w tej klasie.</p>
    </div>

    <NuxtLink to="/klasy" class="inline-block mt-5 text-blue-600 hover:underline">
      ← Wróć do listy klas
    </NuxtLink>
  </div>
</template>