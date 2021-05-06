import { GetStaticPaths, GetStaticProps } from 'next';
import {useRouter} from 'next/router';
import Image from 'next/image';

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
     <div className={styles.thumbnailContainer}></div>
      <button>
        <img src="/arrow-left.svg" alt="Voltar"/>
      </button>
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
  )
}

export const getStaticPaths: GetStaticPaths = async() =>{
  return {
    paths:[],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async(ctx) =>{
  const {slug} = ctx.params;

  const {data} = await api.get(`/episode/${slug}`)
  return{
    props:{
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

    },
    revalidate: 60 * 60 * 24
  }
}