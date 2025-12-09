const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}
const password = process.argv[2]
const content_i = process.argv[3]
const number_i = process.argv[4]

const Password = encodeURIComponent(password)
const url = `mongodb+srv://maijarislakki_db_user:${Password}@cluster0.ombojxl.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const noteSchema = new mongoose.Schema({
  content: String,
  number: String
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
    content: content_i,
    number: number_i
})

if (!note.content) {
    console.log('Phonebook:')
    Note.find({}).then(result => {
      result.forEach(note => {
        console.log(note.content, note.number)
      })
      mongoose.connection.close()
    })
} else {
    note.save().then(result => {
    console.log(`added ${note.content} number ${note.number} to phonebook`)
    mongoose.connection.close()
    })
}


