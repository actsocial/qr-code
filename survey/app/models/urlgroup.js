
module.exports = function(sequelize, DataTypes) {
  return sequelize.define("UrlGroup", {
    group_name: DataTypes.STRING,
    survey_link: DataTypes.STRING
  })
}