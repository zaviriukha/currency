<script setup>
import { defineProps, watch } from 'vue'
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

// Регистрируем компоненты ChartJS
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

// Определяем входные параметры
const props = defineProps({
  chartData: Object,
  options: Object,
})

// Автообновление графика при изменении данных
watch(
  () => props.chartData,
  (newData) => {
    console.log('Chart data updated:', newData)
  },
  { deep: true },
)
</script>

<template>
  <Line :data="chartData" :options="options" />
</template>
