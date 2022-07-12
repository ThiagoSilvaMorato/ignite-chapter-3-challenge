import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { AiOutlineCalendar } from 'react-icons/ai';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import styles from './post.module.scss';

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
  const router = useRouter();

  if (router.isFallback) {
    return <p>Carregando...</p>;
  }

  const getReadTime = (): number => {
    const normalPeopleWordsPerMinute = 200;

    const totalWordsArray = post.data.content.reduce((acc, content) => {
      const totalWordsContentBody = content.body.reduce(
        (accumulator, body) => [...accumulator, ...body.text.split(' ')],
        []
      );
      return [...acc, ...totalWordsContentBody, ...content.heading.split(' ')];
    }, []);

    return Math.ceil(totalWordsArray.length / normalPeopleWordsPerMinute);
  };

  console.log(
    post.data.content.map(content => {
      return content.body.map(({ text }) => {
        return text;
      });
    })
  );

  return (
    <>
      <Header />
      <main className={styles.container}>
        <picture>
          <img src={post.data.banner.url} alt="banner do post" />
        </picture>
        <article>
          <h1>{post.data.title}</h1>
          <img src="/images/calendar.svg" alt="Calendário" />
          <p>
            {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
              locale: ptBR,
            })}
          </p>
          <img src="/images/user.svg" alt="Usuário" />
          <p>{post.data.author}</p>
          <p>{getReadTime()} min</p>
          {post.data.content.map(content => (
            <div key={content.heading}>
              <h2>{content.heading}</h2>
              {content.body.map(({ text }) => (
                <p key={text}>{text}</p>
              ))}
            </div>
          ))}
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('publication', {
    fetch: [],
    pageSize: 2,
  });

  return {
    paths: posts.results.map(res => ({ params: { slug: res.uid } })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});
  const { slug } = params;
  const post = await prismic.getByUID('publication', String(slug), {});

  return {
    props: {
      post,
    },
    revalidate: 5 * 60,
  };
};
