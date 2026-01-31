<script setup>

import { onMounted, ref } from 'vue'

import { useMenuStore } from '../stores/menu'

import { useOrderStore } from '../stores/orders'

import { useTableStore } from '../stores/tables'

import Modal from './Modal.vue'

import { TriangleAlert, Lightbulb } from 'lucide-vue-next'


// Instancias de nuestras stores (Pinia)

const menu = useMenuStore()

const order = useOrderStore()

const tables = useTableStore()


// Modal state

const showModal = ref(false)

const showWarningModal = ref(false)

const showInstructionModal = ref(false)

const selectedProduct = ref(null)

const itemNotes = ref('')


// Long-press detection

const pressTimer = ref(null)

const longPressTriggered = ref(false)

const LONG_PRESS_DURATION = 1000 // 1 segundos


// Modal methods

const openModal = (product) => {

  selectedProduct.value = product

  itemNotes.value = ''

  showModal.value = true

}


const closeModal = () => {

  showModal.value = false

  selectedProduct.value = null

  itemNotes.value = ''

}


const addWithNotes = () => {

  if (selectedProduct.value) {

    order.addToCart(selectedProduct.value, itemNotes.value)

    closeModal()

  }

}


const addWithoutNotes = () => {

  if (selectedProduct.value) {

    order.addToCart(selectedProduct.value, '')

    closeModal()

  }

}


// Long-press handlers

const startPress = (product) => {

  longPressTriggered.value = false

  pressTimer.value = setTimeout(() => {

    longPressTriggered.value = true

    openModal(product)

  }, LONG_PRESS_DURATION)

}


const endPress = (product) => {

  if (pressTimer.value) {

    clearTimeout(pressTimer.value)

    pressTimer.value = null

  }


  if (!longPressTriggered.value) {
    
    order.addToCart(product, '')

  }

  longPressTriggered.value = false

}


const cancelPress = () => {

  if (pressTimer.value) {

    clearTimeout(pressTimer.value)

    pressTimer.value = null

  }

  longPressTriggered.value = false

}


// --- SCROLL VS PRESS HANDLING ---
// Variables para detectar scroll vs press
const touchStartY = ref(0)
const isScrolling = ref(false)

const handleTouchStart = (product, event) => {
  isScrolling.value = false
  if (event.touches && event.touches.length > 0) {
    touchStartY.value = event.touches[0].clientY
  }
  startPress(product)
}

const handleTouchMove = (event) => {

  if (isScrolling.value) return 

  if (event.touches && event.touches.length > 0) {
    const currentY = event.touches[0].clientY
    const deltaY = Math.abs(currentY - touchStartY.value)

    if (deltaY > 10) {
      isScrolling.value = true
      cancelPress() 
    }
  }
}

const handleTouchEnd = (product, event) => {
  if (isScrolling.value) {
    cancelPress() 
    return
  }
  if (event && event.cancelable) {
    event.preventDefault()
  }
  endPress(product)
}

onMounted(() => {

  menu.fetchMenu()

  tables.fetchTables()

})

</script>


<template>

  <div class="layout-container">

    <main class="menu-section">

      <header class="header">
        <div class="header-content">
          <h1>☕ Creador de Comandas</h1>
           <button v-if="!tables.currentTable && !tables.loading" class="warning-message" @click="showWarningModal = true">
             <TriangleAlert :size="20" />
           </button>
          <button class="instruction-message" @click="showInstructionModal = true">
            <Lightbulb :size="20" />
          </button>

        </div>
       
        <div class="table-selection-container">

          <label for="table-select">Selecciona Mesa:</label>

          <select 

            id="table-select"

            class="table-select"

            :value="tables.currentTable?.id || ''"

            @change="tables.selectTable(tables.tables.find(t => t.id === Number($event.target.value)))"

            :disabled="tables.loading"

          >

            <option value="" disabled>-- Elige una mesa --</option>

            <option 

              v-for="table in tables.availableTables" 

              :key="table.id"

              :value="table.id"

            >

              {{ table.label }} ({{ table.status === 'available' ? 'Disponible' : table.status }})

            </option>

          </select>

        </div>

        

        <div v-if="tables.currentTable" class="selected-table-info">

          Mesa actual: <strong>{{ tables.currentTableLabel }}</strong>

        </div>

        

       

        
       
        

      </header>


      <div v-if="menu.loading" class="loading-state">

        Cargando deliciosos productos...

      </div>

      

      <div v-else class="products-grid">

        <button 

          v-for="item in menu.items" 

          :key="item.id"

          @mousedown="startPress(item)"

          @mouseup="endPress(item)"

          @mouseleave="cancelPress"

          @touchstart="handleTouchStart(item, $event)"

          @touchmove="handleTouchMove($event)"

          @touchend="handleTouchEnd(item, $event)"

          @touchcancel="cancelPress"

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

              <div class="item-notes" v-if="item.notes">📝 {{ item.notes }}</div>

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


  <!-- Modal para agregar notas -->

  <Modal :show="showModal" :title="selectedProduct?.name" @close="closeModal">

    <label for="item-notes">Notas opcionales (ej: sin azúcar, extra caliente):</label>

    <textarea 

      id="item-notes"

      v-model="itemNotes"

      placeholder="Escribe aquí cualquier indicación especial..."

      rows="4"

      class="notes-textarea"

      @keydown.enter.ctrl="addWithNotes"

      @keydown.esc="closeModal"

    ></textarea>

    <template #footer>

      <button class="btn-add-quick" @click="addWithoutNotes">

        Añadir sin Notas

      </button>

      <button class="btn-add-notes" @click="addWithNotes">

        Añadir con Notas

      </button>

    </template>

  </Modal>

  <!-- Modal Warning -->
  <Modal :show="showWarningModal" title="⚠️ Atención" @close="showWarningModal = false">
    <p style="font-size: 1.1rem; text-align: center;">
      Selecciona una mesa para comenzar a tomar pedidos.
    </p>
    <template #footer>
      <button class="btn-confirm" @click="showWarningModal = false">
        Entendido
      </button>
    </template>
  </Modal>

  <!-- Modal Instructions -->
  <Modal :show="showInstructionModal" title="💡 Tips de Uso" @close="showInstructionModal = false">
    <div style="font-size: 1.1rem; line-height: 1.6;">
      <p>👆 <strong>Toca un producto</strong> para añadirlo rápidamente a la orden.</p>
      <hr style="border-color: #eee; margin: 1rem 0;">
      <p>⏱️ <strong>Mantén presionado (1s)</strong> un producto para agregar notas o detalles especiales.</p>
    </div>
    <template #footer>
      <button class="btn-confirm" @click="showInstructionModal = false">
        ¡Entendido!
      </button>
    </template>
  </Modal>
  
</template>


<style scoped>

 /* Contenedor que divide la pantalla en 2 */

.layout-container {

  display: flex;

  flex-direction: column;

  height: 100dvh;

  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  color: #1A1817;

  margin: 0;

}
/* MENÚ */

.menu-section {

  flex: 2; 

  background-color: #D4D5B9;

  padding: 2rem;

  overflow-y: auto; 

}


.header h1 {

  color: #8E5A30;

  margin-bottom: 0;

  font-size: 1.2rem;

}


.header-content {

  display: flex;

  align-items: center;

  gap: 1rem;

}


.table-selection-container {

  display: flex;

  flex-direction: column;

  gap: 0.5rem;

  margin: 1rem 0;

}


.table-selection-container label {

  font-weight: 600;

  color: #1A1817;

  font-size: 0.95rem;

}


.table-select {

  padding: 0.75rem 1rem;

  border: 2px solid #8E5A30;

  border-radius: 8px;

  background: #fff;

  color: #1A1817;

  font-size: 1rem;

  font-weight: 500;

  cursor: pointer;

  transition: all 0.3s;

  outline: none;

}


.table-select:hover:not(:disabled) {

  border-color: #6d4524;

  background: #f9f9f9;

}


.table-select:focus {

  border-color: #6d4524;

  box-shadow: 0 0 0 3px rgba(142, 90, 48, 0.1);

}


.table-select:disabled {

  opacity: 0.6;

  cursor: not-allowed;

}


.selected-table-info {

  background: #e8f5e9;

  border: 1px solid #37b43b;

  border-radius: 8px;

  padding: 0.75rem 1rem;

  margin-top: 0.5rem;

  color: #2b6f2f;

  font-size: 0.95rem;

}

.instruction-message,
.warning-message {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  padding: 0;
  margin: 0;
  font-size: 1.2rem;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.instruction-message:hover,
.warning-message:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.warning-message {

  background: #fff5e6;

  border-color: #ffcc80;

  color: #cc7a00;

}
.instruction-message {

  background: #e3f2fd;

  border-color: #2196f3;

  color: #1565c0;
}


.instruction-message strong {

  color: #0d47a1;

  font-weight: 700;

}


.products-grid {

  display: grid;

  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); 

  gap: 1.5rem;

  margin-top: 2rem;

}


.product-card {

  background: #E9E9E0;

  border: 1px solid #b8b9a0;

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

  border-color: #8E5A30;

}


.product-name {

  font-weight: bold;

  font-size: 1.1rem;

  display: block;

  color: #1A1817;

}


.product-cat {

  font-size: 0.85rem;

  color: #888;

}


.product-price {

  font-size: 1.25rem;

  color: #8E5A30;

  font-weight: bold;

  align-self: flex-end;

}


/* SIDEBAR */

.sidebar-order {

  flex: 1; 

  background: #E9E9E0;

  border-left: 1px solid #b8b9a0;

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

  border-bottom: 1px solid #D4D5B9;

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

  background-color: #D4D5B9;

  border-top: 1px solid #b8b9a0;

}


.total-row {

  display: flex;

  justify-content: space-between;

  font-size: 1.5rem;

  font-weight: bold;

  margin-bottom: 1.5rem;

  color: #1A1817;

}


.btn-confirm {

  width: 100%;

  padding: 1rem;

  background-color: #8E5A30;

  color: #E9E9E0;

  border: none;

  border-radius: 8px;

  font-size: 1rem;

  font-weight: bold;

  cursor: pointer;

  transition: background 0.3s;

}


.btn-confirm:hover {

  background-color: #6d4524;

}


.btn-confirm:disabled {

  background-color: #ccc;

  cursor: not-allowed;

}


.item-notes {

  font-size: 0.85rem;

  color: #666;

  font-style: italic;

  margin-top: 0.25rem;

  margin-bottom: 0.25rem;

  line-height: 1.3;

}


@media (max-width: 768px) {

  .menu-section {

    flex: 1;

  }

  .sidebar-order {

    flex: 1;

  }

  .notes-textarea {

    font-size: 16px;

  }

}

@media (min-width: 769px) {

  .layout-container {

    flex-direction: row;

  }

  .header {

    top: 2rem;

    left: 2rem;

    width: calc(66vw - 4rem);

    z-index: 1;

  }

}
@media (max-width: 480px) {

  .product-card {

    height: 140px;

    padding: 1rem;

  }

  .product-name {

    font-size: 1rem;

  }

  .product-price {

    font-size: 1.1rem;

  }

  div.order-content{
    max-height: 35dvh;
  }
  div.order-footer{
    max-height: 15dvh;
  }
  .instruction-message,.warning-message {
    font-size: 0.85rem;
    padding: 0.75rem;
    max-width: 150px;
  }
}
</style>




