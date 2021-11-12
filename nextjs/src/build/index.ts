import * as fs from "fs";
import song from "json/song.json";

const generateJsonFile = async () => {
  const trueSong = song.filter((item) => item.result === true);
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

  fs.writeFileSync("./src/json/artist.json", artistJSON);
  fs.writeFileSync("./src/json/composer.json", composerJSON);

  console.log("json file generated!");
};

let scripts: Promise<void>[] = [generateJsonFile()];
(async () => {
  await Promise.all(scripts).then(() => {
    process.exit();
  });
})();
