var express = require('express'),
	fs = require('fs'),
	app = new express(),
	port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.writeHeader(200, {'Content-Type': 'text/html'});
	fs.readFile('./view/pages/index.html', function(err, data) {
		if(err) throw err;
		res.end(data);
	});
});

app.get('/latest', function(req, res) {

});

app.get('/search/:data', function(req, res) {
	var data = req.params.data,
		offset = req.query.offset;
	console.log(data, offset);
})

app.get('*', function(req, res) {
	res.send('404 not found!');
})

app.listen(port);


console.log('run at port ' + port);