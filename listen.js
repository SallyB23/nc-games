const app = require("./app")

const { PORT = 9090 } = process.env

app.listen((err) => {
  if (err) {
    throw err;
  } else {
    console.log(`listening on port: ${PORT}...`);
  }
});