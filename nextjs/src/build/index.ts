import * as fs from "fs";
import song from "json/song.json";

const excuteBeforeBuild = async () => {
  console.log("no script which execute before build");
};

let scripts: Promise<void>[] = [excuteBeforeBuild()];
(async () => {
  await Promise.all(scripts).then(() => {
    process.exit();
  });
})();
