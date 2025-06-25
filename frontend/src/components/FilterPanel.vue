<template>
  <div class="filter-panel">
    <div class="filter-group">
      <h3>Фильтры</h3>
      
      <div class="filter-item">
        <label>Диапазон цен: {{ priceRange[0] }}₽ - {{ priceRange[1] }}₽</label>
        <vue-slider 
          v-model="priceRange" 
          :min="0" 
          :max="maxPrice" 
          :interval="1000" 
          tooltip="always"
          :tooltip-formatter="val => `${val}₽`"
        />
      </div>
      
      <div class="filter-item">
        <label>Минимальный рейтинг: {{ minRating }}</label>
        <vue-slider 
          v-model="minRating" 
          :min="0" 
          :max="5" 
          :interval="0.1"
          :marks="[0, 1, 2, 3, 4, 5]"
          :tooltip-formatter="val => val.toFixed(1)"
        />
      </div>
      
      <div class="filter-item">
        <label>Минимальное кол-во отзывов: {{ minReviews }}</label>
        <vue-slider 
          v-model="minReviews" 
          :min="0" 
          :max="maxReviews" 
          :interval="10"
          :marks="marks"
        />
      </div>
      
      <div class="filter-item">
        <button class="btn-parse" @click="parseProducts">Загрузить данные</button>
      </div>
    </div>
    
    <div class="search-box">
      <input 
        v-model="searchQuery" 
        placeholder="Введите категорию для парсинга..." 
        @keyup.enter="parseProducts"
      />
      <button @click="parseProducts">Парсить</button>
    </div>
  </div>
</template>

<script>
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
import { mapState } from 'vuex'

export default {
  name: 'FilterPanel',
  components: { VueSlider },
  data() {
    return {
      searchQuery: '',
      priceRange: [0, 100000],
      minRating: 0,
      minReviews: 0
    }
  },
  computed: {
    ...mapState('products', ['products']),
    
    maxPrice() {
      return Math.max(...this.products.map(p => p.price), 100000) || 100000
    },
    
    maxReviews() {
      return Math.max(...this.products.map(p => p.reviews), 1000) || 1000
    },
    
    marks() {
      const step = Math.floor(this.maxReviews / 5)
      return Array.from({ length: 6 }, (_, i) => i * step)
    }
  },
  watch: {
    priceRange() {
      this.emitFilters()
    },
    minRating() {
      this.emitFilters()
    },
    minReviews() {
      this.emitFilters()
    }
  },
  methods: {
    emitFilters() {
      this.$emit('filter-change', {
        priceRange: this.priceRange,
        minRating: this.minRating,
        minReviews: this.minReviews
      })
    },
    
    parseProducts() {
      if (this.searchQuery.trim()) {
        this.$store.dispatch('products/parseProducts', this.searchQuery.trim())
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.filter-panel {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.filter-group {
  flex: 1;
  min-width: 300px;
}

.filter-item {
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #2c3e50;
  }
}

.search-box {
  display: flex;
  align-items: flex-end;
  min-width: 300px;
  
  input {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px 0 0 4px;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.3s;
    
    &:focus {
      border-color: #3498db;
    }
  }
  
  button {
    padding: 0.75rem 1.25rem;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 0 4px 4px 0;
    cursor: pointer;
    transition: background 0.3s;
    
    &:hover {
      background: #2980b9;
    }
  }
}

.btn-parse {
  background: #27ae60;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s;
  
  &:hover {
    background: #219653;
  }
}

h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #2c3e50;
}
</style>