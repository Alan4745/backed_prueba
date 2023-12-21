const tokenCollectionModel = require('../../models/tokens/tokenCollection.model');
//CODIGO PARA CANJEAR TICKETS 
async function cobrar(req, res) {
	try {
		console.log('estamosaqueieiie');
      
		const find_ticket = await tokenCollectionModel.findOne({ _id: req.params.ticket_id }).exec();
      
		console.log('estamosaqueieiie');
      
		if (find_ticket.canjeado) {
			return res.status(200).send({ message: 'Tu ticket ya fue canjeado' });
		}
  
		const update_ticket_canje = await tokenCollectionModel.findByIdAndUpdate(
			req.params.ticket_id,
			{ canjeado: true },
			{ new: true }
		).exec();
  
		return res.status(200).send({ message: update_ticket_canje });
	} catch (error) {
		console.error('Error al procesar la solicitud:', error);
		return res.status(500).send({ error: 'Hubo un error al procesar la solicitud' });
	}
}
  


module.exports = {
	cobrar
};