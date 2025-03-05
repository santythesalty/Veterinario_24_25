var DataTypes = require("sequelize").DataTypes;
var _dueno = require("./dueno");
var _perro = require("./perro");

function initModels(sequelize) {
  var dueno = _dueno(sequelize, DataTypes);
  var perro = _perro(sequelize, DataTypes);

  perro.belongsTo(dueno, { as: "id_dueno_Dueno", foreignKey: "id_dueno"});
  dueno.hasMany(perro, { as: "Perros", foreignKey: "id_dueno"});

  return {
    dueno,
    perro,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
