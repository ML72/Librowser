const mongoose = require('mongoose');

const URI = process.env.DB_URI || "mongodb+srv://TestUser:YhkUxReF6JVvzOvr@librowser.15gs2.mongodb.net/Test?retryWrites=true&w=majority";

const connectDB = async () => {

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
}

module.exports = connectDB;