const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const driverManagement = require("../models/driverManagement");
const isDriver = require("../middleware/isDriver");

// Prenotazioni prese in carico dall'autista corrispondente all'id passato
router.get("/myreservations/", isDriver, async (req, res) => {
  try {
    res.json(await driverManagement.myReservation(req.user.id));
  } catch (err) {
    res.json({
      error: "Database error when requesting reservations - " + err,
    });
  }
});

// Prenotazioni non confermate da nessun autista
router.get("/reservationsnotconfirmed/", isDriver, async (req, res) => {
  try {
    res.json(await driverManagement.reservationNotConfirmed());
  } catch (err) {
    res.json({
      error: "Database error when requesting unconfirmed reservations - " + err,
    });
  }
});

// Ritiro macchina
router.post("/retirecar/", isDriver, async (req, res) => {
  const reservation = {
    refDriver: req.user.id,
    refVehicle: req.body.refVehicle,
    id: req.body.id,
  };
  try {
    await driverManagement.retireCar(reservation);
    res.status(201).end();
  } catch (err) {
    res.json({
      error: "Database error when requesting unconfirmed reservations - " + err,
    });
  }
});

// Consegna macchina
router.delete("/cardelivery/", isDriver, async (req, res) => {
  const reservation = {
    refDriver: req.user.id,
    refVehicle: req.body.refVehicle,
    id: req.body.id,
  };
  try {
    await driverManagement.carDelivery(reservation);
    res.status(201).end();
  } catch (err) {
    res.json({
      error: "Database error while canceling the reservation - " + err,
    });
  }
});



// Conferma prenotazione
router.put("/confirmationofreservation/:id", isDriver, async (req, res) => {
  try {
    await driverManagement.confirmationOfReservation(req.body.idRes, req.user.id);
    res.status(201).end();
  } catch (err) {
    res.json({
      error: "Database error while updating the reservation - " + err,
    });
  }
});

module.exports = router;
