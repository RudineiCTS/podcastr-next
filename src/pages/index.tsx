import {GetStaticProps} from 'next';
import {format, parseISO} from 'date-fns';
import {ptBR} from 'date-fns/locale';
import api from '../service/api';
import { convertDurationToTimeString } from '../util/convertDurationToTimeString';

type Episodes ={
  id: string;
  title: string;
  members: string;
}

type homeProps ={
  episodes:  Episodes[];
}

export default function Home(props: homeProps) {
  return (
    <div>
    <h1>index</h1>
    <p>{JSON.stringify(props.episodes)}</p>
    </div>
   
  )
}
export const getStaticProps: GetStaticProps = async() =>{
  const { data } = await api.get('episodes',{
    params:{
      _limit: 12,
      _sort: 'published_at',
      _order:'desc'
    }
  })
  const episodes = data.map(episode => {
    return { 
      id: episode.id,
      title: episode.title,
      member: episode.member,
      publishedAt: format(
        parseISO(episode.published_at),
       'd MMM yy',{
         locale: ptBR
        }),
      thumbnail: episode.thumbnail,
      description: episode.description,
      url: episode.file.url,
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration))
    }
  })

  
  return {
    props: {
      episodes,
      },
    revalidate: 60 * 60 * 8
    }
  }