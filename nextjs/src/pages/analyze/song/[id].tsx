import Image from "next/image";
import Link from "next/link";
import styles from "styles/Analyze.module.scss";
import { Pie, Bar } from "react-chartjs-2";
import { useWindowDimensions } from "hooks/getWindowSize";
import { GetServerSideProps } from "next";
import {
  pieOptions,
  smallPieOptions,
  backgroundColor,
  barOptions,
} from "lib/vis";
import song from "json/song.json";

export default function SongId({ image, data, max, chordAsc, tensionAsc }) {
  const { width } = useWindowDimensions();

  const chordKeyArr = Object.keys(data.chord);
  const tensionKeyArr = Object.keys(data.tension);

  let pie = {
    labels: chordKeyArr,
    datasets: [
      {
        data: chordKeyArr.map((key) => {
          return data.chord[key];
        }),
        backgroundColor,
        borderWidth: 2,
      },
    ],
  };

  const bar = {
    labels: tensionKeyArr,
    datasets: [
      {
        data: tensionKeyArr.map((key) => {
          return data.tension[key];
        }),
        backgroundColor,
        borderWidth: 2,
      },
    ],
  };

  const generateSimilarSongsPie = JSON.parse(chordAsc)
    .slice(0, 10)
    .map((item: any) => {
      var newPie = {
        labels: chordKeyArr,
        datasets: [
          {
            data: chordKeyArr.map((key) => {
              return item.chord[key];
            }),
            backgroundColor,
            borderWidth: 2,
          },
        ],
      };
      return {
        id: item.id,
        song: item.song,
        artist: item.artist,
        composer: item.composer,
        pie: newPie,
        chordDif: item.chordDif,
        tensionDif: item.tensionDif,
      };
    });

  const generateSimilarSongsBar = JSON.parse(tensionAsc)
    .slice(0, 10)
    .map((item: any) => {
      let newBar = {
        labels: tensionKeyArr,
        datasets: [
          {
            data: tensionKeyArr.map((key) => {
              return item.tension[key];
            }),
            backgroundColor,
            borderWidth: 2,
          },
        ],
      };
      return {
        id: item.id,
        song: item.song,
        artist: item.artist,
        composer: item.composer,
        bar: newBar,
        chordDif: item.chordDif,
        tensionDif: item.tensionDif,
      };
    });

  return (
    <div className={styles.container}>
      <h1 className={styles.name}>{data.song}</h1>
      <p className={styles.detail}>
        {data.artist} / {data.composer}
      </p>
      <br />
      <Image src={image} width={240} height={240} className="circle" />
      <br />
      <div className={styles.about}>
        <h4>分析結果</h4>
        <div className={styles.info}>
          <h6>調（キー）</h6>
          <p>{data.key}</p>
          <br />
          <h6>コード進行分析</h6>
          <p>
            {max.chord
              ? `${max.chord}が最もよく使われています。`
              : "典型コード進行は使われていません。"}
          </p>
          <br />
          <h6>テンションコード分析</h6>
          <p>
            {max.tension
              ? `${max.tension}が最もよく使われています。`
              : "テンションコードは使われていません。"}
          </p>
        </div>
      </div>
      <div className={styles.analyze}>
        <h2>コード分析</h2>
        <p>曲中のコード進行の割合を表示しています</p>
      </div>
      <div className={styles.content}>
        <div className={styles.pie}>
          <Pie data={pie} options={pieOptions(width) as any} />
        </div>
      </div>

      <div className={styles.analyze}>
        <h2>テンション分析</h2>
        <p>曲中でのテンション使用回数を表示しています</p>
        <div className={styles.content}>
          <div className={styles.pie}>
            <Bar data={bar} options={barOptions as any} />
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <h3>コード進行が似ているアーティスト</h3>
        <ul>
          {generateSimilarSongsPie.map((item: any, index: number) => {
            return (
              data.id !== item.id && (
                <Link key={index} href={`/analyze/song/${item.id}`}>
                  <a className={styles.card}>
                    <h4 className={styles.name}>{item.song}</h4>
                    <p className={styles.type}>
                      {item.artist} / {item.composer}
                    </p>
                    <Pie data={item.pie} options={smallPieOptions} />
                    <br />
                    <p>dif:{item.chordDif.toFixed(2)}</p>
                  </a>
                </Link>
              )
            );
          })}
        </ul>
        <br />
        <h3>テンションが似ているアーティスト</h3>
        <ul>
          {generateSimilarSongsBar.map((item: any, index: number) => {
            return (
              data.id !== item.id && (
                <Link key={index} href={`/analyze/song/${item.id}`}>
                  <a className={styles.card}>
                    <h4 className={styles.name}>{item.song}</h4>
                    <br />
                    <Bar data={item.bar} options={barOptions as any} />
                    <p className={styles.type}>
                      {item.artist} / {item.composer}
                    </p>
                    <p>dif:{item.tensionDif.toFixed(2)}</p>
                  </a>
                </Link>
              )
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params.id as string;
  const data = song.find((item) => {
    return id === item.id.toString();
  });

  /* 一番使われているテンション */
  const maxTension = () => {
    let maxPoint = 0;
    let max = null;
    for (let key in data.tension) {
      if (maxPoint < data.tension[key]) max = key;
    }
    return max;
  };

  /* 一番使われているコード */
  const maxChord = () => {
    let maxPoint = 0;
    let max = null;
    for (let key in data.chord) {
      if (maxPoint < data.chord[key]) max = key;
    }
    return max;
  };

  const term = encodeURIComponent(data.song);
  const res = await fetch(
    `https://itunes.apple.com/search?term=${term}&media=music&entity=song&country=jp&lang=ja_jp&limit=1`
  );

  const json = await res.json();

  const image = json.results
    ? json.results[0].artworkUrl100.toString().replace("100x100", "500x500")
    : "/noimage.png";

  /* 類似している曲を探す */

  let chordAsc = [];
  let tensionAsc = [];
  song.map((item) => {
    // コードの距離を算出
    let chordDif = 0;
    for (let key in item.chord) {
      const dif = data.chord[key] - item.chord[key];
      chordDif += dif * dif;
    }
    // テンションの距離を算出
    let tensionDif = 0;
    for (let key in item.tension) {
      const dif = data.tension[key] - item.tension[key];
      tensionDif += dif * dif;
    }

    chordAsc.push({
      ...item,
      artist: item.artist,
      chordDif,
      tensionDif,
    });
    tensionAsc.push({
      ...item,
      chordDif,
      tensionDif,
    });
  });

  chordAsc.sort(function(a, b) {
    if (a.chordDif < b.chordDif) return -1;
    if (a.chordDif > b.chordDif) return 1;
    return 0;
  });

  tensionAsc.sort(function(a, b) {
    if (a.tensionDif < b.tensionDif) return -1;
    if (a.tensionDif > b.tensionDif) return 1;
    return 0;
  });

  return {
    props: {
      image,
      data: data,
      max: { tension: maxTension(), chord: maxChord() },
      chordAsc: JSON.stringify(chordAsc),
      tensionAsc: JSON.stringify(tensionAsc),
    },
  };
};
