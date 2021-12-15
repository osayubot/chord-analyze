import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { GetServerSideProps } from "next";
import styles from "styles/Analyze.module.scss";
import { useEffect, useState } from "react";
import {
  backgroundColor,
  smallPieOptions,
  networkOptions,
  pieOptions,
  barOptions,
} from "lib/vis";
import { Pie, Bar } from "react-chartjs-2";
import { useWindowDimensions } from "hooks/getWindowSize";
import artist from "json/artist.json";

export default function ArtistId({ image, artistData, network }) {
  const { width } = useWindowDimensions();

  useEffect(() => {
    /* 一番使われているテンション */
    const maxTension = () => {
      let maxPoint = 0;
      let max = null;
      for (let key in artistData.tension) {
        if (maxPoint < artistData.tension[key]) max = key;
      }
      return max;
    };

    /* 一番使われているコード */
    const maxChord = () => {
      let maxPoint = 0;
      let max = null;
      for (let key in artistData.chord) {
        if (maxPoint < artistData.chord[key]) max = key;
      }
      return max;
    };

    /* 類似のアーティストを探す */

    let chordAsc = [];
    let tensionAsc = [];
    artist.map((item) => {
      // コードの距離を算出
      let chordDif = 0;
      for (let key in item.chord) {
        const dif = artistData.chord[key] - item.chord[key];
        chordDif += dif * dif;
      }
      // テンションの距離を算出
      let tensionDif = 0;
      for (let key in item.tension) {
        const dif = artistData.tension[key] - item.tension[key];
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

  const chordKeyArr = Object.keys(artistData.chord);
  const tensionKeyArr = Object.keys(artistData.tension);

  let pie = {
    labels: chordKeyArr,
    datasets: [
      {
        data: chordKeyArr.map((key) => {
          return artistData.chord[key];
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
          return artistData.tension[key];
        }),
        backgroundColor,
        borderWidth: 2,
      },
    ],
  };

  const generateSimilarArtistsPie = chordAsc.slice(0, 10).map((item: any) => {
    let newPie = {
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

  const generateSimilarArtistsBar = tensionAsc.slice(0, 10).map((item: any) => {
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
      <h1 className={styles.name}>{artistData.artist}</h1>
      <p className={styles.detail}>アーティスト</p>
      <div className={styles.thumbnail}>
        <Image src={image} width={600} height={315} className="circle" />
      </div>
      <div className={styles.about}>
        <h4>分析結果</h4>
        <div className={styles.info}>
          <h6>分析楽曲数</h6>
          <p>{artistData.data.length}曲</p>
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

      <h2>{artistData.artist}の歌</h2>
      <ul>
        {artistData.data.map((item: any, index: number) => {
          return (
            <Link key={index} href={`/analyze/song/${item.id}`}>
              <a className={styles.songCard}>
                <h4 className={styles.name}>{item.song}</h4>
                <p>{item.artist}</p>
              </a>
            </Link>
          );
        })}
      </ul>
      <div className={styles.analyze}>
        <h2>コード進行分析</h2>
        <p>このアーティストが曲中で使用しているコード進行の割合を表示します</p>
      </div>
      <div className={styles.content}>
        <div className={styles.pie}>
          <Pie data={pie} options={pieOptions(width) as any} />
        </div>
      </div>

      <br />
      <div className={styles.analyze}>
        <h2>テンション分析</h2>
        <p>
          このアーティストが１曲あたりに使用しているテンションの平均値を表示します
        </p>
      </div>
      <div className={styles.content}>
        <div className={styles.pie}>
          <Bar data={bar} options={barOptions as any} />
        </div>
      </div>

      {/*
      import Graph from "react-graph-vis";
      import { v4 as uuidv4 } from "uuid";
      const events = {
        select: function(event: any) {
        var { nodes, edges } = event;
        //ここで選択した場合の制御ができる
        console.log(nodes);
        },
      };
      <div className={styles.analyze}>
        <h2>テンション可視化</h2>
      </div>
      <div className={styles.graph}>
        <Graph
          key={uuidv4()}
          graph={network}
          options={networkOptions(width)}
          events={events}
        /></div>*/}
      <div className={styles.footer}>
        <h3>コード進行が似ているアーティスト</h3>
        <ul>
          {generateSimilarArtistsPie.map((item: any, index: number) => {
            return (
              artistData.id !== item.id && (
                <Link key={index} href={`/analyze/artist/${item.id}`}>
                  <a className={styles.card}>
                    <h4 className={styles.name}>{item.artist}</h4>
                    <br />
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
          {generateSimilarArtistsBar.map((item: any, index: number) => {
            return (
              artistData.id !== item.id && (
                <Link key={index} href={`/analyze/artist/${item.id}`}>
                  <a className={styles.card}>
                    <h4 className={styles.name}>{item.artist}</h4>
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
  const artistData = artist.find((item) => {
    return id === item.id.toString();
  });

  /* アーティストの画像を手に入れる */
  let image = "/noimage.png";

  const term = encodeURIComponent(artistData.artist);
  const res = await fetch(
    `https://itunes.apple.com/search?term=${term}&media=music&entity=musicArtist&country=jp&lang=ja_jp&limit=1`
  );

  const json1 = await res.json();

  if (json1.results && json1.results[0].artistLinkUrl) {
    const json2 = await axios.get(json1.results[0].artistLinkUrl);
    const jsonStr = JSON.stringify(json2.data);
    const startIndex = jsonStr.indexOf("ssl.mzstatic.com/image");
    const cutJsonStr = jsonStr.slice(startIndex - 12, startIndex + 250);
    const lastIndex = cutJsonStr.indexOf("1200x630");
    image = cutJsonStr.slice(0, lastIndex + 14);
  }

  return {
    props: {
      image,
      artistData,
      network: {
        nodes: [
          {
            id: 0,
            label: "王道進行",
            group: 0,
            size: 80,
          },

          { id: 1, label: "1", group: 1, size: 40 },
          { id: 2, label: "2", group: 0 },
          { id: 3, label: "3", group: 1 },
          { id: 4, label: "4", group: 1 },
          { id: 5, label: "5", group: 1 },
          { id: 6, label: "6", group: 2 },
          { id: 7, label: "7", group: 2 },
          { id: 8, label: "8", group: 2 },
          { id: 9, label: "9", group: 3 },
          { id: 10, label: "10", group: 3 },
          { id: 11, label: "11", group: 3 },
          { id: 12, label: "12", group: 4 },
          { id: 13, label: "13", group: 4 },
          { id: 14, label: "14", group: 4 },
          { id: 15, label: "15", group: 5 },
          { id: 16, label: "16", group: 5 },
          { id: 17, label: "17", group: 5 },
          { id: 18, label: "18", group: 6 },
          { id: 19, label: "19", group: 6 },
          { id: 20, label: "20", group: 6 },
          { id: 21, label: "21", group: 7 },
          { id: 22, label: "22", group: 7 },
          { id: 23, label: "23", group: 7 },
          { id: 24, label: "24", group: 8 },
          { id: 25, label: "25", group: 8 },
          { id: 26, label: "26", group: 8 },
          { id: 27, label: "27", group: 9 },
          { id: 28, label: "28", group: 9 },
          { id: 29, label: "29", group: 9 },
        ],
        edges: [
          { from: 1, to: 0 },
          { from: 2, to: 0 },
          { from: 4, to: 3 },
          { from: 5, to: 4 },
          { from: 4, to: 0 },
          { from: 7, to: 6 },
          { from: 8, to: 7 },
          { from: 7, to: 0 },
          { from: 10, to: 9 },
          { from: 11, to: 10 },
          { from: 10, to: 4 },
          { from: 13, to: 12 },
          { from: 14, to: 13 },
          { from: 13, to: 0 },
          { from: 16, to: 15 },
          { from: 17, to: 15 },
          { from: 15, to: 10 },
          { from: 19, to: 18 },
          { from: 20, to: 19 },
          { from: 19, to: 4 },
          { from: 22, to: 21 },
          { from: 23, to: 22 },
          { from: 22, to: 13 },
          { from: 25, to: 24 },
          { from: 26, to: 25 },
          { from: 25, to: 7 },
          { from: 28, to: 27 },
          { from: 29, to: 28 },
          { from: 28, to: 0 },
        ],
      },
    },
  };
};
