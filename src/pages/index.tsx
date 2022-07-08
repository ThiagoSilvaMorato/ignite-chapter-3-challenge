import { GetStaticProps } from 'next';
import { Head } from 'next/document';
import { RichText } from 'prismic-dom';
import { useState } from 'react';
import Header from '../components/Header';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
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

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsResponse: PostPagination;
}

export default function Home({ postsResponse }: HomeProps): JSX.Element {
  const [nextPage, setNextPage] = useState<string>(postsResponse.next_page);

  return (
    <>
      <Head>
        <title>Spacetraveling | Home</title>
      </Head>

      <Header />
      <main>
        <p>TESTE</p>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('publication', {
    fetch: ['post.title', 'post.subtitle', 'post.author'],
    pageSize: 20,
  });

  const { next_page, results } = postsResponse;

  return {
    props: {
      postsResponse: {
        next_page,
        results,
      },
    },
  };
};
