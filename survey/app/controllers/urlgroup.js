var Sequelize = require(__dirname + "/../models/sequelize")
  , config = require(__dirname + "/../../lib/config")
  , sequelize = new Sequelize(config.database, config.username, config.password, {host: config.host, logging: false})
  , ShortUrl = sequelize.import(__dirname + "/../models/shorturl")
  , UrlGroup = sequelize.import(__dirname + "/../models/urlgroup")

UrlGroup.hasMany(ShortUrl)
ShortUrl.belongsTo(UrlGroup)

exports.new = function(req, res){
  res.render('urlgroup/new',
    {title: 'New Group'})
}

exports.create = function(req, res){
  var group_name = req.param('group_name');
  var survey_link = req.param('survey_link');

  sequelize.sync().on('success', function() {
    UrlGroup
      .create({ group_name: group_name, survey_link: survey_link})
      .success(function(urlgroup) {
        res.redirect("index")
      })
  });
}

exports.show = function(req, res) {
  var id = req.param('id');
  UrlGroup.find(id).success(function(urlgroup) {
    res.render('urlgroup/edit',
      {title: 'Edit urlgroup',
       urlgroup: urlgroup})
  });
}

exports.edit = function(req, res) {
  var group_name = req.body.group_name;
  var survey_link = req.body.survey_link;
  var id = req.param('id');

  UrlGroup.find(id).success(function(urlgroup) {
    urlgroup.updateAttributes({
      group_name: group_name,
      survey_link: survey_link
    }).success(function() {
      res.redirect("index");
    })
  });
}

exports.destroy = function(req, res) {
  var chainer = new Sequelize.Utils.QueryChainer;
  var id = req.param('id');
  UrlGroup.find(id).success(function(urlgroup) {
    urlgroup.getShortUrls().success(function(shorturls) {
      console.log(shorturls.length);
      for (var i in shorturls) {
        chainer.add(shorturls[i].destroy());
      }
      chainer.add(urlgroup.destroy());
      chainer.run().on('success', function() {
        res.redirect("index")
      });
    });
  });
}

    