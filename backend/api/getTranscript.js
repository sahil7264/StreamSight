const ytdl = require("ytdl-core");
const fs = require("fs");
const openAiWhisper = require("./openaiWhisper");
const Transcripts = require("../models/Transcripts");

const getTranscriptResponse = async (url, mp3) => {
  // console.log("Here");
  try {
    const foundVideo = await Transcripts.findOne({ videoUrl: url });
    if (false) {
      return { success: true, newFileCreated: false, transcriptText: foundVideo.transcript };
    } else {
      // console.log("Here");
      const info = await ytdl.getInfo(url);
      // console.log(info);
      if (info.videoDetails.lengthSeconds > 1380) {
        return { success: false, newFileCreated: false, error: "Video is larger than expected, try smaller videos" };
      }
      const headerText = `The title is: ${info.videoDetails.title} and the text is: `
      const video = ytdl(url, { quality: "lowestaudio" }, { filter: "audioonly" });
      // console.log("Here");
      const writeStream = fs.createWriteStream(mp3);
      video.pipe(writeStream);
      const fileCreationPromise = new Promise((resolve) => {
        writeStream.on("finish", () => {
          resolve();
        });
      });
      await fileCreationPromise;
      // console.log("File created");
      const transcriptText = await openAiWhisper(url, mp3, headerText);
      // console.log(transcriptText);
      if (transcriptText.error != 0) {
        return { success: false, newFileCreated: false, error: "Something went wrong!" };
      }

      const getTranscriptofVid = await Transcripts.findOne({ videoUrl: url });
      // return { success: true, newFileCreated: true, transcriptText: getTranscriptofVid.transcript,id :transcriptText }
      return { success: true, newFileCreated: true, transcriptText: transcriptText.resp, mongoId: transcriptText.createdMongoId };
    }
  } catch (error) {
    return { success: false, newFileCreated: false, error: error.message };
  }
};

module.exports = getTranscriptResponse;