const names=['A　見出しに引く一本の線','B　墨色の見出し帯','C　言葉を囲む余白','D　マーカーで拾う要点','E　活字の組版'];
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
const accent='#a63a10', paper='#fff8e9', dark='#272722';
function rect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(x,y,w,h)}
function line(j,x,y,scale=1,img=type[j]){ctx.drawImage(img,x,y,img.width*scale,img.height*scale)}
if(id===0){geometry[1].forEach((a,j)=>{const p=ease((phase+.18-j*.10)/.78);ctx.save();ctx.globalAlpha=.38+.62*p;line(j,a.x,a.y+12*(1-p));ctx.restore()});rect(58,420,580*ease(phase/.95),6,accent)}
if(id===1){line(0,54,48,.94);const width=594;rect(42,192,width,206,dark);[1,2].forEach((j)=>{const y=j===1?204:302;line(j,60,y,.87,white[j]);ctx.save();ctx.beginPath();ctx.rect(60,y+white[j].height*.87*(1-ease((phase+.02-j*.09)/.65)),width,150);ctx.clip();line(j,60,y,.87,white[j]);ctx.restore()});rect(42,192,7,206*ease(phase/.8), '#e6a157');const sweep=ease((phase-.10)/.95);if(sweep<1){ctx.save();ctx.beginPath();ctx.rect(57+570*sweep,196,570*(1-sweep),195);ctx.clip();ctx.globalAlpha=.68;rect(56,196,575,195,dark);ctx.restore()}}
if(id===2){rect(26,27,695,397,'rgba(255,250,239,.94)');const p=ease(phase/.75);rect(45,44,55*p,5,accent);rect(45,44,5,37*p,accent);rect(699-55*p,403,55*p,5,accent);rect(694,408-37*p,5,37*p,accent);geometry[1].forEach((a,j)=>{ctx.save();const q=ease((phase+.2-j*.11)/.82);ctx.globalAlpha=.28+.72*q;line(j,69,a.y+18,.87);ctx.restore()})}
if(id===3){geometry[1].forEach((a,j)=>{if(j===1||j===2){const p=ease((phase-(j-1)*.38)/.70);ctx.save();ctx.translate(a.x,a.y+a.h*.76);ctx.rotate(-.018);rect(-5,0,(a.w+12)*p,a.h*.27,'#f3b84d');ctx.restore()}line(j,a.x,a.y)})}
if(id===4){rect(38,41,9,367,dark);rect(38,41,9,367*ease(phase/1.06),accent);geometry[1].forEach((a,j)=>{const p=ease((phase+.08-j*.16)/.62);const z=(j===0?.90:j===1?.84:1.05);ctx.save();ctx.beginPath();const y=[55,194,304][j];ctx.rect(64,y,a.w*z+2,a.h*z+2);ctx.clip();line(j,65,y+(.75*a.h)*(1-p),z);ctx.restore()})}
ctx.drawImage(glow,0,0,1254,1254)});requestAnimationFrame(paint)}requestAnimationFrame(paint)})
