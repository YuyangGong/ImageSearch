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

app.get('/:date', function(req, res) {
	function dateStringify(dateObj) {
		var months = 'January,February,March,April,May,June,July,August,September,October,November,December'.split(',');
		return `${months[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`
	}
	var date = req.params.date,
		time;
	time = new Date(isNaN(+date) ? date : +date);
	if(time.toString() === 'Invalid Date') res.json({"unix": null, "natural": null});
	else res.json({"unix": +time, "natural": dateStringify(time)});
});

app.get('*', function(req, res) {
	res.send('404 not found!');
})

app.listen(port);


console.log('run at port ' + port);