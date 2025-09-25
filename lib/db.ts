import fs from 'fs'
import path from 'path'

const dbPath = path.join(__dirname, '../db/db.json')

const defaultData = {
  categories: [],
  groups: [],
  questions: [],
  answers: [],
  admins: []
}

let data = defaultData

if (fs.existsSync(dbPath)) {
  data = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
} else {
  // create the db directory if not exists
  fs.mkdirSync(path.dirname(dbPath), { recursive: true })
  fs.writeFileSync(dbPath, JSON.stringify(defaultData))
}

const save = () => {
  fs.writeFileSync(dbPath, JSON.stringify(data))
}

// Mock db object
const db = {
  prepare: (sql) => {
    if (sql === 'SELECT name FROM categories') {
      return { all: () => data.categories.map(c => ({ name: c.name })) }
    }
    if (sql === 'SELECT name FROM groups') {
      return { all: () => data.groups.map(c => ({ name: c.name })) }
    }
    if (sql === 'SELECT COUNT(*) as count FROM questions') {
      return { get: () => ({ count: data.questions.length }) }
    }
    if (sql === 'INSERT INTO categories (name) VALUES (?)') {
      return { run: (...args: any[]) => { 
        const name = args[0]
        const id = data.categories.length + 1
        data.categories.push({ id, name })
        save()
        return { lastInsertRowid: id }
      } }
    }
    if (sql === 'INSERT INTO groups (name) VALUES (?)') {
      return { run: (...args: any[]) => { 
        const name = args[0]
        const id = data.groups.length + 1
        data.groups.push({ id, name })
        save()
        return { lastInsertRowid: id }
      } }
    }
    if (sql === 'INSERT INTO questions (question_number, text, category_id, group_id) VALUES (?, ?, ?, ?)') {
      return { run: (...args: any[]) => {
        const question_number = args[0], text = args[1], category_id = args[2], group_id = args[3]
        const id = data.questions.length + 1
        data.questions.push({ id, question_number, text, category_id, group_id })
        save()
      } }
    }
    if (sql === 'SELECT q.id, q.question_number, q.text, c.name as category, g.name as group_name FROM questions q LEFT JOIN categories c ON q.category_id = c.id LEFT JOIN groups g ON q.group_id = g.id') {
      return { all: () => data.questions.map(q => {
        const category = data.categories.find(c => c.id === q.category_id)?.name || null
        const group_name = data.groups.find(g => g.id === q.group_id)?.name || null
        return { id: q.id, question_number: q.question_number, text: q.text, category, group_name }
      }) }
    }
    if (sql === 'INSERT INTO answers (question_id, rating) VALUES (?, ?)') {
      return { run: (...args: any[]) => {
        const question_id = args[0], rating = args[1]
        const id = data.answers.length + 1
        data.answers.push({ id, question_id, rating, timestamp: new Date().toISOString() })
        save()
      } }
    }
    if (sql === 'SELECT q.question_number, q.text, AVG(a.rating) as avg_rating, COUNT(a.id) as count FROM questions q LEFT JOIN answers a ON q.id = a.question_id GROUP BY q.id') {
      return { all: () => data.questions.map(q => {
        const answers = data.answers.filter(a => a.question_id === q.id)
        const avg_rating = answers.length > 0 ? answers.reduce((sum, a) => sum + a.rating, 0) / answers.length : null
        return { question_number: q.question_number, text: q.text, avg_rating, count: answers.length }
      }) }
    }
    if (sql === 'SELECT * FROM admins WHERE username = ?') {
      return { get: (username) => data.admins.find(a => a.username === username) }
    }
    if (sql === 'INSERT OR IGNORE INTO admins (username, password_hash) VALUES (?, ?)') {
      return { run: (...args: any[]) => {
        const username = args[0], password_hash = args[1]
        if (!data.admins.find(a => a.username === username)) {
          const id = data.admins.length + 1
          data.admins.push({ id, username, password_hash })
          save()
        }
      } }
    }
    return {}
  }
}

// Insert default admin
db.prepare('INSERT OR IGNORE INTO admins (username, password_hash) VALUES (?, ?)').run('admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')

// Insert sample data
db.prepare('INSERT INTO categories (name) VALUES (?)').run('General')
db.prepare('INSERT INTO groups (name) VALUES (?)').run('All')
db.prepare('INSERT INTO questions (question_number, text, category_id, group_id) VALUES (?, ?, ?, ?)').run(1, 'How satisfied are you with our service?', 1, 1)
db.prepare('INSERT INTO questions (question_number, text, category_id, group_id) VALUES (?, ?, ?, ?)').run(2, 'Would you recommend us?', 1, 1)

export default db
