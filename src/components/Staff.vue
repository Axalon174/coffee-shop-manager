<script setup>
import { onMounted } from 'vue'
import { useStaffStore } from '../stores/staff'

const staffStore = useStaffStore()

onMounted(() => {
  staffStore.fetchStaff()
})
</script>

<template>
  <div>
    <h1>Staff Members</h1>
    <div v-if="staffStore.loading">Loading...</div>
    <div v-else-if="staffStore.error">{{ staffStore.error }}</div>
    <ul v-else>
      <li v-for="member in staffStore.staffMembers" :key="member.id">
        {{ member.name }}
      </li>
    </ul>
  </div>
</template>


<style scoped>

</style>