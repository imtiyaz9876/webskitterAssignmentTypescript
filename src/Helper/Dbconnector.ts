import mongoose from "mongoose";


export default (database: string) => {
  const connect = () => {
    mongoose
      .connect(database, { useNewUrlParser: true, useUnifiedTopology: true })

      .then(() => console.log(`Database connection successful.....`))
      .catch((error) => {
        console.log("Unable to connect to the db: " + error.message);
        return process.exit(1);
      });
    mongoose.set("useCreateIndex", true);
  };
  connect();
  mongoose.connection.on("disconnected", () => {
    console.log(`Db disconnected`);
  });
};
