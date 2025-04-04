<script setup>
import { ref, onMounted } from 'vue'
import { useCurrencyStore } from '@/store/currencyStore'
import ChartModal from '@/components/ChartModal.vue'

const store = useCurrencyStore()
const showChartModal = ref(false)
const currency = ref(null)
const favorites = ref([])

// add in favorite
const addFavorite = (valute) => {
  if (!favorites.value.some((fav) => fav.cc === valute.cc)) {
    favorites.value.push(valute)
  }
}

// delete from favorite
const deleteFavorite = (valute) => {
  favorites.value = favorites.value.filter((fav) => fav.cc !== valute.cc)
}

// open modal
const openChartModal = (valute) => {
  currency.value = valute
  showChartModal.value = true
}

onMounted(() => {
  if (!store.currencies.length) {
    store.fetchRates()
  }
})
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="w-full max-w-5xl bg-white p-6 md:rounded-lg rounded-none shadow-md">
      <div class="text-center mb-5">
        <h1 class="text-2xl font-bold">Currency Rates</h1>
      </div>

      <div v-if="store.loading">Загрузка...</div>
      <div v-else-if="store.error">{{ store.error }}</div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="overflow-auto h-[400px] border rounded-lg shadow-sm">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-gray-200 text-left text-sm uppercase">
                <th class="p-3 border">Code</th>
                <th class="p-3 border">Name</th>
                <th class="p-3 border">Rate</th>
                <th class="p-3 border">Favorite</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="valute in store.currencies.filter((c) => c.cc !== 'UAH')"
                :key="valute.cc"
                class="hover:bg-gray-100"
              >
                <td class="p-3 border">{{ valute.cc }}</td>
                <td class="p-3 border cursor-pointer uppercase" @click="openChartModal(valute)">
                  <span class="tooltip hover:text-red-500" title="Open chart">{{
                    valute.txt
                  }}</span>
                </td>
                <td class="p-3 border">{{ valute.rate }}</td>
                <td class="p-3 border text-center">
                  <button
                    v-if="!favorites.some((fav) => fav.cc === valute.cc)"
                    @click="addFavorite(valute)"
                    class="cursor-pointer"
                  >
                    ❤️
                  </button>
                  <button v-else @click="deleteFavorite(valute)" class="cursor-pointer">❌</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="p-5 bg-gray-50 rounded-lg shadow-sm">
          <div class="text-center mb-3">
            <h3 class="text-lg font-semibold">Favorite Rates</h3>
          </div>
          <ul v-if="favorites.length" class="pl-0 space-y-3">
            <li
              v-for="favorite in favorites"
              :key="favorite.cc"
              class="flex justify-between items-center bg-white p-3 rounded-lg shadow"
            >
              <div>{{ favorite.cc }} - {{ favorite.txt }}</div>
              <button @click="deleteFavorite(favorite)" class="cursor-pointer">🗑️</button>
            </li>
          </ul>
          <p v-else class="text-center text-gray-500">No favorites yet.</p>
        </div>
      </div>

      <ChartModal v-model="showChartModal" :currency="currency" />
    </div>
  </div>
</template>
