import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCurrencyStore = defineStore('currency', () => {
  const currencies = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const historicalRates = ref([]);

  // Загружаем текущие курсы валют
  const fetchRates = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json');
      const data = await response.json();
      currencies.value = data;
    } catch (err) {
      error.value = 'Ошибка при загрузке валют.';
    } finally {
      loading.value = false;
    }
  };

  // Загружаем исторические курсы валют
  const fetchHistoricalRates = async (currencyCode, period = 'week') => {
    historicalRates.value = [];
    const today = new Date();
    const formatDate = (date) => date.toISOString().split('T')[0].replace(/-/g, '');

    let intervals = { week: 6, month: 30, year: 365 };

    for (let i = intervals[period]; i >= 0; i--) {
      let date = new Date();
      date.setDate(today.getDate() - i);
      let formattedDate = formatDate(date);

      try {
        let response = await fetch(
          `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json&valcode=${currencyCode}&date=${formattedDate}`
        );
        let data = await response.json();

        if (data.length > 0) {
          historicalRates.value.push({ date: formattedDate, rate: data[0].rate });
        }
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    }
  };

  return { currencies, loading, error, fetchRates, historicalRates, fetchHistoricalRates };
});
