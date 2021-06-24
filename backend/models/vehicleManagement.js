//2 GESTIONE VEICOLI

"use strict";

const db = require("../db/db");

//  2.1 AGGIUNGI VEICOLO:

// add a new vehicle
exports.createVehicle = (vehicle) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO vehicles(type, category, refParking, position) VALUES(?, ?, ?, ?)";
    db.run(
      sql,
      [vehicle.type, vehicle.category !== "" ? vehicle.category : 'NULL', vehicle.refParking, vehicle.position],
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      }
    );
  });
};

//  2.2 RIMUOVI VEICOLO:

// get all Vehicles identified by {tipologia}
exports.listVehicle = (tipologia) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM vehicles WHERE type = ?";
    db.all(sql, [tipologia], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const vehicles = rows.map((v) => ({
        id: v.id,
        category: v.category,
        refParking: v.refParking,
        position: v.position,
        state: v.state,
      }));
      resolve(vehicles);
    });
  });
};

// delete an existing vehicles
exports.deleteVehiclesById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM vehicles WHERE id = ?";
    db.run(sql, [id], (err) => {
      if (err) {
        reject(err);
        return;
      } else resolve(null);
    });
  });
};

//  2.3 MODIFICA STATO VEICOLO:

// get all Vehicles identified by {tipologia}

// update an existing vehicle
exports.updateVehicle = (vehicle) => {
  console.log(vehicle);
  return new Promise((resolve, reject) => {
    const sql = "UPDATE vehicles SET refParking = ?, state = ? WHERE id = ?";
    db.run(sql, [vehicle.refParking, vehicle.state, vehicle.id], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};
