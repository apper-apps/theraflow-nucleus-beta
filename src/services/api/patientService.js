import patientsData from '@/services/mockData/patients.json'

class PatientService {
  constructor() {
    this.patients = [...patientsData]
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }

  async getAll() {
    await this.delay()
    return [...this.patients]
  }

  async getById(id) {
    await this.delay()
    return this.patients.find(patient => patient.Id === id) || null
  }

  async create(patientData) {
    await this.delay()
    const maxId = Math.max(...this.patients.map(p => p.Id), 0)
    const newPatient = {
      ...patientData,
      Id: maxId + 1,
      createdAt: new Date().toISOString()
    }
    this.patients.push(newPatient)
    return { ...newPatient }
  }

  async update(id, patientData) {
    await this.delay()
    const index = this.patients.findIndex(patient => patient.Id === id)
    if (index === -1) throw new Error('Patient not found')
    
    this.patients[index] = { ...this.patients[index], ...patientData }
    return { ...this.patients[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.patients.findIndex(patient => patient.Id === id)
    if (index === -1) throw new Error('Patient not found')
    
    this.patients.splice(index, 1)
    return true
  }
}

export const patientService = new PatientService()