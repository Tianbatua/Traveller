const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const config = require('./config/database'); //monggose config
const path = require('path'); //package for file paths
const authentication = require('./routes/authentication')(router);
const bodyParser = require('body-parser');


// Database Connection
mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
	if(err){
		console.log('Could Not connect to database', err);
	}else{
		console.log('Connect to database: ' + config.db);
	}
});

// Provide static directory for frontend
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); 
// parse application/json
app.use(bodyParser.json());

app.use(express.static(__dirname + '/client/dist/'));
app.use('/authentication', authentication);

// Connect server to Angular Index.html
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

// Start Server: Listen on port 8080
app.listen(8080, () => {
	console.log('listening on port 8080');
});
