
module.exports = function(sequelize, DataTypes) {
  return sequelize.define("ShortUrls", {
  	longurl: DataTypes.STRING,
    shorturl: DataTypes.STRING,
    remark: DataTypes.STRING,
    UrlGroupId: DataTypes.INTEGER,
  })
}