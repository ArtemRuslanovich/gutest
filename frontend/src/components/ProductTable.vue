<template>
  <div class="product-table">
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th @click="sort('name')" :class="{ active: sortField === 'name' }">
              Название товара
              <SortIndicator :field="'name'" :current="sortField" :order="sortOrder" />
            </th>
            <th @click="sort('price')" :class="{ active: sortField === 'price' }">
              Цена
              <SortIndicator :field="'price'" :current="sortField" :order="sortOrder" />
            </th>
            <th @click="sort('sale_price')" :class="{ active: sortField === 'sale_price' }">
              Цена со скидкой
              <SortIndicator :field="'sale_price'" :current="sortField" :order="sortOrder" />
            </th>
            <th @click="sort('rating')" :class="{ active: sortField === 'rating' }">
              Рейтинг
              <SortIndicator :field="'rating'" :current="sortField" :order="sortOrder" />
            </th>
            <th @click="sort('reviews')" :class="{ active: sortField === 'reviews' }">
              Отзывы
              <SortIndicator :field="'reviews'" :current="sortField" :order="sortOrder" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in sortedProducts" :key="product.id">
            <td>{{ product.name }}</td>
            <td>{{ formatPrice(product.price) }}</td>
            <td>{{ formatPrice(product.sale_price) }}</td>
            <td>{{ formatRating(product.rating) }}</td>
            <td>{{ product.reviews }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-if="products.length === 0" class="empty-state">
      <p>Товары не найдены. Попробуйте изменить фильтры или загрузить данные.</p>
    </div>
  </div>
</template>

<script>
import SortIndicator from './SortIndicator.vue'

export default {
  name: 'ProductTable',
  components: { SortIndicator },
  props: {
    products: {
      type: Array,
      required: true
    }
  },
  emits: ['sort'],
  data() {
    return {
      sortField: 'name',
      sortOrder: 'asc'
    }
  },
  computed: {
    sortedProducts() {
      return [...this.products].sort((a, b) => {
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
  methods: {
    sort(field) {
      if (this.sortField === field) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortField = field
        this.sortOrder = 'asc'
      }
      this.$emit('sort', { field: this.sortField, order: this.sortOrder })
    },
    
    formatPrice(price) {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0
      }).format(price)
    },
    
    formatRating(rating) {
      return rating.toFixed(1)
    }
  }
}
</script>
<style lang="scss" scoped>
.product-table {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  height: 100%;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 800px;
}

th {
  background-color: #f8f9fa;
  padding: 1rem 1.5rem;
  text-align: left;
  font-weight: 600;
  color: #495057;
  cursor: pointer;
  position: relative;
  border-bottom: 2px solid #e9ecef;
  
  &:hover {
    background-color: #e9ecef;
  }
  
  &.active {
    color: #3498db;
  }
}

td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
  color: #495057;
}

tr:hover td {
  background-color: #f8f9fa;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #6c757d;
}
</style>