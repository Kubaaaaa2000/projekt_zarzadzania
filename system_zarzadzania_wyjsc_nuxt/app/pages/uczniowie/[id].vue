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

// Dane samej klasy (nazwa itp.)
const { data: klasa } = await useAsyncData(`klasa-${route.params.id}`, async () => {
  const { data, error } = await supabase
    .from('klasy')
    .select('id, nazwa')
    .eq('id', route.params.id)
    .single()

  if (error) throw error
  return data
})

// Uczniowie należący do tej klasy
const { data: uczniowie, pending, error, refresh } = await useAsyncData(`uczniowie-${route.params.id}`, async () => {
  const response = await supabase
    .from('uczniowie')
    .select('id, name, surname')
    .eq('klasa_id', route.params.id)

  if (response.error) throw response.error
  return response.data
})

// Dzisiejsze wpisy z rejestru (dla tej klasy)
const { data: dzisiejszeWyjscia, refresh: odswiezRejestr } = await useAsyncData(`rejestr-dzis-${route.params.id}`, async () => {
  const dzisiaj = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('rejestr')
    .select('*')
    .filter('wyjscie', 'gte', `${dzisiaj}T00:00:00`)
    .filter('wyjscie', 'lt', `${dzisiaj}T23:59:59.999`)

  if (error) throw error
  return data
})

// Znajduje najnowszy (jeszcze niezakończony) wpis danego ucznia z dzisiaj
function wpisUcznia(uczenId: number) {
  if (!dzisiejszeWyjscia.value) return null
  return dzisiejszeWyjscia.value
    .filter(w => w.uczen_id === uczenId)
    .sort((a, b) => new Date(b.wyjscie).getTime() - new Date(a.wyjscie).getTime())[0] || null
}

function formatGodzina(iso: string | null) {
  if (!iso) return '--:--'
  return new Date(iso).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
}

const toast = useToast()

async function dodajWyjscie(uczen: { id: number }) {
  if (!user.value) {
    toast.add({ title: 'Musisz być zalogowany', color: 'error' })
    return
  }

  const { data: userData, error: userError } = await supabase
    .from('uzytkownicy')
    .select('id')
    .eq('id_auth', user.value.sub)

  if (userError) {
    console.error('Szczegóły błędu:', userError)
  }

  const { data, error } = await supabase
    .from('rejestr')
    .insert({
      uczen_id: uczen.id,
      wyjscie: new Date().toISOString(),
      powrot: null,
      powod: reson.value,
      nauczyciel_id: userData[0].id,
    })
    .select()
    .single()

  if (error) {
    toast.add({ title: 'Błąd rejestrowania wyjścia', description: error.message, color: 'error' })
    return
  }

  toast.add({ title: 'Zarejestrowano wyjście', color: 'success' })
  odswiezRejestr()
}

async function zarejestrujPowrot(wpisId: number) {
  const { error } = await supabase
    .from('rejestr')
    .update({ powrot: new Date().toISOString() })
    .eq('id', wpisId)

  if (error) {
    toast.add({ title: 'Błąd rejestrowania powrotu', description: error.message, color: 'error' })
    return
  }

  toast.add({ title: 'Zarejestrowano powrót', color: 'success' })
  odswiezRejestr()
}
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
            <th class="p-4 text-center">godzina wyjścia</th>
            <th class="p-4 text-center">godzina powrotu</th>
           
            <th class="p-4 text-center">wyjście <USelect :ui="{ content: 'w-auto min-w-(--reka-select-trigger-width)'}" class="w-auto" v-model="reson" :items="items"></USelect></th>
            <th class="p-4 text-center">powrót</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="uczen in uczniowie" :key="uczen.id" class="hover:bg-gray-50 transition-colors">
            <td class="py-3 px-4">{{ uczen.id % 20 > 0 ? uczen.id % 20 : uczen.id % 20 + 20 }}</td>
            <td class="py-3 px-4">{{ uczen.name }}</td>
            <td class="py-3 px-4">{{ uczen.surname }}</td>
            <td class="text-center">{{ formatGodzina(wpisUcznia(uczen.id)?.wyjscie) }}</td>
            <td class="text-center">{{ formatGodzina(wpisUcznia(uczen.id)?.powrot) }}</td>
            
            <td class="text-center">
              <UButton
                class="bg-blue-500 rounded-xl p-2 text-center"
                :disabled="!!wpisUcznia(uczen.id) && !wpisUcznia(uczen.id)?.powrot"
                @click="dodajWyjscie(uczen)"
              >
                wyjście
              </UButton>
            </td>
            <td class="text-center">
              <UButton
                class="bg-red-500 rounded-xl p-2 text-center disabled:bg-gray-300 hover:bg-red-400"
                :disabled="!wpisUcznia(uczen.id) || !!wpisUcznia(uczen.id)?.powrot"
                @click="zarejestrujPowrot(wpisUcznia(uczen.id)!.id)"
              >
                powrót
              </UButton>
            </td>
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