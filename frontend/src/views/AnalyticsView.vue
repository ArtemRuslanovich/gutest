<template>
  <div class="analytics-view">
    <FilterPanel @filter-change="handleFilterChange" />
    
    <div class="dashboard">
      <div class="dashboard-left">
        <ProductTable :products="filteredProducts" @sort="handleSort" />
      </div>
      
      <div class="dashboard-right">
        <div class="chart-container">
          <h2>Распределение цен</h2>
          <PriceHistogram :products="filteredProducts" />
        </div>
        
        <div class="chart-container">
          <h2>Скидка vs Рейтинг</h2>
          <DiscountRatingChart :products="filteredProducts" />
        </div>
      </div>
    </div>
    
    <div v-if="loading" class="loading-overlay">
      <div class="loader"></div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import ProductTable from '@/components/ProductTable.vue'
import PriceHistogram from '@/components/PriceHistogram.vue'
import DiscountRatingChart from '@/components/DiscountRatingChart.vue'
import FilterPanel from '@/components/FilterPanel.vue'

export default {
  name: 'AnalyticsView',
  components: {
    ProductTable,
    PriceHistogram,
    DiscountRatingChart,
    FilterPanel
  },
  data() {
    return {
      filters: {
        priceRange: [0, 100000],
        minRating: 0,
        minReviews: 0
      },
      sortField: 'name',
      sortOrder: 'asc'
    }
  },
  computed: {
    ...mapState('products', ['products', 'loading']),
    
    filteredProducts() {
      let result = [...this.products]
      
      // Применяем фильтры
      result = result.filter(p => 
        p.price >= this.filters.priceRange[0] && 
        p.price <= this.filters.priceRange[1] &&
        p.rating >= this.filters.minRating &&
        p.reviews >= this.filters.minReviews
      )
      
      // Применяем сортировку
      return this.sortProducts(result)
    }
  },
  methods: {
    ...mapActions('products', ['fetchProducts']),
    
    handleFilterChange(filters) {
      this.filters = { ...filters }
    },
    
    handleSort(field) {
      if (this.sortField === field) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortField = field
        this.sortOrder = 'asc'
      }
    },
    
    sortProducts(products) {
      return [...products].sort((a, b) => {
        const aValue = a[this.sortField]
        const bValue = b[this.sortField]
        const modifier = this.sortOrder === 'asc' ? 1 : -1
        
        if (typeof aValue === 'string') {
          return aValue.localeCompare(bValue) * modifier
        }
        return (aValue - bValue) * modifier
      })
    }
  },
  created() {
    this.fetchProducts()
  }
}
</script>

<style lang="scss" scoped>
.analytics-view {
  position: relative;
}

.dashboard {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  margin-top: 2rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
}

.chart-container {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  
  h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    font-size: 1.25rem;
    color: #2c3e50;
  }
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loader {
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>