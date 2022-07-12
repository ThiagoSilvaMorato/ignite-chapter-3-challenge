import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import Header from '../components/Header';

import { getPrismicClient } from '../services/prismic';

import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface HomeProps {
  postsPagination: {
    next_page: string;
    results: Post[];
  };
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);
  const [nextPage, setNextPage] = useState<string>(postsPagination.next_page);

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, consistent-return
  const handleNextPageClick = async () => {
    try {
      const resultJson = await (await fetch(nextPage)).json();
      const { results, next_page } = resultJson;

      setNextPage(next_page);
      setPosts([...posts, ...results]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Head>
        <title>Spacetraveling | Home</title>
      </Head>

      <Header />
      <main className={styles.container}>
        {posts.map(post => {
          return (
            <Link key={post.uid} href={`/post/${post.uid}`}>
              <a>
                <h2 className={styles.postTitle}>{post.data.title}</h2>
                <p>{post.data.subtitle}</p>
                <div className={styles.infoContainer}>
                  <img src="/images/calendar.svg" alt="Calendário" />
                  <p>
                    {format(
                      new Date(post.first_publication_date),
                      'dd MMM yyyy',
                      { locale: ptBR }
                    )}
                  </p>
                  <img src="/images/user.svg" alt="Usuário" />
                  <p>{post.data.author}</p>
                </div>
              </a>
            </Link>
          );
        })}

        {nextPage !== null && (
          <button onClick={handleNextPageClick} type="button">
            Carregar mais posts
          </button>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('publication', {
    fetch: ['post.title', 'post.subtitle', 'post.author'],
    pageSize: 1,
  });

  const { next_page, results } = postsResponse;

  return {
    props: {
      postsPagination: {
        next_page,
        results,
      },
    },
  };
};
