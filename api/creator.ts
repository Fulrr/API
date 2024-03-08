import express from "express";
import { conn, queryAsync } from "./dbconnect";

import { creator } from "../model/creator";

import * as mysql from 'mysql';



export const router = express.Router();

// /GET 
router.get("/", (req, res) => {
    if(req.query.id) {
        res.send("Get in Creator id: " + req.query.id + " name=" + req.query.name);
    }else {
        // res.send("Get in trip.ts");
        const sql = "SELECT * FROM Creator";
        conn.query(sql, (err, result) => {
            if(err){
                res.status(400).json(err);
            }else {
                res.json(result);
            }
        });

    
    }
});


//DELETE
router.delete("/:mid/:pid", (req, res) => {
    let mid = +req.params.mid;
    let pid = +req.params.pid;
    conn.query("DELETE FROM Creator WHERE movieId = ? AND personId = ?", [mid, pid], (err, result) => {
        if (err) {
            res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบข้อมูล" });
            throw err;
        }
        res.status(200).json({ affected_rows: result.affectedRows });
    });
});




  //insert 
router.post("/", (req, res) => {
    let Creator: creator = req.body;
    let sql =
      "INSERT INTO `Creator`(`movieId`, `personId`) VALUES (?,?)";
    sql = mysql.format(sql, [
        Creator.movieId,
        Creator.personId,
    ]);
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(201)
        .json({ affected_row: result.affectedRows, last_id: result.insertId });
    });
  });


