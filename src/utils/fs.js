import fs from 'fs';
import path from 'path';

const deleteAudioFiles = () => {
    const directory = `${process.cwd()}/tmp/`; // Cambia a la ruta donde se encuentran los archivos si es diferente
    const extensions = ['.ogg', '.opus','.mp3'];

    // Lee el directorio y borra los archivos con las extensiones especificadas
    fs.readdir(directory, (err, files) => {
        if (err) {
            console.error('Error al leer el directorio:', err);
            return;
        }

        files.forEach(file => {
            if (extensions.includes(path.extname(file))) {
                fs.unlink(path.join(directory, file), (err) => {
                    if (err) {
                        console.error(`Error al eliminar el archivo ${file}:`, err);
                    } else {
                        console.log(`Archivo eliminado: ${file}`);
                    }
                });
            }
        });
    });
};

export default deleteAudioFiles;