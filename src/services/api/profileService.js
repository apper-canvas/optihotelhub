import { getApperClient } from '@/services/apperClient'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'

const profileService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const response = await apperClient.fetchRecords('profile_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "avatar_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "emergency_contact_c"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "join_date_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "Tags"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data?.map(profile => ({
        ...profile,
        // Map database fields to legacy field names for UI compatibility
        firstName: profile.first_name_c,
        lastName: profile.last_name_c,
        email: profile.email_c,
        phone: profile.phone_c,
        role: profile.role_c,
        department: profile.department_c,
        joinDate: profile.join_date_c,
        address: profile.address_c,
        emergencyContact: profile.emergency_contact_c,
        avatar: profile.avatar_c,
        status: profile.status_c,
        // Add computed permissions
        permissions: this._getPermissionsByRole(profile.role_c)
      })) || []
    } catch (error) {
      console.error("Error fetching profiles:", error.message)
      toast.error("Failed to load profiles")
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const response = await apperClient.getRecordById('profile_c', id, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "avatar_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "emergency_contact_c"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "join_date_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "Tags"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      const profile = response.data
      return {
        ...profile,
        firstName: profile.first_name_c,
        lastName: profile.last_name_c,
        email: profile.email_c,
        phone: profile.phone_c,
        role: profile.role_c,
        department: profile.department_c,
        joinDate: profile.join_date_c,
        address: profile.address_c,
        emergencyContact: profile.emergency_contact_c,
        avatar: profile.avatar_c,
        status: profile.status_c,
        permissions: this._getPermissionsByRole(profile.role_c)
      }
    } catch (error) {
      console.error(`Error fetching profile ${id}:`, error.message)
      toast.error("Failed to load profile")
      return null
    }
  },

  async getCurrentProfile() {
    // In real implementation, would get from Redux user state or user context
    // For now, return first profile as mock current user
    try {
      const profiles = await this.getAll()
      return profiles.length > 0 ? profiles[0] : null
    } catch (error) {
      console.error("Error fetching current profile:", error.message)
      return null
    }
  },

  async getByRole(role) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const response = await apperClient.fetchRecords('profile_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "avatar_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "emergency_contact_c"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "join_date_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "Tags"}}
        ],
        where: [{
          FieldName: "role_c",
          Operator: "EqualTo",
          Values: [role]
        }]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data?.map(profile => ({
        ...profile,
        firstName: profile.first_name_c,
        lastName: profile.last_name_c,
        email: profile.email_c,
        phone: profile.phone_c,
        role: profile.role_c,
        department: profile.department_c,
        joinDate: profile.join_date_c,
        address: profile.address_c,
        emergencyContact: profile.emergency_contact_c,
        avatar: profile.avatar_c,
        status: profile.status_c,
        permissions: this._getPermissionsByRole(profile.role_c)
      })) || []
    } catch (error) {
      console.error(`Error fetching profiles by role ${role}:`, error.message)
      toast.error("Failed to load profiles")
      return []
    }
  },

  async create(profileData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      // Only include updateable fields
      const createData = {
        Name: profileData.Name || `${profileData.firstName || profileData.first_name_c} ${profileData.lastName || profileData.last_name_c}`,
        first_name_c: profileData.first_name_c || profileData.firstName,
        last_name_c: profileData.last_name_c || profileData.lastName,
        email_c: profileData.email_c || profileData.email,
        phone_c: profileData.phone_c || profileData.phone,
        role_c: profileData.role_c || profileData.role,
        department_c: profileData.department_c || profileData.department,
        join_date_c: profileData.join_date_c || profileData.joinDate || new Date().toISOString(),
        address_c: profileData.address_c || profileData.address,
        emergency_contact_c: profileData.emergency_contact_c || profileData.emergencyContact,
        avatar_c: profileData.avatar_c || profileData.avatar,
        status_c: profileData.status_c || profileData.status || "Active",
        Tags: profileData.Tags || ""
      }

      const response = await apperClient.createRecord('profile_c', {
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
          const profile = successful[0].data
          return {
            ...profile,
            firstName: profile.first_name_c,
            lastName: profile.last_name_c,
            email: profile.email_c,
            phone: profile.phone_c,
            role: profile.role_c,
            department: profile.department_c,
            joinDate: profile.join_date_c,
            address: profile.address_c,
            emergencyContact: profile.emergency_contact_c,
            avatar: profile.avatar_c,
            status: profile.status_c,
            permissions: this._getPermissionsByRole(profile.role_c)
          }
        }
      }

      return null
    } catch (error) {
      console.error("Error creating profile:", error.message)
      toast.error("Failed to create profile")
      return null
    }
  },

  async update(id, profileData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      // Only include updateable fields
      const updateData = {
        Id: id,
        ...(profileData.Name !== undefined && { Name: profileData.Name }),
        ...(profileData.firstName !== undefined && { first_name_c: profileData.firstName }),
        ...(profileData.first_name_c !== undefined && { first_name_c: profileData.first_name_c }),
        ...(profileData.lastName !== undefined && { last_name_c: profileData.lastName }),
        ...(profileData.last_name_c !== undefined && { last_name_c: profileData.last_name_c }),
        ...(profileData.email !== undefined && { email_c: profileData.email }),
        ...(profileData.email_c !== undefined && { email_c: profileData.email_c }),
        ...(profileData.phone !== undefined && { phone_c: profileData.phone }),
        ...(profileData.phone_c !== undefined && { phone_c: profileData.phone_c }),
        ...(profileData.role !== undefined && { role_c: profileData.role }),
        ...(profileData.role_c !== undefined && { role_c: profileData.role_c }),
        ...(profileData.department !== undefined && { department_c: profileData.department }),
        ...(profileData.department_c !== undefined && { department_c: profileData.department_c }),
        ...(profileData.joinDate !== undefined && { join_date_c: profileData.joinDate }),
        ...(profileData.join_date_c !== undefined && { join_date_c: profileData.join_date_c }),
        ...(profileData.address !== undefined && { address_c: profileData.address }),
        ...(profileData.address_c !== undefined && { address_c: profileData.address_c }),
        ...(profileData.emergencyContact !== undefined && { emergency_contact_c: profileData.emergencyContact }),
        ...(profileData.emergency_contact_c !== undefined && { emergency_contact_c: profileData.emergency_contact_c }),
        ...(profileData.avatar !== undefined && { avatar_c: profileData.avatar }),
        ...(profileData.avatar_c !== undefined && { avatar_c: profileData.avatar_c }),
        ...(profileData.status !== undefined && { status_c: profileData.status }),
        ...(profileData.status_c !== undefined && { status_c: profileData.status_c }),
        ...(profileData.Tags !== undefined && { Tags: profileData.Tags })
      }

      const response = await apperClient.updateRecord('profile_c', {
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
          const profile = successful[0].data
          return {
            ...profile,
            firstName: profile.first_name_c,
            lastName: profile.last_name_c,
            email: profile.email_c,
            phone: profile.phone_c,
            role: profile.role_c,
            department: profile.department_c,
            joinDate: profile.join_date_c,
            address: profile.address_c,
            emergencyContact: profile.emergency_contact_c,
            avatar: profile.avatar_c,
            status: profile.status_c,
            permissions: this._getPermissionsByRole(profile.role_c)
          }
        }
      }

      return null
    } catch (error) {
      console.error("Error updating profile:", error.message)
      toast.error("Failed to update profile")
      return null
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not available')
      }

      const response = await apperClient.deleteRecord('profile_c', {
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
      console.error("Error deleting profile:", error.message)
      toast.error("Failed to delete profile")
      return false
    }
  },

  async updatePassword(id, oldPassword, newPassword) {
    // Mock implementation - password management would typically be handled by authentication service
    await new Promise(resolve => setTimeout(resolve, 400))
    return true
  },

  _getPermissionsByRole(role) {
    const rolePermissions = {
      ADMIN: ["manage_users", "manage_bookings", "manage_rooms", "view_reports", "manage_billing", "system_admin"],
      MANAGER: ["manage_bookings", "manage_rooms", "view_reports", "manage_staff"],
      RECEPTION: ["manage_bookings", "view_guests", "basic_reports"],
      STAFF: ["view_tasks", "update_room_status", "update_maintenance_status"],
      GUEST: ["view_bookings", "manage_profile"]
    }
    return rolePermissions[role] || []
  },

  getRoleHierarchy() {
    return ["GUEST", "STAFF", "RECEPTION", "MANAGER", "ADMIN"]
  },

  getRolePermissions(role) {
    return this._getPermissionsByRole(role)
  }
}

export default profileService

export default profileService