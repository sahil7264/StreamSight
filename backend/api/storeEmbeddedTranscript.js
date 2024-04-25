
require("dotenv").config();
const { TextLoader } = require("langchain/document_loaders/fs/text");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { PineconeStore } = require("langchain/vectorstores/pinecone");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { PineconeClient } = require("@pinecone-database/pinecone");
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_API_ENV = "asia-southeast1-gcp";
const storeEmbedded = async (textFile) => {
  try {
    console.log("In storing Embedded");
    const loader = new TextLoader(textFile);
    const documents = await loader.load();
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunk_size: 1000,
      chunk_overlap: 10,
    });
    const texts = await textSplitter.splitDocuments(documents);
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: "embedding-001" });

    const emb = model.embedContent(textFile).then((result) => {
      return result
    });
    console.log(emb);

    // const client = new PineconeClient();
    // await client.init({
    //   environment: PINECONE_API_ENV,
    //   apiKey: PINECONE_API_KEY,
    // });
    // const index_name = process.env.PINECONE_INDEX_NAME;
    // const pineconeIndex = client.Index(index_name);
    // await PineconeStore.fromDocuments(texts, embeddings, {
    //   pineconeIndex,
    // });
    return "success";
  } catch (error) {
    return "error";
  }
};

module.exports = storeEmbedded;
