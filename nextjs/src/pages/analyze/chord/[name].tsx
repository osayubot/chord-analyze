import { GetStaticProps, GetStaticPaths } from "next";
import styles from "styles/Analyze.module.scss";
import { useState } from "react";
import Link from "next/link";
import artist from "json/artist.json";
import song from "json/song.json";
import chord from "json/description/chord.json";

export default function ChodName({ name, artistChordAsc, songChordAsc }) {
  const [type, setType] = useState<string>("楽曲");

  const desctiption = chord.find((item) => item.name === name).description;

  return (
    <div className={styles.container}>
      <h1 className={styles.name}>{name}</h1>
      <br />
      <div className={styles.content}>
        <p>{desctiption}</p>
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
      </div>

      <div className={styles.analyze}>
        <h2>
          {type} の {name} ランキング
        </h2>
        <h3>トップ１００</h3>
      </div>

      {type === "楽曲"
        ? JSON.parse(songChordAsc).map((data, index) => {
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
                      <h4>{name}の出現回数：</h4>
                      <span>{data.chord[name].toFixed(3)} 回</span>
                    </div>
                  </a>
                </Link>
              );
          })
        : JSON.parse(artistChordAsc).map((data, index) => {
            if (index < 100)
              return (
                <Link href={`/analyze/artist/${data.id}`} key={index}>
                  <a className={styles.about}>
                    <div className={styles.info}>
                      <h6>{index + 1}位</h6>
                      <p>{data.artist}</p>
                    </div>

                    <div className={styles.info}>
                      <h4>{name}の１曲あたりの平均出現回数：</h4>
                      <span>{data.chord[name].toFixed(3)}回</span>
                    </div>
                  </a>
                </Link>
              );
          })}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const name = params.name.toString();

  artist.sort(function(a, b) {
    if (a.chord[name] > b.chord[name]) return -1;
    if (a.chord[name] < b.chord[name]) return 1;
    return 0;
  });

  song.sort(function(a, b) {
    if (a.chord[name] > b.chord[name]) return -1;
    if (a.chord[name] < b.chord[name]) return 1;
    return 0;
  });

  return {
    props: {
      name,
      artistChordAsc: JSON.stringify(artist),
      songChordAsc: JSON.stringify(song),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const chordName: string[] = Object.keys(artist[0].chord);
  const paths = chordName.map((name) => `/analyze/chord/${name}`);
  return { paths, fallback: false };
};
