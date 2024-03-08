import express from "express";
import { conn, queryAsync } from "./dbconnect";

import * as mysql from 'mysql';
import { TripPostRequest } from "../model/trip_post_request";





export const router = express.Router();


// /trip
router.get("/", (req, res) => {
    if(req.query.id) {
        res.send("Get in trip.ts id: " + req.query.id + " name=" + req.query.name);
    }else {
        // res.send("Get in trip.ts");
        const sql = "select * from trip";
        conn.query(sql, (err, result) => {
            if(err){
                res.status(400).json(err);
            }else {
                res.json(result);
            }
        });

    
    }
});


// /trip/xxx
router.get("/:id", (req, res) => {
    // res.send("Get in trip.ts id: " + req.params.id);
    const id = req.params.id;
    res.send("Get in trip.ts id: " + id);   

    // const sql = "select * from trip";
    const sql = "select * from trip where idx = ?";
        conn.query(sql,[id],(err, result) => {
            if(err){
                res.status(400).json(err);
            }else {
                res.json(result);
            }
        });
  });


//Delete
router.delete("/:id", (req, res) => {
    let id = +req.params.id;
    conn.query("delete from trip where idx = ?", [id], (err, result) => {
       if (err) throw err;
       res
         .status(200)
         .json({ affected_row: result.affectedRows });
    });
  });

//   // /price
//   router.get("/price", (req, res) => {
//     conn.query(
//       "select * from trip where (idx IS NULL OR idx = ?) OR (name IS NULL OR name like ?)",
//       [ req.query.id, "%" + req.query.name + "%"],
//       (err, result, fields) => {
//       if (err) throw err;
//         res.json(result);
//       }
//     );
//   });


// POST /trip
router.post("/", (req, res) => {
    const body = req.body;
    res.status(201).json({ Text: "Get in trip.ts body " + JSON.stringify(body) });//stringify การแปลง obj->string
});

router.get("/search/fields", (req, res) => {
    const id =req.query.id;
    const name = req.query.name;
    const sql ="select * from trip where (idx IS NULL OR idx = ?) OR (name IS NULL OR name like ?)";

    conn.query(sql,[id, "%" + name + "%"],(err, result) => {
        if(err){
            res.json(err);
        }else {
            res.json(result);
        }
    });
});


//insert
router.post("/", (req, res) => {
    let trip: TripPostRequest = req.body;
    let sql =
      "INSERT INTO `trip`(`name`, `country`, `destinationid`, `coverimage`, `detail`, `price`, `duration`) VALUES (?,?,?,?,?,?,?)";
    sql = mysql.format(sql, [
      trip.name,
      trip.country,
      trip.destinationid,
      trip.coverimage,
      trip.detail,
      trip.price,
      trip.duration,
    ]);
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(201)
        .json({ affected_row: result.affectedRows, last_idx: result.insertId });
    });
  });

// Update PUT/trip/xxxx + Data
router.put("/:id", (req, res) => {
    let id = +req.params.id;
    let trip: TripPostRequest = req.body;
    let sql =
      "update  `trip` set `name`=?, `country`=?, `destinationid`=?, `coverimage`=?, `detail`=?, `price`=?, `duration`=? where `idx`=?";
    sql = mysql.format(sql, [
      trip.name,
      trip.country,
      trip.destinationid,
      trip.coverimage,
      trip.detail,
      trip.price,
      trip.duration,
      id
    ]);
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(201)
        .json({ affected_row: result.affectedRows });
    });
  });




// PUT/trip/xxxx + some file
router.put("/:id", (req, res) => {
    let id = +req.params.id;
    let trip: TripPostRequest = req.body;
    let sql =
      "update  `trip` set `name`=?, `country`=?, `destinationid`=?, `coverimage`=?, `detail`=?, `price`=?, `duration`=? where `idx`=?";
    sql = mysql.format(sql, [
      trip.name,
      trip.country,
      trip.destinationid,
      trip.coverimage,
      trip.detail,
      trip.price,
      trip.duration,
      id
    ]);
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(201)
        .json({ affected_row: result.affectedRows });
    });
  });


  router.put("/:id", async (req, res) => {
    let id = +req.params.id;
    let trip: TripPostRequest = req.body;
    let tripOriginal: TripPostRequest | undefined;
  
    let sql = mysql.format("select * from trip where idx = ?", [id]);
  
    let result = await queryAsync(sql);
    const rawData = JSON.parse(JSON.stringify(result));
    console.log(rawData);
    tripOriginal = rawData[0] as TripPostRequest;
    console.log(tripOriginal);
  
    let updateTrip = {...tripOriginal, ...trip};
    console.log(trip);
    console.log(updateTrip);
  
      sql =
        "update  `trip` set `name`=?, `country`=?, `destinationid`=?, `coverimage`=?, `detail`=?, `price`=?, `duration`=? where `idx`=?";
      sql = mysql.format(sql, [
        updateTrip.name,
        updateTrip.country,
        updateTrip.destinationid,
        updateTrip.coverimage,
        updateTrip.detail,
        updateTrip.price,
        updateTrip.duration,
        id,
      ]);
      conn.query(sql, (err, result) => {
        if (err) throw err;
        res.status(201).json({ affected_row: result.affectedRows });
      });
  });
