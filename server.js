require("dotenv").config();
const app = require("./api");

app.listen(process.env.PORT || 3000, () => console.log("API running"));

app.get("/", (req, res) => {
  res.json({
    status: "UP",
    message: "Srini iTech API is running"
  });
});