import * as fs from "fs";
import Blob from "cross-blob";

// nextjs用の分析ファイル

export default function generateMdsCSV() {
  //const id = params.id;

  const songs = JSON.parse(fs.readFileSync("./data_analyze/song.json", "utf8"));

  let mdsCsvChordData = "";
  let mdsCsvTensionData = "";

  let bomLabel = [];
  songs.map((data) => {
    let chordCsvRow = data.song;
    let tensionCsvRow = data.song;
    bomLabel.push(data.song);
    songs.map((item) => {
      // コードの距離を算出
      let chordDif = 0;
      for (let key in item.chord) {
        const dif = data.chord[key] - item.chord[key];
        chordDif += dif * dif;
      }
      // テンションの距離を算出
      let tensionDif = 0;
      for (let key in item.tension) {
        const dif = data.tension[key] - item.tension[key];
        tensionDif += dif * dif;
      }
      chordCsvRow += `, ${chordDif}`;
      tensionCsvRow += `, ${tensionDif}`;
    });
    mdsCsvChordData += `${chordCsvRow} \n`;
    mdsCsvTensionData += `${tensionCsvRow} \n`;
  });

  fs.writeFileSync("./data_mds/song.csv", `${bomLabel}\n${mdsCsvChordData}`);

  console.log("csv for mds generated!");
}
