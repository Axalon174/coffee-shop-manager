import { defineStore } from 'pinia'
import { supabase } from '../supabase' 

export const useMenuStore = defineStore('menu', {
  state: () => ({
    items: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchMenu() {
      this.loading = true
      this.error = null
      
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('is_active', true)
          .order('name')

        if (error) throw error
        
        this.items = data
      } catch (err) {
        console.error('Error al cargar menú:', err.message)
        this.error = err.message
      } finally {
        this.loading = false
      }
    }
  }
})