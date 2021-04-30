const mongoose = require ('mongoose')

if (process.argv.length !==3 && process.argv.length !== 5) {
  console.log('Wrong input, provide only the password if you want the list of people or <password> <name> <number> if you want to add someone to the phonebook')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@cluster0.gb5jt.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person =  mongoose.model('Person', personSchema)

if(process.argv.length === 5){
  const person = new Person({
    name: name,
    number: number,
  })
  person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else if (process.argv.length === 3) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })

}
