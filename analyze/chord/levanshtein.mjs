import fs from "fs";
/*
 * 定型コードとのレーベンシュタイン距離を測定する
 */

// 定型コード
const typicalChordArr = JSON.parse(
  fs.readFileSync(`./analyze/chord/typicalChord.json`, "utf8")
);

export default function calcDistance(chordArr) {
  // レーベンシュタイン距離のポイントを計算
  let result = false;
  let chord = {};
  let totalPoint = 0;
  let extraChord = chordArr.length;

  typicalChordArr.map((typicalChord) => {
    const typicalChordName = Object.keys(typicalChord)[0];
    const typicalChordStr = typicalChord[typicalChordName];
    const typicalChordLength = typicalChordStr.split(",").length;
    const allowDistance = typicalChordLength / 2 + 1;

    let i = 0;
    let point = 0;

    while (chordArr[i + typicalChordLength - 1]) {
      const distance = levenshteinDistancs(
        chordArr.slice(i, i + typicalChordLength).join(","), // 文字列
        typicalChordStr // 文字列
      );
      if (distance < allowDistance) {
        point += 1;
        totalPoint += 1;
        extraChord--;
        result = true;
        i += typicalChordLength / 2; // 調節
      }
      i++;
    }
    chord[typicalChordName] = Number(
      ((point * 100) / chordArr.length).toFixed(5)
    );
  });

  return {
    chord: {
      ...chord,
      その他の進行: Number(((extraChord * 100) / chordArr.length).toFixed(5)),
    },
    result,
    totalPoint,
  };
}

const levenshteinDistancs = (s1, s2) => {
  if (s1 == s2) {
    return 0;
  }

  var s1_len = s1.length;
  var s2_len = s2.length;
  if (s1_len === 0) {
    return s2_len;
  }
  if (s2_len === 0) {
    return s1_len;
  }

  var split = false;
  try {
    split = !"0"[0];
  } catch (e) {
    split = true;
  }

  if (split) {
    s1 = s1.split("");
    s2 = s2.split("");
  }

  var v0 = new Array(s1_len + 1);
  var v1 = new Array(s1_len + 1);

  var s1_idx = 0,
    s2_idx = 0,
    cost = 0;
  for (s1_idx = 0; s1_idx < s1_len + 1; s1_idx++) {
    v0[s1_idx] = s1_idx;
  }
  var char_s1 = "",
    char_s2 = "";
  for (s2_idx = 1; s2_idx <= s2_len; s2_idx++) {
    v1[0] = s2_idx;
    char_s2 = s2[s2_idx - 1];

    for (s1_idx = 0; s1_idx < s1_len; s1_idx++) {
      char_s1 = s1[s1_idx];
      cost = char_s1 == char_s2 ? 0 : 1;
      var m_min = v0[s1_idx + 1] + 1;
      var b = v1[s1_idx] + 1;
      var c = v0[s1_idx] + cost;
      if (b < m_min) {
        m_min = b;
      }
      if (c < m_min) {
        m_min = c;
      }
      v1[s1_idx + 1] = m_min;
    }
    var v_tmp = v0;
    v0 = v1;
    v1 = v_tmp;
  }
  return v0[s1_len];
};
