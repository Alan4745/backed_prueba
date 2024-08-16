const TokenCollection = require("../../models/tokens/tokenCollection.model");
const Collections = require("../../models/tokens/collections.model");
const { default: mongoose } = require("mongoose");
const { Post } = require("../../models/post/posts.model");

const getCollectionByIdPost = async (req, res) => {
    try { 
        const { idPost } = req.params;
        // Verifica si se proporcionó el idPost
        if (!idPost) {
            return res.status(400).send({ message: "Proporciona un idPost válido." });
        }

        // Verifica si el idPost es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(idPost)) {
            return res.status(400).send({ message: "El idPost proporcionado no es válido." });
        }

        // Busca la publicación en la base de datos
        const postFound = await Post.findById(idPost);
        if (!postFound) {
            return res.status(404).send({ message: "Publicación no encontrada." });
        }

        // Busca la colección asociada al idPost
        const collectionFound = await Collections.findOne({ idPost: idPost });
        if (!collectionFound) {
            return res.status(404).send({ message: "Colección no encontrada." });
        }

        // Buscar todos los tickets asociados a la colección
        const ticketsFounds = await TokenCollection.find({ idCollection: collectionFound._id });

        if (!ticketsFounds.length) {
            return res.status(404).send({ message: "No se encontraron tickets para esta colección." });
        }

        // Obtener el número total de tickets, el primero y el último
        const numberOfTickets = ticketsFounds.length;
        const firstTicket = ticketsFounds[0];
        const lastTicket = ticketsFounds[numberOfTickets - 1];

        // Envía la colección, número total de tickets, el primero y el último como respuesta
        return res.status(200).send({
            collection: collectionFound,
            numberOfTickets,
            firstTicket,
            lastTicket
        });
    } catch (error) {
        console.error("Error al obtener la colección por idPost:", error);
        res.status(500).send({ message: "Error al obtener la colección por idPost." });
    }
};

module.exports = { getCollectionByIdPost };
