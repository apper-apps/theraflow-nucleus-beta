import sessionNotesData from '@/services/mockData/sessionNotes.json'

class SessionNoteService {
  constructor() {
    this.sessionNotes = [...sessionNotesData]
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }

  async getAll() {
    await this.delay()
    return [...this.sessionNotes]
  }

  async getById(id) {
    await this.delay()
    return this.sessionNotes.find(note => note.Id === id) || null
  }

  async create(noteData) {
    await this.delay()
    const maxId = Math.max(...this.sessionNotes.map(n => n.Id), 0)
    const newNote = {
      ...noteData,
      Id: maxId + 1,
      date: noteData.date || new Date().toISOString(),
      attachments: noteData.attachments || []
    }
    this.sessionNotes.push(newNote)
    return { ...newNote }
  }

  async update(id, noteData) {
    await this.delay()
    const index = this.sessionNotes.findIndex(note => note.Id === id)
    if (index === -1) throw new Error('Session note not found')
    
    this.sessionNotes[index] = { ...this.sessionNotes[index], ...noteData }
    return { ...this.sessionNotes[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.sessionNotes.findIndex(note => note.Id === id)
    if (index === -1) throw new Error('Session note not found')
    
    this.sessionNotes.splice(index, 1)
    return true
  }
}

export const sessionNoteService = new SessionNoteService()