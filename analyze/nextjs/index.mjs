import * as fs from "fs";

// nextjs用の分析ファイル

export default function generateNextjsJson() {
  console.log("started to generate Nextjs JSON.");

  let songs = [];
  for (let i = 0; i < 100; i++) {
    const dirName = `./data_analyze/song${i * 1000 + 1}_${
      i * 1000 + 1000
    }.json`;
    if (fs.existsSync(dirName)) {
      const data = JSON.parse(fs.readFileSync(dirName, "utf8"));
      songs = songs.concat(data);
    }
  }

  const trueSong = songs; // = songs.filter((item) => item.result === true)
  const artistObj = {};
  const composerObj = {};

  trueSong.map((item) => {
    artistObj[item.artist] = true;
    composerObj[item.composer] = true;
  });

  // アーティストの分析
  const artistArr = Object.keys(artistObj);

  const artistJsonArr = artistArr.map((artist, id) => {
    let tensionSum = {};
    let chordSum = {};
    let count = 0;

    const data = trueSong.filter((item) => {
      if (item.artist === artist) {
        count++;
        for (let key in item.tension) {
          tensionSum[key]
            ? (tensionSum[key] = tensionSum[key] + Number(item.tension[key]))
            : (tensionSum[key] = Number(item.tension[key]));
        }
        for (let key in item.chord) {
          chordSum[key]
            ? (chordSum[key] = chordSum[key] + Number(item.chord[key]))
            : (chordSum[key] = Number(item.chord[key]));
        }
        return item;
      }
    });

    for (let key in tensionSum) {
      tensionSum[key] = (tensionSum[key] / count).toFixed(4);
    }
    for (let key in chordSum) {
      chordSum[key] = (chordSum[key] / count).toFixed(4);
    }

    return {
      id,
      artist,
      tension: tensionSum,
      chord: chordSum,
      data: data,
    };
  });

  // 作曲家の分析
  const composerArr = Object.keys(composerObj);

  const composerJsonArr = composerArr.map((composer, id) => {
    let tensionSum = {};
    let chordSum = {};
    let count = 0;

    const data = trueSong.filter((item) => {
      if (item.composer === composer) {
        count++;
        for (let key in item.tension) {
          tensionSum[key]
            ? (tensionSum[key] = tensionSum[key] + Number(item.tension[key]))
            : (tensionSum[key] = Number(item.tension[key]));
        }
        for (let key in item.chord) {
          chordSum[key]
            ? (chordSum[key] = chordSum[key] + Number(item.chord[key]))
            : (chordSum[key] = Number(item.chord[key]));
        }
        return item;
      }
    });

    for (let key in tensionSum) {
      tensionSum[key] = (tensionSum[key] / count).toFixed(4);
    }
    for (let key in chordSum) {
      chordSum[key] = (chordSum[key] / count).toFixed(4);
    }

    return {
      id,
      composer,
      tension: tensionSum,
      chord: chordSum,
      data: data,
    };
  });

  const songJson = JSON.stringify(trueSong);
  const artistJSON = JSON.stringify(artistJsonArr);
  const composerJSON = JSON.stringify(composerJsonArr);

  fs.writeFileSync("./nextjs/src/json/song.json", songJson);
  fs.writeFileSync("./nextjs/src/json/artist.json", artistJSON);
  fs.writeFileSync("./nextjs/src/json/composer.json", composerJSON);

  fs.writeFileSync("./data_nextjs/song.json", songJson);
  fs.writeFileSync("./data_nextjs/artist.json", artistJSON);
  fs.writeFileSync("./data_nextjs/composer.json", composerJSON);

  console.log("Nextjs JSON generated!");
}
