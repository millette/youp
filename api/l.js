// npm
const level = require("level")

const elDb = level("my-db", { valueEncoding: "json" })

elDb
  .createReadStream()
  .on("data", (d) => {
    console.log("data", JSON.stringify(d, null, " "))
  })
  .on("end", () => {
    console.log("end")
  })
  .on("error", (e) => {
    console.log("error", e)
  })
