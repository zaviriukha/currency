<script setup>
import { ref, computed } from 'vue'
import { useCurrencyStore } from '@/store/currencyStore'

const store = useCurrencyStore()

const selected = ref(['USD', 'EUR'])
const amount = ref('')

// Вычисляем конвертированную сумму
const convertedAmount = computed(() => {
  return store.convertCurrency(amount.value, selected.value[0], selected.value[1])
})
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
      <div class="text-center mb-4">
        <h1 class="text-2xl font-bold">Currency Converter</h1>
      </div>

      <div v-if="store.loading">Загрузка...</div>
      <div v-else-if="store.error">{{ store.error }}</div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex flex-col space-y-2">
          <label class="text-gray-600">I have</label>
          <select v-model="selected[0]" class="border border-gray-300 rounded px-3 py-2">
            <option v-for="ccy in store.currencies" :key="ccy.cc" :value="ccy.cc">
              {{ ccy.cc }}
            </option>
          </select>
          <input v-model="amount" type="number" class="border border-gray-300 rounded px-3 py-2" />
        </div>

        <div class="flex flex-col space-y-2">
          <label class="text-gray-600">I buy</label>
          <input
            v-model="convertedAmount"
            type="text"
            readonly
            class="border border-gray-300 rounded px-3 py-2 bg-gray-100"
          />
          <select v-model="selected[1]" class="border border-gray-300 rounded px-3 py-2">
            <option v-for="ccy in store.currencies" :key="ccy.cc" :value="ccy.cc">
              {{ ccy.cc }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>
