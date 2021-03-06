import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import styles from "styles/Index.module.scss";
import { Scatter } from "react-chartjs-2";
import mds from "json/mds.json";
import mds_extra_other from "json/mds_extra_other.json";
import song from "json/song.json";
import chord from "json/description/chord.json";
import tension from "json/description/tension.json";

export default function Index() {
  const router = useRouter();
  const [searchSongResult, setSearchSongResult] = useState(song);
  const [value, setValue] = useState<string>("");
  const [guide, setGuide] = useState<string>("");

  const [hoverSongId, setHoverSongId] = useState<number>();

  const [showChord, setShowChord] = useState<boolean>(true);
  const [showTension, setShowTension] = useState<boolean>(true);
  const [showSong, setShowSong] = useState<boolean>(true);
  const [chordProgress, setChordProgress] = useState<string[]>([]);
  const [chordTension, setChordTension] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showIncludeOther, setShowIncludeOther] = useState<boolean>(false);

  const defaultDataset = {
    datasets: [
      {
        label: "matched",
        data: [...mds],
        backgroundColor: "rgba(53, 162, 235, 1)",
      },
    ],
  };
  const defaultDataset2 = {
    datasets: [
      {
        label: "matched",
        data: [...mds_extra_other],
        backgroundColor: "rgba(53, 162, 235, 1)",
      },
    ],
  };

  const [datasets, setDatasets] = useState<{
    datasets: {
      label: string;
      data: { x: number; y: number; label: string; id: number }[];
      backgroundColor: string;
    }[];
  }>(defaultDataset);

  const [datasets2, setDatasets2] = useState<{
    datasets: {
      label: string;
      data: { x: number; y: number; label: string; id: number }[];
      backgroundColor: string;
    }[];
  }>(defaultDataset2);

  useEffect(() => {
    const chordProgress = chord.map(({ name }) => name);
    setChordProgress(chordProgress);
    const chordTension = tension.map(({ name }) => name);
    setChordTension(chordTension);
  }, [router]);

  const search = (value: string) => {
    if (value.length === 0) return;
    const songResult = song.filter((item) => {
      return (
        item.song.indexOf(value) > -1 ||
        item.artist.indexOf(value) > -1 ||
        item.composer.indexOf(value) > -1
      );
    });

    const matchedData = [];
    const notMatchedData = [];

    defaultDataset.datasets[0].data.map((item) => {
      if (item.label.indexOf(value) > -1) {
        return matchedData.push(item);
      }
      return notMatchedData.push(item);
    });

    const matchedData2 = [];
    const notMatchedData2 = [];

    defaultDataset2.datasets[0].data.map((item) => {
      if (item.label.indexOf(value) > -1) {
        return matchedData2.push(item);
      }
      return notMatchedData2.push(item);
    });

    setSearchSongResult(songResult);
    setDatasets({
      datasets: [
        {
          label: "matched",
          data: matchedData,
          backgroundColor: "rgba(255, 99, 132, 1)",
        },
        {
          label: "notMatched",
          data: notMatchedData,
          backgroundColor: "rgba(0, 0, 0, 0.1)",
        },
      ],
    });
    setDatasets2({
      datasets: [
        {
          label: "matched",
          data: matchedData2,
          backgroundColor: "rgba(255, 99, 132, 1)",
        },
        {
          label: "notMatched",
          data: notMatchedData2,
          backgroundColor: "rgba(0, 0, 0, 0.1)",
        },
      ],
    });
    setGuide(value ? `???${value}??????????????????` : "???");
  };

  return (
    <div className={styles.container}>
      {loading && <div className={styles.loading} />}

      <div className={styles.image}>
        <Image src="/music.png" height={120} width={120} layout="fixed" />
      </div>
      <div className={styles.cardContainer}>
        <h3 className={styles.description}>
          ????????????????????????????????????????????????
          <br />
          ?????????????????????????????????????????? ????
        </h3>
        <p className={styles.note}>
          ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
          ???????????????????????????????????????????????????????????????????????????????????????
          ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
        </p>
      </div>

      <div className={styles.cardContainer}>
        <Scatter
          data={datasets}
          options={{
            elements: { point: { radius: 2 } },
            onClick: () => {
              if (hoverSongId) {
                router.push(`/analyze/song/${hoverSongId}`);
              }
            },
            legend: { display: false },
            tooltips: {
              callbacks: {
                label: (tooltipItem, data) => {
                  const datasetIndex = tooltipItem.datasetIndex;
                  const index = tooltipItem.index;
                  var labelObj = data.datasets[datasetIndex].data[index];
                  // if (context.dataset.label !== "notMatched") {return "";}
                  setHoverSongId(labelObj.id);
                  return labelObj?.label ? labelObj.label : "";
                },
              },
            },
            parsing: { label: "label" },
          }}
        />
      </div>
      <h5 className={styles.advice}>
        ??? ?????????????????????????????????????????????????????????????????????
      </h5>

      {showIncludeOther && (
        <div className={styles.cardContainer}>
          <Scatter
            data={datasets2}
            options={{
              elements: { point: { radius: 2 } },
              legend: { display: false },
              onClick: () => {
                if (hoverSongId) {
                  router.push(`/analyze/song/${hoverSongId}`);
                }
              },
              tooltips: {
                callbacks: {
                  label: (tooltipItem, data) => {
                    const datasetIndex = tooltipItem.datasetIndex;
                    const index = tooltipItem.index;
                    var labelObj = data.datasets[datasetIndex].data[index];
                    // if (context.dataset.label !== "notMatched") {return "";}
                    setHoverSongId(labelObj.id);
                    return labelObj?.label ? labelObj.label : "";
                  },
                },
              },
              parsing: { label: "label" },
            }}
          />
        </div>
      )}
      <a
        className="button"
        onClick={() => setShowIncludeOther(!showIncludeOther)}
      >
        {!showIncludeOther ? "???????????????????????????????????????" : "?????????"}
      </a>

      <h2 className={styles.guide}>{guide}</h2>

      <div className={styles.search}>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            if (e.target.value.length === 0) {
              setLoading(true);
              setGuide("");
              setLoading(false);
            }
            setValue(e.target.value);
          }}
        />
        <div className={styles.magnify}>
          <Image
            src="/search.svg"
            height="32"
            width="32"
            onClick={() => search(value)}
          />
        </div>
      </div>

      <div className={styles.cardContainer}>
        <h3 className={styles.item} onClick={() => setShowChord(!showChord)}>
          ???????????????&nbsp;
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
                <a className={styles.card} onClick={() => setLoading(true)}>
                  <h2>{item}</h2>
                  <h5>????????????????????????</h5>
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
          ???????????????&nbsp;
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
                <a className={styles.card} onClick={() => setLoading(true)}>
                  <h2>{item}</h2>
                  <h5>????????????????????????</h5>
                </a>
              </Link>
            );
          })}
      </div>

      <div className={styles.cardContainer}>
        <h3 className={styles.item} onClick={() => setShowSong(!showSong)}>
          ????????????&nbsp;
          {showSong ? (
            <Image src="/chevron-up.svg" height="32" width="32" />
          ) : (
            <Image src="/chevron-down.svg" height="32" width="32" />
          )}
        </h3>

        {showSong &&
          searchSongResult.map((item, index) => {
            // ?????????????????????????????????????????????????????????
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
                  <h5>??????</h5>
                </a>
              </Link>
            );
          })}
        {showSong && searchSongResult.length === 0 && (
          <div className={styles.card}>
            <h3>????????????????????????????????????</h3>
          </div>
        )}
      </div>
    </div>
  );
}
