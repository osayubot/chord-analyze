import fs from "fs";
import analyze from "./js/index.mjs";

// 保存先のディレクトリ
const analyzeDir = "./nextjs/src/json/song.json";

let newAnalyzeData = [];

/*const analyzeData = JSON.parse(fs.readFileSync(analyzeDir, "utf8"));
analyzeData.map((item) => {
  newAnalyzeData.push(item);
});*/

// 分析対象のデータとディレクトリ
let folderMaxNum = 100;

for (let n = 0; n <= 1000; n++) {
  if (n % 100 === 0 && n !== 0) folderMaxNum += 100;
  const dir = `chord${(
    folderMaxNum - 99
  ).toString()}_${folderMaxNum.toString()}`;
  const dirName = `./data/${dir}/json${(n % 100) + 1}.json`;
  const data = JSON.parse(fs.readFileSync(dirName, "utf8"));

  // 分析
  const resultData = analyze(data);

  // 配列に追加
  newAnalyzeData.push(resultData);
}

// 分析データを保存する
fs.writeFileSync(analyzeDir, JSON.stringify(newAnalyzeData, null, " "));

console.log("done!");
