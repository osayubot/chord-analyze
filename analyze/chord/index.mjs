import { Progression } from "@tonaljs/tonal";
import tensionChordCount from "./tension.mjs";
import calcDistance from "./levanshtein.mjs";

import specifyKey from "./key.mjs";
import similarityCalc from "./distance.mjs";

export default function analyze(data) {
  // ライブラリで使える形に整える
  const chord = data.chord.map((chord) =>
    chord
      .replace("♭", "b")
      .replace("M", "m")
      .replace("sus4", "")
      .replace("dim", "")
      .replace("aug", "")
      .replace("add9", "")
      .replace("add11", "")
      .replace("add13", "")
      .replace("6", "")
      .replace("N.C.", "")
      .replace("N.C", "")
  );

  // テンションコードを見つける
  const tensionChord = tensionChordCount(chord);

  let maxTotalPoint = 0;
  let analyzeResult = {};
  let currentKey = "";

  // 現在のキーを調べる
  // const currentKeys = specifyKey(chord);

  // Cに転調する
  //currentKeys.map((key) => {
  ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"].map(
    (key) => {
      if (key) {
        const chordCdegree = Progression.toRomanNumerals(key, chord);
        if (chordCdegree) {
          let chordC = Progression.fromRomanNumerals("C", chordCdegree);
          // レーベンシュタイン距離を測定する
          const result = calcDistance(chordC);

          if (maxTotalPoint < result.totalPoint) {
            maxTotalPoint = result.totalPoint;
            analyzeResult = result;
            currentKey = key;
          }
        }
      }
    }
  );

  delete analyzeResult.totalPoint;

  return {
    id: data.id,
    song: data.song,
    artist: data.artist,
    composer: data.composer,
    key: currentKey,
    tension: tensionChord,
    ...analyzeResult,
  };
}
