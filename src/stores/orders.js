import { defineStore } from 'pinia'
import { supabase } from '../supabase'

export const useOrderStore = defineStore('order', {
  state: () => ({
    currentTable: 1, 
    cart: [], 
    isSending: false
  }),

  getters: {
    totalAmount: (state) => {
      return state.cart.reduce((total, item) => total + item.price, 0)
    }
  },

  actions: {
    addToCart(product) {
      this.cart.push({
        ...product,
        tempId: Date.now() // ID temporal para la UI
      })
    },

    removeFromCart(tempId) {
      this.cart = this.cart.filter(item => item.tempId !== tempId)
    },

    async sendOrder() {
      if (this.cart.length === 0) return
      
      this.isSending = true
      
      try {
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert({
            table_id: this.currentTable,
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
          status: 'pending'
        }))

        // insert order items
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems)

        if (itemsError) throw itemsError

       
        alert(`¡Orden #${newOrderId} creada con éxito!`)
        this.cart = [] //clear cart

      } catch (error) {
        console.error('Error creando orden:', error)
        alert('Hubo un error al enviar la orden')
      } finally {
        this.isSending = false
      }
    }
  }
})