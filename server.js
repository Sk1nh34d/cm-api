const express = require("express");
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));



app.use("/api/contacts", require("./routes/contacts"));



app.listen(3000, () => console.log('Server started'));
