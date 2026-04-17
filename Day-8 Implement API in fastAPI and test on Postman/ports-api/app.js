import express from 'express';
import portsRouter from './routes/ports.routes.js';

const app = express();

app.use(express.json());
app.use('/ports', portsRouter);
const PORT = 3000;


//middleware for logging requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
    next();
});

app.get('/', (req, res) => {
     res.json({ message: 'Ports API running ' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Endpoint not found' });
});
