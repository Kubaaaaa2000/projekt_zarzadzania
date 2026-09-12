<script setup lang="ts">

const route = useRoute()
const supabase = useSupabaseClient()

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

  console.log('Odpowiedź z Supabase:', response)

  if (response.error) throw response.error
  return response.data
})
</script>

<template>
  <div class="max-w-3xl mx-auto my-10 px-5 font-sans text-gray-800">
    <div class="flex justify-between items-center mb-5">
      <h1 class="text-2xl font-bold">
        Uczniowie klasy {{ klasa?.nazwa }}
      </h1>
      <button
        class="bg-[#00dc82] hover:bg-[#00b368] disabled:bg-gray-300 text-white border-none py-2.5 px-4 rounded-md font-bold cursor-pointer transition-colors duration-200 disabled:cursor-not-allowed"
        :disabled="pending"
        @click="refresh"
      >
        {{ pending ? 'Ładowanie...' : 'Odśwież' }}
      </button>
    </div>

    <div v-if="pending" class="p-4 bg-gray-100 rounded-md text-center text-gray-600">
      Pobieranie danych z bazy...
    </div>

    <div v-else-if="error" class="p-4 bg-red-100 text-red-600 border border-red-200 rounded-md text-center">
      <strong>Błąd podczas pobierania danych:</strong>
      <p class="mt-1">{{ error.message }}</p>
    </div>

    <div v-else class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <table v-if="uczniowie && uczniowie.length > 0" class="w-full border-collapse text-left">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <th class="py-3 px-4 font-semibold text-gray-700">ID</th>
            <th class="py-3 px-4 font-semibold text-gray-700">Imię</th>
            <th class="py-3 px-4 font-semibold text-gray-700">Nazwisko</th>
            <th>godzina wyjścia</th>
            <th>godzina powrotu</th>
            <th  class="p-4">wyjście</th>
            <th class="p-4">powrót</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="uczen in uczniowie" :key="uczen.id" class="hover:bg-gray-50 transition-colors">
            <td class="py-3 px-4">{{ uczen.id}}</td>
            <td class="py-3 px-4">{{ uczen.name }}</td>
            <td class="py-3 px-4">{{ uczen.surname }}</td>
            <td>--:--</td>
            <td>--:--</td> 
            <td><button class="bg-blue-500 rounded-xl p-2">wyjscie</button></td>
            <td><button class="bg-red-500 rounded-xl p-2">powrót</button></td>
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