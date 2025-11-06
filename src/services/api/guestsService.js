import { getApperClient } from '@/services/apperClient'
import { toast } from 'react-toastify'

const guestsService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const response = await apperClient.fetchRecords('guest_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "preferences_c"}},
          {"field": {"Name": "vip_status_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data?.map(guest => ({
        ...guest,
        // Map database fields to legacy field names for UI compatibility
        firstName: guest.first_name_c,
        lastName: guest.last_name_c,
        email: guest.email_c,
        phone: guest.phone_c,
        vipStatus: guest.vip_status_c,
        // Parse preferences from string to object if needed
        preferences: guest.preferences_c ? 
          (typeof guest.preferences_c === 'string' ? 
            JSON.parse(guest.preferences_c) : guest.preferences_c) : {},
        // Mock data for features not in database yet
        stayHistory: []
      })) || []
    } catch (error) {
      console.error("Error fetching guests:", error.message)
      toast.error("Failed to load guests")
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const response = await apperClient.getRecordById('guest_c', id, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "preferences_c"}},
          {"field": {"Name": "vip_status_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      const guest = response.data
      return {
        ...guest,
        firstName: guest.first_name_c,
        lastName: guest.last_name_c,
        email: guest.email_c,
        phone: guest.phone_c,
        vipStatus: guest.vip_status_c,
        preferences: guest.preferences_c ? 
          (typeof guest.preferences_c === 'string' ? 
            JSON.parse(guest.preferences_c) : guest.preferences_c) : {},
        stayHistory: []
      }
    } catch (error) {
      console.error(`Error fetching guest ${id}:`, error.message)
      toast.error("Failed to load guest")
      return null
    }
  },

  async create(guestData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      // Only include updateable fields
      const createData = {
        Name: guestData.Name || `${guestData.firstName || guestData.first_name_c} ${guestData.lastName || guestData.last_name_c}`,
        first_name_c: guestData.first_name_c || guestData.firstName,
        last_name_c: guestData.last_name_c || guestData.lastName,
        email_c: guestData.email_c || guestData.email,
        phone_c: guestData.phone_c || guestData.phone,
        preferences_c: guestData.preferences_c || 
          (guestData.preferences ? JSON.stringify(guestData.preferences) : "{}"),
        vip_status_c: guestData.vip_status_c || guestData.vipStatus || false,
        Tags: guestData.Tags || ""
      }

      const response = await apperClient.createRecord('guest_c', {
        records: [createData]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records: ${JSON.stringify(failed)}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          const guest = successful[0].data
          const guestResult = {
            ...guest,
            firstName: guest.first_name_c,
            lastName: guest.last_name_c,
            email: guest.email_c,
            phone: guest.phone_c,
            vipStatus: guest.vip_status_c,
            preferences: guest.preferences_c ? 
              (typeof guest.preferences_c === 'string' ? 
                JSON.parse(guest.preferences_c) : guest.preferences_c) : {},
            stayHistory: []
          }

          // Send welcome email asynchronously (non-blocking)
          this.sendWelcomeEmail(guestResult).catch(error => {
            console.info(`apper_info: Welcome email failed for guest ${guestResult.Id}. Error: ${error.message}`)
          })

          return guestResult
        }
      }

      return null
    } catch (error) {
      console.error("Error creating guest:", error.message)
      toast.error("Failed to create guest")
      return null
    }
  },

  async sendWelcomeEmail(guestData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const result = await apperClient.functions.invoke(import.meta.env.VITE_SEND_WELCOME_EMAIL, {
        body: JSON.stringify({
          firstName: guestData.firstName,
          lastName: guestData.lastName,
          email: guestData.email
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!result.success) {
        console.info(`apper_info: Got an error in this function: ${import.meta.env.VITE_SEND_WELCOME_EMAIL}. The response body is: ${JSON.stringify(result)}.`)
      }

      return result
    } catch (error) {
      console.info(`apper_info: Got this error an this function: ${import.meta.env.VITE_SEND_WELCOME_EMAIL}. The error is: ${error.message}`)
      throw error
    }
  },

  async update(id, guestData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      // Only include updateable fields
      const updateData = {
        Id: id,
        ...(guestData.Name !== undefined && { Name: guestData.Name }),
        ...(guestData.firstName !== undefined && { first_name_c: guestData.firstName }),
        ...(guestData.first_name_c !== undefined && { first_name_c: guestData.first_name_c }),
        ...(guestData.lastName !== undefined && { last_name_c: guestData.lastName }),
        ...(guestData.last_name_c !== undefined && { last_name_c: guestData.last_name_c }),
        ...(guestData.email !== undefined && { email_c: guestData.email }),
        ...(guestData.email_c !== undefined && { email_c: guestData.email_c }),
        ...(guestData.phone !== undefined && { phone_c: guestData.phone }),
        ...(guestData.phone_c !== undefined && { phone_c: guestData.phone_c }),
        ...(guestData.preferences !== undefined && { 
          preferences_c: typeof guestData.preferences === 'object' ? 
            JSON.stringify(guestData.preferences) : guestData.preferences 
        }),
        ...(guestData.preferences_c !== undefined && { preferences_c: guestData.preferences_c }),
        ...(guestData.vipStatus !== undefined && { vip_status_c: guestData.vipStatus }),
        ...(guestData.vip_status_c !== undefined && { vip_status_c: guestData.vip_status_c }),
        ...(guestData.Tags !== undefined && { Tags: guestData.Tags })
      }

      const response = await apperClient.updateRecord('guest_c', {
        records: [updateData]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records: ${JSON.stringify(failed)}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          const guest = successful[0].data
          return {
            ...guest,
            firstName: guest.first_name_c,
            lastName: guest.last_name_c,
            email: guest.email_c,
            phone: guest.phone_c,
            vipStatus: guest.vip_status_c,
            preferences: guest.preferences_c ? 
              (typeof guest.preferences_c === 'string' ? 
                JSON.parse(guest.preferences_c) : guest.preferences_c) : {},
            stayHistory: []
          }
        }
      }

      return null
    } catch (error) {
      console.error("Error updating guest:", error.message)
      toast.error("Failed to update guest")
      return null
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const response = await apperClient.deleteRecord('guest_c', {
        RecordIds: [id]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records: ${JSON.stringify(failed)}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successful.length > 0
      }

      return true
    } catch (error) {
      console.error("Error deleting guest:", error.message)
      toast.error("Failed to delete guest")
      return false
    }
  }
}

export default guestsService