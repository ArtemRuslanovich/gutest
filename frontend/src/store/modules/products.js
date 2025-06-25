import api from '@/services/api'

export default {
  namespaced: true,
  state: {
    products: [],
    loading: false,
    error: null
  },
  mutations: {
    SET_PRODUCTS(state, products) {
      state.products = products
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },
  actions: {
    async fetchProducts({ commit }) {
      commit('SET_LOADING', true)
      try {
        const response = await api.get('/products/')
        commit('SET_PRODUCTS', response.data)
        commit('SET_ERROR', null)
      } catch (error) {
        commit('SET_ERROR', 'Ошибка загрузки данных: ' + error.message)
        console.error('Ошибка загрузки товаров:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async parseProducts({ commit }, query) {
      commit('SET_LOADING', true)
      try {
        await api.post('/parse', { query })
        // После парсинга обновляем список товаров
        await this.dispatch('products/fetchProducts')
        commit('SET_ERROR', null)
      } catch (error) {
        commit('SET_ERROR', 'Ошибка парсинга: ' + error.message)
        console.error('Ошибка парсинга товаров:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    }
  },
  getters: {
    products: state => state.products,
    loading: state => state.loading,
    error: state => state.error
  }
}