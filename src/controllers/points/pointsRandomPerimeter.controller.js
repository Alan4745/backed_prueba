const { Points } = require('../../models/points/points.model');
const { PointsMarked } = require('../../models/points/pointsMarked.model');
const turf = require('@turf/turf'); // Para cálculos de geolocalización
const { getRandomNumberInRange } = require('../../funcs/getRandomNumberInRange');

const createPerimeterAndDistributePoints = async (req, res) => {
    const { amount, type, coordinates, emitterId } = req.body;

    if (!amount || !type || !coordinates || !emitterId) {
        return res.status(400).json({ message: 'Faltan datos requeridos' });
    }
    console.log(coordinates)
    // Validación de coordenadas para Point
    if (type === 'Point') {
        if (!Array.isArray(coordinates) || coordinates.length !== 2 || !coordinates.every(coord => typeof coord === 'number')) {
            return res.status(400).json({ message: 'Coordenadas inválidas para Point' });
        }
    }

    try {
        // Crear el perímetro
        const newPerimeter = new Points({
            amountCurrent: amount,
            amountInitial: amount,
            location: {
                type,
                coordinates
            },
            emitter: emitterId
        });

        await newPerimeter.save();

        // Distribuir los puntos aleatoriamente dentro del perímetro
        if (type === 'Polygon') {
            const polygon = turf.polygon(coordinates); // Crear el polígono usando @turf
            let remainingAmount = amount; // Monto restante a distribuir
            const generatedPoints = [];

            while (remainingAmount > 0) {
                let point = null;
                do {
                    // Generar un punto aleatorio dentro del polígono
                    const randomPoint = turf.randomPoint(1, { bbox: turf.bbox(polygon) });
                    point = randomPoint.features[0].geometry.coordinates;
                } while (!turf.booleanPointInPolygon(point, polygon));

                generatedPoints.push(point);

                // Generar un valor aleatorio para amountPointsMarked
                const pointCount = getRandomNumberInRange(remainingAmount);

                // Si el pointCount es mayor que el remainingAmount, ajustarlo
                const amountPointsMarked = pointCount > remainingAmount ? remainingAmount : pointCount;

                // Restar el monto asignado del monto restante
                remainingAmount -= amountPointsMarked;

                // Crear el punto marcado
                const pointMarked = new PointsMarked({
                    amountPointsMarked,
                    location: {
                        type: 'Point',
                        coordinates: point
                    },
                    idPoints: newPerimeter._id,
                    redeemed: false
                });

                await pointMarked.save();
            }
        } else if (type === 'Point') {
            // Crear un único punto marcado si el tipo es Point
            const pointMarked = new PointsMarked({
                amountPointsMarked: amount,
                location: {
                    type: 'Point',
                    coordinates
                },
                idPoints: newPerimeter._id,
                redeemed: false
            });

            await pointMarked.save();
        }

        res.status(201).json({ message: 'Perímetro creado y puntos distribuidos con éxito', perimeter: newPerimeter });
    } catch (error) {
        console.error('Error al crear el perímetro y distribuir puntos:', error);
        res.status(500).json({ message: 'Error al crear el perímetro y distribuir puntos', error });
    }
};

module.exports = {
    createPerimeterAndDistributePoints
}
