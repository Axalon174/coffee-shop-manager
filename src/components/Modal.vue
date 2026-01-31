<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="modal-overlay" @click="close">
        <div class="modal-card" @click.stop>
          <header v-if="title">
            <h2>{{ title }}</h2>
            <button @click="close" class="close-btn">&times;</button>
          </header>
          
          <div class="modal-body">
            <slot />
          </div>

          <footer v-if="$slots.footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  title: String
})

const emit = defineEmits(['close'])

const close = () => emit('close')

const handleKeydown = (e) => {
  if (props.show && e.key === 'Escape') {
    close()
  }
}

watch(() => props.show, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeydown)
  } else {
    document.body.style.overflow = ''
    window.removeEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>

.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(2px); 
}

.modal-card {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}


header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 1.5rem; border-bottom: 1px solid #e0e0e0;
}
header h2 { margin: 0; color: #8E5A30; font-size: 1.25rem; font-weight: 600; }
.close-btn { background: none; border: none; font-size: 2rem; color: #999; cursor: pointer; line-height: 1; }
.close-btn:hover { color: #e74c3c; }
.modal-body { padding: 1.5rem; flex-grow: 1; overflow-y: auto; }
footer { padding: 1.5rem; border-top: 1px solid #e0e0e0; display: flex; gap: 1rem; justify-content: flex-end; }

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active .modal-card {
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Efecto rebote suave */
}

.fade-leave-active .modal-card {
  transition: transform 0.2s ease-in;
}

.fade-enter-from .modal-card,
.fade-leave-to .modal-card {
  transform: scale(0.9) translateY(20px);
}
</style>