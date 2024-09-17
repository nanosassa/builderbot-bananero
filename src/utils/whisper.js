import { downloadMediaMessage } from "@whiskeysockets/baileys";
import OpenAI from "openai";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";


ffmpeg.setFfmpegPath(ffmpegPath.path);

const voiceToText = async (path) => {
    if (!fs.existsSync(path)) {
        throw new Error("No se encuentra el archivo");
    }
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY, // Asegúrate de configurar tu clave de API
          });
          
          const resp = await openai.audio.transcriptions.create({
            file: fs.createReadStream(path), // Archivo de audio
            model: "whisper-1",              // Modelo Whisper
            language: "es",                  // Código de idioma (en este caso, español)
          });
            
        return resp.text;
    } catch (err) {
        console.log(err.response);
        return "ERROR";
    }
};

const convertOggMp3 = async (inputStream, outStream) => {
    return new Promise((resolve, reject) => {
        ffmpeg(inputStream)
            .audioQuality(96)
            .toFormat("mp3")
            .save(outStream)
            .on("progress", (p) => null)
            .on("end", () => {
                resolve(true);
            });
    });
};

const handlerAI = async (ctx) => {
    const buffer = await downloadMediaMessage(ctx, "buffer", {});
    const pathTmpOgg = `${process.cwd()}/tmp/voice-note-${Date.now()}.ogg`;
    const pathTmpMp3 = `${process.cwd()}/tmp/voice-note-${Date.now()}.mp3`;
    await fs.writeFileSync(pathTmpOgg, buffer);
    await convertOggMp3(pathTmpOgg, pathTmpMp3);
    const text = await voiceToText(pathTmpMp3);
    fs.unlink(pathTmpMp3, (error) => {
        if (error) throw error;
    });
    fs.unlink(pathTmpOgg, (error) => {
        if (error) throw error;
    });
    console.info("audio a texto:" + text)
    return text;
};

export default handlerAI;