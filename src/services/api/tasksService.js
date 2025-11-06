import { getApperClient } from '@/services/apperClient'
import { toast } from 'react-toastify'

const tasksService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const response = await apperClient.fetchRecords('task_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "assigned_to_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "room_id_c"}},
          {"field": {"Name": "room_number_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "Tags"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching tasks:", error.message)
      toast.error("Failed to load tasks")
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const response = await apperClient.getRecordById('task_c', id, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "assigned_to_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "room_id_c"}},
          {"field": {"Name": "room_number_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "Tags"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error.message)
      toast.error("Failed to load task")
      return null
    }
  },

  async create(taskData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      // Only include updateable fields
      const createData = {
        Name: taskData.Name || taskData.name,
        assigned_to_c: taskData.assigned_to_c || taskData.assignedTo,
        description_c: taskData.description_c || taskData.description,
        priority_c: taskData.priority_c || taskData.priority,
        room_id_c: taskData.room_id_c || taskData.roomId,
        room_number_c: taskData.room_number_c || taskData.roomNumber,
        status_c: taskData.status_c || taskData.status || "Open",
        type_c: taskData.type_c || taskData.type,
        Tags: taskData.Tags || ""
      }

      const response = await apperClient.createRecord('task_c', {
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
          return successful[0].data
        }
      }

      return null
    } catch (error) {
      console.error("Error creating task:", error.message)
      toast.error("Failed to create task")
      return null
    }
  },

  async update(id, taskData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      // Only include updateable fields
      const updateData = {
        Id: id,
        ...(taskData.Name !== undefined && { Name: taskData.Name }),
        ...(taskData.assigned_to_c !== undefined && { assigned_to_c: taskData.assigned_to_c }),
        ...(taskData.assignedTo !== undefined && { assigned_to_c: taskData.assignedTo }),
        ...(taskData.completed_at_c !== undefined && { completed_at_c: taskData.completed_at_c }),
        ...(taskData.completedAt !== undefined && { completed_at_c: taskData.completedAt }),
        ...(taskData.description_c !== undefined && { description_c: taskData.description_c }),
        ...(taskData.description !== undefined && { description_c: taskData.description }),
        ...(taskData.priority_c !== undefined && { priority_c: taskData.priority_c }),
        ...(taskData.priority !== undefined && { priority_c: taskData.priority }),
        ...(taskData.room_id_c !== undefined && { room_id_c: taskData.room_id_c }),
        ...(taskData.roomId !== undefined && { room_id_c: taskData.roomId }),
        ...(taskData.room_number_c !== undefined && { room_number_c: taskData.room_number_c }),
        ...(taskData.roomNumber !== undefined && { room_number_c: taskData.roomNumber }),
        ...(taskData.status_c !== undefined && { status_c: taskData.status_c }),
        ...(taskData.status !== undefined && { status_c: taskData.status }),
        ...(taskData.type_c !== undefined && { type_c: taskData.type_c }),
        ...(taskData.type !== undefined && { type_c: taskData.type }),
        ...(taskData.Tags !== undefined && { Tags: taskData.Tags })
      }

      const response = await apperClient.updateRecord('task_c', {
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
          return successful[0].data
        }
      }

      return null
    } catch (error) {
      console.error("Error updating task:", error.message)
      toast.error("Failed to update task")
      return null
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const response = await apperClient.deleteRecord('task_c', {
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
      console.error("Error deleting task:", error.message)
      toast.error("Failed to delete task")
      return false
    }
  }
}

export default tasksService