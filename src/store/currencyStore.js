import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCurrencyStore = defineStore('currency', () => {
  const currencies = ref([])
  const loading = ref(false)
  const error = ref(null)
  const historicalRates = ref([])
  const historyLoading = ref(false) // Новый флаг загрузки для истории курса

  // Загружаем текущие курсы валют
  const fetchRates = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(
        'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json',
      )
      const data = await response.json()
      currencies.value = data
    } catch (err) {
      error.value = 'Ошибка при загрузке валют.'
    } finally {
      loading.value = false
    }
  }

  // Загружаем исторические курсы валют
  const fetchHistoricalRates = async (currencyCode, period = 'week') => {
    historicalRates.value = []
    historyLoading.value = true // Устанавливаем флаг загрузки

    const today = new Date()
    const formatDate = (date) => date.toISOString().split('T')[0].replace(/-/g, '')
    const intervals = { week: 6, month: 30, year: 180 } // 180 дней вместо 365

    const requests = []
    for (let i = intervals[period]; i >= 0; i--) {
      let date = new Date()
      date.setDate(today.getDate() - i)
      let formattedDate = formatDate(date)

      requests.push(
        fetch(
          `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json&valcode=${currencyCode}&date=${formattedDate}`,
        )
          .then((res) => res.json())
          .then((data) => (data.length > 0 ? { date: formattedDate, rate: data[0].rate } : null))
          .catch(() => null)
      )
    }

    try {
      const results = await Promise.all(requests)
      historicalRates.value = results.filter((r) => r !== null) // Фильтруем ошибки
    } catch (err) {
      console.error('Ошибка загрузки исторических данных:', err)
    } finally {
      historyLoading.value = false // Снимаем флаг загрузки
    }
  }

  return {
    currencies,
    loading,
    error,
    fetchRates,
    historicalRates,
    fetchHistoricalRates,
    historyLoading
  }
})
