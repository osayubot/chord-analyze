/*
 * sus4,sus2,dim,aug,add9の含まれている数を計算する
 */

export default function tensionChordCount(orglist) {
  let tensionChord = {
    sus2: 0,
    sus4: 0,
    dim: 0,
    _6: 0, // スピッツがD6とか使ってる
    ommit: 0,
    aug: 0,
    add9: 0,
  };
  orglist.map((chord) => {
    if (chord.indexOf("sus2") > -1) tensionChord.sus2 += 1;
    if (chord.indexOf("sus4") > -1) tensionChord.sus4 += 1;
    if (chord.indexOf("dim") > -1) tensionChord.dim += 1;
    if (chord.indexOf("6") > -1) tensionChord._6 += 1;
    if (chord.indexOf("-") > -1) tensionChord.ommit += 1;
    if (chord.indexOf("+") > -1) tensionChord.ommit += 1;
    if (chord.indexOf("aug") > -1) tensionChord.aug += 1;
    if (chord.indexOf("add9") > -1) tensionChord.add9 += 1;
  });
  return tensionChord;
}
