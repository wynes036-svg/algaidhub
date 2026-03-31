import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import SkipButton from '../components/SkipButton';
import FullscreenButton from '../components/FullscreenButton';

const API_KEY = '72f9d7794f529cdf9668a48bff8f8015';
const BASE_URL = 'https://api.themoviedb.org/3';
const VIDEO_SERVER = 'http://localhost:3001';
const SERVERS = ['VidLink', 'VidSrc.me', 'Embed.su', 'My Server', 'YouTube Trailer'];

export default function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addFavorite, isFavorite, removeFavorite, updateProgress } = useApp();
  const [trailer, setTrailer] = useState(null);
  const [movie, setMovie] = useState(null);
  const [imdbId, setImdbId] = useState(null);
  const [activeServer, setActiveServer] = useState(0);
  const [lightOff, setLightOff] = useState(false);
  const [serverVideos, setServerVideos] = useState([]);
  const timerRef = useRef(null);
  const elapsedRef = useRef(0);
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    fetch(BASE_URL+'/movie/'+id+'?api_key='+API_KEY+'&append_to_response=videos,external_ids')
      .then(r=>r.json()).then(data=>{
        setMovie(data);
        setImdbId(data.external_ids?.imdb_id||null);
        const yt=data.videos?.results?.find(v=>v.type==='Trailer'&&v.site==='YouTube');
        setTrailer(yt);
      });
    fetch(VIDEO_SERVER+'/videos').then(r=>r.json()).then(d=>setServerVideos(d.videos||[])).catch(()=>setServerVideos([]));
  },[id]);

  useEffect(()=>{
    if(!movie)return;
    const totalSeconds=(movie.runtime||120)*60;
    clearInterval(timerRef.current);
    elapsedRef.current=0;
    if(activeServer===3)return;
    updateProgress(movie,1);
    timerRef.current=setInterval(()=>{
      elapsedRef.current+=10;
      const percent=Math.min(Math.round((elapsedRef.current/totalSeconds)*100),94);
      updateProgress(movie,percent);
    },10000);
    return ()=>clearInterval(timerRef.current);
  },[activeServer,movie]);

  useEffect(()=>()=>clearInterval(timerRef.current),[]);

  const favorited=movie&&isFavorite(movie.id);
  const matchedVideo=serverVideos.find(f=>f.startsWith(id)||f.toLowerCase().includes((movie?.title||'').toLowerCase().slice(0,10)));
  const videoUrl=matchedVideo?VIDEO_SERVER+'/videos/'+matchedVideo:null;

  const renderPlayer=()=>{
    if(activeServer===0)return React.createElement('iframe',{key:'vl'+id,src:'https://vidlink.pro/movie/'+id,style:styles.iframe,allowFullScreen:true,allow:'autoplay; fullscreen'});
    if(activeServer===1){if(!imdbId)return React.createElement('div',{style:styles.noVideo},React.createElement('p',null,'Not found on VidSrc.me'));return React.createElement('iframe',{key:'vm'+imdbId,src:'https://vidsrc.me/embed/movie?imdb='+imdbId,style:styles.iframe,allowFullScreen:true,allow:'autoplay; fullscreen'});}
    if(activeServer===2){if(!imdbId)return React.createElement('div',{style:styles.noVideo},React.createElement('p',null,'Not found on Embed.su'));return React.createElement('iframe',{key:'es'+imdbId,src:'https://embed.su/embed/movie/'+imdbId,style:styles.iframe,allowFullScreen:true,allow:'autoplay; fullscreen'});}
    if(activeServer===3){
      if(!videoUrl)return React.createElement('div',{style:styles.noVideo},React.createElement('p',null,'No video file found.'));
      return React.createElement('video',{ref:videoRef,key:videoUrl,controls:true,autoPlay:true,onTimeUpdate:e=>{const{currentTime,duration}=e.target;if(duration&&movie){const pct=Math.round((currentTime/duration)*100);if(pct%5===0)updateProgress(movie,pct)}},style:{width:'100%',height:'100%',background:'#000'}},React.createElement('source',{src:videoUrl,type:videoUrl.endsWith('.m3u8')?'application/x-mpegURL':'video/mp4'}));
    }
    if(!trailer)return React.createElement('div',{style:styles.noVideo},React.createElement('p',null,'No trailer available.'));
    return React.createElement('iframe',{src:'https://www.youtube.com/embed/'+trailer.key+'?autoplay=1',title:movie?.title,style:styles.iframe,allow:'autoplay; fullscreen',allowFullScreen:true});
  };

  return React.createElement(React.Fragment,null,
    lightOff&&React.createElement('div',{style:{position:'fixed',inset:0,background:'rgba(0,0,0,0.95)',zIndex:98},onClick:()=>setLightOff(false)}),
    React.createElement('div',{className:'watch-page',style:{position:'relative',zIndex:lightOff?99:1}},
      React.createElement('div',{className:'watch-header'},
        React.createElement('button',{className:'watch-back-btn',onClick:()=>navigate(-1)},'Back'),
        React.createElement('span',{className:'watch-title'},movie?.title),
        React.createElement('div',{style:{marginLeft:'auto',display:'flex',gap:'10px',alignItems:'center'}},
          React.createElement(FullscreenButton,{targetRef:playerRef}),
          React.createElement('button',{onClick:()=>setLightOff(!lightOff),style:styles.controlBtn},lightOff?'Light On':'Light Off'),
          movie&&React.createElement('button',{onClick:()=>favorited?removeFavorite(movie.id):addFavorite(movie),style:{...styles.controlBtn,color:favorited?'#e50914':'#fff'}},favorited?'Saved':'My List')
        )
      ),
      React.createElement('div',{className:'watch-player'},
        React.createElement('div',{ref:playerRef,style:{...styles.playerWrap,position:'relative'}},
          renderPlayer(),
          React.createElement(SkipButton,{runtime:movie?.runtime||120})
        )
      ),
      React.createElement('div',{style:styles.serverBar},
        React.createElement('span',{style:styles.serverLabel},'Server:'),
        SERVERS.map((s,i)=>React.createElement('button',{key:s,onClick:()=>setActiveServer(i),style:{...styles.serverBtn,...(activeServer===i?styles.serverBtnActive:{})}},s))
      )
    )
  );
}

const styles={
  controlBtn:{background:'rgba(255,255,255,0.1)',color:'#fff',border:'none',padding:'8px 14px',borderRadius:'4px',cursor:'pointer',fontSize:'13px'},
  serverBar:{background:'#111',padding:'12px 24px',display:'flex',alignItems:'center',gap:'8px',flexWrap:'wrap',borderTop:'1px solid #1a1a1a'},
  serverLabel:{color:'#e50914',fontSize:'13px',marginRight:'4px',fontWeight:'600'},
  serverBtn:{background:'#2a2a2a',color:'#e50914',border:'1px solid #2a2a2a',padding:'8px 18px',borderRadius:'5px',cursor:'pointer',fontSize:'13px'},
  serverBtnActive:{background:'#e50914',color:'#fff',border:'1px solid #e50914'},
  playerWrap:{position:'relative',width:'100%',maxWidth:'1200px',aspectRatio:'16/9',background:'#000',borderRadius:'8px',overflow:'hidden',margin:'0 auto'},
  iframe:{position:'absolute',top:0,left:0,width:'100%',height:'100%',border:'none'},
  noVideo:{textAlign:'center',color:'#aaa',padding:'60px 20px',fontSize:'16px'},
};
