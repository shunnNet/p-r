const mongoose = require("mongoose")
const { dbSet } = require("./auth")

const db_name = "pocket-random";
const mongodb__production = `mongodb+srv://${dbSet.user}:${dbSet.ps}@demo-r799k.gcp.mongodb.net/${db_name}?retryWrites=true&w=majority`;

mongoose.connect(mongodb__production, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;

connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open',  () => { console.log("we're connected!") });

module.exports = connection