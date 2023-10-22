const e = require('express')
const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

else if (process.argv.length !== 3 && process.argv.length !== 5) {
    console.log('invalid arguments')
    process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://lukektx:${password}@cluster0.jlswa8q.mongodb.net/PhonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const entrySchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Entry = mongoose.model('Entry', entrySchema)

if (process.argv.length === 3) {
    console.log('phonebook:')
    Entry.find({}).then(result => {
        result.forEach(e => {
          console.log(e.name, e.number)
        })
        mongoose.connection.close()
    })
}

else if (process.argv.length === 5) {
    const newEntry = new Entry({
        name: process.argv[3],
        number: process.argv[4],
    })

    newEntry.save().then(result => {
    console.log('entry saved!')
    mongoose.connection.close()
    })
}

