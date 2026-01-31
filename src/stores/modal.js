import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModalStore = defineStore('modal', () => {
  const show = ref(false)
  const message = ref('')
  const type = ref('info')

  const showModal = (msg, typ = 'info') => {
    message.value = msg
    type.value = typ
    show.value = true
  }

  const closeModal = () => {
    show.value = false
  }

  return { show, message, type, showModal, closeModal }
})