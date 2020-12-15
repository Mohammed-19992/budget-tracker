// Dependencies
let express = require("express");
let compression = require("compression");
let logger = require("morgan");
let mongoose = require("mongoose");

// Setting up the port of the application
let PORT = process.env.PORT || 3500;

// Createing an instance of the express app
let app = express();

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Hosting static files so css and js files can be retrieved
app.use(express.static("public"));



// Connecting to the budget tracker database
mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost/budgettracker',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }
);

// Using logger
app.use(logger("dev"));

// Requiring routes from the routes folder

app.use(require("./routes/api.js"));

// Starting the server so it can begin listening to requests.

app.listen(PORT, () => {
  console.log(`The application is listening on port ${PORT}`);
});