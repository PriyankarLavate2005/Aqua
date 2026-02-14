require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const port = process.env.PORT || 5000;

// Connect to database
connectDB();

app.listen(port, () => console.log(`Server started on port ${port}`));
