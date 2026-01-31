import { defineStore } from 'pinia'
import { supabase } from '../supabase'
import { useTableStore } from './tables'
import { useModalStore } from './modal'

export const useOrderStore = defineStore('order', {
  state: () => ({
    cart: [], 
    isSending: false
  }),

  getters: {
    totalAmount: (state) => {
      return state.cart.reduce((total, item) => total + item.price, 0)
    }
  },

  actions: {
    addToCart(product, notes = '') {
      this.cart.push({
        ...product,
        notes: notes,
        tempId: Date.now() // ID temporal para la UI
      })
    },

    removeFromCart(tempId) {
      this.cart = this.cart.filter(item => item.tempId !== tempId)
    },

    async sendOrder() {
      if (this.cart.length === 0) return
      
      const tableStore = useTableStore()
      const modalStore = useModalStore()
      
      if (!tableStore.currentTable) {
        modalStore.showModal('Por favor selecciona una mesa primero', 'warning')
        return
      }
      
      this.isSending = true
      
      try {
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert({
            table_id: tableStore.currentTable.id,
            staff_id: 2, 
            status: 'open',
            total_amount: this.totalAmount
          })
          .select()
          .single() // Important to get the inserted row

        if (orderError) throw orderError

        const newOrderId = orderData.id
        //order details
        const orderItems = this.cart.map(item => ({
          order_id: newOrderId,
          menu_item_id: item.id,
          quantity: 1,
          notes: item.notes || null,
          status: 'pending'
        }))

        // insert order items
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems)

        if (itemsError) throw itemsError

        if (tableStore.currentTable.label !== 'Para llevar') {
          await tableStore.updateTableStatus(tableStore.currentTable.id, 'occupied')
        }

        modalStore.showModal(`¡Orden #${newOrderId} creada con éxito para mesa ${tableStore.currentTable.label}!`, 'success')
        this.cart = [] //clear cart

      } catch (error) {
        console.error('Error creando orden:', error)
        modalStore.showModal('Hubo un error al enviar la orden', 'error')
      } finally {
        this.isSending = false
      }
    }
  }
})