const express = require("express");
const fs = require('fs');

const app = express();
app.use(express.static("public"));

var mediaMembers = [
  "2020Alivia Chieffo",
  "2020Wyatt Pfeil",
  "2022Cole Cianciulli",
  "2021Olivia DeRose",
  "2022Carson Fulmer",
  "2022Nathan Hagarty",
  "2022Kayla Higgins",
  "2022Maria Higgins",
  "2022cameron jones",
  "2020Rachel Lendzinski",
  "2022Noah Makarichev",
  "2021Zachary Mangan",
  "2021Jordan Miller",
  "2021Richard Parry",
  "2022Lorenzo Rossi",
  "2021Natalie Samples",
  "2022Braeden Sheldon",
  "2022Braeden Smith",
  "2022Ryan Stabinski",
  "2020Adrienne Winters",
  "2022Jay Winters",
  "2021Chloe Yordy"
]


app.get("/", function(req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

function getAttendance() {
  let rawJson = fs.readFileSync('attendance.json');
  let attendanceJson = JSON.parse(rawJson);
  return attendanceJson
}

function getDailyAttendance(attendanceJson, date) {
  if(attendanceJson[date]) {
    return attendanceJson[date]
  } else {
    attendanceJson[date] = {}
    mediaMembers.forEach(function(member, index){
      attendanceJson[date][member] = false
    })
    return attendanceJson[date]
  }
}

app.get("/submitAttendance", function(req, res) {
  var user = req.query.user
  console.log(user)
  var dateObject = new Date()
  var dayDate = ("0" + dateObject.getDate()).slice(-2);
  var monthDate = ("0" + (dateObject.getMonth() + 1)).slice(-2);
  var date = monthDate + "-" + dayDate

  var attendanceJson = getAttendance()
  var dailyAttendance = getDailyAttendance(attendanceJson, date)
  dailyAttendance[user] = true
  console.log(dailyAttendance)
  attendanceJson[date] = dailyAttendance

  var attendanceJsonData = JSON.stringify(attendanceJson);
  fs.writeFile('attendance.json', attendanceJsonData);
  res.json("Submitted!")
});

app.get("/revokeAttendance", function(req, res) {
  var user = req.query.user
  console.log(user)
  var dateObject = new Date()
  var dayDate = ("0" + dateObject.getDate()).slice(-2);
  var monthDate = ("0" + (dateObject.getMonth() + 1)).slice(-2);
  var date = monthDate + "-" + dayDate

  var attendanceJson = getAttendance()
  var dailyAttendance = getDailyAttendance(attendanceJson, date)
  dailyAttendance[user] = false
  console.log(dailyAttendance)
  attendanceJson[date] = dailyAttendance

  var attendanceJsonData = JSON.stringify(attendanceJson);
  fs.writeFile('attendance.json', attendanceJsonData);
  res.json("Submitted!")
});

app.get("/getDailyAttendance", function(req, res) {
  var attendanceJson = getAttendance()

  var dateObject = new Date()
  var dayDate = ("0" + dateObject.getDate()).slice(-2);
  var monthDate = ("0" + (dateObject.getMonth() + 1)).slice(-2);
  var date = monthDate + "-" + dayDate

  var dailyAttendance = getDailyAttendance(attendanceJson, date)
  console.log(dailyAttendance)
  res.json(dailyAttendance)
});

const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});

//http://attendance-tracker.glitch.me/submitAttendance?user=USER-HERE
//http://attendance-tracker.glitch.me/getDailyAttendance