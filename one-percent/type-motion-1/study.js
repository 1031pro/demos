const names=['A　現場を大きく','B　結びを強く','C　言葉を一段ずつ','D　営業を主役に','E　短い行と長い行'];
const clamp=x=>Math.max(0,Math.min(1,x));
const ease=x=>1-Math.pow(1-clamp(x),3);
function load(url){return new Promise((resolve,reject)=>{let img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=url})}
const boards=names.map(name=>{let f=document.createElement('figure'),caption=document.createElement('figcaption'),canvas=document.createElement('canvas');canvas.width=canvas.height=840;caption.textContent=name;canvas.setAttribute('aria-label',name);f.append(caption,canvas);document.querySelector('section').append(f);return canvas.getContext('2d')});
Promise.all(['base-1.webp','glow-1.png','type-1-1.png','type-1-2.png','type-1-3.png'].map(load)).then(([base,mask,...type])=>{
const white=type.map(im=>{const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const g=c.getContext('2d');g.drawImage(im,0,0);g.globalCompositeOperation='source-in';g.fillStyle='#fff9ef';g.fillRect(0,0,c.width,c.height);return c});
const glow=document.createElement('canvas');glow.width=glow.height=840;const g=glow.getContext('2d');const start=performance.now();
function paint(now){const t=(now-start)/1000%10;const phase=t%5;
g.clearRect(0,0,840,840);if(phase<2.4){const x=(-.3+phase/2.4*1.6)*840;const grad=g.createLinearGradient(x-75,0,x+75,0);grad.addColorStop(0,'transparent');grad.addColorStop(.5,'rgba(255,255,255,.30)');grad.addColorStop(1,'transparent');g.fillStyle=grad;g.fillRect(0,0,840,840);g.globalCompositeOperation='destination-in';g.drawImage(mask,0,0,840,840);g.globalCompositeOperation='source-over'}
boards.forEach((ctx,id)=>{ctx.setTransform(840/1254,0,0,840/1254,0,0);ctx.drawImage(base,0,0,1254,1254);
// Each entry uses the original glyphs, a uniform size, and a baseline-independent anchor.
const layouts=[
 [[51,23,1.12],[55,151,.77],[55,251,.78],[55,346,.88]],
 [[55,56,.66],[232,65,.80],[55,162,.84],[51,272,1.19]],
 [[54,44,.89],[103,156,.84],[155,243,.80],[204,329,.86]],
 [[55,39,.62],[223,50,.73],[51,130,1.45],[55,313,.96]],
 [[52,35,1.04],[325,65,.79],[53,201,.74],[53,295,1.12]]
];
const segments=[[type[0],0,257],[type[0],257,type[0].width-257],[type[1],0,type[1].width],[type[2],0,type[2].width]];
layouts[id].forEach(([x,y,size],i)=>{
 const [img,left,width]=segments[i], h=img.height;
 const lag=[[0,.13,.34,.49],[0,.08,.22,.48],[0,.17,.34,.51],[0,.08,.31,.52],[0,.16,.32,.49]][id][i];
 const age=phase-lag;
 if(age<0)return;
 const progress=ease((age+.035)/[.36,.55,.44,.46,.55][id]);
 ctx.save();
 let zoom=1, rise=0;
 if(id===0){zoom=1+(1-progress)*(i===0?.14:.045)}
 if(id===1){ctx.globalAlpha=.16+.84*progress;zoom=1-(1-progress)*(i===3?.13:.035)}
 if(id===2){ctx.beginPath();ctx.rect(x,y,width*size,h*size);ctx.clip();rise=(1-progress)*h*.60}
 if(id===3){zoom=1+(i===2?.24:.035)*(1-progress);ctx.globalAlpha=.45+.55*progress}
 if(id===4){ctx.beginPath();ctx.rect(x,y+h*size*(1-progress)/2,width*size,h*size*progress);ctx.clip()}
 const w=width*size, height=h*size;
 ctx.drawImage(img,left,0,width,h,x+(1-zoom)*w*.5,y+rise+(1-zoom)*height*.5,w*zoom,height*zoom);
 ctx.restore();
});
ctx.drawImage(glow,0,0,1254,1254)});requestAnimationFrame(paint)}requestAnimationFrame(paint)})
