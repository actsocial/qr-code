var Sequelize = require(__dirname + "/../models/sequelize")
  , config = require(__dirname + "/../../lib/config")
  , sequelize = new Sequelize(config.database, config.username, config.password, {host: config.host, logging: false})
  , ShortUrl = sequelize.import(__dirname + "/../models/shorturl")
  , UrlGroup = sequelize.import(__dirname + "/../models/urlgroup")
  , QRCode = require('qrcode')
  , async = require('async')

UrlGroup.hasMany(ShortUrl)
ShortUrl.belongsTo(UrlGroup)

exports.generate = function(req, res){
	var errorCorrectLevel = req.param('ecl');
	var chainer = new Sequelize.Utils.QueryChainer
    , rs = {}
  	, tasks = []
  	, remark_hash = {};

  sequelize.sync().success(function(groups) {
    UrlGroup.findAll().success(function(urlgroups) {
			for(var i in urlgroups){
				chainer.add(urlgroups[i].getShortUrls());
			}
			chainer.run().on('success', function(results) {
				for(var i in urlgroups){
					if (!rs[urlgroups[i].group_name]) {
						rs[urlgroups[i].group_name] = [];
					}
					for(var j in results[i]) {
					  // rs[urlgroups[i].group_name].push(results[i][j].shorturl);
					  remark_hash[results[i][j].shorturl] = results[i][j].remark;
					  tasks.push(
					  	[urlgroups[i].group_name, results[i][j].shorturl, errorCorrectLevel]
					  );			
					}
				}

				async.map(tasks, draw, function(err, results){
					var groups = {};
					for(var i in results) {
						var result = results[i];
						for(var group_name in result) {
							if (group_name) {
								if (!groups[group_name]) {
									groups[group_name] = [];
								}
								groups[group_name].push(result[group_name]);
							}
						}
					}
					console.log(groups);
					console.log(remark_hash);
					res.render("qrcode/generate", 
						{groups: groups,
						 remark_hash: remark_hash});
				});
			
			});
		});
  });
	
	
}

function draw(array, callback) {
	QRCode.toDataURL(array[1], {errorCorrectLevel:array[2]}, function(err, url){
		var rs = {};
		rs[array[0]] = {};
		rs[array[0]][array[1]] = url;
		callback(err, rs);
	});
}
