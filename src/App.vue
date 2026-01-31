<script setup>
import { useModalStore } from './stores/modal.js'
import Modal from './components/Modal.vue'

const modalStore = useModalStore()
</script>

<template>
  <router-view />
  <Modal :show="modalStore.show" :title="modalStore.type" @close="modalStore.closeModal">
    {{ modalStore.message }}
    <template #footer>
      <button @click="modalStore.closeModal">OK</button>
    </template>
  </Modal>
</template>

<style>
/* Global styles moved to style.css */
</style>
