import low from "lowdb";
import { AdapterSync } from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import path from "path";

const adapter: AdapterSync = new FileSync(path.resolve(__dirname, "./lowdb.json"));
const lowdb = low(adapter);

lowdb.defaults({ oauth_clients: [] }).write();

export { lowdb };
