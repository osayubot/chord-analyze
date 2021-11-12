import { Progression } from "@tonaljs/tonal";
import specifyKey from "./key.mjs";
import tensionChordCount from "./tension.mjs";
import similarityCalc from "./distance.mjs";

export default function analyze(data) {
  const chord = data.chord;

  // テンションコードを見つける
  const tensionChord = tensionChordCount(chord);

  // 現在のキーを調べる
  const currentKey = specifyKey(chord);

  // Cに転調する
  const chordCdegree = Progression.toRomanNumerals(currentKey, chord);
  const chordC = Progression.fromRomanNumerals("C", chordCdegree);

  // レーベンシュタイン距離を測定する */
  const analyzeResult = similarityCalc(chordC);

  /* データをchord_analyzeに保存する */
  const resultData = {
    id: data.id,
    song: data.song,
    artist: data.artist,
    composer: data.composer,
    key: currentKey,
    tension: tensionChord,
    ...analyzeResult,
  };

  return resultData;
}
