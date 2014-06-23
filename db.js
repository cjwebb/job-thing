var db = require("seraph")({ server: "http://jobthing:EwlwdRCGkbd060YZAGfD@jobthing.sb02.stations.graphenedb.com:24789"});

db.save({ name: "Test-Man", age: 40 }, function(err, node) {
  if (err) throw err;
  console.log("Test-Man inserted.");

  db.delete(node, function(err) {
    if (err) throw err;
    console.log("Test-Man away!");
  });
});