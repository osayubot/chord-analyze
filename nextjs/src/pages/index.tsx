import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import styles from "styles/Index.module.scss";
import song from "json/song.json";
import artist from "json/artist.json";
import composer from "json/composer.json";

export default function Index() {
  const router = useRouter();

  const [searchSongResult, setSearchSongResult] = useState([]);
  const [searchArtistResult, setSearchArtistResult] = useState([]);
  const [searchComposerResult, setSearchComposerResult] = useState([]);
  const [value, setValue] = useState<string>("");
  const [guide, setGuide] = useState<string>("検索しよう");
  const [showChord, setShowChord] = useState<boolean>(false);
  const [showTension, setShowTension] = useState<boolean>(false);
  const [showSong, setShowSong] = useState<boolean>(true);
  const [showArtist, setShowArtist] = useState<boolean>(true);
  const [showComposer, setShowComposer] = useState<boolean>(true);
  const [chordProgress, setChordProgress] = useState<string[]>([]);
  const [chordTension, setChordTension] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setSearchSongResult(song);
    setSearchArtistResult(artist);
    const chordProgress = Object.keys(song[0].chord);
    setChordProgress(chordProgress);
    const chordTension = Object.keys(song[0].tension);
    setChordTension(chordTension);
  }, [router]);

  const search = (value: string) => {
    const songResult = song.filter((item) => {
      return (
        item.song.indexOf(value) > -1 ||
        item.artist.indexOf(value) > -1 ||
        item.composer.indexOf(value) > -1
      );
    });
    const artistResult = artist.filter((item) => {
      return item.artist.indexOf(value) > -1;
    });

    const composerResult = composer.filter((item) => {
      return item.composer.indexOf(value) > -1;
    });

    setSearchSongResult(songResult);
    setSearchArtistResult(artistResult);
    setSearchComposerResult(composerResult);
    setGuide(value ? `「${value}」の検索結果` : "　");
  };

  return (
    <div className={styles.container}>
      {loading && (
        <div className={styles.loading}>
          <Image src="/loading.svg" width={240} height={240} />
          <h2>分析中...</h2>
        </div>
      )}
      <div className={styles.image}>
        <Image src="/music.png" height={120} width={120} layout="fixed" />
      </div>
      <div className={styles.cardContainer}>
        <h3 className={styles.description}>
          お気に入りの楽曲・アーティストに
          <br />
          似ている曲をコードから探そう 🔍
        </h3>
        <p className={styles.note}>
          現在、楽曲は「曲名・アーティスト・作曲家」などに基づいて探すのが一般的ですが、
          楽曲を構成する「コード」から似た楽曲を探すことができれば、
          楽曲内容をもとにした、音楽理論に基づく楽曲検索ができるのではないかと考えました
        </p>
      </div>

      <h2 className={styles.guide}>{guide}</h2>
      <div className={styles.search}>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            search(e.target.value);
          }}
        />
      </div>

      <div className={styles.cardContainer}>
        <h3 className={styles.item} onClick={() => setShowChord(!showChord)}>
          コード進行から探す&nbsp;
          {showChord ? (
            <Image src="/chevron-up.svg" height="32" width="32" />
          ) : (
            <Image src="/chevron-down.svg" height="32" width="32" />
          )}
        </h3>
        {showChord &&
          chordProgress.map((item, index) => {
            return (
              <Link href={`/analyze/chord/${item}`} key={index}>
                <a className={styles.card}>
                  <h2>{item}</h2>
                  <h5>ランキングを見る</h5>
                </a>
              </Link>
            );
          })}
      </div>

      <div className={styles.cardContainer}>
        <h3
          className={styles.item}
          onClick={() => setShowTension(!showTension)}
        >
          テンションから探す&nbsp;
          {showTension ? (
            <Image src="/chevron-up.svg" height="32" width="32" />
          ) : (
            <Image src="/chevron-down.svg" height="32" width="32" />
          )}
        </h3>
        {showTension &&
          chordTension.map((item, index) => {
            return (
              <Link href={`/analyze/tension/${item}`} key={index}>
                <a className={styles.card}>
                  <h2>{item}</h2>
                  <h5>ランキングを見る</h5>
                </a>
              </Link>
            );
          })}
      </div>

      <div className={styles.cardContainer}>
        <h3 className={styles.item} onClick={() => setShowArtist(!showArtist)}>
          アーティスト&nbsp;
          {showArtist ? (
            <Image src="/chevron-up.svg" height="32" width="32" />
          ) : (
            <Image src="/chevron-down.svg" height="32" width="32" />
          )}
        </h3>

        {showArtist &&
          searchArtistResult.map((item, index) => {
            return (
              <Link href={`/analyze/artist/${item.id}`} key={index}>
                <a
                  className={styles.card}
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => setLoading(false), 100000);
                  }}
                >
                  <h2>{item.artist}</h2>
                  <h5>アーティスト</h5>
                </a>
              </Link>
            );
          })}
        {showArtist && searchArtistResult.length === 0 && (
          <div className={styles.card}>
            <h3>データがありませんでした</h3>
          </div>
        )}
      </div>

      <div className={styles.cardContainer}>
        <h3
          className={styles.item}
          onClick={() => setShowComposer(!showComposer)}
        >
          作曲者&nbsp;
          {showComposer ? (
            <Image src="/chevron-up.svg" height="32" width="32" />
          ) : (
            <Image src="/chevron-down.svg" height="32" width="32" />
          )}
        </h3>

        {showComposer &&
          searchComposerResult.map((item, index) => {
            return (
              <Link href={`/analyze/composer/${item.id}`} key={index}>
                <a
                  className={styles.card}
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => setLoading(false), 10000);
                  }}
                >
                  <h2>{item.composer}</h2>
                  <h5>作曲者</h5>
                </a>
              </Link>
            );
          })}
        {showComposer && searchComposerResult.length === 0 && (
          <div className={styles.card}>
            <h3>データがありませんでした</h3>
          </div>
        )}
      </div>

      <div className={styles.cardContainer}>
        <h3
          className={styles.item}
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 10000);
          }}
        >
          楽曲&nbsp;
          {showSong ? (
            <Image src="/chevron-up.svg" height="32" width="32" />
          ) : (
            <Image src="/chevron-down.svg" height="32" width="32" />
          )}
        </h3>

        {showSong &&
          searchSongResult.map((item, index) => {
            if (item.result === true) {
              // 　分析が成功しているものはクリック可能
              return (
                <Link href={`/analyze/song/${item.id}`} key={index}>
                  <a
                    className={styles.card}
                    onClick={() => {
                      setLoading(true);
                      setTimeout(() => setLoading(false), 10000);
                    }}
                  >
                    <h2>{item.song}</h2>
                    <h5>
                      {item.artist} / {item.composer}
                    </h5>
                    <h5>楽曲</h5>
                  </a>
                </Link>
              );
            }
            return (
              <span className={`${styles.card} ${styles.disabled}`}>
                <h2>{item.song}</h2>
                <h5>
                  {item.artist} / {item.composer}
                </h5>
                <h5>楽曲</h5>
              </span>
            );
          })}
        {showSong && searchSongResult.length === 0 && (
          <div className={styles.card}>
            <h3>データがありませんでした</h3>
          </div>
        )}
      </div>
    </div>
  );
}
