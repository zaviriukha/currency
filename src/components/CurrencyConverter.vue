<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
      <div class="text-center mb-4">
        <h1 class="text-2xl font-bold">Currency Converter</h1>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Первая колонка -->
        <div class="flex flex-col space-y-2">
          <label class="text-gray-600">I have</label>
          <select
            v-model="selected[0]"
            @change="convert"
            class="border border-gray-300 rounded px-3 py-2"
          >
            <option v-for="(ccy, index) in currencyList" :key="index" :value="ccy.cc">
              {{ ccy.cc }}
            </option>
          </select>
          <input
            v-model="amount"
            type="number"
            class="border border-gray-300 rounded px-3 py-2"
            placeholder="Enter amount"
          />
        </div>

        <!-- Вторая колонка -->
        <div class="flex flex-col space-y-2">
          <label class="text-gray-600">I buy</label>
          <input
            v-model="convertedAmount"
            type="text"
            readonly
            class="border border-gray-300 rounded px-3 py-2 bg-gray-100"
            placeholder="Converted amount"
          />
          <select
            v-model="selected[1]"
            @change="convert"
            class="border border-gray-300 rounded px-3 py-2"
          >
            <option v-for="(ccy, index) in currencyList" :key="index" :value="ccy.cc">
              {{ ccy.cc }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const selected = ref(['USD', 'EUR'])
const amount = ref('')
const exchangeRates = ref([])
const currencyList = ref([{ cc: 'UAH', rate: 1 }]) // UAH всегда есть
// const baseCurrency = 'UAH'

// Функция загрузки курсов валют с API НБУ
const fetchExchangeRates = async () => {
  try {
    const response = await fetch(
      'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json',
    )
    const data = await response.json()
    exchangeRates.value = data
    currencyList.value = [{ cc: 'UAH', rate: 1 }, ...data] // Добавляем гривну вручную
    console.log(currencyList)
  } catch (error) {
    console.error('Ошибка загрузки данных:', error)
  }
}

// Вычисляем конвертированную сумму
const convertedAmount = computed(() => {
  if (!amount.value) return ''

  const fromRate = exchangeRates.value.find((c) => c.cc === selected.value[0])?.rate || 1
  const toRate = exchangeRates.value.find((c) => c.cc === selected.value[1])?.rate || 1

  return ((amount.value * fromRate) / toRate).toFixed(2)
})

onMounted(fetchExchangeRates)
</script>
