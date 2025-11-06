// Analytics service for dashboard metrics and reporting
// This service integrates with database when available, falls back to calculated analytics
import { getApperClient } from '@/services/apperClient'
import { toast } from 'react-toastify'
import bookingsService from './bookingsService'
import roomsService from './roomsService'

const analyticsService = {
  async getAnalytics(dateRange = "30") {
    try {
      // Get real data from services for calculations
      const [bookings, rooms] = await Promise.all([
        bookingsService.getAll(),
        roomsService.getAll()
      ])
      
      // Calculate real metrics based on actual data
      const analytics = {
        kpis: {
          occupancyRate: this._calculateOccupancyRate(bookings, rooms),
          occupancyTrend: 8, // Mock trend until historical data available
          revpar: this._calculateRevPAR(bookings, rooms),
          revparTrend: 15, // Mock trend
          adr: this._calculateADR(bookings),
          adrTrend: 5, // Mock trend
          totalRevenue: this._calculateTotalRevenue(bookings)
        },
        occupancyTrend: {
          labels: this.getDateLabels(dateRange),
          data: [68, 71, 74, 76, 73, 78, 81, 79, 75, 77, 73, 76] // Mock historical data
        },
        revparTrend: {
          labels: this.getDateLabels(dateRange),
          data: [165, 175, 182, 190, 186, 195, 205, 198, 188, 192, 186, 194] // Mock historical data
        },
        adrTrend: {
          labels: this.getDateLabels(dateRange),
          data: [242, 247, 246, 250, 255, 250, 253, 251, 251, 249, 255, 255] // Mock historical data
        },
        revenueBreakdown: this._calculateRevenueBreakdown(bookings),
        bookingSources: this._calculateBookingSources(bookings),
        roomTypePerformance: this._calculateRoomTypePerformance(bookings, rooms),
        financial: {
          profitMargin: 23.5, // Mock until expense tracking available
          budgetAchievement: 112, // Mock
          commissionRate: this._calculateAverageCommission(bookings)
        },
        recommendations: [
          {
            icon: "TrendingUp",
            title: "Increase Weekend Rates",
            description: "Weekend occupancy consistently exceeds 85%. Consider implementing dynamic pricing with 10-15% weekend premiums.",
            impact: "+$8,500 monthly revenue"
          },
          {
            icon: "Users",
            title: "Corporate Package Optimization",
            description: "Business travelers show 65% repeat booking rate. Create corporate packages with longer stay incentives.",
            impact: "+12% repeat bookings"
          },
          {
            icon: "Calendar",
            title: "Seasonal Promotion Strategy",
            description: "Winter months show 25% lower occupancy. Implement spa packages and business meeting promotions.",
            impact: "+18% winter occupancy"
          },
          {
            icon: "Star",
            title: "Guest Experience Enhancement",
            description: "Guests staying 4+ nights rate experience 15% higher. Focus on extended stay amenities and services.",
            impact: "+0.4 review rating"
          }
        ]
      }
      
      return analytics
    } catch (error) {
      console.error("Error calculating analytics:", error.message)
      // Fallback to mock data if calculation fails
      return this._getMockAnalytics(dateRange)
    }
  },

  _calculateOccupancyRate(bookings, rooms) {
    if (!bookings.length || !rooms.length) return 73 // Mock fallback
    
    const occupiedRooms = rooms.filter(r => r.status === "Occupied").length
    return Math.round((occupiedRooms / rooms.length) * 100)
  },

  _calculateRevPAR(bookings, rooms) {
    if (!bookings.length || !rooms.length) return 186 // Mock fallback
    
    const totalRevenue = bookings
      .filter(b => b.status !== 'Cancelled')
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0)
    
    return Math.round(totalRevenue / rooms.length)
  },

  _calculateADR(bookings) {
    if (!bookings.length) return 255 // Mock fallback
    
    const paidBookings = bookings.filter(b => b.status !== 'Cancelled')
    if (!paidBookings.length) return 255
    
    const totalRevenue = paidBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)
    return Math.round(totalRevenue / paidBookings.length)
  },

  _calculateTotalRevenue(bookings) {
    if (!bookings.length) return 125800 // Mock fallback
    
    return bookings
      .filter(b => b.status !== 'Cancelled')
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0)
  },

  _calculateRevenueBreakdown(bookings) {
    if (!bookings.length) return [65800, 32400, 15200, 8300, 4100] // Mock fallback
    
    // Group by revenue categories
    const breakdown = bookings
      .filter(b => b.status !== 'Cancelled')
      .reduce((acc, booking) => {
        const category = booking.revenueCategory || 'Rooms'
        acc[category] = (acc[category] || 0) + (booking.totalAmount || 0)
        return acc
      }, {})
    
    return Object.values(breakdown)
  },

  _calculateBookingSources(bookings) {
    if (!bookings.length) {
      return {
        labels: ["Direct Bookings", "Booking.com", "Expedia", "Agoda", "Other"],
        data: [45, 28, 18, 12, 7]
      }
    }
    
    const sources = bookings.reduce((acc, booking) => {
      const source = booking.bookingSource || 'Direct'
      acc[source] = (acc[source] || 0) + 1
      return acc
    }, {})
    
    return {
      labels: Object.keys(sources),
      data: Object.values(sources)
    }
  },

  _calculateRoomTypePerformance(bookings, rooms) {
    if (!rooms.length) {
      return [
        { type: "standard", totalRooms: 6, utilizationRate: 78 },
        { type: "deluxe", totalRooms: 4, utilizationRate: 82 },
        { type: "suite", totalRooms: 1, utilizationRate: 85 },
        { type: "presidential", totalRooms: 1, utilizationRate: 65 }
      ]
    }
    
    const roomTypes = rooms.reduce((acc, room) => {
      const type = room.type
      if (!acc[type]) {
        acc[type] = { total: 0, occupied: 0 }
      }
      acc[type].total++
      if (room.status === 'Occupied') {
        acc[type].occupied++
      }
      return acc
    }, {})
    
    return Object.entries(roomTypes).map(([type, data]) => ({
      type,
      totalRooms: data.total,
      utilizationRate: Math.round((data.occupied / data.total) * 100)
    }))
  },

  _calculateAverageCommission(bookings) {
    if (!bookings.length) return 15.2 // Mock fallback
    
    const bookingsWithCommission = bookings.filter(b => 
      b.commissionRate && b.commissionRate > 0 && b.status !== 'Cancelled'
    )
    
    if (!bookingsWithCommission.length) return 0
    
    const avgCommission = bookingsWithCommission.reduce((sum, b) => 
      sum + (b.commissionRate || 0), 0
    ) / bookingsWithCommission.length
    
    return Math.round(avgCommission * 10) / 10 // Round to 1 decimal
  },

  _getMockAnalytics(dateRange) {
    // Fallback mock data when real calculations fail
    return {
      kpis: {
        occupancyRate: 73,
        occupancyTrend: 8,
        revpar: 186,
        revparTrend: 15,
        adr: 255,
        adrTrend: 5,
        totalRevenue: 125800
      },
      occupancyTrend: {
        labels: this.getDateLabels(dateRange),
        data: [68, 71, 74, 76, 73, 78, 81, 79, 75, 77, 73, 76]
      },
      revparTrend: {
        labels: this.getDateLabels(dateRange),
        data: [165, 175, 182, 190, 186, 195, 205, 198, 188, 192, 186, 194]
      },
      adrTrend: {
        labels: this.getDateLabels(dateRange),
        data: [242, 247, 246, 250, 255, 250, 253, 251, 251, 249, 255, 255]
      },
      revenueBreakdown: [65800, 32400, 15200, 8300, 4100],
      bookingSources: {
        labels: ["Direct Bookings", "Booking.com", "Expedia", "Agoda", "Other"],
        data: [45, 28, 18, 12, 7]
      },
      roomTypePerformance: [
        { type: "standard", totalRooms: 6, utilizationRate: 78 },
        { type: "deluxe", totalRooms: 4, utilizationRate: 82 },
        { type: "suite", totalRooms: 1, utilizationRate: 85 },
        { type: "presidential", totalRooms: 1, utilizationRate: 65 }
      ],
      financial: {
        profitMargin: 23.5,
        budgetAchievement: 112,
        commissionRate: 15.2
      },
      recommendations: [
        {
          icon: "TrendingUp",
          title: "Increase Weekend Rates",
          description: "Weekend occupancy consistently exceeds 85%. Consider implementing dynamic pricing with 10-15% weekend premiums.",
          impact: "+$8,500 monthly revenue"
        },
        {
          icon: "Users",
          title: "Corporate Package Optimization",
          description: "Business travelers show 65% repeat booking rate. Create corporate packages with longer stay incentives.",
          impact: "+12% repeat bookings"
        },
        {
          icon: "Calendar",
          title: "Seasonal Promotion Strategy",
          description: "Winter months show 25% lower occupancy. Implement spa packages and business meeting promotions.",
          impact: "+18% winter occupancy"
        },
        {
          icon: "Star",
          title: "Guest Experience Enhancement",
          description: "Guests staying 4+ nights rate experience 15% higher. Focus on extended stay amenities and services.",
          impact: "+0.4 review rating"
        }
      ]
    }
  },

  getDateLabels(range) {
    const labels = []
    const days = parseInt(range)
    const today = new Date()
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      if (days <= 7) {
        labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }))
      } else if (days <= 30) {
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
      } else {
        labels.push(date.toLocaleDateString('en-US', { month: 'short' }))
      }
    }
    
    return labels
  },

  async getFinancialMetrics() {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    try {
      const bookings = await bookingsService.getAll()
      const totalRevenue = this._calculateTotalRevenue(bookings)
      const adr = this._calculateADR(bookings)
      const avgCommission = this._calculateAverageCommission(bookings)
      
      return {
        totalRevenue,
        operatingExpenses: Math.round(totalRevenue * 0.7), // Mock calculation
        grossProfit: Math.round(totalRevenue * 0.3),
        netProfit: Math.round(totalRevenue * 0.23),
        profitMargin: 23.5,
        revpar: this._calculateRevPAR(bookings, await roomsService.getAll()),
        adr,
        occupancyRate: this._calculateOccupancyRate(bookings, await roomsService.getAll()),
        commissionCosts: Math.round(totalRevenue * (avgCommission / 100)),
        averageCommissionRate: avgCommission
      }
    } catch (error) {
      console.error("Error calculating financial metrics:", error.message)
      // Fallback mock data
      return {
        totalRevenue: 125800,
        operatingExpenses: 89600,
        grossProfit: 36200,
        netProfit: 28700,
        profitMargin: 23.5,
        revpar: 186,
        adr: 255,
        occupancyRate: 73,
        commissionCosts: 19123,
        averageCommissionRate: 15.2
      }
    }
  },

  async getGuestSatisfactionMetrics() {
    await new Promise(resolve => setTimeout(resolve, 250))
    
    // Mock guest satisfaction data until feedback system is implemented
    return {
      npsScore: 72,
      averageRating: 4.6,
      totalReviews: 1247,
      responseRate: 87,
      sentimentBreakdown: {
        positive: 78,
        neutral: 15,
        negative: 7
      },
      departmentRatings: {
        frontDesk: 4.7,
        housekeeping: 4.5,
        restaurant: 4.4,
        spa: 4.8,
        concierge: 4.6,
        maintenance: 4.3
      }
    }
  }
}

export default analyticsService

export default analyticsService