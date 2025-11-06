import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

const bookingsService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const response = await apperClient.fetchRecords('booking_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "booking_source_c"}},
          {"field": {"Name": "check_in_c"}},
          {"field": {"Name": "check_out_c"}},
          {"field": {"Name": "commission_rate_c"}},
          {"field": {"Name": "guest_id_c"}},
          {"field": {"Name": "guest_name_c"}},
          {"field": {"Name": "payment_method_c"}},
          {"field": {"Name": "revenue_category_c"}},
          {"field": {"Name": "room_id_c"}},
          {"field": {"Name": "room_number_c"}},
          {"field": {"Name": "special_requests_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data?.map(booking => ({
        ...booking,
        // Map database fields to legacy field names for UI compatibility
        guestId: booking.guest_id_c,
        guestName: booking.guest_name_c,
        roomId: booking.room_id_c,
        roomNumber: booking.room_number_c,
        checkIn: booking.check_in_c,
        checkOut: booking.check_out_c,
        totalAmount: booking.total_amount_c,
        status: booking.status_c,
        specialRequests: booking.special_requests_c,
        bookingSource: booking.booking_source_c,
        commissionRate: booking.commission_rate_c,
        revenueCategory: booking.revenue_category_c,
        paymentMethod: booking.payment_method_c,
        createdAt: booking.CreatedOn
      })) || []
    } catch (error) {
      console.error("Error fetching bookings:", error.message)
      toast.error("Failed to load bookings")
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const response = await apperClient.getRecordById('booking_c', id, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "booking_source_c"}},
          {"field": {"Name": "check_in_c"}},
          {"field": {"Name": "check_out_c"}},
          {"field": {"Name": "commission_rate_c"}},
          {"field": {"Name": "guest_id_c"}},
          {"field": {"Name": "guest_name_c"}},
          {"field": {"Name": "payment_method_c"}},
          {"field": {"Name": "revenue_category_c"}},
          {"field": {"Name": "room_id_c"}},
          {"field": {"Name": "room_number_c"}},
          {"field": {"Name": "special_requests_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      const booking = response.data
      return {
        ...booking,
        guestId: booking.guest_id_c,
        guestName: booking.guest_name_c,
        roomId: booking.room_id_c,
        roomNumber: booking.room_number_c,
        checkIn: booking.check_in_c,
        checkOut: booking.check_out_c,
        totalAmount: booking.total_amount_c,
        status: booking.status_c,
        specialRequests: booking.special_requests_c,
        bookingSource: booking.booking_source_c,
        commissionRate: booking.commission_rate_c,
        revenueCategory: booking.revenue_category_c,
        paymentMethod: booking.payment_method_c,
        createdAt: booking.CreatedOn
      }
    } catch (error) {
      console.error(`Error fetching booking ${id}:`, error.message)
      toast.error("Failed to load booking")
      return null
    }
  },

  async create(bookingData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      // Only include updateable fields
      const createData = {
        Name: bookingData.Name || `Booking - ${bookingData.guestName || bookingData.guest_name_c}`,
        booking_source_c: bookingData.booking_source_c || bookingData.bookingSource || "Direct",
        check_in_c: bookingData.check_in_c || bookingData.checkIn,
        check_out_c: bookingData.check_out_c || bookingData.checkOut,
        commission_rate_c: bookingData.commission_rate_c || bookingData.commissionRate || 0,
        guest_id_c: bookingData.guest_id_c || bookingData.guestId,
        guest_name_c: bookingData.guest_name_c || bookingData.guestName,
        payment_method_c: bookingData.payment_method_c || bookingData.paymentMethod,
        revenue_category_c: bookingData.revenue_category_c || bookingData.revenueCategory || "Rooms",
        room_id_c: bookingData.room_id_c || bookingData.roomId,
        room_number_c: bookingData.room_number_c || bookingData.roomNumber,
        special_requests_c: bookingData.special_requests_c || bookingData.specialRequests || "",
        status_c: bookingData.status_c || bookingData.status || "Pending",
        total_amount_c: bookingData.total_amount_c || bookingData.totalAmount,
        Tags: bookingData.Tags || ""
      }

      const response = await apperClient.createRecord('booking_c', {
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
          const booking = successful[0].data
          return {
            ...booking,
            guestId: booking.guest_id_c,
            guestName: booking.guest_name_c,
            roomId: booking.room_id_c,
            roomNumber: booking.room_number_c,
            checkIn: booking.check_in_c,
            checkOut: booking.check_out_c,
            totalAmount: booking.total_amount_c,
            status: booking.status_c,
            specialRequests: booking.special_requests_c,
            bookingSource: booking.booking_source_c,
            commissionRate: booking.commission_rate_c,
            revenueCategory: booking.revenue_category_c,
            paymentMethod: booking.payment_method_c,
            createdAt: booking.CreatedOn
          }
        }
      }

      return null
    } catch (error) {
      console.error("Error creating booking:", error.message)
      toast.error("Failed to create booking")
      return null
    }
  },

  async update(id, bookingData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      // Only include updateable fields
      const updateData = {
        Id: id,
        ...(bookingData.Name !== undefined && { Name: bookingData.Name }),
        ...(bookingData.bookingSource !== undefined && { booking_source_c: bookingData.bookingSource }),
        ...(bookingData.booking_source_c !== undefined && { booking_source_c: bookingData.booking_source_c }),
        ...(bookingData.checkIn !== undefined && { check_in_c: bookingData.checkIn }),
        ...(bookingData.check_in_c !== undefined && { check_in_c: bookingData.check_in_c }),
        ...(bookingData.checkOut !== undefined && { check_out_c: bookingData.checkOut }),
        ...(bookingData.check_out_c !== undefined && { check_out_c: bookingData.check_out_c }),
        ...(bookingData.commissionRate !== undefined && { commission_rate_c: bookingData.commissionRate }),
        ...(bookingData.commission_rate_c !== undefined && { commission_rate_c: bookingData.commission_rate_c }),
        ...(bookingData.guestId !== undefined && { guest_id_c: bookingData.guestId }),
        ...(bookingData.guest_id_c !== undefined && { guest_id_c: bookingData.guest_id_c }),
        ...(bookingData.guestName !== undefined && { guest_name_c: bookingData.guestName }),
        ...(bookingData.guest_name_c !== undefined && { guest_name_c: bookingData.guest_name_c }),
        ...(bookingData.paymentMethod !== undefined && { payment_method_c: bookingData.paymentMethod }),
        ...(bookingData.payment_method_c !== undefined && { payment_method_c: bookingData.payment_method_c }),
        ...(bookingData.revenueCategory !== undefined && { revenue_category_c: bookingData.revenueCategory }),
        ...(bookingData.revenue_category_c !== undefined && { revenue_category_c: bookingData.revenue_category_c }),
        ...(bookingData.roomId !== undefined && { room_id_c: bookingData.roomId }),
        ...(bookingData.room_id_c !== undefined && { room_id_c: bookingData.room_id_c }),
        ...(bookingData.roomNumber !== undefined && { room_number_c: bookingData.roomNumber }),
        ...(bookingData.room_number_c !== undefined && { room_number_c: bookingData.room_number_c }),
        ...(bookingData.specialRequests !== undefined && { special_requests_c: bookingData.specialRequests }),
        ...(bookingData.special_requests_c !== undefined && { special_requests_c: bookingData.special_requests_c }),
        ...(bookingData.status !== undefined && { status_c: bookingData.status }),
        ...(bookingData.status_c !== undefined && { status_c: bookingData.status_c }),
        ...(bookingData.totalAmount !== undefined && { total_amount_c: bookingData.totalAmount }),
        ...(bookingData.total_amount_c !== undefined && { total_amount_c: bookingData.total_amount_c }),
        ...(bookingData.Tags !== undefined && { Tags: bookingData.Tags })
      }

      const response = await apperClient.updateRecord('booking_c', {
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
          const booking = successful[0].data
          return {
            ...booking,
            guestId: booking.guest_id_c,
            guestName: booking.guest_name_c,
            roomId: booking.room_id_c,
            roomNumber: booking.room_number_c,
            checkIn: booking.check_in_c,
            checkOut: booking.check_out_c,
            totalAmount: booking.total_amount_c,
            status: booking.status_c,
            specialRequests: booking.special_requests_c,
            bookingSource: booking.booking_source_c,
            commissionRate: booking.commission_rate_c,
            revenueCategory: booking.revenue_category_c,
            paymentMethod: booking.payment_method_c,
            createdAt: booking.CreatedOn
          }
        }
      }

      return null
    } catch (error) {
      console.error("Error updating booking:", error.message)
      toast.error("Failed to update booking")
      return null
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const response = await apperClient.deleteRecord('booking_c', {
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
      console.error("Error deleting booking:", error.message)
      toast.error("Failed to delete booking")
      return false
    }
  }
}

export default bookingsService