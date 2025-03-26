<script setup>
import { ref, computed, onMounted } from "vue";
import { useCurrencyStore } from "@/store/currencyStore";
import ChartModal from "@/components/ChartModal.vue";

const store = useCurrencyStore();
const showChartModal = ref(false);
const currency = ref(null);
const favorites = ref([]);

// Добавить в избранное
const addFavorite = (valute) => {
  if (!favorites.value.some((fav) => fav.cc === valute.cc)) {
    favorites.value.push(valute);
  }
};

// Удалить из избранного
const deleteFavorite = (valute) => {
  favorites.value = favorites.value.filter((fav) => fav.cc !== valute.cc);
};

// Открыть модальное окно графика
const openChartModal = (valute) => {
  currency.value = valute;
  showChartModal.value = true;
};

onMounted(() => {
  if (!store.currencies.length) {
    store.fetchRates();
  }
});
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="w-full max-w-5xl bg-white p-6 rounded-lg shadow-md">
      <div class="text-center mb-5">
        <h1 class="text-2xl font-bold">Currency Rates</h1>
      </div>

      <div v-if="store.loading">Загрузка...</div>
      <div v-else-if="store.error">{{ store.error }}</div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Таблица с курсами валют -->
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
            <tr v-for="valute in store.currencies" :key="valute.cc" class="hover:bg-gray-100">
              <td class="p-3 border">{{ valute.cc }}</td>
              <td class="p-3 border cursor-pointer text-blue-600" @click="openChartModal(valute)">
                <span class="tooltip" title="Open chart">{{ valute.txt }}</span>
              </td>
              <td class="p-3 border">{{ valute.rate }}</td>
              <td class="p-3 border">
                <button
                  v-if="!favorites.some(fav => fav.cc === valute.cc)"
                  @click="addFavorite(valute)"
                  class="bg-blue-500 hover:bg-blue-700 text-white p-1 rounded-full"
                >
                  ❤️
                </button>
                <button
                  v-else
                  @click="deleteFavorite(valute)"
                  class="bg-red-500 hover:bg-red-700 text-white p-1 rounded-full"
                >
                  ❌
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- Избранные валюты -->
        <div class="p-5 bg-gray-50 rounded-lg shadow-sm">
          <div class="text-center mb-3">
            <h3 class="text-lg font-semibold">Favorite Rates</h3>
          </div>
          <ul v-if="favorites.length" class="pl-0 space-y-3">
            <li v-for="favorite in favorites" :key="favorite.cc" class="flex justify-between items-center bg-white p-3 rounded-lg shadow">
              <div>{{ favorite.cc }} - {{ favorite.txt }}</div>
              <button @click="deleteFavorite(favorite)" class="bg-red-500 hover:bg-red-700 text-white p-1 rounded-full">
                🗑️
              </button>
            </li>
          </ul>
          <p v-else class="text-center text-gray-500">No favorites yet.</p>
        </div>
      </div>

      <ChartModal v-model="showChartModal" :currency="currency" />
    </div>
  </div>
</template>
