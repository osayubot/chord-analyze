import * as fs from "fs";

// nextjs用の分析ファイル

export default function generateMdsCSV() {
  let songs = [];

  for (let i = 0; i < 1; i++) {
    const dirName = `./data_analyze/song${i * 1000 + 1}_${i * 1000 +
      1000}.json`;
    if (fs.existsSync(dirName)) {
      const data = JSON.parse(fs.readFileSync(dirName, "utf8"));
      songs = songs.concat(data);
    }
  }

  let bomLabel = [];

  const fd = fs.openSync("./data_mds/song.csv", "w");

  songs.map((data, index) => {
    let chordCsvRow = [];
    let tensionCsvRow = [];

    songs.map((item) => {
      if (index === 0) {
        bomLabel.push(
          `${item.song.replace(",", " ")} / ${item.artist.replace(
            ",",
            " "
          )} / ${item.composer.replace(",", " ")}`
        );
      }
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
      chordCsvRow.push(chordDif.toFixed(2));
      tensionCsvRow.push(tensionDif.toFixed(2));
    });

    if (index === 0) {
      console.log(songs.length);
      console.log(bomLabel.length);
      console.log(chordCsvRow.length);
      fs.writeSync(fd, `${bomLabel.join(", ")}\n`);
    }

    fs.writeSync(fd, `${chordCsvRow.join(", ")}\n`);
  });

  fs.closeSync(fd);

  console.log("csv for mds generated!");
}
