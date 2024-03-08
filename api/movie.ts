import express from "express";
import { conn, queryAsync } from "./dbconnect";

import * as mysql from 'mysql';

import { movie } from "../model/movie_post";


export const router = express.Router();

// /GET imdb
router.get("/", (req, res) => {
    if(req.query.id) {
        res.send("Get in Movie id: " + req.query.id + " name=" + req.query.name);
    }else {
        // res.send("Get in trip.ts");
        const sql = "select * from Movie";
        conn.query(sql, (err, result) => {
            if(err){
                res.status(400).json(err);
            }else {
                res.json(result);
            }
        });

    
    }
});

//DELETE movie
router.delete("/:id", (req, res) => {
    let id = +req.params.id;
    conn.query("delete from Movie where movieId  = ?", [id], (err, result) => {
       if (err) throw err;
       res
         .status(200)
         .json({ affected_row: result.affectedRows });
    });
  });

  //insert movie
router.post("/", (req, res) => {
    let Movie: movie = req.body;
    let sql =
      "INSERT INTO `Movie`(`title`, `releaseYear`, `description`) VALUES (?,?,?)";
    sql = mysql.format(sql, [
        Movie.title,
        Movie.releaseYear,
        Movie.description,
    ]);
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(201)
        .json({ affected_row: result.affectedRows, last_idx: result.insertId });
    });
  });

 // get movie by name keyword 
// router.get("/search/fields", (req, res) => {
//     const movieId = req.query.id;
//     const title = req.query.name;
//     const sql = "SELECT * FROM Movie WHERE (movieId = ? OR ? IS NULL) AND (title LIKE ? OR ? IS NULL)";

//     conn.query(sql, [movieId, movieId, "%" + title + "%", title], (err, result) => {
//         if (err) {
//             res.json(err);
//         } else {
//             res.json(result);
//         }
//     });
// });


router.get("/search/fields", (req, res) => {
    const movieId = req.query.id;
    const title = req.query.name;
    const sqlMovie = "SELECT * FROM Movie WHERE (movieId = ? OR ? IS NULL) AND (title LIKE ? OR ? IS NULL)";
    const sqlStars = "SELECT Person.* FROM Movie JOIN Stars ON Movie.movieId = Stars.movieId JOIN Person ON Stars.personId = Person.personId WHERE Movie.title LIKE ?";
    const sqlCreators = "SELECT Person.* FROM Movie JOIN Creator ON Movie.movieId = Creator.movieId JOIN Person ON Creator.personId = Person.personId WHERE Movie.title LIKE ?";

    conn.query(sqlMovie, [movieId, movieId, "%" + title + "%", title], (err, movieResult) => {
        if (err) {
            res.json(err);
        } else {
            conn.query(sqlStars, ["%" + title + "%"], (err, starsResult) => {
                if (err) {
                    res.json(err);
                } else {
                    conn.query(sqlCreators, ["%" + title + "%"], (err, creatorsResult) => {
                        if (err) {
                            res.json(err);
                        } else {
                            res.json({
                                movie: movieResult,
                                stars: starsResult,
                                creators: creatorsResult
                            });
                        }
                    });
                }
            });
        }
    });
});




