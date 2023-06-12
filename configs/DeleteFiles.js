const fs = require('fs');
const path = './uploads';

function DeletefilesBackend() {
	console.log(path);
	fs.readdir(path, (err, files) => {
		if (err) {
			console.error(err);
			return;
		}
		if (files.length === 0) {
			console.log('la carpeta esta vacia');
		} else {
			console.log(`La carpeta tiene ${files.length} archivos(s)`);
		}
		files.forEach(file => {
			fs.unlink(`${path}/${file}`, err => {
				if (err) {
					console.error(err);
					return;
				}
				console.log(`Se Elimino El Archivo ${file}`);
			});
		});
	});
}

module.exports = {
	DeletefilesBackend
};

