import { RecoilRoot } from "recoil";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import "lib/firebase";
import "hooks/authentication";
import "styles/globals.scss";

function MyApp({ Component, pageProps }) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  return (
    <RecoilRoot>
      <div>
        <Head>
          <title>コード分析の可視化</title>
          <meta
            name="description"
            content="あなたの好きな楽曲・アーティストがよく使っているコードはなに？楽曲内容をもとにした、音楽理論に基づく楽曲検索をしよう！"
          />
          <link rel="icon" href="/favicon.ico" />
          <meta property="og:url" content="https://chord-vis.vercel.app" />
          <meta property="og:title" content="コード分析の可視化" />
          <meta
            property="og:site_name"
            content="コード進行の可視化を用いた楽曲検索・楽曲推薦システムの構築"
          />
          <meta
            property="og:description"
            content={`大量の楽曲の分布をコード進行の類似度にもとづいて可視化し、そこからの絞り込みによって楽曲を検索・推薦できるシステムです。
            \n本システムを使用することで、コード進行が類似した楽曲群などから自分の好みの楽曲を見つけることができ、コード情報から楽曲に関する新たな知見を得ることができます。`}
          />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="/icon.png" />
          <meta property="og:image:width" content="160" />
          <meta property="og:image:height" content="160" />
        </Head>
        <header>
          <div className="nav">
            <Link href="/">
              <a>
                <h1>chord vis</h1>
                <p>
                  コード進行の可視化を用いた楽曲検索・楽曲推薦システムの構築
                </p>
              </a>
            </Link>

            <a className="icon" onClick={() => setMenuOpen(!menuOpen)}>
              {!menuOpen ? (
                <Image src="/menu.svg" alt="三" height={72} width={72} />
              ) : (
                <Image src="/close.svg" alt="×" height={72} width={72} />
              )}
            </a>

            <div className={menuOpen ? "open" : ""}>
              <div className="menu">
                <Link href="/">
                  <a onClick={() => setMenuOpen(false)}>トップへ戻る</a>
                </Link>
                <Link href="/analyze">
                  <a
                    onClick={() => {
                      setMenuOpen(false);
                    }}
                  >
                    コード分析の可視化とは
                  </a>
                </Link>
                <Link href="/news">
                  <a onClick={() => setMenuOpen(false)}>研究の進捗</a>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main>
          <Component {...pageProps} />
        </main>

        <footer>
          <Link href="/">
            <a>
              <h2>コード分析の可視化</h2>
              <h6>sayuri kai</h6>
              <h6>@ お茶の水女子大学 伊藤研</h6>
            </a>
          </Link>
        </footer>
      </div>
    </RecoilRoot>
  );
}

export default MyApp;
