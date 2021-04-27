import {GetStaticProps} from 'next';
import api from '../service/api';

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

  
  return {
    props: {
      episodes:data
      },
    revalidate: 60 * 60 * 8
    }
  }