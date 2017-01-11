var express = require('express'),
	fs = require('fs'),
	mongo = require('mongodb').MongoClient,
	query = require('./js/query.js'),
	app = new express(),
	port = process.env.PORT || 3000,
	data_url = process.env.MONGO_URL;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.writeHeader(200, {'Content-Type': 'text/html'});
	fs.readFile('./view/pages/index.html', function(err, data) {
		if(err) throw err;
		res.end(data);
	});
});

app.get('/latest', function(req, res) {
	query(null, 'http://cryptic-ridge-9197.herokuapp.com/api/latest/imagesearch/', function(data) {
		res.json(data);
	})
});

app.get('/search/:data', function(req, res) {
	var data = req.params.data,
		offset = req.query.offset;
	url = `http://cryptic-ridge-9197.herokuapp.com/api/imagesearch/${encodeURI(data)}${offset ? '?offset=' + offset : ''}`;
	query(null, url, function(data) {
		res.json(data);
	})
})

app.get('*', function(req, res) {
	res.send('404 not found!');
})

app.listen(port);


console.log('run at port ' + port);