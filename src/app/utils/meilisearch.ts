import { MeiliSearch } from "meilisearch";
import config from "../config";
import { TNewsItem } from "../modules/NewsFeed/newsfeed.interface";
import { Document, Types } from "mongoose";

const meiliClient = new MeiliSearch({
  host: config.meilisearch_host as string,
  apiKey: config.meilisearch_master_key,
});

export async function addDocumentToIndex(
  result: Document<unknown, object, TNewsItem> &
    TNewsItem & { _id: Types.ObjectId },
  indexKey: string
) {
  const index = meiliClient.index(indexKey);

  const { _id, title, content, source, author, } = result;

  const document = {
    id: _id.toString(),
    title,
    content,
    source,
    author
  };

  try {
    await index.addDocuments([document]);
  } catch (error) {
    console.error("Error adding document to MeiliSearch", error);
  }
}

export const deleteDocumentFromIndex = async (indexKey: string, id: string) => {
  const index = meiliClient.index(indexKey);

  try {
    await index.deleteDocument(id);
  } catch (error) {
    console.error("Error deleting resource from MeiliSearch:", error);
  }
};

export const deleteMeiliSearchIndex = async (indexKey: string) => {
    meiliClient.deleteIndex(indexKey);
}

export default meiliClient;
