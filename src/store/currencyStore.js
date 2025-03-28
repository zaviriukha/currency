import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCurrencyStore = defineStore('currency', () => {
  const currencies = ref([])
  const loading = ref(false)
  const error = ref(null)
  const historicalRates = ref([])

  // Загружаем текущие курсы валют
  const fetchRates = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(
        'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json',
      )
      const data = await response.json()

      // Добавляем UAH вручную, так как его нет в API
      data.push({ cc: 'UAH', rate: 1 })

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
    const today = new Date()
    const formatDate = (date) => date.toISOString().split('T')[0].replace(/-/g, '')

    let intervals = { week: 6, month: 30, year: 365 }

    for (let i = intervals[period]; i >= 0; i--) {
      let date = new Date()
      date.setDate(today.getDate() - i)
      let formattedDate = formatDate(date)

      try {
        let response = await fetch(
          `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json&valcode=${currencyCode}&date=${formattedDate}`,
        )
        let data = await response.json()

        if (data.length > 0) {
          historicalRates.value.push({ date: formattedDate, rate: data[0].rate })
        }
      } catch (error) {
        console.error('Ошибка загрузки данных:', error)
      }
    }
  }

// Конвертер валют
  const convertCurrency = (amount, from, to) => {
    if (!amount && amount !== 0) return ''  // Просто возвращаем пустую строку, если сумма не введена

    if (isNaN(amount) || amount <= 0) return 'Некорректная сумма' // Теперь проверка на некорректную сумму только если значение введено

    const fromCurrency = currencies.value.find((c) => c.cc === from)
    const toCurrency = currencies.value.find((c) => c.cc === to)

    if (!fromCurrency || !toCurrency) return 'Ошибка: валюта не найдена'

    const result = (amount * fromCurrency.rate) / toCurrency.rate
    return result.toFixed(2)
  }

  return { currencies, loading, error, fetchRates, historicalRates, fetchHistoricalRates, convertCurrency }
})
