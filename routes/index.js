var express = require('express');
var router = express.Router();
var pgp = require("pg-promise")(/*options*/);
var db = pgp("postgres://rodrigotorres:asd123@localhost:5432/rodrigotorres");
var apoc = require('apoc');
var neo4j = require('neo4j-driver').v1;

/* GET home page. */
router.get('/services/:id', function(req, res, next) {
  var id = req.params.id;
  db.one("SELECT * FROM servers WHERE id = $1", id)
    .then(function (data) {
        console.log("DATA:", data);
        res.status(200).json({
          data: data
        })
    })
    .catch(function (error) {
      res.status(500).json({
        error: "error"
      })
        console.log("ERROR:", error);
    });
});

router.get('/relations', function(req, res, next) {
  var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "asd123"));
  var session = driver.session();
  session
  .run('match (n) return n')
  .then(function (result) {
    var jsonArr = [];
    result.records.forEach(function (record) {
      jsonArr.push(record.get(0).properties);
    });
    res.status(200).json({
      data: jsonArr
    });
    session.close();
  })
  .catch(function (error) {
    res.status(500).json({
      error: "error"
    })
    console.log(error);
  });



  /*apoc.query('match (n) return n').exec().then(
    function (response) {
      console.log(response);
      res.status(200).json({
        message: "hola2"
      })
    },
    function (fail) {
      console.log(fail);
    }
  );*/
});



module.exports = router;
