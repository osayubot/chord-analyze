import fs from "fs";
import chordAnalyze from "./analyze/chord/index.mjs";
import generateNextjsJson from "./analyze/nextjs/index.mjs";
import generateMDSCsv from "./analyze/mds/index.mjs";

// 保存先のディレクトリ
const analyzeDir = "./data_analyze/song.json";

let newAnalyzeData = [];

// １フォルダ中にあるファイル数
/*let filesNum = 100;

for (let n = 0; n <= 1000; n++) {
  let remainder = n - (n % filesNum);
  const dir = `chord${remainder + 1}_${remainder + filesNum}`;

  const dirName = `./data_raw/${dir}/json${(n % 100) + 1}.json`;
  const data = JSON.parse(fs.readFileSync(dirName, "utf8"));

  // 分析
  const resultData = chordAnalyze(data);

  // 配列に追加
  if (resultData.result === true) {
    // result が true のもののみ
    newAnalyzeData.push(resultData);
  }
}

// 分析データを保存する
fs.writeFileSync(analyzeDir, JSON.stringify(newAnalyzeData, null, " "));
*/
generateNextjsJson();
//generateMDSCsv();

console.log("done!");
