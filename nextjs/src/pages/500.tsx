import Link from "next/link";
import styles from "styles/Error.module.css";

export default function Custom500() {
  return (
    <div className={styles.container}>
      <h1>500</h1>
      <Link href="/">
        <a>トップへ戻る</a>
      </Link>
    </div>
  );
}
