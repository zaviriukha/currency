<script setup>
import { ref, watchEffect } from 'vue'
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

// Регистрация необходимых компонентов для ChartJS
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

const props = defineProps({
  modelValue: Boolean, // Управление модальным окном
  currency: Object, // Валюта (например, { cc: "USD", txt: "Доллар США" })
})

const emit = defineEmits(['update:modelValue'])

const sortType = ref('week')
const sortItems = ref([
  { value: 'week', text: 'Week' },
  { value: 'month', text: 'Month' },
  { value: 'year', text: 'Year' },
])

const datacollection = ref({
  labels: [],
  datasets: [
    {
      label: props.currency?.cc || 'Currency',
      backgroundColor: '#f87979',
      borderColor: '#f87979',
      data: [],
    },
  ],
})

// Функция загрузки данных
const fetchRates = async (period) => {
  console.log('Fetching rates for:', props.currency?.cc, 'Period:', period)

  let rates = new Map()
  let today = new Date()
  const format = (date) => date.toISOString().split('T')[0].replace(/-/g, '')

  let intervals = { week: 6, month: 30, year: 365 }

  for (let i = intervals[period]; i >= 0; i--) {
    let date = new Date()
    date.setDate(today.getDate() - i)
    let formattedDate = format(date)

    try {
      let response = await fetch(
        `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json&valcode=${props.currency?.cc}&date=${formattedDate}`,
      )
      let data = await response.json()

      if (data.length > 0) {
        rates.set(formattedDate, data[0].rate)
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error)
    }
  }

  console.log('Rates received:', rates)
  updateChart(rates)
}

// Обновление графика
const updateChart = (rateMap) => {
  let labels = [...rateMap.keys()]
  let data = [...rateMap.values()]

  datacollection.value = {
    labels,
    datasets: [
      {
        label: props.currency?.cc || 'Currency',
        backgroundColor: '#f87979',
        borderColor: '#f87979',
        data,
      },
    ],
  }
}

// Автообновление при изменении валюты или периода
watchEffect(() => {
  if (props.modelValue && props.currency?.cc) {
    console.log(`Fetching rates for: ${props.currency.cc}, period: ${sortType.value}`)
    fetchRates(sortType.value)
  }
})

// Закрытие модального окна
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
        <h2 class="text-lg font-semibold">{{ currency.txt }} ({{ currency.cc }})</h2>
      </div>

      <div class="p-6">
        <!-- Выбор периода -->
        <label class="block mb-2 text-sm font-medium">Select Limits</label>
        <select
          v-model="sortType"
          @change="fetchRates(sortType)"
          class="w-full p-2 border rounded-lg"
        >
          <option v-for="item in sortItems" :key="item.value" :value="item.value">
            {{ item.text }}
          </option>
        </select>

        <!-- График -->
        <div class="mt-4">
          <Line
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
