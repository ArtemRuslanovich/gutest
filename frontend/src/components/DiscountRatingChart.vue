<template>
  <Scatter :data="chartData" :options="chartOptions" />
</template>

<script>
import { Scatter } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LinearScale, PointElement, LineElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LinearScale, PointElement, LineElement)

export default {
  name: 'DiscountRatingChart',
  components: { Scatter },
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
          x: {
            title: {
              display: true,
              text: 'Рейтинг'
            },
            min: 0,
            max: 5,
            ticks: {
              stepSize: 1
            }
          },
          y: {
            title: {
              display: true,
              text: 'Размер скидки (₽)'
            },
            beginAtZero: true
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: (items) => `Товар: ${items[0].raw.name}`,
              label: (context) => {
                const item = context.raw
                return [
                  `Рейтинг: ${item.rating.toFixed(1)}`,
                  `Скидка: ${item.discount}₽`,
                  `Цена: ${item.price}₽`,
                  `Отзывы: ${item.reviews}`
                ]
              }
            }
          }
        }
      }
    }
  },
  computed: {
    chartData() {
      const data = this.products.map(product => ({
        x: product.rating,
        y: product.price - product.sale_price,
        name: product.name,
        price: product.price,
        sale_price: product.sale_price,
        discount: product.price - product.sale_price,
        rating: product.rating,
        reviews: product.reviews
      }))
      
      return {
        datasets: [{
          label: 'Скидка vs Рейтинг',
          data: data,
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      }
    }
  }
}
</script>