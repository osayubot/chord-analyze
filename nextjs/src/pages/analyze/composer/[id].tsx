import styles from "styles/Analyze.module.scss";
import Link from "next/link";

export default function ComposerId() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.title}>
          <h1>Sorry</h1>
          <p>現在開発中です</p>
        </div>
        <Link href="/">
          <a>トップへ戻る</a>
        </Link>
      </div>
    </div>
  );
}
