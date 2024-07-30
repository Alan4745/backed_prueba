const express = require("express");
const controllerStatistic = require("../../controllers/Statistic/Statistic.controller");

const md_autenticacion = require("../../middlewares/authentication");
const api = express.Router();

api.post(
  "/createStatistics",
  [md_autenticacion.Auth],
  controllerStatistic.RegistreEventStatics
);

api.put(
  "/addStatistics",
  [md_autenticacion.Auth],
  controllerStatistic.UpdateStatisticEntries
);

api.put("/UpdateStatisticEntry", controllerStatistic.UpdateStatisticEntry);

api.get(
  "/getStatisticByEventId/:eventId",
  [md_autenticacion.Auth],
  controllerStatistic.getStatisticByEventId
);

// poder usar la rutas.
module.exports = api;
