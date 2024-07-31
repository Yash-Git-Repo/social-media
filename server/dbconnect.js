const mongoose = require('mongoose')

module.exports = async () =>{
    const mongoUri = 'mongodb+srv://yash:EcQ4moXFxNhZTPmh@cluster0.msevpo3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

    try {
    const connect = await mongoose.connect(mongoUri, {
       useUnifiedTopology: true,
       useNewUrlParser:true,
      });
      console.log(`MongoDb connected`);
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}