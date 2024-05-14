const mongoose = require('mongoose');

const URI = 'mongodb+srv://diclarobatera:VQIf8WtvH8zqWtUn@cluster0.jnxjjwr.mongodb.net/Mary-Care-APP?retryWrites=true&w=majority&appName=Cluster0';

const env = process.env.NODE_ENV || 'dev';
let options = {};

//mongoose.set('useNewUrlParser', true);
//mongoose.set('useFindAndModify', false);
//mongoose.set('useCreateIndex', true);
//mongoose.set('useUnifiedTopology', true);

mongoose
  .connect(URI, options)
  .then(() => console.log('DB is Up!'))
  .catch((err) => console.log(err));