<script setup>
const supabase = useSupabaseClient()

const { data: users, pending, error, refresh } = await useAsyncData('users-list', async () => {
  const response = await supabase
    .from('klasy')
    .select('id, nazwa')
    
  if (response.error) throw response.error
  return response.data
})
</script>

<template>
  <div class="max-w-3xl mx-auto my-10 px-5 font-sans text-gray-800">
    <div class="flex justify-between items-center mb-5">
      <h1 class="text-2xl font-bold text-default">Lista klas</h1>
      <button
        class=" bg-green-400 hover:bg-[#00b368] disabled:bg-gray-300 text-white border-none py-2.5 px-4 rounded-md font-bold cursor-pointer transition-colors duration-200 disabled:cursor-not-allowed"
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
            
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition-colors">
            <td class="py-3 px-4">{{ user.id -2}}</td>
            <td class="py-3 px-4"><NuxtLink :to="`/uczniowie/${user.id}`"><strong>{{ user.nazwa || '-' }}</strong></NuxtLink></td>
            
          </tr>
         
          
        </tbody>
      </table>

      <p v-else class="p-5 text-center text-gray-500">Brak klas w bazie danych.</p>
    </div>
  </div>

</template>