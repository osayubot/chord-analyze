import { Progression } from "@tonaljs/tonal";
import specifyKey from "./key.mjs";
import tensionChordCount from "./tension.mjs";
import similarityCalc from "./distance.mjs";

export default function analyze(data) {
  // ライブラリが使える形に整える
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

  // 現在のキーを調べる
  const currentKeys = specifyKey(chord);

  let maxTotalPoint = 0;
  let analyzeResult = {};
  let currentKey = "";

  // Cに転調する
  currentKeys.map((key) => {
    if (currentKeys !== undefined) {
      const chordCdegree = Progression.toRomanNumerals(key, chord);
      let chordC = Progression.fromRomanNumerals("C", chordCdegree);

      // レーベンシュタイン距離を測定する
      const result = similarityCalc(chordC);

      if (maxTotalPoint < result.totalPoint) {
        maxTotalPoint = result.totalPoint;
        analyzeResult = result;
        currentKey = key;
      }
    }
  });

  delete analyzeResult.totalPoint;
  console.log(`${data.id} analyzed.`);
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
