/*
 * sus4,sus2,dim,aug,add9の含まれている数を計算する
 */

export default function tensionChordCount(orglist) {
  // 種類 sus2,sus4,dim,6,-5,-9,-13,aug,+5,+9,+11,add9,
  let tensionChord = {
    sus2: 0,
    sus4: 0,
    dim: 0,
    6: 0, // スピッツがD6とか使ってる
    "(♭5)": 0,
    "(♭9)": 0,
    "(♭13)": 0,
    aug: 0,
    "(#9)": 0,
    "(#11)": 0,
    add9: 0,
  };

  orglist.map((chord) => {
    if (chord.indexOf("sus2") > -1) tensionChord["sus2"] += 1;
    if (chord.indexOf("sus4") > -1) tensionChord["sus4"] += 1;
    if (chord.indexOf("dim") > -1) tensionChord["dim"] += 1;
    if (chord.indexOf("6") > -1) tensionChord["6"] += 1;
    if (chord.indexOf("-5") > -1) tensionChord["(♭5)"] += 1;
    if (chord.indexOf("-9") > -1) tensionChord["(♭9)"] += 1;
    if (chord.indexOf("-13") > -1) tensionChord["(♭13)"] += 1;
    if (chord.indexOf("aug") > -1) tensionChord["aug"] += 1;
    if (chord.indexOf("+5") > -1) tensionChord["aug"] += 1;
    if (chord.indexOf("+9") > -1) tensionChord["(#9)"] += 1;
    if (chord.indexOf("+11") > -1) tensionChord["(#11)"] += 1;
    if (chord.indexOf("add9") > -1) tensionChord["add9"] += 1;
  });
  return tensionChord;
}
