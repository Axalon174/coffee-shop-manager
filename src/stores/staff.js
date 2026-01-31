import { defineStore } from 'pinia'
import { supabase } from '../supabase'

export const useStaffStore = defineStore('staff', {
  state: () => ({
    staffMembers: [],
    loading: false,
    error: null
  }),
  getters: {
    activeStaff: (state) => {
      return state.staffMembers.filter(member => member.is_active)
    }
  },
  actions: {
    fetchStaff() {
      this.loading = true
      this.error = null 
        supabase
            .from('staff') 
            .select('*')
            .order('name')
            .then(({ data, error }) => {
                if (error) {
                    this.error = error.message
                } else {
                    this.staffMembers = data
                }
            })
            .finally(() => {
                this.loading = false
            })
    }
  }
})