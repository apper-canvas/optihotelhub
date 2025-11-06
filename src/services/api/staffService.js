import { getApperClient } from '@/services/apperClient'
import { toast } from 'react-toastify'

const staffService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const response = await apperClient.fetchRecords('staff_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data?.map(staff => ({
        ...staff,
        // Map database fields to legacy field names for UI compatibility
        name: staff.name_c || staff.Name,
        email: staff.email_c,
        role: staff.role_c,
        // Mock data for features not in database yet
        schedule: this._getMockSchedule(staff.role_c),
        activeTasks: this._getMockActiveTasks(staff.role_c)
      })) || []
    } catch (error) {
      console.error("Error fetching staff:", error.message)
      toast.error("Failed to load staff")
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const response = await apperClient.getRecordById('staff_c', id, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      const staff = response.data
      return {
        ...staff,
        // Map database fields to legacy field names
        name: staff.name_c || staff.Name,
        email: staff.email_c,
        role: staff.role_c,
        // Mock data for features not in database yet
        schedule: this._getMockSchedule(staff.role_c),
        activeTasks: this._getMockActiveTasks(staff.role_c)
      }
    } catch (error) {
      console.error(`Error fetching staff member ${id}:`, error.message)
      toast.error("Failed to load staff member")
      return null
    }
  },

  async create(memberData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      // Only include updateable fields
      const createData = {
        Name: memberData.Name || memberData.name,
        name_c: memberData.name_c || memberData.name,
        email_c: memberData.email_c || memberData.email,
        role_c: memberData.role_c || memberData.role,
        Tags: memberData.Tags || ""
      }

      const response = await apperClient.createRecord('staff_c', {
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
          const staff = successful[0].data
          return {
            ...staff,
            name: staff.name_c || staff.Name,
            email: staff.email_c,
            role: staff.role_c,
            schedule: this._getMockSchedule(staff.role_c),
            activeTasks: this._getMockActiveTasks(staff.role_c)
          }
        }
      }

      return null
    } catch (error) {
      console.error("Error creating staff member:", error.message)
      toast.error("Failed to create staff member")
      return null
    }
  },

  async update(id, memberData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      // Only include updateable fields
      const updateData = {
        Id: id,
        ...(memberData.Name !== undefined && { Name: memberData.Name }),
        ...(memberData.name !== undefined && { name_c: memberData.name }),
        ...(memberData.name_c !== undefined && { name_c: memberData.name_c }),
        ...(memberData.email !== undefined && { email_c: memberData.email }),
        ...(memberData.email_c !== undefined && { email_c: memberData.email_c }),
        ...(memberData.role !== undefined && { role_c: memberData.role }),
        ...(memberData.role_c !== undefined && { role_c: memberData.role_c }),
        ...(memberData.Tags !== undefined && { Tags: memberData.Tags })
      }

      const response = await apperClient.updateRecord('staff_c', {
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
          const staff = successful[0].data
          return {
            ...staff,
            name: staff.name_c || staff.Name,
            email: staff.email_c,
            role: staff.role_c,
            schedule: this._getMockSchedule(staff.role_c),
            activeTasks: this._getMockActiveTasks(staff.role_c)
          }
        }
      }

      return null
    } catch (error) {
      console.error("Error updating staff member:", error.message)
      toast.error("Failed to update staff member")
      return null
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const response = await apperClient.deleteRecord('staff_c', {
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
      console.error("Error deleting staff member:", error.message)
      toast.error("Failed to delete staff member")
      return false
    }
  },

  // Helper methods for mock data until database is expanded
  _getMockSchedule(role) {
    const schedules = {
      housekeeping: [
        {"day": "Monday", "hours": "6:00 AM - 2:00 PM"},
        {"day": "Tuesday", "hours": "6:00 AM - 2:00 PM"},
        {"day": "Wednesday", "hours": "6:00 AM - 2:00 PM"},
        {"day": "Thursday", "hours": "6:00 AM - 2:00 PM"},
        {"day": "Friday", "hours": "6:00 AM - 2:00 PM"}
      ],
      maintenance: [
        {"day": "Monday", "hours": "8:00 AM - 4:00 PM"},
        {"day": "Tuesday", "hours": "8:00 AM - 4:00 PM"},
        {"day": "Wednesday", "hours": "8:00 AM - 4:00 PM"},
        {"day": "Thursday", "hours": "8:00 AM - 4:00 PM"},
        {"day": "Friday", "hours": "8:00 AM - 4:00 PM"}
      ],
      "front desk": [
        {"day": "Monday", "hours": "7:00 AM - 3:00 PM"},
        {"day": "Tuesday", "hours": "7:00 AM - 3:00 PM"},
        {"day": "Wednesday", "hours": "7:00 AM - 3:00 PM"},
        {"day": "Saturday", "hours": "7:00 AM - 3:00 PM"},
        {"day": "Sunday", "hours": "7:00 AM - 3:00 PM"}
      ],
      manager: [
        {"day": "Monday", "hours": "8:00 AM - 6:00 PM"},
        {"day": "Tuesday", "hours": "8:00 AM - 6:00 PM"},
        {"day": "Wednesday", "hours": "8:00 AM - 6:00 PM"},
        {"day": "Thursday", "hours": "8:00 AM - 6:00 PM"},
        {"day": "Friday", "hours": "8:00 AM - 6:00 PM"}
      ]
    }
    return schedules[role] || []
  },

  _getMockActiveTasks(role) {
    const tasks = {
      housekeeping: [
        {"room": "101", "type": "Cleaning", "priority": "High"},
        {"room": "103", "type": "Cleaning", "priority": "Medium"}
      ],
      maintenance: [
        {"room": "202", "type": "Maintenance", "priority": "High"},
        {"room": "301", "type": "Maintenance", "priority": "Medium"}
      ],
      "front desk": [
        {"room": "Lobby", "type": "Guest Services", "priority": "Medium"},
        {"room": "Reception", "type": "Check-in Processing", "priority": "High"}
      ],
      manager: [
        {"room": "Office", "type": "Staff Meeting", "priority": "High"},
        {"room": "Administration", "type": "Report Review", "priority": "Medium"}
      ]
    }
    return tasks[role] || []
  }
}

export default staffService