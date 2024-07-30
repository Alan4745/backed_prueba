const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define el esquema para cada entrada de la estadística
const statisticEntrySchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  eventName: {
    type: String,
    required: true,
  },
  // Nuevo campo para tiempo en minutos, no obligatorio
  timeInMinutes: {
    type: Number,
    // Si no se proporciona, será undefined
    default: undefined,
  },
});

// Define el esquema para la estadística general
const statisticSchema = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event", // Referencia al modelo de Evento si lo tienes
      required: true,
    },
    // Nombre del evento referenciado
    name: {
      type: String,
      required: true,
    },
    // Entradas donde se pondrán las estadísticas
    entries: [
      {
        // Nombre de la estadística
        nameStatic: {
          type: String,
          required: true, // Puedes hacer este campo obligatorio si lo deseas
        },
        // Fecha de creación de esta entrada
        createdDate: {
          type: Date,
          default: Date.now,
        },
        // Array de entradas de estadísticas
        statistics: [statisticEntrySchema], // Array de entradas de estadísticas
      },
    ],
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
  }
);

// Crea el modelo a partir del esquema
const Statistic = mongoose.model("Statistic", statisticSchema);

module.exports = Statistic;
