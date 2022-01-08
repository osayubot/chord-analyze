import fs from "fs";
import chordAnalyze from "./analyze/chord/index.mjs";
import generateNextjsJson from "./analyze/nextjs/index.mjs";
import generateMDSCsv from "./analyze/mds/index.mjs";

// 10万曲は　(let i = 0; i < 100; i++)
for (let i = 0; i < 2; i++) {
  let newAnalyzeData = [];
  for (let n = i * 1000; n < i * 1000 + 1000; n++) {
    // １フォルダ中にあるファイル数
    let filesNum = 100;
    let remainder = n - (n % filesNum);
    const dir = `chord${remainder + 1}_${remainder + filesNum}`;
    const dirName = `./data_raw/${dir}/json${(n % 100) + 1}.json`;
    // フォルダが存在するとき操作
    if (fs.existsSync(dirName)) {
      const data = JSON.parse(fs.readFileSync(dirName, "utf8"));
      // 分析
      const resultData = chordAnalyze(data);
      // 配列に追加
      if (resultData.result === true) {
        // result が true のもののみ
        newAnalyzeData.push(resultData);
      }
    }
    if (n % filesNum === 0) console.log(n);
  }
  // 保存先のディレクトリ
  const analyzeDir = `./data_analyze/song${i * 1000 + 1}_${
    i * 1000 + 1000
  }.json`;
  // 分析データを保存する
  fs.writeFileSync(analyzeDir, JSON.stringify(newAnalyzeData, null, " "));
  console.log(`song${i * 1000 + 1}_${i * 1000 + 1000}.json generated.`);
}

generateNextjsJson();
//generateMDSCsv();

console.log("done!");
