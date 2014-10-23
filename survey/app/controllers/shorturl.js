var Sequelize = require(__dirname + "/../models/sequelize")
  , config = require(__dirname + "/../../lib/config")
  , sequelize = new Sequelize(config.database, config.username, config.password, {host: config.host, logging: false})
  , ShortUrl = sequelize.import(__dirname + "/../models/shorturl")
  , UrlGroup = sequelize.import(__dirname + "/../models/urlgroup")
  , http = require('http')
  , querystring = require('querystring')
  , request = require('request')
  , async = require('async')
  , encode_url = "http://s-m2.me/api/encode?originUrl="

UrlGroup.hasMany(ShortUrl)
ShortUrl.belongsTo(UrlGroup)

exports.new = function(req, res) {
	UrlGroup.findAll().success(function(urlgroups) {
		res.render('url/new',
  	  {title: 'New Url',
  	   urlgroups: urlgroups})
	});
}

exports.create = function(req, res) {
	var text = req.param('url-text');
	var url = req.param('url');
	var urlgroupid = req.param('group_id');
	var tasks = [];
	old_pairs = text.split(';');
	pairs = [];
	for (var index in old_pairs) { 
	  if(old_pairs[index] && old_pairs[index].trim != "") { 
	    pairs.push(old_pairs[index]);
	  } 
	}

	for(var i in pairs) {
		var pair = pairs[i];
		var longUrl = pair.split(",")[0].trim();
		var remark = pair.split(",")[1].trim();
		var request_data = querystring.stringify({
	    longUrl: longUrl,
	    remark: remark
	  });

		tasks.push(
	  	[request_data, urlgroupid]
	  );
	}

	async.map(tasks, get_request, function(err, results){
		console.log(results);
		res.redirect("index");
	});
}


function get_request(params, callback) {
	var request_data = querystring.parse(params[0]);
	var group_id = params[1];
	console.log(request_data);
	var req = http.get(encode_url+request_data.longUrl, function(response) {
	  response.setEncoding('utf8');
	  response.on('data', function (chunk) {
	    var shorturl = chunk;
	    console.log(shorturl);
	    sequelize.sync().on('success', function(error) {
				ShortUrl
				  .create({
				  	longurl: request_data.longUrl,
				  	shorturl: shorturl,
				  	remark: request_data.remark,
				  	UrlGroupId: group_id
				  })
				  .success(function(object) {
				  	callback(null, object);
					})
					.error(function(error) {
						console.log(error);
					})
			}).error(function(error) {
				console.log(error);
			});
	  });
	});

	// write data to request body
	// req.write(params[0] + "\n");
	req.end();
}

exports.show = function(req, res) {
	var id = req.param('id');
	ShortUrl.find(id).success(function(url) {
		UrlGroup.findAll().success(function(urlgroups) {
			res.render('url/edit',
	  	  {title: 'Edit Url',
	  	   url: url,
	  	   urlgroups: urlgroups})
		});
	});
}

exports.edit = function(req, res) {
	var id = req.param('id');
	var url = req.param('url');
	var remark = req.param('remark');
	var urlgroupid = req.param('group_id');

	var req = http.get(encode_url+url, function(response) {
	  response.setEncoding('utf8');
	  response.on('data', function (chunk) {
	    var shorturl = chunk;
	    console.log(shorturl);
	    ShortUrl.find(id).success(function(urls) {
				urls.updateAttributes({
					longurl: url,
					shorturl: shorturl,
					remark: remark,
					UrlGroupId: urlgroupid
				}).success(function() {
					res.redirect("index");
				})
			});
	  });
	});

	// write data to request body
	// req.write(post_data + "\n");
	req.end();
}

exports.destroy = function(req, res) {
	var id = req.param('id');
	ShortUrl.find(id).success(function(shorturl) {
		shorturl.destroy().success(function() {
	    res.redirect("index");
	  });
	});
}


