const express = require("express");
const router = express.Router();
const {encrypt, decrypt} = require("../encryption");
const pool = require("../db");

router.post("/missions", async (req, res) => {
    const {title, status, location, agent_id, start_date, end_date} = req.body;
    try{
        const result = await pool.query(
            `INSERT INTO missions (title, status, location, agent_id, start_date, end_date)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [title, status, location, agent_id, start_date, end_date]
        );
        res.status(200).json(result.rows);
    }catch(err){
        console.error(err);
        res.status(500).send("Ошибка при создании миссии");
    }
})
router.get("/missions", async (req, res) => {
    try{
        const result = await pool.query(`SELECT * FROM missions`);
        res.status(200).json(result.rows);
    }catch(err){
        console.error(err);
        res.status(500).send("Ошибка при получении списка миссий");
    }
})
router.post("/missions/:mission_id/file", async (req, res) => {
    const {mission_id} = req.params;
    if(!mission_id) {
        return res.status(400).send("missionId is required");
    }
    const { filename, encrypted_data } = req.body;
    try{
        const enc = encrypt(encrypted_data);
        const result = await pool.query(`INSERT INTO mission_files (mission_id, filename, encrypted_data) VALUES ($1, $2, $3) RETURNING *`,
            [mission_id, filename, enc]);
        res.status(200).json(result.rows[0]);
    }catch(err){
        console.error(err);
        res.status(500).send("when creating mission file");
    }
})
router.get("/missions/:mission_id/file", async (req, res) => {
    const {mission_id} = req.params;
    if(!mission_id) {
        return res.status(400).send("missionId is required");
    }
    try{

        const result = await pool.query(`SELECT * FROM mission_files WHERE mission_id = $1`, [mission_id]);
        if(result.rows.length === 0) {
            return res.status(404).send("mission file not found");
        }else { 
            const rows_mis = result.rows.map(row => {
                return{
                    ...row,
                    encrypted_data: decrypt(row.encrypted_data)
                }
            })
            return res.status(200).json(rows_mis);};
    }catch(err){
        console.error(err);
        res.status(500).send("error when getting mission file");
    }
})

module.exports = router;