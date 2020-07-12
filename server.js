const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const { MONGO_URI } = require('./config/dev');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

//Routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user');

//Middlewares
app.use(cors());
app.use(express.json());
app.use(authRoutes);
app.use(postRoutes);
app.use(userRoutes);

//Db
mongoose
	.connect(MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then(() => console.log('MongoDb connected!'))
	.catch((error) => console.log(error));

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
