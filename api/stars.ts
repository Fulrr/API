import express from "express";
import { conn, queryAsync } from "./dbconnect";

import * as mysql from 'mysql';

import { stars } from "../model/stars"; 


export const router = express.Router();

// /GET 
router.get("/", (req, res) => {
    if(req.query.id) {
        res.send("Get in Stars id: " + req.query.id + " name=" + req.query.name);
    }else {
        // res.send("Get in trip.ts");
        const sql = "select * from Stars";
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
    conn.query("DELETE FROM Stars WHERE movieId = ? AND personId = ?", [mid, pid], (err, result) => {
        if (err) {
            res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบข้อมูล" });
            throw err;
        }
        res.status(200).json({ affected_rows: result.affectedRows });
    });
});




  //insert 
router.post("/", (req, res) => {
    let Stars: stars = req.body;
    let sql =
      "INSERT INTO `Stars`(`movieId`, `personId`) VALUES (?,?)";
    sql = mysql.format(sql, [
        Stars.movieId,
        Stars.personId,
    ]);
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(201)
        .json({ affected_row: result.affectedRows, last_id: result.insertId });
    });
  });



