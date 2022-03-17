var Qe=Object.defineProperty,Oe=Object.defineProperties;var ze=Object.getOwnPropertyDescriptors;var ge=Object.getOwnPropertySymbols;var Fe=Object.prototype.hasOwnProperty,Ae=Object.prototype.propertyIsEnumerable;var fe=(e,t,s)=>t in e?Qe(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s,O=(e,t)=>{for(var s in t||(t={}))Fe.call(t,s)&&fe(e,s,t[s]);if(ge)for(var s of ge(t))Ae.call(t,s)&&fe(e,s,t[s]);return e},B=(e,t)=>Oe(e,ze(t));import{s as $,r as f,j as n,a as p,B as _,S as xe,c as le,b as je,d as Te,e as we,f as re,u as N,g as V,I as be,F as Se,h as Ce,P as Pe,C as me,D as Be,i as Ve,T as We,k as de,l as He,R as Ue,m as Ge}from"./vendor.c1375b97.js";const Ke=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const d of document.querySelectorAll('link[rel="modulepreload"]'))o(d);new MutationObserver(d=>{for(const a of d)if(a.type==="childList")for(const u of a.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&o(u)}).observe(document,{childList:!0,subtree:!0});function s(d){const a={};return d.integrity&&(a.integrity=d.integrity),d.referrerpolicy&&(a.referrerPolicy=d.referrerpolicy),d.crossorigin==="use-credentials"?a.credentials="include":d.crossorigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(d){if(d.ep)return;d.ep=!0;const a=s(d);fetch(d.href,a)}};Ke();const Je=$.div`
    display: grid;
    margin: 2px 0px 2px 0px;
`,Xe=({item:e,handleContainerCmds:t})=>{const[s,o]=f.exports.useState(!1),d=async()=>{o(!0),e.playable==="yes"?t(null,e.cid,e):e.container==="yes"?await t(null,e.cid)||o(!1):t(e.sid)};return f.exports.useEffect(()=>()=>{o(!1)},[]),n(Je,{showSpinner:s,children:p(_,{onClick:d,disabled:s,children:[e.name," ",s?n(xe,{as:"span",animation:"border",size:"sm"}):null]})})},ke=le({name:"queue",initialState:{queue:[],countSoFar:0},reducers:{setQueue:(e,t)=>{let s=[];for(let o=0;o<t.payload.length;++o)s.push(B(O({},t.payload[o]),{mid:`${t.payload[o].mid}${e.countSoFar++}`,qid:o+1}));e.queue=s,e.countSoFar=0},clearQueue:e=>{e.queue=[]}}}),{setQueue:se,clearQueue:ye}=ke.actions;var Ye=ke.reducer;const y={playMode:{playing:"play",paused:"pause",stopped:"stop"},repeatMode:{repeatOff:"off",repeatOnce:"on_one",repeatAll:"on_all"},shuffleMode:{shuffleOff:"off",shuffleOn:"on"}},Me=le({name:"player",initialState:{currentItem:null,duration:{progress:0,total:0},playState:y.playMode.paused,blockEventUpdates:!1},reducers:{setCurrentItem:(e,t)=>{console.log("replacing currItem with:",t.payload),e.currentItem=t.payload,e.duration={progress:0,total:0}},setPlayState:(e,t)=>{e.playState=t.payload},setDuration:(e,t)=>{e.duration=O({},t.payload)},setBlockEventUpdates:(e,t)=>{t.payload?console.log("Started blocking events..."):console.log("Ending blocking events..."),e.blockEventUpdates=t.payload}}}),{setCurrentItem:X,setPlayState:ne,setDuration:Ze,setBlockEventUpdates:b}=Me.actions;var et=Me.reducer;const Ie=le({name:"notification",initialState:{message:"",gotNotification:!1},reducers:{setNotification:(e,t)=>{e.message=t.payload,e.gotNotification=!0},resetGotNotification:e=>{e.gotNotification=!1}}}),{setNotification:Q,resetGotNotification:tt}=Ie.actions;var nt=Ie.reducer;const Re=le({name:"playlists",initialState:{playlists:[]},reducers:{setPlaylists:(e,t)=>{console.log("setting playlist:",t.payload),e.playlists=t.payload},clearPlaylists:e=>{e.playlists=[]}}}),{setPlaylists:ie,clearPlaylists:st}=Re.actions;var ot=Re.reducer;const $e=le({name:"info",initialState:{pid:null,sid:null,clientIP:null,deviceIP:null,readyForEvents:null},reducers:{setPid:(e,t)=>{e.pid=t.payload},setSid:(e,t)=>{e.sid=t.payload},setClientIP:(e,t)=>{e.clientIP=t.payload?`http://${t.payload}:32400`:""},setReadyForEvents:(e,t)=>{e.readyForEvents=t.payload},clearInfo:e=>{e.pid=null,e.sid=null,e.readyForEvents=null}}}),{setPid:at,setSid:lt,setClientIP:ue,setReadyForEvents:Ne,clearInfo:it}=$e.actions;var rt=$e.reducer;const ct=je({notification:nt,playlists:ot,queue:Ye,info:rt,player:et}),Ee=Te(ct),dt=async()=>new Promise(e=>{re("find_denon_devices").then(t=>{e(t)})}),ut=async e=>new Promise((t,s)=>{re("connect_to_device",{deviceIp:e}).then(o=>{console.log(`tauri connected to device from ${o}!`),Ee.dispatch(ue(o)),t({success:!0})}).catch(o=>{console.log("tauri failed to connect to device; err=",o),s({error:o})})}),pt=()=>{re("disconnect_from_device")};let pe=null;const gt=async e=>{pe=await we("event",t=>{console.log("got an event"),e(t.payload)})};let Z=new Map;const ft=async e=>new Promise((t,s)=>{Z.set(e,{resolve:t,reject:s}),re("send_command",{args:e}).then(()=>{console.log("invoked and mapped",e)}).catch(o=>{console.log("send_command err:",o)})}),mt=async()=>{console.log("Starting reply handler..."),await we("reply",e=>{console.log("got a reply event"),console.log(e);let t=e.payload.heos,s=t.command,o=t.command+"?"+t.message,d=o.replace(/&.*/,""),a=o.match(/.*?&.*?(?=&)/),u=null;Z.has(s)?u=s:Z.has(o)?u=o:Z.has(d)?u=d:a&&Z.has(a[0])&&(u=a[0]),u?(console.log("found match cmd:",u),Z.get(u).resolve(e.payload),Z.delete(u),console.log("Matched response to reply!")):console.log("Couldn't match reply!")})},yt=async()=>{try{const e=await dt();if(console.log("commands.js searchForIPsRes:",e),e)return e}catch(e){console.log("commands.js searchForIPs command error:",e)}},W=async e=>{try{const t=await ft(e);if(console.log("commands.js sendCmdRes:",t),t&&t.heos.result==="success")return t}catch(t){console.log("commands.js sendCommand error:",t)}},ht=async e=>{try{const t=await ut(e);if(console.log(`commands.js connected to ${e}`),console.log("commands.js connectToDevice conRes:",t),t)return t}catch(t){console.log("commands.js connectToDevice error:",t)}},vt=()=>{pt()},xt=async e=>{try{const t=await W(`player/get_now_playing_media?pid=${e}`);if(t&&Object.keys(t.payload).length>0&&t.payload.type&&t.payload.type==="song")return t}catch(t){console.log("command.js getCurrentMedia error:",t)}},wt=async e=>{try{const t=await W(`player/get_volume?pid=${e}`);if(t){const s=t.heos.message.match(/(?<=.*level=)\d{1,3}/);if(s)return parseInt(s[0])}}catch(t){console.log("command.js getVolume error:",t)}},bt=async(e,t)=>{try{const s=await W(`player/set_volume?pid=${e}&level=${t}`)}catch(s){console.log("command.js setVolume error:",s)}},St=async e=>{try{const t=await W(`player/get_play_mode?pid=${e}`);if(t){const s=t.heos.message.match(/(?<=.*repeat=).*(?=&)/),o=t.heos.message.match(/(?<=.*shuffle=).*/);if(s&&o){const d=s[0],a=o[0];return console.log("Repeat mode:",d,", Shuffle mode:",a),{repeatStrVal:d,shuffleStrVal:a}}}}catch(t){console.log("command.js getPlayMode error:",t)}},Ct=async(e,t=null,s=null)=>{if(t||s)try{const o=await W(`player/set_play_mode?pid=${e}${s?`&repeat=${s}`:""}${t?`&shuffle=${t}`:""}`)}catch(o){console.log("command.js setPlayMode error:",o)}},Pt=async e=>{try{const t=await W(`player/get_play_state?pid=${e}`);if(t){const s=t.heos.message.match(/(unknown|play|pause|stop)$/);if(s){let o=s[0];return o==="unknown"&&(o=y.playMode.stopped),o}}}catch(t){console.log("command.js getPlayState error:",t)}},kt=async(e,t)=>{try{await W(`player/set_play_state?pid=${e}&state=${t}`)}catch(s){console.log("command.js setPlayState error:",s)}},Mt=async e=>{try{const t=await W(`player/get_queue?pid=${e}`);if(t)return t.payload}catch(t){console.log("command.js getQueue error:",t)}},It=async e=>{try{const t=await W(`player/clear_queue?pid=${e}`);if(t)return t}catch(t){console.log("command.js clearQueue error:",t)}};var x={searchForIPs:yt,sendCommand:W,connectToDevice:ht,disconnectFromDevice:vt,getCurrentMedia:xt,getVolume:wt,setVolume:bt,getPlayMode:St,setPlayMode:Ct,getPlayState:Pt,setPlayState:kt,getQueue:Mt,clearQueue:It};const ee=$(_)`
    border: 0px;
    z-index: 1;
`,Rt=$.div`
    display: grid;
    grid-template-rows: 1fr 1fr 1fr 1fr;
    gap: 1px;
`,$t=$.div`
    display: grid;
    grid-template-rows: 1fr 1fr;
    gap: 1px;
`,Nt=({cid:e,content:t})=>{const{queue:s}=N(u=>u.queue),o=N(u=>u.info),d=V(),a=async u=>{d(b(!0));let h=[];u===1?h=[...t,...s]:u===2?h=[...s.slice(0,1),...t,...s.slice(1)]:u===3?h=[...s,...t]:u===4&&(h=[...t]),d(se(h));try{const r=`browse/add_to_queue?pid=${o.pid}&sid=${o.sid}&cid=${e}${t.length===1?`&mid=${t[0].mid}`:""}&aid=${u}`,i=await x.sendCommand(r);i&&(console.log("addToQueueRes:",i),d(b(!1)))}catch(r){console.log("AddQueueMenu error:",r),d(Q("Failed to add items to queue!")),d(b(!1))}};return s.length>0?p(Rt,{children:[n(ee,{onClick:()=>a(1),variant:"secondary",children:"Play Now"}),n(ee,{onClick:()=>a(2),variant:"secondary",children:"Play Next"}),n(ee,{onClick:()=>a(3),variant:"secondary",children:"Add to End of Queue"}),n(ee,{onClick:()=>a(4),variant:"secondary",children:"Play Now & Replace Queue"})]}):p($t,{children:[n(ee,{onClick:()=>a(1),variant:"secondary",children:"Play Now"}),n(ee,{onClick:()=>a(3),variant:"secondary",children:"Add to End of Queue"})]})},_e=e=>{const[t,s]=f.exports.useState("0px"),[o,d]=f.exports.useState("0px"),[a,u]=f.exports.useState(!1);f.exports.useEffect(()=>(document.addEventListener("click",h),document.addEventListener("contextmenu",h),()=>{document.removeEventListener("click",h),document.addEventListener("contextmenu",h)}),[]);const h=i=>{i.target.classList.contains("clickableItem")?(s(i.pageX),d(i.pageY),u(!0)):u(!1)};return a?n("div",{style:{position:"absolute",top:o,left:t},children:e.children}):null},Et=$.div`
    display: grid;
    grid-row: 2 / 3;
    grid-column: 2 / 3;
    grid-template-rows: auto auto minmax(0, 1fr);
    grid-template-columns: auto auto;
    min-height: 0;
`,_t=$.div`
    grid-column: 1 / 3;
    grid-row: 3 / 4;
    min-height: 0;
    height: auto;
`,Dt=$.div`
    display: grid;
    margin: 2px 0px 2px 0px;
`,qt=({container:e,items:t})=>{e.image_url=t[0].image_url;const[s,o]=f.exports.useState(null);f.exports.useEffect(()=>{const a=u=>{u.target.classList.contains("clickableItem")||o(null)};return document.addEventListener("click",a),()=>{document.removeEventListener("click",a)}},[]);const d=a=>{a.target.classList.contains("clickableItem")&&o([JSON.parse(a.target.value)])};return p(Et,{children:[n(_e,{children:n(Nt,{cid:e.cid,content:s})}),n(be,{style:{display:"grid",gridRow:"1 / 2",gridColumn:"1 / 2",maxHeight:"256px",maxWidth:"256px",width:"100%",height:"auto"},src:e.image_url}),p("div",{style:{display:"flex",flexDirection:"column",padding:"15px",gridColumn:"2 / 3",placeSelf:"center stretch"},children:[n("h2",{style:{fontWeight:"normal"},children:e.name}),n("h3",{style:{fontWeight:300},children:e.artist})]}),n("div",{style:{display:"grid",gridRow:"2 / 3",gridColumn:"1 / 3"},children:n(_,{variant:"success",onClick:()=>o(t),className:"clickableItem clickableAlbum",children:"Play Album"})}),n(_t,{onClick:d,style:{overflow:s?"hidden":"overlay"},children:t.map(a=>n(Dt,{children:n(_,{value:JSON.stringify(a),className:"clickableItem",children:a.name})},a.mid))})]})},oe={local:"1024",playlists:"1025"},Lt=()=>{const[e,t]=f.exports.useState([]),[s,o]=f.exports.useState([]),[d,a]=f.exports.useState(null),[u,h]=f.exports.useState(new Map),[r,i]=f.exports.useState([]),E=N(g=>g.info),w=V(),F=async(g,L=null)=>{if(u.has(g)){const M=u.get(g);return console.log("memoized result found...",M),L?(a(L),o(M)):t(M),i(D=>D.concat(g)),!0}else{const M=await x.sendCommand(g);if(console.log("containerRes:",M),!M||M.heos.result==="fail")return M&&console.log("fail result:",M.heos.message),w(Q("Command sent was invalid...")),!1;let D=M.payload;if(D.length>0){for(let z of D)z.name&&(z.name=decodeURIComponent(z.name));return console.log("payloadObj:",D),L?(a(L),o(D)):t(D),i(z=>z.concat(g)),h(z=>new Map(z.set(g,D))),!0}else return w(Q("No results found...")),!1}},A=async()=>{if(r.length>1){a(null),o([]);const g=r[r.length-2];i(M=>M.slice(0,M.length-1));const L=u.get(g);t(L)}else i([]),t([])},[j,T]=f.exports.useState(!1),v=f.exports.useRef(j);v.current=j;const H=async(g,L=null,M=null)=>{if(v.current){console.log("Handling a browse, cannot handle another yet...");return}T(!0),L?await F(`browse/browse?sid=${E.sid}&cid=${L}`,M&&M.playable==="yes"?M:null):g&&(w(lt(g)),await F(`browse/browse?sid=${g}`)),T(!1)},C=()=>s.length>0?n(qt,{container:d,items:s}):n("div",{className:"containersList",children:e.map(g=>n(Xe,{item:g,handleContainerCmds:H},g.cid?g.cid:g.sid))});return e.length>0?p(Se,{children:[n("div",{className:"backButton",children:n(_,{variant:"secondary",onClick:A,children:"back"})}),C()]}):n(_,{onClick:()=>F(`browse/browse?sid=${oe.local}`),children:"Browse for local media sources"})},Qt=({ips:e,handleSearch:t,clearSearchHistory:s})=>{const[o,d]=f.exports.useState(""),[a,u]=f.exports.useState(!1),h=V(),r=N(w=>w.info.readyForEvents),i=async w=>{if(await x.connectToDevice(w)){d(w),u(!0);const A=await x.sendCommand("player/get_players");if(A){const j=A.payload.find(T=>T.ip===w).pid;h(at(j))}}else console.log("Connection.js handleConnect error!"),h(Q("Failed to connect to player..."))};return a?p(Se,{children:[p("div",{className:"connectedPrompt",children:[p("h5",{children:["Connected to ",o]}),n(_,{variant:"secondary",onClick:async()=>{!a||(r&&(pe&&pe(),h(Ne(!1)),console.log("Ended event handler connection!")),x.disconnectFromDevice(),d(""),u(!1),h(it()))},children:"disconnect"})]}),n("div",{className:"containers",children:n(Lt,{})})]}):p("div",{className:"connectionPrompt",children:[n("h3",{style:{gridColumn:"1/3"},children:"Connect to a device"}),n(_,{style:{gridColumn:"1/2",marginRight:"5px",marginBottom:"10px"},size:"lg",onClick:t,children:"Re-scan for Denon devices"}),n(_,{style:{gridColumn:"2/3",marginBottom:"10px"},variant:"secondary",size:"lg",onClick:s,children:"Clear search history"}),n("div",{style:{gridColumn:"1/3",gridRow:"3",overflow:"auto",height:"auto"},children:e.map(w=>p("div",{style:{fontSize:"20px"},children:[n(_,{onClick:()=>i(w),children:"connect"})," ",w]},w))})]})},te=$(_)`
    border: 0px;
    z-index: 1;
`,Ot=$.div`
    display: grid;
    grid-template-rows: 1fr 1fr 1fr 1fr;
    gap: 1px;
`,zt=$.div`
    display: grid;
    grid-template-rows: 1fr 1fr;
    gap: 1px;
`,Ft=({cid:e})=>{const{queue:t}=N(a=>a.queue),s=N(a=>a.info.pid),o=V(),d=async a=>{try{o(b(!0));const u=`browse/add_to_queue?pid=${s}&sid=${oe.playlists}&cid=${e}&aid=${a}`,h=await x.sendCommand(u);if(console.log("addPlaylistMediaRes:",h),h){const r=await x.getQueue(s);if(console.log("newQueueItems:",r),r){let i=[];a===1?i=[...r,...t]:a===2?i=[...t.slice(0,1),...r,...t.slice(1)]:a===3?i=[...t,...r]:a===4&&(i=[...r]),console.log("Setting queue items...",i),o(se(i))}o(b(!1))}}catch(u){console.log("addPlaylistMedia error:",u),o(Q("Failed to add items to queue!")),o(b(!1))}};return t.length>0?p(Ot,{children:[n(te,{onClick:()=>d(1),variant:"secondary",children:"Play Now"}),n(te,{onClick:()=>d(2),variant:"secondary",children:"Play Next"}),n(te,{onClick:()=>d(3),variant:"secondary",children:"Add to End of Queue"}),n(te,{onClick:()=>d(4),variant:"secondary",children:"Play Now & Replace Queue"})]}):p(zt,{children:[n(te,{onClick:()=>d(1),variant:"secondary",children:"Play Now"}),n(te,{onClick:()=>d(3),variant:"secondary",children:"Add to End of Queue"})]})},he=$(_)`
border: 0px;
z-index: 1;
`,At=$.div`
display: grid;
grid-template-rows: 1fr 1fr 1fr 1fr;
gap: 1px;
`,jt=({handleDelete:e,startRename:t})=>p(At,{children:[n(he,{onClick:t,className:"rename-playlist",variant:"secondary",children:"Rename"}),n(he,{onClick:e,variant:"danger",children:"Delete"})]}),Tt=$.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 45px;
    align-items: center;
    justify-content: center;
    color: black;
    background-color: white;
    font-size: medium;
    border: 0;
    border-bottom: 0.5px solid rgba(0,0,0,0.75);
    border-radius: 4px;

    cursor: pointer;
    user-select: none;
    outline: none;

    &:hover, &:focus {
        background-color: ${e=>e.showRename?"white":"rgb(255,200,200)"};
        box-shadow: 0 0 0 0 white;
        border: 0;
        border-bottom: 0.5px solid rgba(0,0,0,0.75);
    }
`,Bt=$.div`
    display: grid;
    grid-template-columns: auto auto;
    width: 100%;
    height: 100%;
    padding: 5px;
    column-gap: 5px;
`,Vt=$.button`
    border: 0;
    border-radius: 4px;
    &:hover {
        border: 0.5px solid black;
    }
`,Wt=()=>{const e=V(),{playlists:t}=N(C=>C.playlists),s=N(C=>C.info.pid);f.exports.useEffect(()=>{s?(async()=>{console.log("Getting existing playlists...");const g=await x.sendCommand(`browse/browse?sid=${oe.playlists}`);g&&e(ie(g.payload))})():e(st())},[s]);const[o,d]=f.exports.useState(null),[a,u]=f.exports.useState(null),[h,r]=f.exports.useState(""),[i,E]=f.exports.useState(!1),w=()=>{E(!0),r(a.name)},F=async()=>{if(s){e(b(!0));let C=[...t];const g=C.findIndex(M=>M.cid===a.cid);C.splice(g,1,B(O({},C[g]),{name:h})),e(ie(C)),await x.sendCommand(`browse/rename_playlist?sid=${oe.playlists}&cid=${a.cid}&name=${h}`)&&e(b(!1)),E(!1),u(null),r("")}},A=async()=>{s&&(e(b(!0)),e(ie(t.filter(g=>g.cid!==a.cid))),await x.sendCommand(`browse/delete_playlist?sid=${oe.playlists}&cid=${a.cid}`)&&e(b(!1)))},j=()=>o?n(Ft,{cid:o.cid}):a?n(jt,{handleDelete:A,startRename:w}):null,T=(C,g)=>{if(i&&C.button===2&&a&&g.cid!==a.cid)return v();if(i&&C.button===0&&a&&g.cid!==a.cid)return d(g),v();if(i)return;C.button===0?(console.log("left-clicked"),u(null),d(g)):C.button===2&&(console.log("right-clicked"),d(null),u(g))},v=C=>{E(!1),u(null),r("")},H=C=>{C.target.classList.contains("rename-playlist")||v()};return f.exports.useEffect(()=>(window.addEventListener("click",H),()=>window.removeEventListener("click",H)),[]),p("div",{className:"savedPlaylists",children:[n(_e,{children:j()}),t&&t.length>0?t.map(C=>n(Tt,{className:"clickableItem",onMouseUp:g=>T(g,C),onContextMenu:g=>g.preventDefault(),showRename:i,children:i&&a&&a.cid===C.cid?p(Bt,{className:"rename-playlist",children:[n("input",{className:"rename-playlist",onChange:g=>r(g.target.value),value:h}),n(Vt,{onClick:F,children:"Save"})]}):C.name},C.cid)):null]})},G={nowPlayingProgress:"event/player_now_playing_progress",nowPlayingChanged:"event/player_now_playing_changed",queueChanged:"event/player_queue_changed",playbackError:"event/player_playback_error",playerStateChanged:"event/player_state_changed",shuffleModeChanged:"event/shuffle_mode_changed",repeatModeChanged:"event/repeat_mode_changed",volumeChanged:"event/player_volume_changed",sourcesChanged:"event/sources_changed"},De=(e,t)=>e&&t&&e.qid&&t.qid&&e.qid===t.qid&&e.mid&&t.mid&&e.mid===t.mid,Ht=$.div`
    display: grid;
    grid-column: 1 / 3;
    grid-row: 3 / 4;
    gap: 1px;

    grid-template-columns: 256px minmax(600px, auto) minmax(200px, 350px);
    grid-template-rows: 81px 175px;

    text-align: center;
    font-size: 20px;
`,Ut=$.div`
    display: grid;
    grid-column: 1 / 2;
    grid-row: 1 / 3;
    border: 0.5px solid rgb(70,70,70);;
    border-radius: 4px;
    user-select: none;
`,Gt=$.div`
    border: 0.5px solid rgb(70,70,70);;
    border-radius: 4px;
    display: grid;
    grid-column: 2 / 3;
    grid-row: 2 / 3;
    grid-template-columns: 80px 80px 80px 80px 80px;

    justify-items: center;
    align-items: center;
    justify-content: center;

    overflow: hidden;
    grid-column-gap: 45px;

    & .disabled {
        opacity: 0.25; 
        pointer-events: none;
    }
    & div {
        cursor: pointer;
    }
    & svg {
        padding: 10px;
        width: 100%;
        height: 100%;
    }
    & div:hover path, div:hover rect {
        stroke: rgba(255,0,90,0.75);
        stroke-width: 3px;
    }
    & div:active path, div:active rect {
        stroke: rgba(0,0,0,1);
        stroke-width: 1.5px;
    }
`,Kt=$.div`
    display: grid;
    grid-column: 3 / 4;
    grid-row: 2 / 3;

    grid-template-rows: auto auto;
    
    align-items: center;
    justify-items: center;

    border: 0.5px solid rgb(70,70,70);;
    border-radius: 4px;

    & rect:hover {
        stroke-width: 0.5px;
    }

    & .volNum {
    }

    & .volNum-show {
        opacity: 1;
        transition: opacity 250ms ease-in-out 0s;
    }

    & .volNum-hide {
        opacity: 0;
        transition: opacity 250ms ease-in-out 3s;
    }
`,Jt=()=>{const[e,t]=f.exports.useState({value:0,x:0}),[s,o]=f.exports.useState(!1),[d,a]=f.exports.useState(y.repeatMode.repeatOff),[u,h]=f.exports.useState(y.shuffleMode.shuffleOff),r=V(),i=N(I=>I.info),E=N(I=>I.player.playState),w=N(I=>I.player.currentItem,De),{queue:F}=N(I=>I.queue,Ce),A=N(I=>I.player.blockEventUpdates),j=f.exports.useRef(A);j.current=A;const T=async()=>{i.pid&&(r(b(!0)),u===y.shuffleMode.shuffleOff?(h(y.shuffleMode.shuffleOn),await x.setPlayMode(i.pid,y.shuffleMode.shuffleOn),console.log("Set shuffle ON on player...")):(h(y.shuffleMode.shuffleOff),await x.setPlayMode(i.pid,y.shuffleMode.shuffleOff),console.log("Set shuffle OFF on player...")),r(b(!1)))},v=async()=>{i.pid&&(r(b(!0)),d===y.repeatMode.repeatOff?(a(y.repeatMode.repeatAll),await x.setPlayMode(i.pid,null,y.repeatMode.repeatAll),console.log("Set REPEAT ALL on player...")):d===y.repeatMode.repeatAll?(a(y.repeatMode.repeatOnce),await x.setPlayMode(i.pid,null,y.repeatMode.repeatOnce),console.log("Set REPEAT ONCE on player...")):(a(y.repeatMode.repeatOff),await x.setPlayMode(i.pid,null,y.repeatMode.repeatOff),console.log("Set REPEAT OFF on player...")),r(b(!1)))},H=async()=>{i.pid&&(r(b(!0)),E===y.playMode.playing?(r(ne(y.playMode.paused)),await x.setPlayState(i.pid,y.playMode.paused),console.log("Set to PAUSE on player...")):(r(ne(y.playMode.playing)),await x.setPlayState(i.pid,y.playMode.playing),console.log("Set to PLAY on player...")),r(b(!1)))},C=()=>!!(w&&parseInt(w.qid)<F.length),g=async()=>{i.pid&&C()&&(r(b(!0)),await x.sendCommand(`player/play_next?pid=${i.pid}`)&&console.log("Playing next song on player..."),r(b(!1)))},L=()=>!!(w&&parseInt(w.qid)>1),M=async()=>{i.pid&&L()&&(r(b(!0)),await x.sendCommand(`player/play_previous?pid=${i.pid}`)&&console.log("Playing prev. song on player..."),r(b(!1)))},D=375;f.exports.useEffect(()=>{const I=async()=>{const l=await x.getVolume(i.pid);l>=0&&t({value:l,x:D*l/100});const{repeatStrVal:c,shuffleStrVal:m}=await x.getPlayMode(i.pid);c&&m&&(a(c),h(m));const P=await x.getPlayState(i.pid);P&&(P===y.playMode.stopped&&r(X(null)),r(ne(P)));const S=await x.getCurrentMedia(i.pid);S&&r(X(S.payload)),await x.sendCommand("system/register_for_change_events?enable=on")&&console.log("Registered for events!"),r(Ne(!0)),console.log("Set up event source!")};i.pid?I():(t({value:0,x:0}),r(X(null)),r(ne(y.playMode.paused)),a(y.repeatMode.repeatOff),h(y.shuffleMode.shuffleOff))},[i.pid]);const z=async I=>{if(j.current){console.log("Blocked an event!");return}else if(typeof I!="object")return;const l=I.heos;if(l.command===G.nowPlayingChanged){console.log("Now playing change event, getting new current media...");const c=await x.getCurrentMedia(i.pid);r(c?X(c.payload):Q("Failed updating current media from event..."))}else if(l.command===G.playerStateChanged){console.log("Playstate change event!");let c=l.message.match(/(unknown|play|pause|stop)$/);c?(c[0]==="unknown"&&(c[0]=y.playMode.stopped),console.log(`Changing to ${c[0]} event state...`),c[0]===y.playMode.stopped&&r(X(null)),r(ne(c[0]))):r(Q("Failed updating playstate from event..."))}else if(l.command===G.nowPlayingProgress){let c=l.message.match(/(?<=.*&cur_pos=)\d+/),m=l.message.match(/(?<=.*&duration=)\d+/);c&&m?(c=parseInt(c[0]),m=parseInt(m[0]),r(Ze({progress:c,total:m}))):r(Q("Failed updating progress from event..."))}else if(l.command===G.volumeChanged){console.log("Vol. change event!");const c=l.message.match(/(?<=.*level=)\d{1,3}/);if(c){const m=parseInt(c[0]);t({value:m,x:D*m/100})}else r(Q("Failed updating volume from event..."))}else if(l.command===G.repeatModeChanged||l.command===G.shuffleModeChanged){console.log("Playmode change event!");const{repeatStrVal:c,shuffleStrVal:m}=await x.getPlayMode(i.pid);c&&m?(a(c),h(m)):r(Q("Failed updating playmode from event..."))}else if(l.command===G.queueChanged){console.log("Queue change event!");const c=await x.getQueue(i.pid);c&&(console.log("Setting queue items...",c),r(se(c)))}else if(l.command===G.sourcesChanged){const c=await x.sendCommand(`browse/get_source_info?sid=${i.sid}`);console.log("musicSourcesRes:",c)}else l.command===G.playbackError&&r(Q("Playblack error. Unable to play media."))};f.exports.useEffect(()=>{i.readyForEvents&&i.pid&&gt(z)},[i.readyForEvents]);const K=I=>{if(I.preventDefault(),I.stopPropagation(),I.button>0)return;i.pid&&r(b(!0));const l=I.currentTarget.childNodes[0].childNodes[2],c=R=>{const q=l.getScreenCTM();let J=(R.clientX-q.e)/q.a;return J-=parseFloat(l.getAttribute("width"))/2,J<0?J=0:J>D&&(J=D),J};let m=0,P=null;const S=async R=>{const q=c(R);m=parseInt(q/D*100),t({value:m,x:q}),o(!0),i.pid&&(P&&clearTimeout(P),P=setTimeout(()=>{x.setVolume(i.pid,m)},250))},k=async R=>{clearTimeout(P),document.removeEventListener("mousemove",S),document.removeEventListener("mouseup",k),i.pid&&(x.setVolume(i.pid,m),r(b(!1)))};S(I),document.addEventListener("mousemove",S),document.addEventListener("mouseup",k)},[U,ae]=f.exports.useState({}),ce=async()=>{i.pid&&i.clientIP&&ae(B(O({},U),{[w.album]:w.image_url}))};return f.exports.useEffect(()=>{i.pid&&w&&!U[w.album]&&(console.log("Getting album art..."),ce())},[w]),p(Ht,{children:[n(Ut,{children:w&&U[w.album]?n(be,{style:{borderRadius:"4px",paddingRight:"2px",width:"256px"},fluid:!0,src:U[w.album]}):null}),p(Gt,{children:[n("div",{className:"repeatBtn",onClick:v,style:{display:"grid",gridColumn:"1/2",gridRow:"1/2"},children:p("svg",{viewBox:"0 0 150 150",children:[p("g",{style:{fill:d!==y.repeatMode.repeatOff?"rgba(255,0,90,0.75)":"rgba(75,75,75,0.5)",stroke:d!==y.repeatMode.repeatOff?"rgba(255,0,90,0.75)":"rgba(75,75,75,0.5)",strokeWidth:d!==y.repeatMode.repeatOff?"3":"1.5"},children:[n("path",{d:"M 90,25 L 90,5 L 125,25 L 90,45 z"}),n("path",{d:"M 60,125 L 60,145 L 25,125 L 60,105 z"})]}),p("g",{style:{fill:"none",stroke:d!==y.repeatMode.repeatOff?"rgba(255,0,90,0.75)":"rgba(75,75,75,0.5)",strokeWidth:d!==y.repeatMode.repeatOff?"3":"1.5"},children:[n("path",{d:"M 20,110 Q 0 40 , 50 25"}),n("path",{d:"M 50,25 L 90,25"}),n("path",{d:"M 130,40 Q 150 110 , 100 125"}),n("path",{d:"M 60,125 L 100,125"})]}),p("g",{style:{display:d===y.repeatMode.repeatOnce?"grid":"none"},children:[n("circle",{fill:"rgb(255,0,90)",cx:"120",cy:"120",r:"25"}),n("line",{strokeWidth:"2",stroke:"black",x1:"120",y1:"135",x2:"120",y2:"115"}),n("line",{strokeWidth:"2",stroke:"black",x1:"120",y1:"115",x2:"115",y2:"120"})]})]})}),n("div",{className:`prevBtn ${L()?"":"disabled"}`,onClick:M,style:{display:"grid",gridColumn:"2/3",gridRow:"1/2"},children:n("svg",{viewBox:"0 0 150 150",children:n("path",{fill:"rgba(75,75,75,0.5)",stroke:"black",strokeWidth:"1.5",d:"M 150,0 L 150,150 L 20,78\r L 20,150 L 0,150 L 0,0 L 20,0 L 20,72 z"})})}),n("div",{className:`playPauseBtn ${w?"":"disabled"}`,onClick:H,style:{display:"grid",gridColumn:"3/4",gridRow:"1/2"},children:p("svg",{viewBox:"0 0 150 150",style:{fill:"rgba(75,75,75,0.5)",stroke:"rgba(75,75,75,0.5)",strokeWidth:"1.5px"},children:[p("g",{style:{display:E===y.playMode.playing?"grid":"none"},children:[n("rect",{x:"0",y:"0",width:"50",height:"150"}),n("rect",{x:"100",y:"0",width:"50",height:"150"})]}),n("g",{style:{display:E===y.playMode.paused||E===y.playMode.stopped?"grid":"none"},children:n("path",{fill:"rgba(75,75,75,0.5)",stroke:"rgba(75,75,75,0.5)",strokeWidth:"1.5",d:"M 0,0 L 0,150 L 150,75 z"})})]})}),n("div",{className:`nextBtn ${C()?"":"disabled"}`,onClick:g,style:{display:"grid",gridColumn:"4/5",gridRow:"1/2"},children:n("svg",{viewBox:"0 0 150 150",children:n("path",{fill:"rgba(75,75,75,0.5)",stroke:"rgba(75,75,75,0.5)",strokeWidth:"1.5",d:"M 0,0 L 0,150 L 130,78\r L 130,150 L 150,150 L 150,0 L 130,0 L 130,72 z"})})}),n("div",{className:"shuffleBtn",onClick:T,style:{display:"grid",gridColumn:"5/6",gridRow:"1/2"},children:p("svg",{viewBox:"0 0 150 150",style:{fill:u===y.shuffleMode.shuffleOn?"rgba(255,0,90,0.75)":"rgba(75,75,75,0.5)",stroke:u===y.shuffleMode.shuffleOn?"rgba(255,0,90,0.75)":"rgba(75,75,75,0.5)",strokeWidth:u===y.shuffleMode.shuffleOn?"3":"1.5"},children:[p("g",{transform:"rotate(45, 75, 75)",children:[n("path",{d:"M -25,75 L 150,75"}),n("path",{d:"M 150,75 L 150,50 L 175,75 L 150,100 L 150,75"})]}),p("g",{transform:"rotate(-45, 75, 75)",children:[n("path",{d:"M -25,75 L 150,75"}),n("path",{d:"M 150,75 L 150,50 L 175,75 L 150,100 L 150,75"})]})]})})]}),p(Kt,{children:[n("div",{className:`volNum ${s?"volNum-show":"volNum-hide"}`,onTransitionEnd:()=>o(!1),style:{display:"grid",gridRow:"1/2",gridColumn:"1/2",height:"100%",width:"100%"},children:e.value}),n("div",{style:{display:"grid",gridRow:"2/3",gridColumn:"1/2",height:"100%",width:"100%"},onMouseDown:K,children:p("svg",{viewBox:"0 0 400 150",style:{padding:"0px 15px 15px 15px",overflow:"visible",maxWidth:"100%",maxHeight:"100%"},children:[n("line",{strokeLinecap:"round",strokeWidth:"10px",stroke:"rgb(50,50,50)",x1:"0",y1:"100%",x2:"100%",y2:"25%"}),n("line",{strokeLinecap:"round",strokeWidth:"1px",stroke:"rgba(0,0,0,1)",x1:"0",y1:"100%",x2:"100%",y2:"25%"}),n("rect",{fill:"rgb(75,75,75)",stroke:"black",strokeWidth:"0.25",x:`${e.x}`,y:"30",height:"120",width:"30"})]})})]})]})};const Xt=$.div`
    display: grid;
    position: relative;
    justify-content: center;
    align-items: center;
    min-height: 50px;
    height: max-content;
    width: 100%;
    padding-left: 55px;

    background-color: ${e=>e.isDragging||e.isSelected?"rgb(155, 100, 100)":"rgb(75,75,75)"};
    & * {
        background-color: ${e=>e.isDragging||e.isSelected?"rgb(155, 100, 100)":"rgb(75,75,75)"};
    }
    opacity: ${e=>e.isGhosting?"0.2":"1"};
    border-bottom: ${e=>e.isDragging?"0":"1px solid rgba(0,0,0,0.45)"};
    border-radius: 4px;

    cursor: pointer;
    font-weight: 500;
    user-select: none;
    outline: none;
`,Yt=$.div`
    display: flex;
    position: absolute;
    align-items: center;
    justify-content: center;
    border-radius: 50%;

    left: -15px;
    top: -15px;
    width: 40px;
    height: 40px;
    
    color: whitesmoke;
    font-size: larger;
    background-color: rgb(255,120,120);
    text-shadow: 2px 2px rgba(0,0,0,0.25);
`,Zt=({item:e,index:t,handleItemDblClick:s,handleSelectItem:o,isSelected:d,isGhosting:a,selectionCount:u})=>n(Pe,{draggableId:e.mid,index:t,children:(h,r)=>p(Xt,B(O(O({},h.draggableProps),h.dragHandleProps),{ref:h.innerRef,onDoubleClick:i=>s(i,t),onClick:i=>o(i,e),isSelected:d,isDragging:r.isDragging,isGhosting:a,selectionCount:u,children:[p("div",{className:"queueItemWrapper",children:[p("div",{style:{display:"grid",gridColumn:"1/2",gridTemplateRows:"max-content max-content",lineHeight:"20px",fontWeight:"400",overflow:"hidden"},children:[n("span",{style:{display:"grid",gridRow:"1/2",width:"max-content",fontSize:"large",fontWeight:"500"},children:e.album?`${e.album}`:null}),n("span",{style:{display:"grid",gridRow:"2/3",width:"max-content"},children:e.artist?`${e.artist}`:null})]}),n("div",{style:{display:"grid",gridColumn:"2/3",fontSize:"larger",fontWeight:"500"},children:n("span",{style:{width:"max-content"},children:e.name?e.name:e.song})})]}),r.isDragging&&u>1?n(Yt,{children:u}):null]}))}),ve=e=>{const t=parseInt(e/1e3),s=parseInt(t/60),o=t%60;return`${s}:${o>=10?o:`0${o}`}`},en=$.div`
    display: grid;
    position: relative;
    justify-content: center;
    align-items: center;
    min-height: 50px;
    height: max-content;
    width: 100%;
    padding-left: 10px;
    
    opacity: ${e=>e.isGhosting?"0.2":"1"};
    border-bottom: ${e=>e.isDragging?"0":"1px solid rgba(0,0,0,0.45)"};
    border-radius: 4px;

    background-color: ${e=>e.isDragging||e.isSelected?"rgb(155, 100, 100)":"rgb(75,75,75)"};
    & * {
        background-color: ${e=>e.isDragging||e.isSelected?"rgb(155, 100, 100)":"rgb(75,75,75)"};
    }

    font-weight: 500;
    user-select: none;
    outline: none;
`,tn=$.div`
    display: flex;
    position: absolute;
    align-items: center;
    justify-content: center;
    border-radius: 50%;

    left: -15px;
    top: -15px;
    width: 40px;
    height: 40px;
    
    color: whitesmoke;
    font-size: larger;
    background-color: rgb(155,20,20);
    text-shadow: 2px 2px rgba(0,0,0,0.25);
`,nn=({item:e,index:t,handleSelectItem:s,isSelected:o,isGhosting:d,selectionCount:a})=>{const u=N(r=>r.player.playState),h=N(r=>r.player.duration);return n(Pe,{draggableId:e.mid,index:t,children:(r,i)=>p(en,B(O(O({ref:r.innerRef},r.draggableProps),r.dragHandleProps),{onClick:E=>s(E,e),isSelected:o,isDragging:i.isDragging,isGhosting:d,children:[p("div",{className:"queueItemWrapper currentlyPlaying",style:{gridTemplateColumns:"25px minmax(150px, 350px) minmax(325px, 500px)"},children:[p("svg",{style:{display:"grid",gridRow:"1/2",width:"25px"},children:[n("g",{style:{opacity:u===y.playMode.playing?"1":"0"},children:n("path",{d:"M 0,0 L 0,25 L 25,12.5 z"})}),p("g",{style:{opacity:u!==y.playMode.playing?"1":"0"},children:[n("rect",{x:"0",y:"0",width:"10",height:"25"}),n("rect",{x:"15",y:"0",width:"10",height:"25"})]})]}),p("div",{style:{display:"grid",gridColumn:"2/3",gridTemplateRows:"max-content max-content",lineHeight:"20px",fontWeight:"400",overflow:"hidden"},children:[n("span",{style:{display:"grid",gridRow:"1/2",width:"max-content",fontSize:"large",fontWeight:"500"},children:e.album?`${e.album}`:null}),n("span",{style:{display:"grid",gridRow:"2/3",width:"max-content"},children:e.artist?`${e.artist}`:null})]}),p("div",{style:{display:"grid",gridColumn:"3/4",gridTemplateColumns:"max-content max-content",columnGap:"50px",fontSize:"larger",fontWeight:"500"},children:[n("span",{style:{display:"grid",gridColumn:"1/2"},children:e.name?e.name:e.song}),n("span",{style:{display:"grid",gridColumn:"2/3",fontWeight:"400"},children:h.total>0?`${ve(h.progress)}/${ve(h.total)}`:""})]})]}),i.isDragging&&a>1?n(tn,{children:a}):null]}))})},sn=()=>{const e=V(),t=N(l=>l.info.pid),{queue:s}=N(l=>l.queue,Ce),o=N(l=>l.player.currentItem,De),d=N(l=>l.player.blockEventUpdates),a=f.exports.useRef(d);a.current=d,f.exports.useEffect(()=>{const l=async()=>{const c=await x.getQueue(t);c&&(console.log("Setting queue items...",c),e(se(c)))};t?(console.log("Initialized SSEs, initial state, and pid connected:",t),l()):e(ye())},[t]);const u=async(l,c)=>{if(l.preventDefault(),t){if(console.log("Double clicked item qid:",c+1),o&&o.qid===c+1||l.target.classList.contains("btn"))return;e(b(!0)),e(X(s[c])),e(ne(y.playMode.playing)),await x.sendCommand(`player/play_queue?pid=${t}&qid=${c+1}`)&&e(b(!1))}},h=(l,c,m)=>{let P=[...l];const[S]=P.splice(c,1);if(P.splice(m,0,S),(v.size>0||i)&&o){const k=P.findIndex(R=>R.mid===o.mid);console.log("setting new currItem qid:",o.qid,"to",k+1),e(X(B(O({},o),{qid:k+1})))}return P},r=(l,c)=>{let m=0,P=l.filter(k=>!v.has(k.mid));if(c>0){let k=null;for(let R=c;R<l.length;++R)if(!v.has(l[R].mid)){k=l[R].mid;break}m=k!==null&&l[l.length-1].mid!==k?P.findIndex(R=>R.mid===k):P.length}console.log("newDestIdx:",m);const S=l.filter(k=>v.has(k.mid));return P.splice(m,0,...S),[P,m]},[i,E]=f.exports.useState(null),w=async l=>{E(l.draggableId),v.has(l.draggableId)||g(),e(b(!0))},F=()=>{E(null),g()},A=async l=>{if(!l.destination||v.size===s.length||v.size<=1&&l.source.index===l.destination.index){e(b(!1)),F();return}console.log("sourceIdx:",l.source.index),console.log("destIdx:",l.destination.index);let c=null,m=null;v.size>1?[c,m]=r(s,l.destination.index):c=h(s,l.source.index,l.destination.index),e(se(c));let P="",S="";if(v.size>0){const k=Array.from(v.values()).sort();for(let q=0;q<v.size;++q)P+=`${k[q]}${q<v.size-1?",":""}`;const R=m+(v.size||1);for(let q=m;q<R;++q)S+=`${q+1}${q<R-1?",":""}`}else P=`${s[l.source.index].qid}`,S=`${s[l.destination.index].qid}`;if(console.log("srcQidStr:",P),console.log("destQidStr:",S),P===S)console.log("same qid order, not applying changes"),e(b(!1));else{const k=await x.sendCommand(`player/move_queue_item?pid=${t}&sqid=${P}&dqid=${S}`);k&&(console.log("moveQueueRes:",k),e(b(!1)))}F()},j=async l=>{l.preventDefault(),t&&(e(ye()),e(b(!0)),await x.clearQueue(t)&&(console.log("Deleted all queue items on player"),e(b(!1))))},T=async l=>{if(l.preventDefault(),t){e(b(!0));const c=s.filter(k=>!v.has(k.mid));console.log("filtered queue:",c),e(se(c));let m="",P=0;for(const[k,R]of v)m+=`${R}${P<v.size-1?",":""}`,++P;console.log("handleDeleteItems qidStr:",m);const S=await x.sendCommand(`player/remove_from_queue?pid=${t}&qid=${m}`);console.log("removeQueueRes:",S),S&&(o&&v.has(o.mid)&&e(X(null)),e(b(!1)))}},[v,H]=f.exports.useState(new Map),C=(l,c)=>{const m=c.mid;if(l.button!==0||l.defaultPrevented)return;l.preventDefault();const P=v.has(m);let S=null;if(l.ctrlKey)S=new Map([...v]),P?S.delete(m):S.set(m,c.qid);else if(l.shiftKey){S=new Map([...v]),v.size<1&&S.set(m,c.qid);const k=s.findIndex(Y=>Y.mid===m),R=s.findIndex(Y=>Y.mid===Array.from(v.keys()).pop());if(k===R)return;const q=k>R,J=q?R:k,qe=q?k:R,Le=s.slice(J,qe+1);for(let Y of Le)S.has(Y.mid)||S.set(Y.mid,Y.qid)}else S=new Map,P?v.size>1&&S.set(m,c.qid):S.set(m,c.qid);H(S)},g=()=>{H(new Map)},L=l=>{l.defaultPrevented||l.target.classList.contains("playlist-input-collapse")||ae.current&&l.target.classList.contains("delete-collapse")||(ae.current&&U(!1),g())};f.exports.useEffect(()=>{g()},[s]);const M={handleItemDblClick:u,handleSelectItem:C},[D,z]=f.exports.useState(""),[K,U]=f.exports.useState(!1),ae=f.exports.useRef(K);ae.current=K,f.exports.useEffect(()=>(document.addEventListener("click",L),()=>document.removeEventListener("click",L)),[K,U]);const ce=l=>{l.preventDefault(),U(!0)};return p("div",{className:"qMain",children:[n(me,{in:K,children:p("div",{className:"playlist-input-collapse",children:[n("input",{className:"playlist-input-collapse",style:{marginRight:"5px",border:"0.5px solid black",backgroundColor:"whitesmoke",borderRadius:"4px",paddingLeft:"5px"},placeholder:"Enter a playlist name",value:D,onChange:l=>z(l.target.value)}),n(_,{onClick:async()=>{if(D.length<1)return e(Q("Cannot enter an empty playlist name!"));if(t){e(b(!0));const l=await x.sendCommand(`player/save_queue?pid=${t}&name=${D}`);if(console.log("addPlaylistRes:",l),l){console.log("Getting existing playlists...");const c=await x.sendCommand(`browse/browse?sid=${oe.playlists}`);console.log("playlistRes:",c),c&&(e(ie(c.payload)),U(!1),z(""),e(b(!1)))}}},variant:"success",children:"Save"})]})}),n(me,{in:K||!i&&v.size>0,children:p("div",{className:"delete-collapse",children:[n(_,{className:"show-prompt-btn",disabled:K,onClick:ce,style:{marginRight:"3px"},variant:"secondary",children:"Save All to Playlist"}),n(_,{onClick:T,style:{marginRight:"3px"},variant:"danger",children:"Clear Selected"}),n(_,{onClick:j,variant:"danger",children:"Clear All"})]})}),n(Wt,{}),n(Be,{onDragStart:w,onDragEnd:A,children:n(Ve,{droppableId:"queueDroppable",children:l=>p("div",B(O({ref:l.innerRef},l.droppableProps),{className:"mediaQueue",children:[s.map((c,m)=>o&&o.qid===c.qid?n(nn,B(O({item:c,index:m},M),{isSelected:v.has(c.mid),isGhosting:i&&v.has(c.mid)&&i!==c.mid,selectionCount:v.size}),c.mid):n(Zt,B(O({item:c,index:m},M),{isSelected:v.has(c.mid),isGhosting:i&&v.has(c.mid)&&i!==c.mid,selectionCount:v.size}),c.mid)),l.placeholder]}))})}),n(Jt,{})]})},on=()=>{const e=V(),t=N(u=>u.info.clientIP),[s,o]=f.exports.useState("");f.exports.useEffect(()=>{t&&o(t.replace("http://",""))},[t]);const d=u=>{localStorage.setItem("settings",JSON.stringify({clientIP:s})),e(ue(s))},a=()=>{e(ue("")),o("")};return p("div",{className:"settings",children:[n("div",{style:{alignSelf:"center"},children:"My Plex Auth'd IP (w/ port #): "}),n("input",{style:{width:"250px",backgroundColor:"rgb(200,200,200)",color:"black"},value:s,onChange:u=>o(u.target.value),placeholder:"Ex: 192.168.7.208:32400"}),n(_,{style:{width:"75px"},onClick:d,children:"Set"}),n(_,{disabled:!s||s.length<1,variant:"danger",onClick:a,children:"Clear"})]})};const an=()=>{const e=N(o=>o.notification.message),t=N(o=>o.notification.gotNotification),s=V();return n("div",{className:`alert ${t?"alert-show":"alert-hide"}`,onTransitionEnd:()=>{s(tt())},children:e})},ln=()=>{const[e,t]=f.exports.useState(new Set),[s,o]=f.exports.useState(!1),d=V();f.exports.useEffect(()=>{mt();const r=JSON.parse(localStorage.getItem("ipsFound"));r&&t(r)},[]);const a=async()=>{if(!s){o(!0);try{const r=await x.searchForIPs();if(console.log("App searchForIPsRes:",r),!r)return console.log("Error in searching for ips..."),d(Q("Error in searching for ips...")),o(!1);if(r.length<1)return console.log("No new devices found!"),d(Q("No new devices found...")),o(!1);let i=new Set(r);const E=JSON.parse(localStorage.getItem("ipsFound"));if(E){console.log("existingStoredIps:",E);for(storedIp of E)i.has(storedIp)||i.add(storedIp)}console.log("newIpSet:",i);const w=Array.from(i);return localStorage.setItem("ipsFound",JSON.stringify(w)),t(w),o(!1)}catch{return console.log("Error in grabbing devices..."),d(Q("Error in grabbing devices...")),o(!1)}}},u=()=>{t([]),localStorage.clear()};return p("div",{className:"main",children:[n(an,{}),p(We,{className:"tabs",defaultActiveKey:"queue",children:[n(de,{className:"c",eventKey:"browse",title:"Browse",children:n("div",{className:"cMain",children:(()=>!s&&e.length>0?n(Qt,{ips:e,handleSearch:a,clearSearchHistory:u}):p("div",{className:"searchPage",children:[n(_,{variant:"primary",size:"lg",style:{width:"100%"},onClick:a,disabled:s,children:s?p("div",{children:[n("span",{children:"Searching "}),n(xe,{as:"span",animation:"border",size:"sm"})]}):"Search for Denon devices"}),n("ul",{children:s&&e.length>0?e.map(r=>n(He,{in:!0,appear:!0,children:n("li",{style:{fontSize:"20px"},children:r})},r)):null})]}))()})}),n(de,{className:"q",eventKey:"queue",title:"Queue",children:n(sn,{})}),n(de,{className:"s",eventKey:"settings",title:"Settings",children:n(on,{})})]})]})};Ue.render(n(Ge,{store:Ee,children:n(ln,{})}),document.getElementById("root"));
