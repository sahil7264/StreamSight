require("dotenv").config();
// const { OpenAI } = require("openai");
const { createClient } = require("@deepgram/sdk");
const fs = require("fs");
const Transcripts = require("../models/Transcripts");


const checkSize = async (filePath) => {
  try {
    var stats = fs.statSync(filePath);
    var fileSizeInBytes = stats.size;
    // Convert the file size to megabytes (optional)
    var fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
    return fileSizeInMegabytes;
  } catch (error) {
    return error;
  }
};
const openAiWhisper = async (url, mp3File, headerText) => {
  try {
    const sizeCheck = await checkSize(mp3File);
    if (sizeCheck > 9.96) {
      return { error: "File size is greater than 10MB, try smaller video" };
    }
    const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      fs.readFileSync(mp3File),
      {
        model: "nova-2",
        smart_format: true,
      }
    );
    const resp = result.results.channels[0].alternatives[0].transcript;
    console.log("Transcription created");
    const transcriptText = `${headerText} ${resp}`;
    const createdMongoInstance = await Transcripts.create({
      videoUrl: url,
      transcript: transcriptText,
    });
    return { resp: transcriptText, createdMongoId: createdMongoInstance._id, error: 0 };
  } catch (err) {
    return { error: 1 };
  }
};

module.exports = openAiWhisper;
