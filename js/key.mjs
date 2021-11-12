/*
 * 曲の現在のキー（調性）を調べ、キーを返す
 */

export default function specifyKey(orglist) {
  const pitchClass = [
    "C", //0
    "C#", //1
    "D", //2
    "D#", //3
    "E", //4
    "F", //5
    "F#", //6
    "G", //7
    "G#", //8
    "A", //9
    "A#", //10
    "B", //11
  ];
  let pitchClassCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  for (let n = 0; n < orglist.length; n++) {
    let pitchNumber = specifyPitchNumber(orglist[n]);
    pitchNumber.map((number) => {
      pitchClassCount[number] = pitchClassCount[number] + 1;
    });
  }

  const maxPitchNumber = pitchClassCount.indexOf(Math.max(...pitchClassCount));

  return pitchClass[maxPitchNumber];
}

const specifyPitchNumber = (c) => {
  if (c.indexOf("N.C") >= 0) return [];

  if (c.indexOf("F#m") >= 0) return [2, 4, 7, 9];
  if (c.indexOf("G♭m") >= 0) return [2, 4, 7, 9];
  if (c.indexOf("C#m") >= 0) return [2, 4, 9, 11];
  if (c.indexOf("D♭m") >= 0) return [2, 4, 9, 11];
  if (c.indexOf("G#m") >= 0) return [4, 6, 9, 11];
  if (c.indexOf("A♭m") >= 0) return [4, 6, 9, 11];
  if (c.indexOf("D#m") >= 0) return [1, 4, 6, 11];
  if (c.indexOf("E♭m") >= 0) return [1, 4, 6, 11];
  if (c.indexOf("A#m") >= 0) return [1, 6, 8, 11];
  if (c.indexOf("B♭m") >= 0) return [1, 6, 8, 11];

  if (c.indexOf("Am") >= 0) return [0, 5, 7, 10];
  if (c.indexOf("Em") >= 0) return [0, 2, 7, 10];
  if (c.indexOf("Bm") >= 0) return [0, 2, 7, 9];
  if (c.indexOf("Dm") >= 0) return [0, 3, 5, 10];
  if (c.indexOf("Gm") >= 0) return [3, 5, 8, 10];
  if (c.indexOf("Cm") >= 0) return [1, 3, 8, 10];
  if (c.indexOf("Fm") >= 0) return [1, 3, 6, 8];

  if (c.indexOf("F#") >= 0) return [1, 6, 11];
  if (c.indexOf("G♭") >= 0) return [1, 6, 11];
  if (c.indexOf("C#") >= 0) return [1, 6, 8];
  if (c.indexOf("D♭") >= 0) return [1, 6, 8];
  if (c.indexOf("G#") >= 0) return [1, 3, 8];
  if (c.indexOf("A♭") >= 0) return [1, 3, 8];
  if (c.indexOf("D#") >= 0) return [3, 8, 10];
  if (c.indexOf("E♭") >= 0) return [3, 8, 10];
  if (c.indexOf("A#") >= 0) return [3, 5, 10];
  if (c.indexOf("B♭") >= 0) return [3, 5, 10];

  if (c.indexOf("F") >= 0) return [0, 5, 10];
  if (c.indexOf("C") >= 0) return [0, 5, 7];
  if (c.indexOf("G") >= 0) return [0, 2, 7];
  if (c.indexOf("D") >= 0) return [2, 7, 9];
  if (c.indexOf("A") >= 0) return [2, 4, 9];
  if (c.indexOf("E") >= 0) return [4, 9, 11];
  if (c.indexOf("B") >= 0) return [4, 6, 11];

  return [];
};

const specifyPitchNumber2 = (c) => {
  if (c.indexOf("Bdim") > -1) return [0];
  if (c.indexOf("Cdim") > -1) return [1];
  if (c.indexOf("C#dim") > -1) return [2];
  if (c.indexOf("D♭dim") > -1) return [2];
  if (c.indexOf("Ddim") > -1) return [3];
  if (c.indexOf("D#dim") > -1) return [4];
  if (c.indexOf("E♭dim") > -1) return [4];
  if (c.indexOf("Edim") > -1) return [5];
  if (c.indexOf("Fdim") > -1) return [6];
  if (c.indexOf("F#dim") > -1) return [7];
  if (c.indexOf("G♭dim") > -1) return [7];
  if (c.indexOf("Gdim") > -1) return [8];
  if (c.indexOf("G#dim") > -1) return [9];
  if (c.indexOf("A♭dim") > -1) return [9];
  if (c.indexOf("Adim") > -1) return [10];
  if (c.indexOf("A#dim") > -1) return [11];
  if (c.indexOf("B♭dim") > -1) return [11];

  if (c.indexOf("F#m") > -1) return [2, 4, 9];
  if (c.indexOf("G♭m") > -1) return [2, 4, 9];
  if (c.indexOf("C#m") > -1) return [4, 9, 11];
  if (c.indexOf("D♭m") > -1) return [4, 9, 11];
  if (c.indexOf("G#m") > -1) return [4, 6, 11];
  if (c.indexOf("A♭m") > -1) return [4, 6, 11];
  if (c.indexOf("D#m") > -1) return [1, 6, 11];
  if (c.indexOf("E♭m") > -1) return [1, 6, 11];
  if (c.indexOf("A#m") > -1) return [1, 6, 8];
  if (c.indexOf("B♭m") > -1) return [1, 6, 8];

  if (c.indexOf("Am") > -1) return [0, 5, 7];
  if (c.indexOf("Em") > -1) return [0, 2, 7];
  if (c.indexOf("Bm") > -1) return [2, 7, 9];
  if (c.indexOf("Dm") > -1) return [0, 5, 10];
  if (c.indexOf("Gm") > -1) return [3, 5, 10];
  if (c.indexOf("Cm") > -1) return [3, 8, 10];
  if (c.indexOf("Fm") > -1) return [1, 3, 8];

  if (c.indexOf("F#") > -1) return [1, 6, 11];
  if (c.indexOf("G♭") > -1) return [1, 6, 11];
  if (c.indexOf("C#") > -1) return [1, 6, 8];
  if (c.indexOf("D♭") > -1) return [1, 6, 8];
  if (c.indexOf("G#") > -1) return [1, 3, 8];
  if (c.indexOf("A♭") > -1) return [1, 3, 8];
  if (c.indexOf("D#") > -1) return [3, 8, 10];
  if (c.indexOf("E♭") > -1) return [3, 8, 10];
  if (c.indexOf("A#") > -1) return [3, 5, 10];
  if (c.indexOf("B♭") > -1) return [3, 5, 10];

  if (c.indexOf("F") > -1) return [0, 5, 10];
  if (c.indexOf("C") > -1) return [0, 5, 7];
  if (c.indexOf("G") > -1) return [0, 2, 7];
  if (c.indexOf("D") > -1) return [2, 7, 9];
  if (c.indexOf("A") > -1) return [2, 4, 9];
  if (c.indexOf("E") > -1) return [4, 9, 11];
  if (c.indexOf("B") > -1) return [4, 6, 11];
};
