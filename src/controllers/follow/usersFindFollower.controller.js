const User = require("../../models/user.model");

const usersFindFollower = async (req, res) => {
    try {
        const { userId } = req.params;

        // Buscar el usuario por su ID
        let findUser = await User.findById(userId);
        if (!findUser) return res.status(404).send({ message: 'Usuario no encontrado' });

        // Obtener los IDs de los usuarios que sigue
        const followerIds = findUser.followers;

        // Buscar los usuarios que el usuario sigue
        const followerUsers = await User.find(
            { _id: { $in: followerIds } }, // Filtrar por los IDs que el usuario sigue
            { _id: 1, imageAvatar: 1, name: 1 } // Seleccionar solo los campos id, imageAvatar, y name
        );

        // Enviar los resultados
        res.status(200).send({ follower: followerUsers });
    } catch (error) {
        console.error("Error al buscar los usuarios que sigue:", error);
        res.status(500).send({ error: "Hubo un error al buscar los usuarios que sigue" });
    }
};

module.exports = { usersFindFollower };