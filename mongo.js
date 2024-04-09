const mongoose = require('mongoose');

if (!(process.argv.length === 3 || process.argv.length === 5)) {
  console.log('Invalid arguments, give only the password or password, name and number');
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://aleksinurmento:${password}@fullstack.fkv4ihi.mongodb.net/phoneBookApp?retryWrites=true&w=majority&appName=fullstack`;
mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
  Person
    .find({})
    .then((persons) => {
      persons.forEach((person) => {
        console.log(person);
      });
      mongoose.connection.close();
    });
} else {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    name,
    number,
  });

  person.save().then((result) => {
    console.log('person saved!');
    mongoose.connection.close();
  });
}
