var express = require('express'),
	fs = require('fs'),
	mongo = require('mongodb').MongoClient,
	query = require('./js/query.js'),
	app = new express(),
	port = process.env.PORT || 3000,
	data_url = process.env.MONGO_URL || "mongodb://localhost:27017/my_database_name";
console.log('-----------------warning---------------');
console.log('database url:' + data_url);
console.log('-----------------warning---------------');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.writeHeader(200, {'Content-Type': 'text/html'});
	fs.readFile('./view/pages/index.html', function(err, data) {
		if(err) throw err;
		res.end(data);
	});
});

app.get('/latest', function(req, res) {
	mongo.connect(data_url, function(err, db) {
		if(err) {
			return console.log(err);
		}
		var collection = db.collection('lastest');
		collection.find().toArray(function(err, datas) {
			if(err) {
				return console.log(err);
			}
			if(datas.length && (Date.now() - datas[0].time) < 60*1000*60*24) {
				res.json(datas[0].lastestData);
				db.close();
			}
			else {
				collection.remove();
				query(null, 'https://cryptic-ridge-9197.herokuapp.com/api/latest/imagesearch/', function(data) {
					collection.insert({"lastestData": data, "time": Date.now()}, function(err, theData) {
						if(err) {
							return console.log(err);
						}
						res.json(data);
						db.close();
					});
				});				
			}
		});
	});
});

app.get('/search/:data', function(req, res) {
	var data = req.params.data,
		offset = req.query.offset || 0,
		url;
	mongo.connect(data_url, function(err, db) {
		if(err) {
			return console.log(err);
		}
		var collection = db.collection('pic');
		collection.find({search: data, offset: offset}).toArray(function(err, arr) {
			if(err) {
				return console.log(err);
			}
			if(arr.length) {
				res.json(arr[0].pictures);
				db.close();
			}
			else {
				url = `https://cryptic-ridge-9197.herokuapp.com/api/imagesearch/${encodeURI(data)}${offset ? '?offset=' + offset : ''}`;
				query(null, url, function(picData) {
					res.json(picData);
					collection.insert({search: data, offset: offset, pictures: picData}, function(err, datas) {
						db.close();
					})
				});
			}
		});
	});
})

app.get('*', function(req, res) {
	res.send('404 not found!');
})

app.listen(port);


console.log('run at port ' + port);