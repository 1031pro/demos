/* Preserve the bookmarked page and select its live view only after the D1 cutover. */
(async()=>{
 const page=location.pathname.split('/').pop(),hash=location.hash.slice(1).split('?')[0];
 if(page==='portal.html' && (hash.startsWith('acquisition')||hash==='archive'))return;
 if(page==='approvals.html' && ['workflow','respond'].includes(hash))return;
 const original=new URL(location.href);
 document.documentElement.style.visibility='hidden';
 function ready(){return document.readyState==='loading'?new Promise(r=>document.addEventListener('DOMContentLoaded',r,{once:true})):Promise.resolve()}
 try{
  const res=await fetch('https://one-percent-intake.1031pro.workers.dev/api/v2/mode',{cache:'no-store',referrerPolicy:'no-referrer'});
  if(!res.ok)throw Error();
  const data=await res.json();
  if(data.mode==='trial'){document.documentElement.style.visibility='';return}
  if(data.mode!=='live')throw Error();
  await ready();
  if(page==='workspace.html'||page==='tasks.html'){
   const rel=page==='workspace.html'?'ops/runtime/workspace.html':'runtime/tasks.html';
   const asset=await fetch(new URL(rel,original),{cache:'no-store'});
   if(!asset.ok)throw Error();const html=await asset.text();if(!html.includes('data-workflow-runtime'))throw Error();
   document.open();document.write(html);document.close();return;
  }
  const search=new URLSearchParams(original.hash.split('?')[1]||'');
  const id=original.searchParams.get('offer_id')||search.get('offer_id');
  if(hash==='review' && (search.has('access')||!id)){
    const p=document.createElement('p');p.textContent='以前の確認依頼は受付を終了しました。送付元の運営担当者に新しい依頼リンクをご確認ください。';
    document.body.replaceChildren(p);document.documentElement.style.visibility='';return;
  }
  if(id && /^\d+$/.test(id)){location.replace('approvals.html?offer_id='+encodeURIComponent(id)+'#workflow');if(page==='approvals.html'){location.reload()}return}
  if(page==='portal.html'){history.replaceState(null,'',original.pathname+'#acquisition');location.reload();return}
  location.replace('portal.html#acquisition');
 }catch{
  await ready();const p=document.createElement('p');p.textContent='運営システムへの接続を確認できませんでした。再読み込みしてください。';
  document.body.replaceChildren(p);document.documentElement.style.visibility='';
 }
})();
