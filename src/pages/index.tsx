import { GetStaticProps } from 'next';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import { formatDate } from '../utils/date';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const { results, next_page } = postsPagination;
  const [posts, setPosts] = useState<Post[]>(results);
  const [nextPage, setNextPage] = useState<string>(next_page);

  const loadPostsHandler = async (): Promise<void> => {
    const data = await (await fetch(nextPage)).json();

    setPosts(prev => [...prev, ...data.results]);
    setNextPage(data.next_page);
  };

  return (
    <div className={commonStyles.structure}>
      <Header />
      <section className={styles.section}>
        {posts.map(post => (
          <Link key={post.uid} href={`post/${post.uid}`}>
            <article className={styles.post}>
              <h1>{post.data.title}</h1>
              <span>{post.data.subtitle}</span>
              <div className={commonStyles.info}>
                <time>
                  <FiCalendar />
                  <span>{formatDate(post.first_publication_date)}</span>
                </time>
                <address>
                  <FiUser />
                  <span>{post.data.author}</span>
                </address>
              </div>
            </article>
          </Link>
        ))}
        {nextPage && (
          <button
            onClick={loadPostsHandler}
            className={styles.loadPosts}
            type="button"
          >
            Carregar mais posts
          </button>
        )}
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts', {
    pageSize: 1,
  });

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: postsResponse.results,
      },
    },
  };
};
