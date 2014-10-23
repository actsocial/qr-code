var Sequelize = require(__dirname + "/../models/sequelize")
  , config = require(__dirname + "/../../lib/config")
  , sequelize = new Sequelize(config.database, config.username, config.password, {host: config.host, logging: false})
  , ShortUrl = sequelize.import(__dirname + "/../models/shorturl")
  , UrlGroup = sequelize.import(__dirname + "/../models/urlgroup")
  , moment = require('moment')

UrlGroup.hasMany(ShortUrl)
ShortUrl.belongsTo(UrlGroup)

exports.index = function(req, res){
  var chainer = new Sequelize.Utils.QueryChainer;
  rs = [];
  sequelize.sync().success(function(groups) {
    UrlGroup.findAll().success(function(urlgroups) {
			for(var i in urlgroups){
				chainer.add(urlgroups[i].getShortUrls());
			}
			chainer.run().on('success', function(results) {
				for(var i in urlgroups){
					rs[i] = [];
					rs[i][0] = urlgroups[i].id;
					rs[i][1] = urlgroups[i].group_name;
					rs[i][2] = urlgroups[i].survey_link;
					for(var j in results[i]) {
						results[i][j].updatedAt = moment(results[i][j].updatedAt).format("YYYY-MM-DD HH:mm:ss");
					}
					rs[i][3] = results[i];
				}
				res.render('index', {rs: rs, urlgroups: urlgroups});
			});
		});
  });
};