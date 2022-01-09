import { GetStaticProps, GetStaticPaths } from "next";
import styles from "styles/Analyze.module.scss";
import { useState } from "react";
import Link from "next/link";
import artist from "json/artist.json";
import composer from "json/composer.json";
import song from "json/song.json";
import chord from "json/description/chord.json";

export default function ChrodName({
  name,
  artistChordAsc,
  songChordAsc,
  composerChordAsc,
}) {
  const [type, setType] = useState<string>("楽曲");

  const { description, quote } = chord.find((item) => item.name === name);

  const songChord = JSON.parse(songChordAsc);
  const artistChord = JSON.parse(artistChordAsc);
  const composerChord = JSON.parse(composerChordAsc);

  return (
    <div className={styles.container}>
      <h1 className={styles.name}>{name}</h1>
      <br />
      <div className={styles.content}>
        <p>{description}</p>
        <p>引用：{quote}</p>
      </div>
      <div className={styles.analyze}>
        <a
          className={styles.button}
          onClick={() => {
            setType("楽曲");
          }}
        >
          　　楽曲　　
        </a>
        {"　"}
        <a
          className={styles.button}
          onClick={() => {
            setType("アーティスト");
          }}
        >
          アーティスト
        </a>
        {"　"}
        <a
          className={styles.button}
          onClick={() => {
            setType("作曲者");
          }}
        >
          作曲者
        </a>
      </div>

      <div className={styles.analyze}>
        <h2>
          {type} の {name} ランキング
        </h2>
        <h3>トップ１００</h3>
      </div>

      {type === "楽曲" &&
        songChord.map((data, index) => {
          if (index < 100)
            return (
              <Link href={`/analyze/song/${data.id}`} key={index}>
                <a className={styles.about}>
                  <div className={styles.info}>
                    <h6>{index + 1}位</h6>
                    <p>
                      {data.song} / {data.artist}
                    </p>
                  </div>
                  <div className={styles.info}>
                    <h4>使用率：</h4>
                    <span>{Number(data.chord[name]).toFixed(1)} %</span>
                  </div>
                </a>
              </Link>
            );
        })}
      {type === "楽曲" && songChord.length === 0 && (
        <a className={styles.about}>
          <div className={styles.info}>
            <h4>該当する{type}が見つかりませんでした</h4>
          </div>
        </a>
      )}
      {type === "アーティスト" &&
        artistChord.map((data, index) => {
          if (index < 100)
            return (
              <Link href={`/analyze/artist/${data.id}`} key={index}>
                <a className={styles.about}>
                  <div className={styles.info}>
                    <h6>{index + 1}位</h6>
                    <p>{data.artist}</p>
                  </div>

                  <div className={styles.info}>
                    <h4>１曲あたりの使用率：</h4>
                    <span>平均{Number(data.chord[name]).toFixed(1)}%</span>
                  </div>
                </a>
              </Link>
            );
        })}
      {type === "アーティスト" && artistChord.length === 0 && (
        <a className={styles.about}>
          <div className={styles.info}>
            <h4>該当する{type}が見つかりませんでした</h4>
          </div>
        </a>
      )}
      {type === "作曲者" &&
        composerChord.map((data, index) => {
          if (index < 100)
            return (
              <Link href={`/analyze/composer/${data.id}`} key={index}>
                <a className={styles.about}>
                  <div className={styles.info}>
                    <h6>{index + 1}位</h6>
                    <p>{data.composer}</p>
                  </div>

                  <div className={styles.info}>
                    <h4>１曲あたりの使用率：</h4>
                    <span>平均{Number(data.chord[name]).toFixed(1)}%</span>
                  </div>
                </a>
              </Link>
            );
        })}
      {type === "作曲者" && composerChord.length === 0 && (
        <a className={styles.about}>
          <div className={styles.info}>
            <h4>該当する{type}が見つかりませんでした</h4>
          </div>
        </a>
      )}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const name = params.name.toString();

  let artistChordAsc = artist.filter((item) => item.chord[name] > 0);
  let composerChordAsc = composer.filter((item) => item.chord[name] > 0);
  let songChordAsc = song.filter((item) => item.chord[name] > 0);

  artistChordAsc.sort(function (a, b) {
    if (a.chord[name] > b.chord[name]) return -1;
    if (a.chord[name] < b.chord[name]) return 1;
    return 0;
  });
  artistChordAsc = JSON.stringify(artistChordAsc);

  composerChordAsc.sort(function (a, b) {
    if (a.chord[name] > b.chord[name]) return -1;
    if (a.chord[name] < b.chord[name]) return 1;
    return 0;
  });

  composerChordAsc = JSON.stringify(composerChordAsc);

  songChordAsc.sort(function (a, b) {
    if (a.chord[name] > b.chord[name]) return -1;
    if (a.chord[name] < b.chord[name]) return 1;
    return 0;
  });

  songChordAsc = JSON.stringify(songChordAsc);

  return {
    props: {
      name,
      artistChordAsc,
      composerChordAsc,
      songChordAsc,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const chordName: string[] = chord.map(({ name }) => name);
  const paths = chordName.map((name) => `/analyze/chord/${name}`);
  return { paths, fallback: false };
};
