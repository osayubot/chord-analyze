import * as fs from "fs";

// nextjs用の分析ファイル

export default function generateNextjsJson() {
  const songJson = fs.readFileSync("./data_analyze/song.json", "utf8");
  const song = JSON.parse(songJson);

  const trueSong /*= song.filter((item) => item.result === true)*/ = song;
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
            ? (tensionSum[key] = tensionSum[key] + item.tension[key])
            : (tensionSum[key] = item.tension[key]);
        }
        for (let key in item.chord) {
          chordSum[key]
            ? (chordSum[key] = chordSum[key] + item.chord[key])
            : (chordSum[key] = item.chord[key]);
        }
        return item;
      }
    });

    for (let key in tensionSum) {
      tensionSum[key] = tensionSum[key] / count;
    }

    for (let key in chordSum) {
      chordSum[key] = chordSum[key] / count;
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
            ? (tensionSum[key] = tensionSum[key] + item.tension[key])
            : (tensionSum[key] = item.tension[key]);
        }
        for (let key in item.chord) {
          chordSum[key]
            ? (chordSum[key] = chordSum[key] + item.chord[key])
            : (chordSum[key] = item.chord[key]);
        }
        return item;
      }
    });

    for (let key in tensionSum) {
      tensionSum[key] = tensionSum[key] / count;
    }

    for (let key in chordSum) {
      chordSum[key] = chordSum[key] / count;
    }

    return { id, composer, tension: tensionSum, chord: chordSum, data: data };
  });

  const artistJSON = JSON.stringify(artistJsonArr);
  const composerJSON = JSON.stringify(composerJsonArr);

  fs.writeFileSync("./nextjs/src/json/song.json", songJson);
  fs.writeFileSync("./nextjs/src/json/artist.json", artistJSON);
  fs.writeFileSync("./nextjs/src/composer.json", composerJSON);

  fs.writeFileSync("./data_nextjs/song.json", songJson);
  fs.writeFileSync("./data_nextjs/artist.json", artistJSON);
  fs.writeFileSync("./data_nextjs/composer.json", composerJSON);

  console.log("json for nextjs generated!");
}
