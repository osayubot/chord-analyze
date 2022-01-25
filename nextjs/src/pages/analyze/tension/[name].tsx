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

  const { description, quote } = tension.find((item) => item.name === name);

  const songTension = JSON.parse(songTensionAsc);
  const artistTension = JSON.parse(artistTensionAsc);
  const composerTension = JSON.parse(composerTensionAsc);

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
          className="button"
          onClick={() => {
            setType("楽曲");
          }}
        >
          　　楽曲　　
        </a>
        {"　"}
        <a
          className="button"
          onClick={() => {
            setType("アーティスト");
          }}
        >
          アーティスト
        </a>
        {"　"}
        <a
          className="button"
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
        songTension.map((data, index) => {
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
                    <h4>使用回数：</h4>
                    <span>{Number(data.tension[name])} 回</span>
                  </div>
                </a>
              </Link>
            );
        })}
      {type === "楽曲" && songTension.length === 0 && (
        <a className={styles.about}>
          <div className={styles.info}>
            <h4>該当する{type}が見つかりませんでした</h4>
          </div>
        </a>
      )}

      {type === "アーティスト" &&
        artistTension.map((data, index) => {
          if (index < 100 && data.tension[name] > 0)
            return (
              <Link href={`/analyze/artist/${data.id}`} key={index}>
                <a className={styles.about}>
                  <div className={styles.info}>
                    <h6>{index + 1}位</h6>
                    <p>{data.artist}</p>
                  </div>
                  <div className={styles.info}>
                    <h4>１曲あたりの使用回数：</h4>
                    <span>平均{Number(data.tension[name]).toFixed(1)}回</span>
                  </div>
                </a>
              </Link>
            );
        })}
      {type === "アーティスト" && artistTension.length === 0 && (
        <a className={styles.about}>
          <div className={styles.info}>
            <h4>該当する{type}が見つかりませんでした</h4>
          </div>
        </a>
      )}

      {type === "作曲者" &&
        composerTension.map((data, index) => {
          if (index < 100 && data.tension[name] > 0)
            return (
              <Link href={`/analyze/composer/${data.id}`} key={index}>
                <a className={styles.about}>
                  <div className={styles.info}>
                    <h6>{index + 1}位</h6>
                    <p>{data.composer}</p>
                  </div>
                  <div className={styles.info}>
                    <h4>１曲あたりの使用回数：</h4>
                    <span>平均{Number(data.tension[name]).toFixed(1)}回</span>
                  </div>
                </a>
              </Link>
            );
        })}
      {type === "作曲者" && composerTension.length === 0 && (
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

  let artistTensionAsc = artist.filter((item) => item.tension[name] > 0);
  let composerTensionAsc = composer.filter((item) => item.tension[name] > 0);
  let songTensionAsc = song.filter((item) => item.tension[name] > 0);

  artistTensionAsc.sort(function (a, b) {
    if (a.tension[name] > b.tension[name]) return -1;
    if (a.tension[name] < b.tension[name]) return 1;
    return 0;
  });
  artistTensionAsc = JSON.stringify(artistTensionAsc);

  composerTensionAsc.sort(function (a, b) {
    if (a.tension[name] > b.tension[name]) return -1;
    if (a.tension[name] < b.tension[name]) return 1;
    return 0;
  });
  composerTensionAsc = JSON.stringify(composerTensionAsc);

  songTensionAsc.sort(function (a, b) {
    if (a.tension[name] > b.tension[name]) return -1;
    if (a.tension[name] < b.tension[name]) return 1;
    return 0;
  });
  songTensionAsc = JSON.stringify(songTensionAsc);

  return {
    props: {
      name,
      artistTensionAsc,
      composerTensionAsc,
      songTensionAsc,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const tensionName: string[] = tension.map(({ name }) => name);
  const paths = tensionName.map((name) => `/analyze/tension/${name}`);
  return { paths, fallback: false };
};
