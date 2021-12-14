import { useState, useEffect } from "react";
import styles from "styles/Analyze.module.scss";
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

interface About {
  fieldId: string;
  text: string;
  title: string;
  notes: string;
}
import { client } from "lib/microcms";

export default function Analyze({ about }) {
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

        {(about as About[]).map(({ title, text, notes }, index) => {
          return (
            <div className={styles.text} key={index}>
              <h2>{title}</h2>

              <p>{text}</p>
              {notes && <p className={styles.code}>{notes}</p>}
            </div>
          );
        })}
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
              <h4>
                ID：
                {user.uid}
              </h4>

              <h5>名前</h5>
              <input
                placeholder="〇〇大学△△ など"
                onChange={(e) => {
                  if (e.target.value) {
                    setName(e.target.value);
                  }
                }}
              />
              <h5>コメント</h5>
              <textarea
                placeholder="自由にコメントをどうぞ"
                onChange={(e) => {
                  if (e.target.value) {
                    setText(e.target.value);
                  }
                }}
              />
              <h6 className={styles.alert}>{alert}</h6>
              <a className={styles.button} onClick={() => sendComment()}>
                書き込む
              </a>
            </div>
          </div>
          <div className={styles.text}>
            <h3>コメント履歴</h3>

            <p className={styles.code}>荒らしや誹謗中傷は禁止です。</p>

            {comment.map((item, index) => {
              return (
                <p className={styles.code} key={index}>
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

export const getStaticProps = async () => {
  const data = await client.get({ endpoint: "chord-vis-about" });

  return {
    props: {
      about: data.content,
    },
  };
};
