import { promises as fs } from 'fs';
import path from 'path';

import textToSpeech  from '@google-cloud/text-to-speech';
import { v4 as uuidv4 } from 'uuid';

const textToVoice = async (text) => {
    try {
        
        const __dirname = import.meta.dirname;

        const client = new textToSpeech.TextToSpeechClient({
            projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
            keyFilename: path.join(__dirname, './keyfile.json'),
        });

        const request = {
            input: {text: text || 'Hola Como estas?'},
            voice: {languageCode: 'es-419', ssmlGender: 'MALE'},
            audioConfig: {audioEncoding: 'OGG_OPUS', speakingRate: 1.2},
        };

        const [response] = await client.synthesizeSpeech(request);
        console.log(`Audio synthesized, content-length: ${response.audioContent.length} bytes`);

        // Crear directorio tmp si no existe
        const tmpDir = path.join(__dirname, '../../tmp');
        await fs.mkdir(tmpDir, { recursive: true });

        // Generar un nombre de archivo único
        const fileName = `audio_${uuidv4()}.ogg`;
        const filePath = path.join(tmpDir, fileName);

        // Escribir el contenido del audio en el archivo
        await fs.writeFile(filePath, response.audioContent);

        console.log(`Audio guardado en: ${filePath}`);

        return filePath;
    } catch (err) {
        console.error('Error en textToVoice:', err);
        throw err;
    }
};


export default textToVoice;