import { GetStaticPaths, GetStaticProps } from 'next';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import * as prismicH from '@prismicio/helpers';
import Header from '../../components/Header';
import { getPrismicClient } from '../../services/prismic';
import commonStyles from '../../styles/common.module.scss';
import { formatDate } from '../../utils/date';
import styles from './post.module.scss';
import { useRouter } from 'next/router';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const { isFallback } = useRouter();

  if (isFallback) {
    return <div>Carregando...</div>;
  }
  const readingTime = Math.ceil(
    post.data.content
      .map(ct => {
        const bodyLength = ct.body
          .map(b => b.text.length)
          .reduce((acc, cur) => acc + cur, 0);
        return bodyLength + ct.heading.length;
      })
      .reduce((acc, cur) => acc + cur, 0) / 200
  );

  return (
    <>
      <div className={commonStyles.structure}>
        <Header />
        <section className={styles.section}>
          <div className={styles.banner}>
            <img src={post.data.banner.url} alt={post.data.title} />
          </div>
          <article className={styles.post}>
            <div>
              <h1>{post.data.title}</h1>
              <div className={commonStyles.info}>
                <time>
                  <FiCalendar />
                  {formatDate(post.first_publication_date)}
                </time>
                <address>
                  <FiUser />
                  {post.data.author}
                </address>
                <span>
                  <FiClock />
                  {`${readingTime} min`}
                </span>
              </div>
            </div>
            {post.data.content.map(content => (
              <section key={Math.random()}>
                <h1>{content.heading}</h1>
                <div
                  dangerouslySetInnerHTML={{
                    __html: prismicH.asHTML(content.body),
                  }}
                />
              </section>
            ))}
          </article>
        </section>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});

  const posts = await prismic.getByType('posts');

  return {
    paths: posts.results.map(post => ({ params: { slug: post.uid } })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});
  const slug = params.slug as string;
  const post = await prismic.getByUID('posts', slug);

  return {
    props: {
      post,
    },
  };
};
