const mongoose = require("mongoose");
require("dotenv").config();

const Schema = mongoose.Schema;
const CalendarSchema = new Schema({
  date: String,
  heading: String,
  line: String,
  type: String,
  rashi: String,
  status: { type: Boolean, default: true },
  deleteflag: { type: Boolean, default: false }
});
const Calendar = mongoose.model("Calendar", CalendarSchema);

async function checkDB() {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/iskcon");
  const entries = await Calendar.find({ date: { $regex: /^2026-03-08/ } });
  console.log("Entries for 2026-03-08:");
  console.log(JSON.stringify(entries, null, 2));
  
  const allFestivals = await Calendar.find({ type: "Festival", deleteflag: false });
  console.log("\nAll active Festivals:");
  console.log(JSON.stringify(allFestivals, null, 2));

  process.exit();
}

checkDB().catch(err => {
  console.error(err);
  process.exit(1);
});
