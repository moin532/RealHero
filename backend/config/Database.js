const mongoose = require("mongoose");

const url =
  "mongodb+srv://moinmern:moin%409606@cluster0.dcrtwb1.mongodb.net/ecomsixpack?retryWrites=true&w=majority";

const connectDatabase = async () => {
  await mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
    })
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = connectDatabase;
