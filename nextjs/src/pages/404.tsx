import Link from "next/link";
import styles from "styles/Error.module.scss";

export default function Custom404() {
  return (
    <div className={styles.container}>
      <h1>404</h1>
      <Link href="/">
        <a>トップへ戻る</a>
      </Link>
    </div>
  );
}
