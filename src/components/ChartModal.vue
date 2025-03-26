<script setup>
import { ref, watch } from 'vue'
import { useCurrencyStore } from '@/store/currencyStore'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

const props = defineProps({
  modelValue: Boolean,
  currency: Object,
})

const emit = defineEmits(['update:modelValue'])
const store = useCurrencyStore()
const sortType = ref('week')

const datacollection = ref({
  labels: [],
  datasets: [
    {
      label: '',
      backgroundColor: '#f87979',
      borderColor: '#f87979',
      data: [],
    },
  ],
})

// Следим за открытием модального окна и загружаем данные
watch(
  () => props.modelValue,
  async (newValue) => {
    if (newValue && props.currency?.cc) {
      await store.fetchHistoricalRates(props.currency.cc, sortType.value)
      updateChart()
    }
  },
)

// Следим за изменением периода и обновляем график
watch(sortType, async () => {
  if (props.modelValue && props.currency?.cc) {
    await store.fetchHistoricalRates(props.currency.cc, sortType.value)
    updateChart()
  }
})

// Обновление графика после загрузки данных
const updateChart = () => {
  if (!store.historyLoading && store.historicalRates.length > 0) {
    datacollection.value = {
      labels: store.historicalRates.map((item) => item.date),
      datasets: [
        {
          label: props.currency?.cc || 'Currency',
          backgroundColor: '#f87979',
          borderColor: '#f87979',
          data: store.historicalRates.map((item) => item.rate),
        },
      ],
    }
  }
}

const closeModal = () => {
  emit('update:modelValue', false)
}
</script>

<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-lg shadow-lg w-[500px]">
      <div class="px-6 py-4 border-b">
        <h2 class="text-lg font-semibold">{{ currency?.txt }} ({{ currency?.cc }})</h2>
      </div>

      <div class="p-6">
        <label class="block mb-2 text-sm font-medium">Select Limits</label>
        <select v-model="sortType" class="w-full p-2 border rounded-lg">
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>

        <div class="mt-4">
          <div v-if="store.historyLoading" class="text-center text-gray-500">
            Загрузка данных...
          </div>
          <div v-else-if="store.historicalRates.length === 0" class="text-center text-gray-500">
            Нет данных
          </div>
          <Line
            v-else
            :data="datacollection"
            :options="{ responsive: true, maintainAspectRatio: false }"
          />
        </div>
      </div>

      <div class="px-6 py-4 border-t flex justify-end">
        <button
          @click="closeModal"
          class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>
