const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const { PORT = 3000 } = process.env;

const app = express();

app.use(userRoutes);
app.use(cardRoutes);
app.use('*', (req, res)=>{
  res.status(404).send({message: 'Страница по указанному адресу не найдена'})
});

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`Connected to Database`)

  app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
  })
}

main();