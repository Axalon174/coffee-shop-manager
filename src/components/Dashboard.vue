<script setup>
import { useRouter } from 'vue-router'
import { useMenuStore } from '../stores/menu'

const router = useRouter()
const menu = useMenuStore()
// Modal state
const showModal = ref(false)

const openModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

</script>