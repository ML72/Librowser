const mongoose = require('mongoose');

const connectDB = async (URI) => {

    try {

        await mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        console.log('MongoDB connected');
    } catch(err) {
        
        console.error(err.message);
        process.exit(1);
    }

    return mongoose;
}

module.exports = connectDB;