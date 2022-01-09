import { Chord, Progression } from "@tonaljs/tonal";
import tensionChordCount from "./tension.mjs";
import calcDistance from "./levanshtein.mjs";
import specifyKey from "./key.mjs";
import similarityCalc from "./distance.mjs";

export default function analyze(data) {
  // ライブラリで使える形に置き換え
  const chord = data.chord.map((chord) => {
    let newChord = chord
      .replace("♭", "b")
      .replace("maj7", "")
      .replace("maj9", "")
      .replace("-5", "")
      .replace("-9", "")
      .replace("-13", "")
      .replace("aug", "")
      .replace("+5", "")
      .replace("+9", "")
      .replace("+11", "")
      .replace("sus2", "")
      .replace("sus4", "")
      .replace("add9", "")
      .replace("6", "")
      .replace("N.C.", "")
      .replace("N.C", "");

    const dimIndex = newChord.indexOf("dim");
    if (dimIndex > -1) {
      // dimを代理コードで変換（引用：http://www.katmsp.com/2016/06/28/dairiko-do-ichiran/）
      newChord = `${Chord.transpose(newChord.slice(0, dimIndex), "6m")}7`;
    }
    const minusIndex = newChord.indexOf("-"); // -5, -9, -13 以外の置き換え漏れ
    if (minusIndex > -1) {
      console.log(`${chord}（${data.id}:${data.song}）- found.`);
      newChord = newChord.slice(0, minusIndex);
    }
    const plusIndex = newChord.indexOf("+"); // +5, +9, +11 以外の置き換え漏れ
    if (plusIndex > -1) {
      console.log(`${chord}（${data.id}:${data.song}）+ found.`);
      newChord = newChord.slice(0, plusIndex);
    }
    return newChord;
  });

  const tensionChord = tensionChordCount(data.chord);

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
    length: chord.length,
    key: currentKey,
    tension: tensionChord,
    ...analyzeResult,
  };
}
