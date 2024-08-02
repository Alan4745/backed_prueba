const { default: mongoose } = require("mongoose");
const Statistic = require("../../models/Statistics/Statistics.model");
const Counter = require("../../models/Statistics/Counter.model");

// Función para obtener el próximo ID autoincrementable para la colección específica
async function getNextSequenceValue(model) {
  if (!model) {
    throw new Error("El valor del modelo no puede ser null o undefined");
  }

  const counter = await Counter.findOneAndUpdate(
    { model: model },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true } // Crear un nuevo contador si no existe
  );

  if (!counter) {
    throw new Error("No se pudo obtener el siguiente valor del contador");
  }

  return counter.sequence_value;
}

// Controlador para registrar un nuevo conjunto de estadísticas
async function RegistreEventStatics(req, res) {
  try {
    // Obtener el nombre de la estadística y el ID del evento desde la solicitud
    const { eventId, name } = req.body;

    // Validar que se reciban los parámetros necesarios
    if (!eventId || !name) {
      return res.status(400).json({ message: "Faltan parámetros requeridos" });
    }

    // Verificar si ya existe una estadística con el mismo nombre y evento
    const existingStatistic = await Statistic.findOne({ eventId, name });

    if (existingStatistic) {
      return res.status(400).json({
        message: "La estadística ya está registrada para este evento",
      });
    }

    // Crear una nueva estadística
    const newStatistic = new Statistic({
      eventId,
      name,
    });

    // Guardar la nueva estadística en la base de datos
    await newStatistic.save();

    // Enviar respuesta exitosa
    res.status(201).json({
      message: "Estadística registrada exitosamente",
      statistic: newStatistic,
    });
  } catch (error) {
    console.error("Error al registrar la estadística:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

// Controlador para actualizar las entradas de un conjunto de estadísticas
async function UpdateStatisticEntries(req, res) {
  try {
    const { statisticId, entryName, statistics } = req.body;

    if (!statisticId || !entryName) {
      return res.status(400).json({ message: "Faltan parámetros requeridos" });
    }

    if (!mongoose.Types.ObjectId.isValid(statisticId)) {
      return res.status(400).json({ message: "ID de estadística inválido" });
    }

    const statisticDoc = await Statistic.findById(statisticId);

    if (!statisticDoc) {
      return res.status(404).json({ message: "Estadística no encontrada" });
    }

    const existingEntryIndex = statisticDoc.entries.findIndex(
      (entry) => entry.nameStatic === entryName
    );

    if (existingEntryIndex > -1) {
      statisticDoc.entries[existingEntryIndex].statistics = statistics;
      statisticDoc.entries[existingEntryIndex].createdDate = Date.now(); // Actualizar la fecha de creación si se actualiza
    } else {
      statisticDoc.entries.push({
        nameStatic: entryName,
        statistics,
        createdDate: Date.now(),
      });
    }

    await statisticDoc.save();

    res.status(200).json({
      message: "Estadística actualizada exitosamente",
      statistic: statisticDoc,
    });
  } catch (error) {
    console.error("Error al actualizar la estadística:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

// Controlador para actualizar o agregar una entrada en la estadística
async function UpdateStatisticEntry(req, res) {
  try {
    const { statisticId, nameStatic, eventName, timeInMinutes } = req.body;

    // Validar los parámetros requeridos
    if (!statisticId || !nameStatic || !eventName) {
      return res.status(400).json({ message: "Faltan parámetros requeridos" });
    }

    // Verificar si el ID de la estadística es válido
    if (!mongoose.Types.ObjectId.isValid(statisticId)) {
      return res.status(400).json({ message: "ID de estadística inválido" });
    }

    // Buscar el documento de estadística
    const statisticDoc = await Statistic.findById(statisticId);

    if (!statisticDoc) {
      return res.status(404).json({ message: "Estadística no encontrada" });
    }

    // Buscar la entrada específica o crear una nueva si no existe
    let entry = statisticDoc.entries.find(
      (entry) => entry.nameStatic === nameStatic
    );

    if (!entry) {
      // Si no existe la entrada, crear una nueva
      entry = {
        nameStatic: nameStatic,
        createdDate: new Date(),
        statistics: [],
      };
      statisticDoc.entries.push(entry);
    }

    // Obtener el siguiente ID
    const newId = await getNextSequenceValue(nameStatic); // Usa nameStatic como el valor de model

    // Agregar la nueva estadística
    entry.statistics.push({
      id: newId,
      creationDate: new Date(),
      eventName: eventName,
      timeInMinutes: timeInMinutes, // Campo opcional
    });

    // Guardar los cambios en la base de datos
    await statisticDoc.save();

    res.status(200).json({
      message: "Entrada de estadística actualizada exitosamente",
      statistic: statisticDoc,
    });
  } catch (error) {
    console.error(
      "Error al actualizar o agregar la entrada de estadística:",
      error
    );
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

// Controlador para consultar el documento de estadística por ID del evento
async function getStatisticByEventId(req, res) {
  try {
    const { eventId } = req.params;

    // Validar el parámetro requerido
    if (!eventId) {
      return res.status(400).json({ message: "ID del evento es requerido" });
    }

    // Verificar si el ID del evento es válido
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "ID de evento inválido" });
    }

    // Buscar el documento de estadística por ID del evento
    const statisticDoc = await Statistic.findOne({ eventId: eventId });

    if (!statisticDoc) {
      return res.status(404).json({ message: "Estadística no encontrada" });
    }

    res.status(200).json({
      message: "Estadística encontrada exitosamente",
      statistic: statisticDoc,
    });
  } catch (error) {
    console.error(
      "Error al consultar la estadística por ID del evento:",
      error.message
    );
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

module.exports = {
  RegistreEventStatics,
  UpdateStatisticEntries,
  UpdateStatisticEntry,
  getStatisticByEventId,
};
