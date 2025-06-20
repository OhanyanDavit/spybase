const express = require('express');
const router = express.Router();
const pool = require('../db');
const { encrypt, decrypt } = require('../encryption');

router.post('/agents', async (req, res) => {
    const {codename, real_name, clearance_level} = req.body;
    try {
        const encryptedName = encrypt(real_name);
        const result = await pool.query(
            'INSERT INTO agents (codename, real_name, clearance_level) VALUES ($1, $2, $3)',
            [codename, encryptedName, clearance_level]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при создании агента');
    }
})

router.get('/agents', async (req, res) => {
    try{
        const result = await pool.query('SELECT * FROM agents');
        const agents = result.rows.map(agents =>{
            return {
                ...agents,
                real_name: decrypt(agents.real_name)
            };
        })
        res.json(agents);
    }catch(err){
        console.error(err);
        res.status(500).send('Error when getting agents map');
    }
});

module.exports = router;