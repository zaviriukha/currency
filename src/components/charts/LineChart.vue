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

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

// define input props
const props = defineProps({
  chartData: Object,
  options: Object,
})

// graphic update if data changed
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
