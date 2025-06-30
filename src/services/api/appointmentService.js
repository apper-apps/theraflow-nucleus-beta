import appointmentsData from '@/services/mockData/appointments.json'

class AppointmentService {
  constructor() {
    this.appointments = [...appointmentsData]
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }

  async getAll() {
    await this.delay()
    return [...this.appointments]
  }

  async getById(id) {
    await this.delay()
    return this.appointments.find(appointment => appointment.Id === id) || null
  }

  async create(appointmentData) {
    await this.delay()
    const maxId = Math.max(...this.appointments.map(a => a.Id), 0)
    const newAppointment = {
      ...appointmentData,
      Id: maxId + 1,
      reminderSent: false
    }
    this.appointments.push(newAppointment)
    return { ...newAppointment }
  }

  async update(id, appointmentData) {
    await this.delay()
    const index = this.appointments.findIndex(appointment => appointment.Id === id)
    if (index === -1) throw new Error('Appointment not found')
    
    this.appointments[index] = { ...this.appointments[index], ...appointmentData }
    return { ...this.appointments[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.appointments.findIndex(appointment => appointment.Id === id)
    if (index === -1) throw new Error('Appointment not found')
    
    this.appointments.splice(index, 1)
    return true
  }
}

export const appointmentService = new AppointmentService()