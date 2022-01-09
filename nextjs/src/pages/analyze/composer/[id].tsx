import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { GetServerSideProps } from "next";
import styles from "styles/Analyze.module.scss";
import { useEffect, useState } from "react";
import {
  backgroundColor,
  horizonalBarOption,
  smallHorizonalBarOption,
  pieOptions,
  smallPieOptions,
  networkOptions,
  barOptions,
} from "lib/vis";
import { Pie, Bar, HorizontalBar } from "react-chartjs-2";
import composer from "json/composer.json";

export default function composerId({ image, composerData }) {
  useEffect(() => {
    /* 一番使われているテンション */
    const maxTension = () => {
      let maxPoint = 0;
      let max = null;
      for (let key in composerData.tension) {
        if (maxPoint < composerData.tension[key]) {
          max = key;
          maxPoint = composerData.tension[key];
        }
      }
      return max;
    };

    /* 一番使われているコード */
    const maxChord = () => {
      let maxPoint = 0;
      let max = null;
      for (let key in composerData.chord) {
        if (key !== "その他の進行") {
          if (maxPoint < composerData.chord[key]) {
            max = key;
            maxPoint = composerData.chord[key];
          }
        }
      }
      return max;
    };

    /* 類似のアーティストを探す */

    let chordAsc = [];
    let tensionAsc = [];
    composer.map((item) => {
      // コードの距離を算出
      let chordDif = 0;
      for (let key in item.chord) {
        const dif = composerData.chord[key] - item.chord[key];
        chordDif += dif * dif;
      }
      // テンションの距離を算出
      let tensionDif = 0;
      for (let key in item.tension) {
        const dif = composerData.tension[key] - item.tension[key];
        tensionDif += dif * dif;
      }

      chordAsc.push({
        ...item,
        composer: item.composer,
        chordDif,
        tensionDif,
      });
      tensionAsc.push({
        ...item,
        chordDif,
        tensionDif,
      });
    });

    chordAsc.sort(function (a, b) {
      if (a.chordDif < b.chordDif) return -1;
      if (a.chordDif > b.chordDif) return 1;
      return 0;
    });

    tensionAsc.sort(function (a, b) {
      if (a.tensionDif < b.tensionDif) return -1;
      if (a.tensionDif > b.tensionDif) return 1;
      return 0;
    });

    setMax({ tension: maxTension(), chord: maxChord() });
    setChordAsc(chordAsc);
    setTensionAsc(tensionAsc);
  }, []);

  const [max, setMax] = useState<{ tension: string; chord: string }>({
    tension: "",
    chord: "",
  });
  const [chordAsc, setChordAsc] = useState<any>([]);
  const [tensionAsc, setTensionAsc] = useState<any>([]);

  const chordKeyArr = Object.keys(composerData.chord);
  const tensionKeyArr = Object.keys(composerData.tension);

  let total = 0;
  chordKeyArr.map((key) => {
    total = total + Number(composerData.chord[key]);
  });

  const horizontalBar = {
    datasets: chordKeyArr.map((key, index) => {
      const number = Number(composerData.chord[key]);
      return {
        label: key,
        data: [((number * 100) / total).toFixed(2)],
        backgroundColor: backgroundColor[index],
      };
    }),
  };

  const pie = {
    labels: chordKeyArr,
    datasets: [
      {
        data: chordKeyArr.map((key) => {
          return Number(composerData.chord[key]).toFixed(2);
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
          return Number(composerData.tension[key]).toFixed(2);
        }),
        backgroundColor,
        borderWidth: 2,
      },
    ],
  };

  const generateSimilarComposersPie = chordAsc.slice(0, 20).map((item: any) => {
    const newPie = {
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

    let total = 0;
    chordKeyArr.map((key) => {
      total = total + Number(composerData.chord[key]);
    });

    const newHorizonalBar = {
      datasets: chordKeyArr.map((key, index) => {
        const number = Number(composerData.chord[key]);
        return {
          label: key,
          data: [((number * 100) / total).toFixed(2)],
          backgroundColor: backgroundColor[index],
        };
      }),
    };
    return {
      id: item.id,
      song: item.song,
      artist: item.artist,
      composer: item.composer,
      pie: newPie,
      horizontalBar: newHorizonalBar,
      chordDif: item.chordDif,
      tensionDif: item.tensionDif,
    };
  });

  const generateSimilarComposersBar = tensionAsc
    .slice(0, 20)
    .map((item: any) => {
      let newBar = {
        labels: tensionKeyArr,
        datasets: [
          {
            data: tensionKeyArr.map((key) => {
              return Number(item.tension[key]).toFixed(2);
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
      <h1 className={styles.name}>{composerData.composer}</h1>
      <p className={styles.detail}>作曲者</p>
      <div className={styles.thumbnail}>
        <Image src={image} width={600} height={315} className="circle" />
      </div>
      <div className={styles.about}>
        <h4>分析結果</h4>
        <div className={styles.info}>
          <h6>分析楽曲数</h6>
          <p>{composerData.data.length}曲</p>
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

      <h2>{composerData.composer}の楽曲</h2>
      <ul>
        {composerData.data.map((item: any, index: number) => {
          return (
            <Link key={index} href={`/analyze/song/${item.id}`}>
              <a className={styles.songCard}>
                <h4 className={styles.name}>{item.song}</h4>
                <p>{item.composer}</p>
              </a>
            </Link>
          );
        })}
      </ul>
      <div className={styles.analyze}>
        <h2>コード進行分析</h2>
        <p>この作曲者が曲中で使用しているコード進行の割合を表示します</p>
      </div>
      <div className={styles.content}>
        <div className={styles.pie}>
          {/*<Pie data={pie} options={pieOptions as any} />*/}
          <HorizontalBar data={horizontalBar} options={horizonalBarOption} />
        </div>
      </div>

      <br />
      <div className={styles.analyze}>
        <h2>テンション分析</h2>
        <p>
          この作曲者が１曲あたりに使用しているテンションの平均値を表示します
        </p>
      </div>
      <div className={styles.content}>
        <div className={styles.pie}>
          <Bar data={bar} options={barOptions as any} />
        </div>
      </div>

      <div className={styles.footer}>
        <h3>コード進行が似ている作曲者</h3>
        <ul>
          {generateSimilarComposersPie.map((item: any, index: number) => {
            return (
              composerData.id !== item.id && (
                <Link key={index} href={`/analyze/composer/${item.id}`}>
                  <a className={styles.card}>
                    <h4 className={styles.name}>{item.composer}</h4>

                    <HorizontalBar
                      data={item.horizontalBar}
                      options={smallHorizonalBarOption}
                    />
                    {/*<Pie data={item.pie} options={smallPieOptions} /><br/>*/}

                    <p>dif:{item.chordDif.toFixed(2)}</p>
                  </a>
                </Link>
              )
            );
          })}
        </ul>
        <br />
        <h3>テンションが似ている作曲者</h3>
        <ul>
          {generateSimilarComposersBar.map((item: any, index: number) => {
            return (
              composerData.id !== item.id && (
                <Link key={index} href={`/analyze/composer/${item.id}`}>
                  <a className={styles.card}>
                    <h4 className={styles.name}>{item.composer}</h4>
                    <br />
                    <Bar data={item.bar} options={barOptions as any} />
                    <br />
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
  const id = params.id.toString();
  const composerData = composer.find((item) => {
    return id === item.id.toString();
  });

  /* 作曲者の画像を手に入れる */
  let image = "/noimage1200x630.png";

  const term = encodeURIComponent(composerData.composer);
  const res = await fetch(
    `https://itunes.apple.com/search?term=${term}&media=music&entity=musicArtist&country=jp&lang=ja_jp&limit=1`
  );

  const json1 = await res.json();

  if (json1.results && json1.results[0]?.artistLinkUrl) {
    const json2 = await axios.get(json1.results[0]?.artistLinkUrl);
    const jsonStr = JSON.stringify(json2.data);
    const startIndex = jsonStr.indexOf("ssl.mzstatic.com/image");
    const cutJsonStr = jsonStr.slice(startIndex - 12, startIndex + 250);
    const lastIndex = cutJsonStr.indexOf("1200x630");
    image = cutJsonStr.slice(0, lastIndex + 14);
  }

  return {
    props: {
      image,
      composerData,
    },
  };
};
