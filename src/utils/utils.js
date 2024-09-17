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

const loadGoogleCredentials = () => {
    // Ruta temporal donde se guardará el archivo keyfile.json
    const keyfilePath = `${process.cwd()}/tmp/keyfile.json`;

    // Escribir la variable de entorno en un archivo
    fs.writeFileSync(keyfilePath, process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

    // Ahora configura la variable GOOGLE_APPLICATION_CREDENTIALS para apuntar al archivo temporal
    process.env.GOOGLE_APPLICATION_CREDENTIALS = keyfilePath;

}

export { deleteAudioFiles, loadGoogleCredentials };