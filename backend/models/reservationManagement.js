const db = require("../db/db");

exports.deleteReservationById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM reservations WHERE id = ?";
    db.run(sql, [id], (err) => {
      if (err) {
        reject(err);
        return;
      } else resolve(null);
    });
  });
};

//  5.2 PRENOTAZIONI EFFETTUATE: (ADMIN)

// get elenco prenotazioni by name, surname, type, date in questo formato '2021-06-19 00:00'-'2021-06-19 23:59'

exports.listReservations = (name, surname, type, dateS, dateE) => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT users.name, users.surname, reservations.id, reservations.dateR, reservations.dateC FROM users JOIN reservations ON users.id = reservations.refGuest JOIN vehicles ON reservations.refVehicles = vehicles.id WHERE vehicles.type = ? AND users.name = ? AND users.surname= ? AND ((dateR >= ? AND dateR <= ?) OR (dateC >= ? AND dateC <= ?))";
    db.all(
      sql,
      [type, name, surname, dateS, dateE, dateS, dateE],
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const res = rows.map((r) => ({
          name: r.name,
          surname: r.surname,
          id: r.id,
          dateR: r.dateR,
          dateC: r.dateC,
        }));
        resolve(res);
      }
    );
  });
};

exports.listReservations = (idV) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM reservations WHERE refVehicle = ?";
    db.all(sql, [idV], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const res = rows.map((r) => ({
        id: r.id,
        refGuest: r.refGuest,
        dateR: r.dateR,
        dateC: r.dateC,
      }));
      resolve(res);
    });
  });
};

//  5.3 MODIFICA PRENOTAZIONE:

// get dati prenotazione by id

exports.getReservationById = (idP) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM reservations WHERE id=?";
    db.get(sql, [idP], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row == undefined) {
        resolve({ error: "Reservation not found." });
      } else {
        const reservation = {
          id: row.id,
          dateR: row.dateR,
          dateC: row.dateC,
          refParkingR: row.refParkingR,
          refParkingC: row.refParkingC,
          refGuest: row.refGuest,
          state: row.state,
        };
        resolve(reservation);
      }
    });
  });
};

exports.retireVehicle = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE vehicles SET state = "in use" WHERE id = ?';
    db.run(sql, [id], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

// verifica possibilità di modifica ed eventualmente modifica

// update an existing reservation
exports.updateReservation = (reservation) => {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE reservations as R SET dateR = ?, dateC= ?, refParkingR = ?, refParkingC = ? WHERE id = ? AND NOT EXISTS (SELECT 1 FROM reservations AS R1 WHERE R1.refVehicle =? AND id != ?)";
    db.run(
      sql,
      [
        reservation.dateR,
        reservation.dateC,
        reservation.refParkingR,
        reservation.refParkingC,
        reservation.id,
        reservation.refVehicle,
        reservation.id,
      ],
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.changes);
      }
    );
  });
};

//  5.4 VISUALIZZA MIE PRENOTAZIONI: (GUEST)

// get reservations by userId
exports.getMyReservations = (userId) => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT r.id,r.refVehicle, v.type, v.category, r.dateR, r.dateC, r.refParkingR, r.refParkingC, r.refDriver, r.positionR, r.positionC, r.state FROM reservations AS r JOIN vehicles AS v ON r.refVehicle= v.id WHERE r.refGuest = ?";
    db.all(sql, [userId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const reservations = rows.map((r) => ({
        id: r.id,
        refVehicle: r.refVehicle,
        type: r.type,
        category: r.category,
        dateR: r.dateR,
        dateC: r.dateC,
        refParkingR: r.refParkingR,
        refParkingC: r.refParkingC,
        refDriver: r.refDriver,
        positionR: r.positionR,
        positionC: r.positionC,
        state: r.state,
      }));
      resolve(reservations);
    });
  });
};

exports.getMyReservationsNotWithdrawn = (userId) => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT r.id,r.refVehicle, v.type, v.category, r.dateR, r.dateC, r.refParkingR, r.refParkingC, r.refDriver, r.positionR, r.positionC, r.state FROM reservations AS r JOIN vehicles AS v ON r.refVehicle= v.id WHERE r.refGuest = ? AND r.state != 'withdrawn'";
    db.all(sql, [userId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const reservations = rows.map((r) => ({
        id: r.id,
        refVehicle: r.refVehicle,
        type: r.type,
        category: r.category,
        dateR: r.dateR,
        dateC: r.dateC,
        refParkingR: r.refParkingR,
        refParkingC: r.refParkingC,
        refDriver: r.refDriver,
        positionR: r.positionR,
        positionC: r.positionC,
        state: r.state,
      }));
      resolve(reservations);
    });
  });
};

exports.deliveryVehicle = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE vehicles SET state = "available" WHERE id = ?';
    db.run(sql, [id], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

exports.damagedVehicle = (id, posizione) => {
  return new Promise((resolve, reject) => {
    const sql =
      'UPDATE vehicles SET state = "damage", position = ? WHERE id = ?';
    db.run(sql, [posizione, id], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

exports.getVehicleWithoutReservation = (type, category, position) => {
  return new Promise((resolve, reject) => {
    const sql =
      'SELECT * FROM vehicles WHERE type = ? AND category = ? AND position = ? AND state = "available" AND id NOT IN(SELECT refVehicles FROM reservations)';
    db.all(sql, [type, category, position], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      if (row == undefined) {
        resolve({ error: "Vehicle not found." });
      } else {
        const vehicles = rows.map({
          id: vehicles.id,
          position: vehicles.position,
        });
        resolve(v);
      }
    });
  });
};

exports.updateVehicleInReservations = (idV, newIdV) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE reservations SET refVehicles = ? WHERE refVehicles = ?";
    db.run(sql, [newIdV, idV], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID); //dovrei capire a che cazzo serve
    });
  });
};

exports.addReservation = (reservation, userId) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO reservations(refGuest, refVehicle, dateR, dateC, refParkingR, refParkingC, positionR, positionC) VALUES(?,?,?,?,?,?,?,?)";
    db.run(
      sql,
      [
        userId,
        reservation.refVehicle,
        reservation.dateR,
        reservation.dateC,
        reservation.refParkingR,
        reservation.refParkingC,
        reservation.positionR,
        reservation.positionC,
      ],
      (err) => {
        if (err) {
          reject(err);
          return;
        }
        const sql2 =
          "SELECT * FROM reservations WHERE ROWID=last_insert_rowid()";
        db.get(sql2, [], (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(row.id);
        });
      }
    );
  });
};

exports.retireVehicle = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE vehicles SET state = 'in use' WHERE id = ?";
    db.run(sql, [id], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

exports.addReservationWithDriver = (reservation, userId) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO reservations(refGuest, refVehicle, dateR, dateC, refParkingR, refParkingC, positionR, positionC, state) VALUES(?,?,?,?,?,?,?,?, 'not confirmed')";
    db.run(
      sql,
      [
        userId,
        reservation.refVehicle,
        reservation.dateR,
        reservation.dateC,
        reservation.refParkingR,
        reservation.refParkingC,
        reservation.positionR,
        reservation.positionC,
      ],
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      }
    );
  });
};

exports.retireVehicle = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE vehicles SET state = 'in use' WHERE id = ?";
    db.run(sql, [id], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

exports.updateVehicleInReservation = (idOldVehicle, idNewVehicle) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE reservations SET refVehicle = ? WHERE refVehicle = ?";
    db.run(sql, [idNewVehicle, idOldVehicle], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

exports.isInReservations = (idGuest, idReservation) => {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE reservations SET state='late delivery' WHERE id = ? AND refGuest= ?";
    db.run(sql, [idReservation, idGuest], function (err, row) {
      if (err) {
        reject(err);
        return;
      }
      console.log("CAMBIAMENTI " + this.changes);
      this.changes === 1 ? resolve(true) : resolve(false);
      //resolve(row);
    });
  });
};

exports.canTEditReservation = (refVehicle, id) => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT id FROM reservations as r WHERE r.refVehicle = ? AND r.id != ?";
    db.get(sql, [refVehicle, id], (err, row) => {
      if (err) {
        reject(err);
      }
      resolve(row ? true : false);
    });
  });
};

exports.changeDestinationParking = (reservation) => {
  console.log("RESERVATION: " + reservation);
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE reservations SET refParkingR = ? AND refParkingC = ? WHERE id = ?";
    db.run(
      sql,
      [reservation.refParkingR, reservation.refParkingC, reservation.id],
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        console.log("CAMBIAMENTI " + this.changes);
        this.changes === 1 ? resolve(true) : resolve(false);
        //resolve(row);
      }
    );
  });
};

exports.changeState = (reservation) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE reservations SET state = ? WHERE id = ?";
    db.run(sql, [reservation.state, reservation.id], function (err) {
      if (err) {
        reject(err);
        return;
      }
      console.log("CAMBIAMENTI " + this.changes);
      this.changes === 1 ? resolve(true) : resolve(false);
      //resolve(row);
    });
  });
};

exports.changeDate = (reservation) => {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE reservations SET dateR = ?, dateC= ? WHERE id = ?";
    db.run(
      sql,
      [
        reservation.dateR,
        reservation.dateC,
        reservation.id
      ],
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.changes);
      }
    );
  });
};

exports.getReservationByIdAndRefDriver = (id, refDriver) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM reservations WHERE id=? AND refDriver = ?";
    db.get(sql, [id, refDriver], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row == undefined) {
        resolve({ error: "Reservation not found." });
      } else {
        const reservation = {
          id: row.id,
          dateR: row.dateR,
          dateC: row.dateC,
          refParkingR: row.refParkingR,
          refParkingC: row.refParkingC,
          refGuest: row.refGuest,
          state: row.state,
        };
        resolve(reservation);
      }
    });
  });
};