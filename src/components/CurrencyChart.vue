<script setup>
import { ref, onMounted, watch } from "vue";
import ChartModal from "@/components/ChartModal.vue";

const valutes = ref([]); // Полный список валют
const favorites = ref([]); // Избранные валюты
const showChartModal = ref(false);
const currency = ref(null); // Выбранная валюта для графика

// Загружаем ВСЕ валюты
const fetchAllRates = async () => {
  try {
    const response = await fetch("https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json");
    const data = await response.json();

    console.log("Fetched all currencies:", data); // Лог для отладки

    if (Array.isArray(data)) {
      valutes.value = data.map(item => ({
        code: item.cc,
        name: item.txt,
        rate: item.rate
      }));
    } else {
      console.error("Некорректный формат данных", data);
    }
  } catch (error) {
    console.error("Ошибка при загрузке курсов валют:", error);
  }
};

// Добавить в избранное
const addFavorite = (valute) => {
  if (!favorites.value.some(fav => fav.code === valute.code)) {
    favorites.value.push(valute);
  }
};

// Удалить из избранного
const deleteFavorite = (valute) => {
  favorites.value = favorites.value.filter(fav => fav.code !== valute.code);
};

// Открыть модальное окно графика
const openChartModal = (valute) => {
  currency.value = { cc: valute.code, txt: valute.name }; // Передаём актуальные данные валюты
  showChartModal.value = true;
};

// Загружаем все данные при монтировании
onMounted(fetchAllRates);
</script>







<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="w-full max-w-5xl bg-white p-6 rounded-lg shadow-md">
      <div class="text-center mb-5">
        <h1 class="text-2xl font-bold">Currency Rates</h1>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Блок с таблицей валют -->
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
            <tr v-for="valute in valutes" :key="valute.code" class="hover:bg-gray-100">
              <td class="p-3 border">{{ valute.code }}</td>
              <td class="p-3 border cursor-pointer text-blue-600" @click.stop="openChartModal(valute)">
                <span class="tooltip" title="Open chart">{{ valute.name }}</span>
              </td>
              <td class="p-3 border">{{ valute.rate }}</td>
              <td class="p-3 border">
                <button @click="addFavorite(valute)" class="bg-blue-500 hover:bg-blue-700 text-white p-1 rounded-full">
                  ❤️
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- Блок с избранными валютами -->
        <div class="p-5 bg-gray-50 rounded-lg shadow-sm">
          <div class="text-center mb-3">
            <h3 class="text-lg font-semibold">Favorite Rates</h3>
          </div>
          <ul v-for="favorite in favorites" class="pl-0 space-y-3">
            <li class="flex justify-between items-center bg-white p-3 rounded-lg shadow">
              <div>{{ favorite.code }} - {{ favorite.name }}</div>
              <button @click="deleteFavorite(favorite)" class="bg-red-500 hover:bg-red-700 text-white p-1 rounded-full">
                🗑️
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- Вызов модального окна ChartModal -->
      <ChartModal v-model="showChartModal" :currency="currency" />
    </div>
  </div>
</template>

