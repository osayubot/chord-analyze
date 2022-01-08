import Image from "next/image";
import Link from "next/link";
import styles from "styles/Analyze.module.scss";
import { Pie, Bar, HorizontalBar } from "react-chartjs-2";
import { GetServerSideProps } from "next";
import {
  horizonalBarOption,
  smallHorizonalBarOption,
  pieOptions,
  smallPieOptions,
  backgroundColor,
  barOptions,
} from "lib/vis";
import song from "json/song.json";
import artist from "json/artist.json";
import composer from "json/composer.json";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function SongId({ image, songData }) {
  const chordKeyArr = Object.keys(songData.chord);
  const tensionKeyArr = Object.keys(songData.tension);

  const router = useRouter();

  useEffect(() => {
    /* 一番使われているテンション */
    const maxTension = () => {
      let maxPoint = 0;
      let max = null;
      for (let key in songData.tension) {
        if (maxPoint < songData.tension[key]) max = key;
      }
      return max;
    };
    /* 一番使われているコード */
    const maxChord = () => {
      let maxPoint = 0;
      let max = null;
      for (let key in songData.chord) {
        if (maxPoint < songData.chord[key]) max = key;
      }
      return max;
    };

    /* 類似している曲を探す */

    let chordAsc = [];
    let tensionAsc = [];
    song.map((item) => {
      // コードの距離を算出
      let chordDif = 0;
      for (let key in item.chord) {
        const dif = songData.chord[key] - item.chord[key];
        chordDif += dif * dif;
      }
      // テンションの距離を算出
      let tensionDif = 0;
      for (let key in item.tension) {
        const dif = songData.tension[key] - item.tension[key];
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

  const [loading, setLoading] = useState<boolean>(false);

  let total = 0;
  chordKeyArr.map((key) => {
    total = total + Number(songData.chord[key]);
  });

  let horizontalBar = {
    datasets: chordKeyArr.map((key, index) => {
      const number = Number(songData.chord[key]);
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
          return Number(songData.chord[key]).toFixed(2);
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
          return Number(songData.tension[key]).toFixed(2);
        }),
        backgroundColor,
      },
    ],
  };

  const generateSimilarSongsPie = chordAsc.slice(0, 10).map((item: any) => {
    const newPie = {
      labels: chordKeyArr,
      datasets: [
        {
          data: chordKeyArr.map((key) => {
            return Number(item.chord[key]).toFixed(2);
          }),
          backgroundColor,
          borderWidth: 2,
        },
      ],
    };
    let total = 0;
    chordKeyArr.map((key) => {
      total = total + Number(songData.chord[key]);
    });

    const newHorizonalBar = {
      datasets: chordKeyArr.map((key, index) => {
        const number = Number(songData.chord[key]);
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

  const generateSimilarSongsBar = tensionAsc.slice(0, 10).map((item: any) => {
    let newBar = {
      labels: tensionKeyArr,
      datasets: [
        {
          data: tensionKeyArr.map((key) => {
            return Number(item.tension[key]);
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
      {loading && <div className={styles.loading} />}
      <h1 className={styles.name}>{songData.song}</h1>
      <div className={styles.detail}>
        <a
          className={styles.link}
          onClick={() => {
            setLoading(true);
            const result = artist.find((item) => {
              return item.artist === songData.artist;
            });
            if (result) router.push(`/analyze/artist/${result.id}`);
          }}
        >
          {songData.artist}
        </a>
        /
        <a
          className={styles.link}
          onClick={() => {
            setLoading(true);
            const result = composer.find((item) => {
              return item.composer === songData.composer;
            });

            if (result) router.push(`/analyze/composer/${result.id}`);
          }}
        >
          {songData.composer}
        </a>
      </div>
      <br />
      <Image src={image} width={240} height={240} className="circle" />
      <br />
      <div className={styles.about}>
        <h4>分析結果</h4>
        <div className={styles.info}>
          <h6>調（キー）</h6>
          <p>{songData.key}</p>
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
          {/*<Pie data={pie} options={pieOptions as any} />*/}
          <HorizontalBar data={horizontalBar} options={horizonalBarOption} />
        </div>
      </div>
      <div className={styles.analyze}>
        <h2>テンション分析</h2>
        <p>曲中でのテンション使用回数を表示しています</p>
        <div className={styles.content}>
          <div className={styles.pie}>
            <Bar data={bar} options={barOptions} />
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <h3>コード進行が似ているアーティスト</h3>
        <ul>
          {generateSimilarSongsPie.map((item: any, index: number) => {
            return (
              songData.id !== item.id && (
                <Link key={index} href={`/analyze/song/${item.id}`}>
                  <a className={styles.card}>
                    <h4 className={styles.name}>{item.song}</h4>
                    <p className={styles.type}>
                      {item.artist} / {item.composer}
                    </p>
                    <HorizontalBar
                      data={item.horizontalBar}
                      options={smallHorizonalBarOption}
                    />
                    {/*<Pie data={item.pie} options={smallPieOptions} /><br />*/}

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
              songData.id !== item.id && (
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
  const songData = song.find((item) => {
    return id === item.id.toString();
  });

  const term = encodeURIComponent(songData.song);
  const res = await fetch(
    `https://itunes.apple.com/search?term=${term}&media=music&entity=song&country=jp&lang=ja_jp&limit=1`
  );

  const json = await res.json();

  const image = json.results
    ? json.results[0].artworkUrl100.toString().replace("100x100", "500x500")
    : "/noimage.png";

  return {
    props: {
      image,
      songData,
    },
  };
};
