const { Post } = require("../../models/post/posts.model");
const User = require("../../models/user.model");
const Collections = require("../../models/tokens/collections.model");
const TokenCollection = require("../../models/tokens/tokenCollection.model");// Función que verifica si algo está dentro de un radio
const { verifyRedemptionPost } = require("../../funcs/verifyRedemptionPost");

const postsDetectByKmRadius = async (req, res) => {
  try {
    const { coordinates } = req.body; // Las coordenadas llegan por el req.body como [latitud, longitud]
    console.log(coordinates)
    console.log(coordinates.length)
    if (!coordinates || coordinates.length !== 2) {
      return res.status(400).json({ success: false, message: 'Coordenadas no válidas' });
    }

    // Obtener todos los posts sin aplicar filtro de distancia
    const allPosts = await Post.find();

    // Radio en metros (500 km)
    const radiusInMeters = 500 * 1000;

    // Crear un array para almacenar los posts dentro del radio
    const filteredPosts = await Promise.all(
      allPosts.map(async (post) => {
        // Verificar si el post tiene ubicación (asumiendo que se almacena en `post.location`)
        if (post.coordinates && post.coordinates && post.coordinates.length === 2) {
          // Verificar si el post está dentro del radio usando `verifyRedemption`
          const verificationResult = await verifyRedemptionPost(post, coordinates, radiusInMeters);
          if (verificationResult.success) {
            // Buscar el usuario correspondiente
            const user = await User.findById(post.author, { password: 0 });

            // Si el usuario no tiene una imagen, manejar el caso aquí
            const image = user.imageAvatar ? {
              public_id: user.imageAvatar.public_id,
              secure_url: user.imageAvatar.secure_url
            } : { public_id: "", secure_url: "" };

            // Crear el objeto dataAuthor
            const dataAuthor = {
              image,
              author: user.name, // Asumí que deseas que 'author' sea el nombre del usuario
              authorName: user.name
            };

            // Modificar el objeto post para incluir dataAuthor
            post.dataAuthor = dataAuthor;

            // Buscar la colección correspondiente al post
            let collectionFound = await Collections.findOne({ idPost: post._id });
            if (!collectionFound) {
              collectionFound = { message: "Colección no encontrada." };
            }

            // Buscar los tickets de la colección
            const ticketsFounds = await TokenCollection.find({ idCollection: collectionFound._id });
            const numberOfTickets = ticketsFounds.length > 0 ? ticketsFounds.length : 0;
            const numberLikes = post.likes.length > 0 ? post.likes.length : 0;

            // Retornar el post con la información adicional
            return {
              post,
              numberLikes,
              collectionFound,
              numberOfTickets
            };
          }
        }
        return null; // Si el post no tiene ubicación o no está dentro del radio, retorna null
      })
    );

    // Filtrar los null para obtener solo los posts válidos
    const validPosts = filteredPosts.filter((post) => post !== null);

    // Si no se encontraron posts dentro del radio
    if (!validPosts.length) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron posts dentro del radio especificado',
      });
    }

    return res.status(200).json({ success: true, postsFound: validPosts });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ success: false, message: 'Error al buscar posts en el radio especificado' });
  }
};

module.exports = {
  postsDetectByKmRadius
};
