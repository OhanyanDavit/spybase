const express = require('express');
const agentsRouter = require('./routes/agents');
const missionsRouter = require('./routes/missions');

const app = express();

app.use(express.json());

app.use('/', agentsRouter);
app.use('/', missionsRouter);



const PORT = 3000;  
app.listen(PORT || 3000, () => {
    console.log(`Server is running on port ${PORT}`);
});