import { useState, useEffect } from "react";
import styles from "styles/Analyze.module.css";
import { useAuthentication } from "hooks/authentication";
import {
  addDoc,
  collection,
  query,
  getDocs,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";

interface Comment {
  uid: string;
  name: string;
  text: string;
  createdAt: any;
}

export default function Analyze() {
  const { user } = useAuthentication();
  const [name, setName] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [alert, setAlert] = useState<string>("");
  const [comment, setComment] = useState<Comment[]>([]);

  useEffect(() => {
    getComment();
  }, []);

  const getComment = async () => {
    const db = getFirestore();
    const q = query(collection(db, "comments"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return;
    }
    const comment = snapshot.docs.map((doc) => {
      return doc.data() as Comment;
    });
    setComment(comment);
  };

  const sendComment = async () => {
    if (text.length > 4) {
      const db = getFirestore();
      const newComment: Comment = {
        uid: user.uid,
        name: name ? name : "匿名",
        text,
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, "comments"), newComment);
      setText("");
      setAlert("コメントを送信しました");
      setComment([newComment, ...comment]);
    }
    setAlert("5文字以上で入力して下さい");
  };
  return (
    <div className={styles.container}>
      <div className={styles.content2}>
        <h1 className={styles.title}>研究概要</h1>

        <div className={styles.text}>
          <h2>そもそもコードとは何か</h2>
          <p>
            コードとは音楽理論において、「和音」のことで、特に「３音以上の違う高さの音の重なり」のことを指します。
            <br />
            音楽はリズム・メロディー・ハーモニーの３要素から構成されており、コードは特にメロディーに大きな影響を与えます。
          </p>
        </div>
        <div className={styles.text}>
          <h2>コードを分析するとわかること</h2>
          <p>
            「同じコード進行が使われている曲はメロディが似やすく」なり、「同じテンションが使われている曲はジャンルが近くなる」という特性から、コードを分析することで曲の特徴を知ることができます。
          </p>
        </div>
        <div className={styles.text}>
          <h2>本研究について</h2>
          <p>
            以上の性質から、曲の定型コードやテンションを分析することで、「コード理論に基づいた新規音楽の開拓・選曲の効率化」を可能にし、音楽や曲に関する新たな知見を得ることができるのではないかと考えました。
          </p>
        </div>

        <div className={styles.text}>
          <h2>研究の流れ</h2>
          <p>
            コードの取得・加工 &rarr; コードの分析 &rarr; 楽曲を可視化
            の順に研究を進めました。
          </p>
        </div>
        <div className={styles.text}>
          <h2>①コードの取得・加工</h2>
          <p>
            コード譜を提供しているサイトをスクレイピングし、コード部分を抽出し、Cメジャースケールに移調します。　{" "}
            <br />
            移調とは曲のキーを変えることで、これによって、調性に依存せずにコード進行を比較できます。
            <br />
          </p>
        </div>
        <div className={styles.text}>
          <h2>②コードの分析</h2>
          <p>
            出現するテンションコードの情報から楽曲のジャンルを分析し、楽曲の定型コードとの類似度をレーベンシュタイン距離を用い、メロディを分析します。
            <br />
            レーベンシュタイン距離とは二つの文字列がどの程度異なっているかを表す距離のことです。
            <br />
            また以下のようなルールを設定し、楽曲のコード進行が使われている割合を計算しています。
          </p>
          <p className={styles.code}>
            【ルール】 <br />
            ①典型コード進行と完全に一致または代理コードが使用されている場合
            &rarr; 同一コードとみなす
            <br />
            ②典型コード進行と1つだけコードが異なるもしくは間にコードが挿入されている
            &rarr; 派生コードとみなす
            <br />
            ③それ以外 &rarr; 同一でも派生コードでもない
            <br />
          </p>
        </div>
        <div className={styles.text}>
          <h2>③楽曲を可視化</h2>
          <p>
            当初は８万曲の表示を一気に行う想定でしたが、処理が100曲の時点でもすでに重く、仮に８万曲の表示ができたとしても美しく可視化することはできないと判断したため、「コード理論に基づいた新規音楽の開拓」を達成する方法として、①ユーザーに好みの楽曲を検索してもらい、②その楽曲に類似した楽曲を表示する
            という手法を取りました。
            <br />
            <br />
            また、コード分析をする際に「Ａメロ・Ｂメロ・サビ・楽曲全体」どの部分で類似度を定義するべきか
            という課題に関しては、「楽曲全体におけるコード進行の割合」で類似度を決めるのが最も適当な方法ではないかと考え、円グラフを用いてコード進行の出現割合を表示しました。
            <br />
          </p>
          <p className={styles.code}>
            【備考】 <br />
            類似度はユークリッド距離で算出しています。
            <br />
            可視化ライブラリ：
            <a href="https://github.com/reactchartjs/react-chartjs-2">
              chart.js
            </a>
            ，
            <a href="https://www.npmjs.com/package/react-vis-network-graph">
              vis.js
            </a>
            <br />
            ジャケ写は
            <a href="https://syncer.jp/itunes-api-matome">iTunesApi</a>
            を叩いて取得していますが、楽曲名が同じ場合に別の楽曲を表示してしまうことがあります。
          </p>
        </div>
        <div className={styles.text}>
          <h2>今後の課題</h2>
          <p>
            コード進行を円グラフ、「テンションを棒グラフで可視化していますが、コード進行とテンションを組み合わせた（２変数の）類似度の可視化も行いたいと考えています。
            <br />
            また、トップページで検索した際にグレーで表示されている楽曲は、典型コード進行が１つも見つからなかったものです。これは「楽曲で実際に典型コード進行が使われていない」か、「移調に失敗しておりコード進行を検出できなかった」のどちらかが原因であると考えられ、後者の場合はコードの調性（キー）判定の精度をあげる必要があります。
            <br />
            それに加え、分析の精度やバリエーションも増やし、よりわかりやすい可視化を目指していきたいです。
          </p>
        </div>
      </div>
      <br />
      {/*<div className={styles.content2}>
        <div className={styles.text}>
          <p>
            スライドは{" "}
            <a href="/">
              <b>こちら</b>
            </a>
          </p>
        </div>
      </div>*/}
      <br />
      {user && (
        <div className={styles.content2}>
          <h2>&nbsp;&nbsp;感想を聞かせてください！</h2>
          <div className={styles.text}>
            <p>こちらのページをご覧いただきありがとうございました。</p>
            <p>もしよろしければ、本研究への感想をお聞かせください！</p>
            <p>書き込みは今後の開発に役立たせていただきます。</p>
          </div>

          <div className={styles.text}>
            <div className={styles.comment}>
              <h5>
                ID：
                {user.uid}
              </h5>

              <h6>名前</h6>
              <input
                placeholder="〇〇大学△△ など"
                onChange={(e) => {
                  if (e.target.value) {
                    setName(e.target.value);
                  }
                }}
              />
              <h6>コメント</h6>
              <textarea
                placeholder="自由にコメントをどうぞ"
                onChange={(e) => {
                  if (e.target.value) {
                    setText(e.target.value);
                  }
                }}
              />
              <h6 className={styles.alert}>{alert}</h6>
              <a
                className={styles.button}
                onClick={() => {
                  sendComment();
                }}
              >
                書き込む
              </a>
            </div>
          </div>
          <div className={styles.text}>
            <h3>コメント履歴</h3>

            <p className={styles.code}>荒らしや誹謗中傷は禁止です。</p>

            {comment.map((item) => {
              return (
                <p className={styles.code}>
                  {item.text}
                  <br />
                  {item.name} さん
                  <br />
                  ID:{item.uid}
                </p>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
