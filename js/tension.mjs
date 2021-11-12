/*
 * sus4,sus2,dim,aug,add9,add11,add13の含まれている数を計算する
 */

export default function tensionChordCount(orglist) {
  let tensionChord = {
    sus2: 0,
    sus4: 0,
    dim: 0,
    aug: 0,
    add9: 0,
    add11: 0,
    add13: 0,
  };
  orglist.map((chord) => {
    if (chord.indexOf("sus2") > -1) tensionChord.sus2 += 1;
    if (chord.indexOf("sus4") > -1) tensionChord.sus4 += 1;
    if (chord.indexOf("dim") > -1) tensionChord.dim += 1;
    if (chord.indexOf("aug") > -1) tensionChord.aug += 1;
    if (chord.indexOf("add9") > -1) tensionChord.add9 += 1;
    if (chord.indexOf("add11") > -1) tensionChord.add11 += 1;
    if (chord.indexOf("add13") > -1) tensionChord.add13 += 1;
  });

  return tensionChord;
}
