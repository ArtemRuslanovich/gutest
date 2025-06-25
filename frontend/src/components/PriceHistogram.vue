<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { generatePriceBins } from '@/utils/chartUtils'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'PriceHistogram',
  components: { Bar },
  props: {
    products: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Количество товаров'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Диапазон цен (₽)'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              title: (items) => `Цена: ${items[0].label}`,
              label: (context) => `Товаров: ${context.raw}`
            }
          }
        }
      }
    }
  },
  computed: {
    chartData() {
      const bins = generatePriceBins(this.products)
      
      return {
        labels: bins.map(bin => bin.label),
        datasets: [{
          label: 'Количество товаров',
          data: bins.map(bin => bin.count),
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      }
    }
  }
}
</script>