import { useContext, useEffect, useRef, useState,  } from 'react';
import Image from 'next/image';
import { PlayerContext } from '../../contexts/playerContext';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import styles from './styles.module.scss';
import { convertDurationToTimeString } from '../../util/convertDurationToTimeString';

export function Player(){
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    togglePlay,
    toggleLoop,
    setPlayingState,
    playNext,
    playPrevious,
    hasNext,
    isLooping,
    hasPrevious,
    isShuffling,
    toggleShuffle
  } = useContext(PlayerContext)

  useEffect(()=>{
    if(!audioRef.current){
      return;
    }
    if(isPlaying){
      audioRef.current.play();
    } else{
      audioRef.current.pause();
    }

  },[isPlaying])

  function setupMetaDataListener(){
    audioRef.current.currentTime = 0;
   
    audioRef.current.addEventListener('timeupdate', ()=>{
      setProgress(Math.floor(audioRef.current.currentTime));
    })

  }
  function handleSeek(amount: number ){
    audioRef.current.currentTime = amount;

    setProgress(amount);
  }

  const episode = episodeList[currentEpisodeIndex]
  return(
   <div className={styles.playerContainer}>
     <header>
       <img src="/playing.svg" alt="tocando agora"/>
       <strong>Tocando agora</strong>
     </header>
    
      { episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            objectFit="cover"
            src={episode.thumbnail}
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
        <strong>Selecione um podcast para ouvir</strong>
      </div>
      )}
     
     {/* tag audio adicionada caso haja um episódio */}
     {episode && (
       <audio 
        src={episode.url}
        ref={audioRef}
        autoPlay
        onEnded={playNext}
        onLoadedMetadata={setupMetaDataListener}
        loop={isLooping}
        onPlay={() => setPlayingState(true)}
        onPause={() => setPlayingState(false)}
       />
     )}

     <footer className={!episode ? styles.empty : ''}>
       <div className={styles.progress}>
        <span>{convertDurationToTimeString(progress)}</span>
          <div className ={styles.slider}>
           {episode ? (
             <Slider
              max={episode.duration}
              value={progress}
              onChange={handleSeek}
              trackStyle={{backgroundColor: '#04d361'}}
              railStyle={{backgroundColor: '#9f75ff'}}
              handleStyle={{borderColor: '#04d361', borderWidth: 4}}
             />
           ) : 
           (
            <div className ={styles.emptySlider} />
           )}
          </div>
        <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
       </div>

      <div className ={styles.buttons}>
        <button 
        type="button" 
        disabled={!episode|| episodeList.length === 1} 
        className={isShuffling ? styles.isActive : ''}
        onClick={()=> toggleShuffle()}
        >
          <img src="/shuffle.svg" alt="Embaralhar"/>
        </button>

        <button type="button" disabled={!episode || !hasPrevious} onClick={()=> playPrevious()}>
          <img src="/play-previous.svg" alt="Tocar anterior"/>
        </button>

        <button type="button" className={styles.playButton} disabled={!episode} onClick={togglePlay}> 
         {isPlaying ? (
            <img src="/pause.svg" alt="Tocar"/>
         ) : (
            <img src="/play.svg" alt="Tocar"/>
         )}
        </button>
        <button type="button" disabled={!episode || !hasNext} onClick={() =>playNext()}>
          <img src="/play-next.svg" alt="Tocar próxima"/>
        </button>
        <button 
          type="button"
          disabled={!episode} 
          onClick={(toggleLoop)} 
          className={isLooping ? styles.isActive : ''}
          > 
          <img src="/repeat.svg" alt="Repetir"/>
        </button>
      </div>

     </footer>

   </div>
  )
}