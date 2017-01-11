var http = require('http'),
	https = require('https');

function query (err, url, callback) {
	if(err) {
		return console.log(err);
	}
	
	var get = /^https/.test(url) ? https.get : http.get;

	get(url, function(res) {
		res.on('data', function(data) {
			callback(data.toString());
		});
	}).on('err', function(e) {
		console.log('error: ' + e.message);
	})
}

module.exports = query;