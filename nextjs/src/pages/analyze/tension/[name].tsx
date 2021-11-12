import { GetStaticProps, GetStaticPaths } from "next";
import styles from "styles/Analyze.module.css";
import { useState } from "react";
import Link from "next/link";
import artist from "json/artist.json";
import song from "json/song.json";

export default function TensionName({
  name,
  artistTensionAsc,
  songTensionAsc,
}) {
  const [type, setType] = useState<string>("楽曲");

  return (
    <div className={styles.container}>
      <h1 className={styles.name}>{name}</h1>
      <br />
      <div className={styles.content}>
        <p>{name}は　。。。（一部分析できていないテンションあり）</p>
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
        ? JSON.parse(songTensionAsc).map((data, index) => {
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
                      <h4>{name}：</h4>
                      <span>{data.tension[name]} 回</span>
                    </div>
                  </a>
                </Link>
              );
          })
        : JSON.parse(artistTensionAsc).map((data, index) => {
            if (index < 100)
              return (
                <Link href={`/analyze/artist/${data.id}`} key={index}>
                  <a className={styles.about}>
                    <div className={styles.info}>
                      <h6>{index + 1}位</h6>
                      <p>{data.artist}</p>
                    </div>
                    <div className={styles.info}>
                      <h4>{name}：</h4>
                      <span>{data.chord[name]} 回（１曲あたり）</span>
                    </div>{" "}
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
    if (a.tension[name] > b.tension[name]) return -1;
    if (a.tension[name] < b.tension[name]) return 1;
    return 0;
  });

  song.sort(function(a, b) {
    if (a.tension[name] > b.tension[name]) return -1;
    if (a.tension[name] < b.tension[name]) return 1;
    return 0;
  });

  return {
    props: {
      name,
      artistTensionAsc: JSON.stringify(artist),
      songTensionAsc: JSON.stringify(song),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const tensionName: string[] = Object.keys(artist[0].tension);
  const paths = tensionName.map((name) => `/analyze/tension/${name}`);
  return { paths, fallback: false };
};
