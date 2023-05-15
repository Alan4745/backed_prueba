const tokenCollectionModel = require('../../models/tokens/tokenCollection.model');

async function cobrar(req, res) {
    console.log("estamosaqueieiie");
    tokenCollectionModel.findOne({ _id: req.params.ticket_id }, (_err, find_ticket) => {
        console.log("estamosaqueieiie");
        if (find_ticket.canjeado) {
            return res.status(200).send({ message: "tu tickt ya fue canjeado mierda" })


        }
        tokenCollectionModel.findByIdAndUpdate(req.params.ticket_id, { canjeado: true }, { new: true }, (err, update_ticket_canje) => {
            return res.status(200).send({ message: update_ticket_canje })
        })
    



    })
}

module.exports = {
    cobrar
}