import { GetStaticPaths, GetStaticProps } from 'next';
import {useRouter} from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import api from '../../service/api';
import {format, parseISO} from 'date-fns';
import {ptBR} from 'date-fns/locale';
import { convertDurationToTimeString } from '../../util/convertDurationToTimeString';

import styles from './episode.module.scss';

type Episodes ={
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string ;
  description:string ;
  url:string ;
  duration: Number ;
  durationAsString: string;
}

type episodesProps = {
  episodes: Episodes;
}

export default function Episodes({episodes}: episodesProps){
  const router = useRouter();
  return (
   <div className={styles.episode}>
     <div className={styles.thumbnailContainer}>
     <Link href="/">
      <button>
        <img src="/arrow-left.svg" alt="Voltar"/>
      </button>
      </Link>
      <Image
        width={700}
        height={160}
        src={episodes.thumbnail}
        objectFit="cover"
      />
      <button>
        <img src="/play.svg" alt="Tocar episódio"/>
      </button>
   </div>

    <header>
      <h1>{episodes.title}</h1>
      <span>{episodes.members}</span>
      <span>{episodes.publishedAt}</span>
      <span>{episodes.durationAsString}</span>
    </header>

    <div className={styles.description}
      dangerouslySetInnerHTML={{__html: episodes.description}}
    />

  </div>
  )
}

export const getStaticPaths: GetStaticPaths = async() =>{
  const { data } = await api.get('episodes',{
    params:{
      _limit: 2,
      _sort: 'published_at',
      _order: 'desc'
    }
  })
  const paths = data.map(episodes =>{
    return {
      params:{
        slug: episodes.id,
      }
    }
  })
  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async(ctx) =>{
  const {slug} = ctx.params;

  const { data } = await api.get(`/episodes/${slug}`)
  const episodes =  {
      id: data.id,
      title: data.title,
      members: data.members,
      publishedAt: format(
        parseISO(data.published_at),
       'd MMM yy',{
         locale: ptBR
        }),
      thumbnail: data.thumbnail,
      description: data.description,
      url: data.file.url,
      duration: Number(data.file.duration),
      durationAsString: convertDurationToTimeString(Number(data.file.duration))
    }
  return{
    props:{
      episodes,
    },
    revalidate: 60 * 60 * 24
  }
}