'use strict';
const $=s=>document.querySelector(s);let key=null;let objectUrls=[];let generation=0;
const bytes=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
async function load(url){const r=await fetch(url,{credentials:'omit'});if(!r.ok)throw new Error('network');return r;}
async function decryptAsset(asset){const raw=await (await load(asset.file)).arrayBuffer();return crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(asset.iv)},key,raw);}
function blobUrl(data,type){const url=URL.createObjectURL(new Blob([data],{type}));objectUrls.push(url);return url;}
function element(tag,cls,text){const el=document.createElement(tag);if(cls)el.className=cls;if(text)el.textContent=text;return el;}
async function show(catalog){const current=++generation;$('#grid').replaceChildren();$('#gate').hidden=true;$('#review').hidden=false;
 for(const item of catalog){
  const card=element('article');card.dataset.id=item.id;const head=element('div','card-head');head.append(element('h2','',item.id),element('span','duration',`${item.seconds}秒`));
  const media=element('div','media'),poster=element('img');poster.alt=`${item.id}の冒頭`;media.append(poster);
  const copy=element('p','card-copy',item.text),actions=element('div','actions'),button=element('button','','動画を開く'),status=element('p','notice');button.type='button';status.setAttribute('role','status');actions.append(button);
  card.append(head,media,copy,actions,status);$('#grid').append(card);
  decryptAsset(item.poster).then(data=>{if(current===generation)poster.src=blobUrl(data,'image/webp');}).catch(()=>{status.textContent='画像を読み込めませんでした。動画は下のボタンから開けます。';});
  button.addEventListener('click',async()=>{button.disabled=true;status.textContent='動画を読み込んでいます…';try{
   const data=await decryptAsset(item.video);if(current!==generation)return;
   document.querySelectorAll('video').forEach(v=>v.pause());
   const url=blobUrl(data,'video/mp4'),video=element('video');video.controls=true;video.playsInline=true;video.preload='metadata';video.src=url;video.setAttribute('aria-label',item.id);media.replaceChildren(video);
   const link=element('a','download','ダウンロード');link.href=url;link.download=`partner-${item.id.toLowerCase()}.mp4`;actions.replaceChildren(link);status.textContent='';
  }catch{status.textContent='動画を読み込めませんでした。もう一度お試しください。';button.disabled=false;}});
 }
}
$('#unlock').addEventListener('submit',async e=>{e.preventDefault();const pw=$('#password').value.trim();if(!pw)return;$('#submit').disabled=true;$('#message').textContent='確認しています…';try{
 const locked=await (await load('locked.json')).json();const base=await crypto.subtle.importKey('raw',new TextEncoder().encode(pw),'PBKDF2',false,['deriveKey']);
 const candidate=await crypto.subtle.deriveKey({name:'PBKDF2',salt:bytes(locked.salt),iterations:locked.iterations,hash:'SHA-256'},base,{name:'AES-GCM',length:256},false,['decrypt']);
 let plain;try{plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(locked.iv)},candidate,bytes(locked.data));}catch{throw new Error('password');}
 const catalog=JSON.parse(new TextDecoder().decode(plain));key=candidate;$('#password').value='';$('#message').textContent='';await show(catalog);
 }catch(err){$('#message').textContent=err.message==='password'?'パスワードが違います。確認して入力してください。':'読み込めませんでした。通信状態を確認してお試しください。';}finally{$('#submit').disabled=false;}});
$('#logout').addEventListener('click',()=>{generation++;document.querySelectorAll('video').forEach(v=>{v.pause();v.removeAttribute('src');v.load();});$('#grid').replaceChildren();objectUrls.forEach(URL.revokeObjectURL);objectUrls=[];key=null;$('#review').hidden=true;$('#gate').hidden=false;$('#password').focus();});
