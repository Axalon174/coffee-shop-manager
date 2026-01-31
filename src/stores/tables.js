import { defineStore } from 'pinia'
import { supabase } from '../supabase'

export const useTableStore = defineStore('tables', {
  state: () => ({
    tables: [],
    currentTable: null,
    loading: false,
    error: null
  }),

  getters: {
    availableTables: (state) => {
      return state.tables.filter(table => table.status === 'available')
    },
    currentTableLabel: (state) => {
      return state.currentTable?.label || 'No seleccionada'
    }
  },

  actions: {
    async fetchTables() {
      this.loading = true
      this.error = null
      
      try {
        const { data, error } = await supabase
          .from('restaurant_tables')
          .select('*')
          .order('label')

        if (error) throw error
        
        this.tables = data
      } catch (err) {
        console.error('Error al cargar mesas:', err.message)
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    selectTable(table) {
      this.currentTable = table
    },

    clearTable() {
      this.currentTable = null
    },

    async updateTableStatus(tableId, status) {
      try {
        const { error } = await supabase
          .from('restaurant_tables')
          .update({ status })
          .eq('id', tableId)

        if (error) throw error

        // Update local state
        const table = this.tables.find(t => t.id === tableId)
        if (table) {
          table.status = status
        }
      } catch (err) {
        console.error('Error updating table status:', err.message)
        this.error = err.message
      }
    }
  }
})
