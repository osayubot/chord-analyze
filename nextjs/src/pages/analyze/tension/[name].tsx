import { GetStaticProps, GetStaticPaths } from "next";
import styles from "styles/Analyze.module.scss";
import { useState } from "react";
import Link from "next/link";
import artist from "json/artist.json";
import composer from "json/composer.json";
import song from "json/song.json";
import tension from "json/description/tension.json";

export default function TensionName({
  name,
  artistTensionAsc,
  composerTensionAsc,
  songTensionAsc,
}) {
  const [type, setType] = useState<string>("楽曲");

  const desctiption = tension.find((item) => item.name === name).description;

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
        JSON.parse(songTensionAsc).map((data, index) => {
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
                    <h4>出現回数：</h4>
                    <span>{Number(data.tension[name]).toFixed(3)} 回</span>
                  </div>
                </a>
              </Link>
            );
        })}
      {type === "アーティスト" &&
        JSON.parse(artistTensionAsc).map((data, index) => {
          if (index < 100)
            return (
              <Link href={`/analyze/artist/${data.id}`} key={index}>
                <a className={styles.about}>
                  <div className={styles.info}>
                    <h6>{index + 1}位</h6>
                    <p>{data.artist}</p>
                  </div>
                  <div className={styles.info}>
                    <h4>１曲あたりの平均出現回数：</h4>
                    <span>{Number(data.tension[name]).toFixed(3)}回</span>
                  </div>
                </a>
              </Link>
            );
        })}
      {type === "作曲者" &&
        JSON.parse(composerTensionAsc).map((data, index) => {
          if (index < 100)
            return (
              <Link href={`/analyze/composer/${data.id}`} key={index}>
                <a className={styles.about}>
                  <div className={styles.info}>
                    <h6>{index + 1}位</h6>
                    <p>{data.composer}</p>
                  </div>
                  <div className={styles.info}>
                    <h4>１曲あたりの平均出現回数：</h4>
                    <span>{Number(data.tension[name]).toFixed(3)}回</span>
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

  artist.sort(function (a, b) {
    if (a.tension[name] > b.tension[name]) return -1;
    if (a.tension[name] < b.tension[name]) return 1;
    return 0;
  });

  composer.sort(function (a, b) {
    if (a.tension[name] > b.tension[name]) return -1;
    if (a.tension[name] < b.tension[name]) return 1;
    return 0;
  });

  song.sort(function (a, b) {
    if (a.tension[name] > b.tension[name]) return -1;
    if (a.tension[name] < b.tension[name]) return 1;
    return 0;
  });

  return {
    props: {
      name,
      artistTensionAsc: JSON.stringify(artist),
      composerTensionAsc: JSON.stringify(composer),
      songTensionAsc: JSON.stringify(song),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const tensionName: string[] = tension.map(({ name }) => name);
  const paths = tensionName.map((name) => `/analyze/tension/${name}`);
  return { paths, fallback: false };
};
