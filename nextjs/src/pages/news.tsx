import Link from "next/link";
import styles from "styles/News.module.scss";
import { client } from "lib/microcms";

export default function News({ blog }) {
  return (
    <div className={styles.container}>
      {blog.map((blog) => {
        const createDate = blog.createdAt.split("T")[0].split("-");
        const create = `${createDate[0]}年${createDate[1]}月${createDate[2]}日`;
        const updateDate = blog.createdAt.split("T")[0].split("-");
        const update = `${updateDate[0]}年${updateDate[1]}月${updateDate[2]}日`;

        return (
          <div key={blog.id} className={styles.card}>
            <h2 className={styles.title}>{blog.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: blog.text }} />
            <p className={styles.date}>
              {create}
              {create !== update && `（更新：${update}）`}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export const getStaticProps = async () => {
  const data = await client.get({ endpoint: "chord-vis-news" });
  return {
    props: {
      blog: [], //data.contents,
    },
  };
};
