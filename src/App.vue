<script setup>
import { onMounted } from 'vue'
import { useMenuStore } from './stores/menu'
import { useOrderStore } from './stores/orders'

// Instancias de nuestras stores (Pinia)
const menu = useMenuStore()
const order = useOrderStore()

// Cargar menú al iniciar
onMounted(() => {
  menu.fetchMenu()
})
</script>

<template>
  <div class="layout-container">
    
    <main class="menu-section">
      <header class="header">
        <h1> Coffee APP</h1>
        <p>Mesa seleccionada: <strong>{{ order.currentTable }}</strong></p>
      </header>

      <div v-if="menu.loading" class="loading-state">
        Cargando deliciosos productos...
      </div>
      
      <div v-else class="products-grid">
        <button 
          v-for="item in menu.items" 
          :key="item.id"
          @click="order.addToCart(item)"
          class="product-card"
        >
          <div class="card-content">
            <span class="product-name">{{ item.name }}</span>
            <span class="product-cat">{{ item.category }}</span>
          </div>
          <span class="product-price">${{ item.price }}</span>
        </button>
      </div>
    </main>

    <aside class="sidebar-order">
      <div class="order-content">
        <h2>Comanda Actual</h2>
        
        <div v-if="order.cart.length === 0" class="empty-msg">
          La orden está vacía.
        </div>

        <ul class="cart-list">
          <li v-for="item in order.cart" :key="item.tempId" class="cart-item">
            <div>
              <div class="item-name">{{ item.name }}</div>
              <div class="item-price">${{ item.price }}</div>
            </div>
            <button class="btn-remove" @click="order.removeFromCart(item.tempId)">
              ✕
            </button>
          </li>
        </ul>
      </div>

      <div class="order-footer">
        <div class="total-row">
          <span>Total:</span>
          <span>${{ order.totalAmount }}</span>
        </div>

        <button 
          class="btn-confirm"
          @click="order.sendOrder()"
          :disabled="order.isSending || order.cart.length === 0"
        >
          {{ order.isSending ? 'Enviando...' : 'CONFIRMAR PEDIDO' }}
        </button>
      </div>
    </aside>

  </div>
</template>

<style scoped>
/* Contenedor que divide la pantalla en 2 */
.layout-container {
  display: flex;
  height: 100dvh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  margin: 0;
}

/* MENÚ */
.menu-section {
  flex: 2; 
  background-color: #f4f4f9;
  padding: 2rem;
  overflow-y: auto; 
}

.header h1 {
  color: #d35400;
  margin-bottom: 0.5rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); 
  gap: 1.5rem;
  margin-top: 2rem;
}

.product-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 160px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  border-color: #e67e22;
}

.product-name {
  font-weight: bold;
  font-size: 1.1rem;
  display: block;
  color: #2c3e50;
}

.product-cat {
  font-size: 0.85rem;
  color: #888;
}

.product-price {
  font-size: 1.25rem;
  color: #d35400;
  font-weight: bold;
  align-self: flex-end;
}

/* SIDEBAR */
.sidebar-order {
  flex: 1; 
  background: white;
  border-left: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  box-shadow: -5px 0 15px rgba(0,0,0,0.05);
  z-index: 10;
}

.order-content {
  padding: 2rem;
  flex-grow: 1; 
  overflow-y: auto;
}

.empty-msg {
  text-align: center;
  color: #bbb;
  margin-top: 3rem;
  font-style: italic;
}

.cart-list {
  list-style: none;
  padding: 0;
  margin-top: 1.5rem;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.item-name {
  font-weight: 500;
}

.item-price {
  color: #666;
  font-size: 0.9rem;
}

.btn-remove {
  background: none;
  border: none;
  color: #e74c3c;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 0.5rem;
}

.btn-remove:hover {
  color: #c0392b;
}

/*FOOTER DEL SIDEBAR*/
.order-footer {
  padding: 2rem;
  background-color: #fafafa;
  border-top: 1px solid #e0e0e0;
}

.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.btn-confirm {
  width: 100%;
  padding: 1rem;
  background-color: #e67e22;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-confirm:hover {
  background-color: #d35400;
}

.btn-confirm:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
