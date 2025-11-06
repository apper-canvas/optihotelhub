import { getApperClient } from '@/services/apperClient'
import { toast } from 'react-toastify'

const roomsService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const response = await apperClient.fetchRecords('room_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "capacity_c"}},
          {"field": {"Name": "number_c"}},
          {"field": {"Name": "price_per_night_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data?.map(room => ({
        ...room,
        // Map database fields to legacy field names for UI compatibility
        number: room.number_c,
        type: room.type_c,
        capacity: room.capacity_c,
        status: room.status_c,
        pricePerNight: room.price_per_night_c,
        // Mock data for features not in database yet
        amenities: this._getMockAmenities(room.type_c),
        photos: this._getMockPhotos(room.number_c)
      })) || []
    } catch (error) {
      console.error("Error fetching rooms:", error.message)
      toast.error("Failed to load rooms")
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const response = await apperClient.getRecordById('room_c', id, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "capacity_c"}},
          {"field": {"Name": "number_c"}},
          {"field": {"Name": "price_per_night_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      const room = response.data
      return {
        ...room,
        number: room.number_c,
        type: room.type_c,
        capacity: room.capacity_c,
        status: room.status_c,
        pricePerNight: room.price_per_night_c,
        amenities: this._getMockAmenities(room.type_c),
        photos: this._getMockPhotos(room.number_c)
      }
    } catch (error) {
      console.error(`Error fetching room ${id}:`, error.message)
      toast.error("Failed to load room")
      return null
    }
  },

  async create(roomData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      // Only include updateable fields
      const createData = {
        Name: roomData.Name || `Room ${roomData.number_c || roomData.number}`,
        capacity_c: roomData.capacity_c || roomData.capacity,
        number_c: roomData.number_c || roomData.number,
        price_per_night_c: roomData.price_per_night_c || roomData.pricePerNight,
        status_c: roomData.status_c || roomData.status || "Available",
        type_c: roomData.type_c || roomData.type,
        Tags: roomData.Tags || ""
      }

      const response = await apperClient.createRecord('room_c', {
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
          const room = successful[0].data
          return {
            ...room,
            number: room.number_c,
            type: room.type_c,
            capacity: room.capacity_c,
            status: room.status_c,
            pricePerNight: room.price_per_night_c,
            amenities: this._getMockAmenities(room.type_c),
            photos: this._getMockPhotos(room.number_c)
          }
        }
      }

      return null
    } catch (error) {
      console.error("Error creating room:", error.message)
      toast.error("Failed to create room")
      return null
    }
  },

  async update(id, roomData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      // Only include updateable fields
      const updateData = {
        Id: id,
        ...(roomData.Name !== undefined && { Name: roomData.Name }),
        ...(roomData.capacity !== undefined && { capacity_c: roomData.capacity }),
        ...(roomData.capacity_c !== undefined && { capacity_c: roomData.capacity_c }),
        ...(roomData.number !== undefined && { number_c: roomData.number }),
        ...(roomData.number_c !== undefined && { number_c: roomData.number_c }),
        ...(roomData.pricePerNight !== undefined && { price_per_night_c: roomData.pricePerNight }),
        ...(roomData.price_per_night_c !== undefined && { price_per_night_c: roomData.price_per_night_c }),
        ...(roomData.status !== undefined && { status_c: roomData.status }),
        ...(roomData.status_c !== undefined && { status_c: roomData.status_c }),
        ...(roomData.type !== undefined && { type_c: roomData.type }),
        ...(roomData.type_c !== undefined && { type_c: roomData.type_c }),
        ...(roomData.Tags !== undefined && { Tags: roomData.Tags })
      }

      const response = await apperClient.updateRecord('room_c', {
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
          const room = successful[0].data
          return {
            ...room,
            number: room.number_c,
            type: room.type_c,
            capacity: room.capacity_c,
            status: room.status_c,
            pricePerNight: room.price_per_night_c,
            amenities: this._getMockAmenities(room.type_c),
            photos: this._getMockPhotos(room.number_c)
          }
        }
      }

      return null
    } catch (error) {
      console.error("Error updating room:", error.message)
      toast.error("Failed to update room")
      return null
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const response = await apperClient.deleteRecord('room_c', {
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
      console.error("Error deleting room:", error.message)
      toast.error("Failed to delete room")
      return false
    }
  },

  // Helper methods for mock data until database is expanded
  _getMockAmenities(roomType) {
    const amenitiesByType = {
      standard: ["Wi-Fi", "TV", "Air Conditioning", "Mini Bar"],
      deluxe: ["Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Balcony", "Ocean View"],
      suite: ["Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Balcony", "Ocean View", "Jacuzzi", "Living Room"],
      presidential: ["Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Balcony", "Ocean View", "Jacuzzi", "Living Room", "Kitchenette", "Dining Room", "Office"]
    }
    return amenitiesByType[roomType] || ["Wi-Fi", "TV", "Air Conditioning"]
  },

  _getMockPhotos(roomNumber) {
    // Generate mock photo URLs based on room number
    return [`room${roomNumber}-1.jpg`, `room${roomNumber}-2.jpg`]
  }
}

export default roomsService