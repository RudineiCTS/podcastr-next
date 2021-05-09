import '../styles/global.scss';

import { Header } from '../components/Header';
import { Player } from '../components/Player';
import { PlayerContext } from '../contexts/playerContext';

import style from '../styles/app.module.scss';

function MyApp({ Component, pageProps }) {
  return (
    <PlayerContext.Provider value="any">
      <div className={style.wrapper}>
        <main>
        <Header/>
        <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContext.Provider>
  )
}
export default MyApp
