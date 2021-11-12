import fs from "fs";
/*
 * 定型コードとのレーベンシュタイン距離を測定する
 */

// 定型コード
const typicalChordArr = JSON.parse(
  fs.readFileSync(`./js/typicalChord.json`, "utf8")
);

export default function similarityCalc(chordArr) {
  // レーベンシュタイン距離のポイントを計算
  let result = false;
  let chord = {};
  let extraChord = Math.floor(chordArr.length / 4);

  typicalChordArr.map((typicalChord) => {
    const typicalChordName = Object.keys(typicalChord)[0];
    const typicalChordStr = typicalChord[typicalChordName];
    const typicalChordLength = typicalChordStr.split(",").length;

    let i = 0;
    let point = 0;

    while (chordArr[i + typicalChordLength - 1]) {
      const chordType = calcChordType(
        chordArr.slice(i, i + typicalChordLength), // 配列
        typicalChordStr.split(","), // 配列
        chordArr[i + typicalChordLength + 1]
      );
      if (chordType) {
        if (chordType === "一致") {
          extraChord--;
          point++;
          result = true;
        }
        if (chordType === "代理") {
          extraChord--;
          point++;
          result = true;
        }
        if (chordType === "派生") {
          extraChord -= 0.5;
          point += 0.5;
          result = true;
        }
      }
      i++;
    }
    chord[typicalChordName] = Math.round(
      (point / Math.floor(chordArr.length / 4)) * 100
    );
  });

  chord["その他の進行"] = Math.round(
    (extraChord / Math.floor(chordArr.length / 4)) * 100
  );

  return { chord, result };
}

// 定型コードとの距離を計測しタイプを返す
const calcChordType = (chordArr, typicalChordArr, nextChord) => {
  let isAllCorrespond = true;
  let isAlternativeChord = true;
  for (let i = 0; i < chordArr.length; i++) {
    if (chordArr[i] !== typicalChordArr[i]) {
      // 一つでも違うものがあったらfalse
      isAllCorrespond = false;

      //　もし違うとしても代理コード判定OKだったら同一
      if (!judgeAlternativeChord(chordArr[i], typicalChordArr[i])) {
        isAlternativeChord = false;
      }
    }
  }

  if (isAllCorrespond) return "一致"; // 全て一致なら2ポイント加算
  if (isAlternativeChord) return "代理"; // 全て一致でなくても代理コードが使用されていたなら2ポイント加算

  if (typicalChordArr.length === 3) return null; // 典型コードが長さ3だと判定がガバガバになるので

  // 派生コードかどうか
  const isDerivedChord = judgeDerivedChord(
    chordArr,
    typicalChordArr,
    nextChord
  );

  if (isDerivedChord) return "派生";

  return null;

  /*
   * コスト計算法
   * [a,b,c,d] と同一と見なすもの
   * 1.[a,b,c,d]   （全く同じ）
   *
   * 2.https://music-thcreate.com/substitute-chord/#i-2
   * 代理コードが使用されている
   * C→AmとEm、F#m7-5
   * F→Dm、F7とF#m7-5とB7
   * G→Bm7-5、D♭7
   *
   * コストの付け方
   * 3.[a,e,c,d]　 （n文字目の1つだけが異なる） +1
   * 4.[a,e,b,c,d] （間に追加されたパターン） +1
   *
   * コスト0なら同一とみなす
   * コスト1なら派生パターンとみなす
   * コスト2は類似していないので終了
   */
};

const judgeAlternativeChord = (chord, typicalChord) => {
  if (typicalChord === "C") {
    if (chord === "Am") {
      return true;
    }
    if (chord === "Em") {
      return true;
    }
    if (chord === "F#m") {
      return true;
    }
  }
  return false;
};

const judgeDerivedChord = (chordArr, typicalChordArr, nextChord) => {
  // n文字目の1つだけが異なる説
  let cost1 = 0;
  for (let i = 0; i < chordArr.length; i++) {
    if (chordArr[i] !== typicalChordArr[i]) {
      if (!judgeAlternativeChord(chordArr[i], typicalChordArr[i])) {
        cost1++;
      }
    }
  }
  if (cost1 > 1) return false;
  // 間に追加されたパターン説
  let cost2 = 0;
  const addedChordArr = chordArr.push(nextChord);
  for (let i = 0; i < addedChordArr.length; i++) {
    console.log(addedChordArr[i], typicalChordArr[i]);
    if (addedChordArr[i] !== typicalChordArr[i]) {
      if (addedChordArr[i + 1] !== typicalChordArr[i]) {
        cost2++;
      }
    }
  }
  if (cost2 > 1) return false;

  return true;
};
