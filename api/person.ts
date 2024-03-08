import express from "express";
import { conn, queryAsync } from "./dbconnect";

import * as mysql from 'mysql';

import { person } from "../model/person"; 


export const router = express.Router();

// /GET person
router.get("/", (req, res) => {
    if(req.query.id) {
        res.send("Get in Person id: " + req.query.id + " name=" + req.query.name);
    }else {
        // res.send("Get in trip.ts");
        const sql = "select * from Person";
        conn.query(sql, (err, result) => {
            if(err){
                res.status(400).json(err);
            }else {
                res.json(result);
            }
        });

    
    }
});

//DELETE person
router.delete("/:id", (req, res) => {
    let id = +req.params.id;
    conn.query("delete from Person where personId  = ?", [id], (err, result) => {
       if (err) throw err;
       res
         .status(200)
         .json({ affected_row: result.affectedRows });
    });
  });

  //insert person
router.post("/", (req, res) => {
    let Person: person = req.body;
    let sql =
      "INSERT INTO `Person`(`name`, `birthDate`, `biography`) VALUES (?,?,?)";
    sql = mysql.format(sql, [
        Person.name,
        Person.birthDate,
        Person.biography,
    ]);
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(201)
        .json({ affected_row: result.affectedRows, last_id: result.insertId });
    });
  });
