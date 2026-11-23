const CA='#ffd98a',CB='#8cc8ff',DIM='rgba(200,190,170,.35)';
// 100 identical creators, 100 fans each, 100 days; same daily luck applied two ways
const SIM=(()=>{const r=rng(8),N=100,D=100;let mul=Array(N).fill(100),add=Array(N).fill(100);const M=[mul.slice()],A=[add.slice()];
  for(let d=0;d<D;d++){for(let i=0;i<N;i++){const up=r()<.5;mul[i]*=up?1.2:.8;add[i]=Math.max(0,add[i]+(up?20:-20));}M.push(mul.slice());A.push(add.slice());}
  const rank=a=>{const idx=a.map((v,i)=>i).sort((x,y)=>a[y]-a[x]);const rk=Array(a.length);idx.forEach((i,k)=>rk[i]=k);return rk;};
  const share=a=>{const f=[...a].sort((x,y)=>y-x),s=f.reduce((x,y)=>x+y,0);return{top20:f.slice(0,20).reduce((x,y)=>x+y,0)/s,bot50:f.slice(50).reduce((x,y)=>x+y,0)/s,med:f[49],max:f[0],sorted:f};};
  return{M,A,rkM:rank(M[D]),rkA:rank(A[D]),sM:share(M[D]),sA:share(A[D]),D};})();
window.SIMR={top20:SIM.sM.top20,bot50:SIM.sM.bot50,med:SIM.sM.med,max:SIM.sM.max,addTop20:SIM.sA.top20,below100:SIM.M[100].filter(v=>v<100).length};
const pct=x=>(x*100).toFixed(1)+'%';
function dayVals(H,d){d=clamp(d,0,SIM.D);const i=Math.floor(d),f=d-i,a=H[i],b=H[Math.min(SIM.D,i+1)];return a.map((v,k)=>v+(b[k]-v)*f);}
function bars(vals,x0,base,w,h,maxV,{a=1,rk=null,sortK=0,hi=0,dim=0}={}){if(a<=0)return;const n=vals.length,st=w/n,bw=st*.68;ctx.save();ctx.globalAlpha=a;
  for(let i=0;i<n;i++){const pos=rk?i+(rk[i]-i)*eInOut(sortK):i;const x=x0+pos*st,bh=Math.max(2,vals[i]/maxV*h),top20=rk&&rk[i]<20;
    const g=top20?hi:0;ctx.fillStyle=g>0?`rgba(${Math.round(230+25*g)},${Math.round(190+20*g)},${Math.round(110-10*g)},${.55+.45*g})`:`rgba(230,190,110,${.55-.3*dim})`;
    if(g>.5){ctx.shadowColor='#f0b850';ctx.shadowBlur=14*g;}else ctx.shadowBlur=0;ctx.fillRect(x,base-bh,bw,bh);}
  ctx.shadowBlur=0;ctx.strokeStyle='rgba(230,190,110,.35)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0-10,base+2);ctx.lineTo(x0+w,base+2);ctx.stroke();ctx.restore();}
function person(x,y,s,a,col='#e6bd62',glow=0){if(a<=0)return;ctx.save();ctx.globalAlpha=a;ctx.fillStyle=col;if(glow){ctx.shadowColor=col;ctx.shadowBlur=glow;}
  ctx.beginPath();ctx.arc(x,y-s*.55,s*.32,0,6.283);ctx.fill();ctx.beginPath();ctx.roundRect(x-s*.42,y-s*.15,s*.84,s*.75,s*.3);ctx.fill();ctx.restore();}

function s1(t){ // bars 1-3
  const a=1-seg(t,bar(4)-.3,bar(4)+.1);if(a<=0)return;const k=eOut(seg(t,0,.6));
  text('为什么总是少数人，拿走大多数？',W/2,330,60,{a});
  ctx.save();const s=1.08-.08*k+.01*Math.sin(t*3);ctx.translate(W/2,560);ctx.scale(s,s);ctx.translate(-W/2,-560);
  rich([['20%',190,'g'],['  拿走  ',80,false],['80%',190,'g']],620,{a,glow:44});ctx.restore();
  text('财富、流量、销量……都长成同一个形状',W/2,760,44,{a:a*seg(t,.5,.9),weight:500,color:'#d9cdb3'});
  for(let i=0;i<10;i++){const big=i<2,m=seg(t,.8+i*.08,1.1+i*.08);person(W/2-405+i*90,915,big?70:46,a*m,big?'#f0c870':DIM,big?24:0);}
  text('这不是巧合，是数学',W/2,1010,40,{a:a*seg(t,2.2,2.6),gold:true,glow:16});
}
function s2(t){ // bars 4-8 Pareto
  const a=Math.min(seg(t,bar(4)-.1,bar(4)+.3),1-seg(t,bar(9)-.15,bar(9)+.05));if(a<=0)return;
  text('1906 年，意大利经济学家帕累托',W/2,220,52,{a});
  text('注意到：意大利约 80% 的土地，属于约 20% 的人',W/2,300,40,{a:a*seg(t,bar(5),bar(5)+.4),weight:500,color:'#d9cdb3'});
  const L=560,T=370,Wd=800,Ht=360,sp=eInOut(seg(t,bar(5)+.6,bar(6)+.6)),m=seg(t,bar(4)+.6,bar(5));
  ctx.save();ctx.globalAlpha=a*m;ctx.strokeStyle='rgba(230,190,110,.6)';ctx.lineWidth=3;ctx.strokeRect(L,T,Wd,Ht);
  const gw=Wd*.8*sp;const g=ctx.createLinearGradient(L,T,L,T+Ht);g.addColorStop(0,'rgba(240,200,110,.55)');g.addColorStop(1,'rgba(150,105,40,.45)');ctx.fillStyle=g;ctx.fillRect(L,T,gw,Ht);
  ctx.fillStyle='rgba(140,200,255,.12)';ctx.fillRect(L+gw,T,Wd-gw,Ht);ctx.restore();
  const q=a*seg(t,bar(6)+.3,bar(6)+.8);
  text('80% 的土地',L+320,T+110,56,{a:q,gold:true,glow:14});text('20%',L+720,T+110,44,{a:q,color:'#cfe6ff'});
  person(L+260,T+260,90,q,'#f0c870',20);person(L+380,T+260,90,q,'#f0c870',20);
  for(let i=0;i<8;i++)person(L+665+(i%2)*55,T+190+Math.floor(i/2)*50,34,q,DIM);
  text('20% 的人',L+320,T+Ht+45,34,{a:q,weight:500,color:'#f1d99a'});text('80% 的人',L+720,T+Ht+45,34,{a:q,weight:500,color:'#cfe6ff'});
  text('后来人们发现，这个形状到处都是',W/2,900,44,{a:a*seg(t,bar(7),bar(7)+.4),weight:500});
  text('为什么？',W/2,985,58,{a:a*seg(t,bar(7)+.9,bar(8)+.2),gold:true,glow:20});
}
// main experiment chart, bars 9-19
const CH={x:260,base:900,w:1400,h:520};
function mainChart(t){const a=Math.min(seg(t,bar(9),bar(9)+.1),1-seg(t,bar(19)-.3,bar(19)));if(a<=0)return;
  const d=SIM.D*eInOut(seg(t,bar(10),bar(13))),vals=dayVals(SIM.M,d);let mx=100;for(let i=0;i<=Math.ceil(d);i++)for(const v of SIM.M[Math.min(SIM.D,i)])mx=Math.max(mx,v);
  const maxV=Math.max(250,Math.min(mx,SIM.sM.max));
  bars(vals,CH.x,CH.base,CH.w,CH.h,maxV,{a,rk:SIM.rkM,sortK:seg(t,bar(13)+.3,bar(13)+1.4),hi:seg(t,bar(14),bar(14)+.3),dim:seg(t,bar(14),bar(14)+.3)});
  text(`第 ${Math.round(d)} 天`,CH.x+CH.w,330,44,{a:a*(1-seg(t,bar(13),bar(13)+.35)),align:'right',gold:true});
  text('每人 100 粉',CH.x,CH.base+40,28,{a:a*(1-seg(t,bar(10),bar(10)+.5)),align:'left',weight:500,color:'#d9cdb3'});
}
function s3(t){ // bars 9-14
  const a=Math.min(seg(t,bar(9),bar(9)+.08),1-seg(t,bar(15)-.15,bar(15)+.1));if(a<=0)return;
  const h=1-seg(t,bar(13),bar(13)+.35);
  pop(t,bar(9),W/2,200,k=>text('100 个一模一样的博主，同一天开号',W/2,200,62,{a:a*h,gold:true,glow:20}),.3);
  rich([['每天随机：',38,false],['运气好 +20%',44,'g'],['，运气差 −20%',44,false]],285,{a:a*h*seg(t,bar(10)-.1,bar(10)+.2),glow:12});
  text('没人更有才华，只有运气',W/2,975,40,{a:a*seg(t,bar(11),bar(11)+.4)*(1-seg(t,bar(13),bar(13)+.4)),weight:500,color:'#d9cdb3'});
  text('100 天后，按粉丝数排个队',W/2,220,52,{a:a*seg(t,bar(13)+.4,bar(13)+.8)});
  pop(t,bar(14),1210,480,k=>{const m=a*seg(t,bar(14)-.05,bar(14)+.1);text('前 20% 的人，拿走了',1210,410,46,{a:m});text(pct(SIM.sM.top20),1210,530,130,{a:m,gold:true,glow:40});},.3);
}
function s4(t){ // bars 15-18
  const a=Math.min(seg(t,bar(15)-.1,bar(15)+.3),1-seg(t,bar(19)-.2,bar(19)+.1));if(a<=0)return;
  text(`前 20%：${pct(SIM.sM.top20)}`,W/2,220,52,{a,gold:true,glow:14});
  rich([['后 50% 的人，加起来只有 ',44,false],[pct(SIM.sM.bot50),80,'g']],440,{a:a*seg(t,bar(15)+.4,bar(15)+.8),glow:20,cx:1210});
  text(`${SIMR.below100} 个人的粉丝，比开号那天还少`,1210,570,40,{a:a*seg(t,bar(16)+.4,bar(16)+.8),weight:500,color:'#cfe6ff'});
  text(`第一名：${Math.round(SIM.sM.max)} 粉　排第 50 的人：${Math.round(SIM.sM.med)} 粉`,1210,650,36,{a:a*seg(t,bar(17),bar(17)+.4),weight:500,color:'#d9cdb3'});
  pop(t,bar(18),W/2,985,k=>text('没人更努力——只是运气，按比例滚了 100 天',W/2,985,54,{a:a*seg(t,bar(18)-.05,bar(18)+.1),gold:true,glow:28}),.3);
}
function s5(t){ // bars 19-22 additive vs multiplicative
  const a=Math.min(seg(t,bar(19)-.1,bar(19)+.3),1-seg(t,bar(23)-.2,bar(23)+.1));if(a<=0)return;
  text('如果涨粉是「加法」呢？',W/2,200,58,{a});
  const mx=SIM.sM.max,d=SIM.D*eInOut(seg(t,bar(19)+.5,bar(21))),srt=seg(t,bar(21)+.1,bar(21)+.9),ml=seg(t,bar(19)+.3,bar(19)+.8);
  text('加法：每天 ±20 粉',510,320,40,{a:a*ml,color:'#cfe6ff'});text('乘法：每天 ±20%',1410,320,40,{a:a*ml,gold:true});
  bars(dayVals(SIM.A,d),150,820,720,420,mx,{a:a*ml,rk:SIM.rkA,sortK:srt,hi:srt});
  bars(SIM.M[SIM.D],1050,820,720,420,mx,{a:a*ml,rk:SIM.rkM,sortK:1,hi:1});
  const r=seg(t,bar(21)+.8,bar(21)+1.2);
  rich([['前 20% 占 ',36,false],[pct(SIM.sA.top20),60,'g']],900,{a:a*r,glow:12,cx:510});
  rich([['前 20% 占 ',36,false],[pct(SIM.sM.top20),60,'g']],900,{a:a*ml,glow:12,cx:1410});
  pop(t,bar(22),W/2,1000,k=>text('同样的运气，差距来自「按比例」',W/2,1000,58,{a:a*seg(t,bar(22)-.05,bar(22)+.1),gold:true,glow:30}),.3);
}
function s6(t){ // bars 23-30 power law / Zipf
  const a=Math.min(seg(t,bar(23)-.1,bar(23)+.3),1-seg(t,bar(31)-.2,bar(31)+.1));if(a<=0)return;
  pop(t,bar(23),W/2,200,k=>rich([['这个形状，叫',52,false],['幂律',72,'g'],['，也叫',52,false],['长尾',72,'g']],225,{a,glow:20}),.25);
  // rank curve
  const f=SIM.sM.sorted,L=140,B=880,Wd=760,Ht=500,p=eInOut(seg(t,bar(23)+.5,bar(24)+.8));
  ctx.save();ctx.globalAlpha=a;const g=ctx.createLinearGradient(0,B-Ht,0,B);g.addColorStop(0,'rgba(240,200,110,.55)');g.addColorStop(1,'rgba(240,200,110,.05)');
  ctx.beginPath();ctx.moveTo(L,B);const n=Math.max(1,Math.floor(p*f.length));for(let i=0;i<n;i++)ctx.lineTo(L+i/(f.length-1)*Wd,B-Math.sqrt(f[i]/f[0])*Ht);ctx.lineTo(L+(n-1)/(f.length-1)*Wd,B);ctx.closePath();ctx.fillStyle=g;ctx.fill();
  ctx.beginPath();for(let i=0;i<n;i++){const x=L+i/(f.length-1)*Wd,y=B-Math.sqrt(f[i]/f[0])*Ht;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle='#ffd98a';ctx.lineWidth=4;ctx.shadowColor='#f0b850';ctx.shadowBlur=14;ctx.stroke();
  ctx.shadowBlur=0;ctx.strokeStyle='rgba(230,190,110,.35)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(L,B+2);ctx.lineTo(L+Wd,B+2);ctx.stroke();ctx.restore();
  text('头部：少数几个',L+60,B-Ht-20,34,{a:a*seg(t,bar(24)+.6,bar(25)),align:'left',gold:true});
  text('长尾：大多数人',L+Wd-20,B-130,34,{a:a*seg(t,bar(24)+1,bar(25)+.4),align:'right',color:'#cfe6ff'});
  text('按排名从高到低',L+Wd/2,B+40,26,{a:a*p,weight:500,color:'#d9cdb3'});
  // Zipf
  const X=1080;text('语言里也一样',X,350,46,{a:a*seg(t,bar(25),bar(25)+.4),align:'left'});
  [['the','约 7%',.07],['of','约 3.5%',.035],['and','约 2.8%',.0286]].forEach(([w,l,v],i)=>{const m=seg(t,bar(25)+.6+i*.4,bar(25)+1+i*.4);if(m<=0)return;const y=440+i*80;
    text(w,X,y,40,{a:a*m,align:'left',color:'#efe6d2',weight:500});ctx.save();ctx.globalAlpha=a*m;ctx.fillStyle='#e6bd62';ctx.shadowColor='#f0b850';ctx.shadowBlur=10;ctx.fillRect(X+110,y-16,v/.07*440*eOut(m),32);ctx.restore();
    text(l,X+110+v/.07*440+20,y,32,{a:a*m,align:'left',weight:500,color:'#f1d99a'});});
  text('英语里最常用的词，出现频率大致是：',X,700,32,{a:a*seg(t,bar(27),bar(27)+.4),align:'left',weight:500,color:'#d9cdb3'});
  pop(t,bar(27),1400,770,k=>text('第 n 名 ≈ 第 1 名的 1/n',X,770,52,{a:a*seg(t,bar(27)-.05,bar(27)+.1),align:'left',gold:true,glow:20}),.2);
  text('最常用的 135 个词，就占了全部用词的一半',X,855,30,{a:a*seg(t,bar(28)+.6,bar(29)),align:'left',weight:500});
  text('城市人口、地震强度、网站流量……也是这个形状',W/2,990,40,{a:a*seg(t,bar(29)+.6,bar(30)),color:'#f1d99a'});
}
function s7(t){ // bars 31-36 real world
  const a=Math.min(seg(t,bar(31)-.1,bar(31)+.3),1-seg(t,bar(37)-.25,bar(37)+.1));if(a<=0)return;
  text('现实世界的「二八」',W/2,200,60,{a,gold:true,glow:16});
  [['全球财富','最富的 10% 的人，拥有','76%','《世界不平等报告 2022》',bar(32)],['全球收入','最富的 20% 的人，拿走','82.7%','联合国开发计划署，1992',bar(33)],
   ['医疗支出','20% 的病人，花掉约','80%','美国医疗研究与质量局，2009',bar(34)],['软件崩溃','最常见的 20% bug，导致了约','80%','微软',bar(34)+1]].forEach(([h,d,n,src,tt],i)=>{
    const m=eOut(seg(t,tt,tt+.5));if(m<=0)return;const x=150+(i%2)*840+(1-m)*40,y=290+Math.floor(i/2)*270;
    ctx.save();ctx.globalAlpha=a*m;ctx.fillStyle='rgba(239,230,210,.05)';ctx.strokeStyle='rgba(230,190,110,.45)';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x,y,780,240,22);ctx.fill();ctx.stroke();ctx.restore();
    text(n,x+170,y+125,92,{a:a*m,gold:true,glow:16});text(h,x+330,y+70,40,{a:a*m,align:'left',gold:true});text(d,x+330,y+130,32,{a:a*m,align:'left',weight:500});
    text(src,x+330,y+190,22,{a:a*m*.8,align:'left',weight:500,color:'#a99c80'});});
  pop(t,bar(35),W/2,880,k=>text('比例不一定是 80/20：可能是 90/10，也可能是 70/30',W/2,880,48,{a:a*seg(t,bar(35)-.05,bar(35)+.1),gold:true,glow:22}),.2);
  text('但形状总是一样：少数，占了大多数',W/2,975,40,{a:a*seg(t,bar(36),bar(36)+.4),weight:500});
}
function s8(t){ // bars 37-44 breakdown
  const a=Math.min(seg(t,bar(37)-.1,bar(37)+.5),1-seg(t,bar(45)-.2,bar(45)+.05));if(a<=0)return;
  text('但是……',W/2,540,120,{a:a*span(t,bar(37),bar(39)),gold:true,glow:20});
  const b=span(t,bar(39),bar(43)+.2);
  text('二八法则，常被误解',W/2,250,62,{a:a*b,gold:true,glow:14});
  ['80 和 20 加起来正好 100，只是巧合——两个数本来不用相加','它是经验法则，不是自然定律','剩下那 80% 的人和事，并不是「没用」'].forEach((s,i)=>{
    const m=seg(t,bar(39)+.6+i*1.1,bar(39)+1+i*1.1);if(m<=0)return;const y=420+i*120;
    ctx.save();ctx.globalAlpha=a*b*m;ctx.fillStyle='#e6bd62';ctx.beginPath();ctx.arc(330,y,9,0,6.283);ctx.fill();ctx.restore();
    text(s,370,y,42,{a:a*b*m,align:'left',weight:500});});
  text('那知道这个形状，有什么用？',W/2,840,50,{a:a*b*seg(t,bar(42)+.4,bar(42)+.8),color:'#f1d99a'});
  text('它告诉你——',W/2,540,80,{a:a*seg(t,bar(43)+.2,bar(43)+.6),gold:true,glow:20});
}
function s9(t){ // bars 45-52
  const a=Math.min(seg(t,bar(45),bar(45)+.12),1-seg(t,END-.7,END));if(a<=0)return;
  bars(SIM.M[SIM.D],360,1040,1200,160,SIM.sM.max,{a:a*.35,rk:SIM.rkM,sortK:1,hi:1});
  const top=span(t,bar(45),bar(48)+.4);
  pop(t,bar(45),W/2,380,k=>{text('找到你的 20%',W/2,380,140,{a:a*top,gold:true,glow:50});},.35);
  text('少数关键的事，往往决定大部分结果',W/2,530,46,{a:a*top*seg(t,bar(45)+.5,bar(45)+.9),weight:500});
  text('做事：先做最关键的那几件',W/2,650,42,{a:a*top*seg(t,bar(46),bar(46)+.4),color:'#f1d99a'});
  text('看差距：它常常来自「比例 × 时间」，不只是努力',W/2,740,42,{a:a*top*seg(t,bar(47),bar(47)+.4),color:'#cfe6ff'});
  const e=seg(t,bar(48)+.6,bar(49)+.2);
  text('世界不是平均分配的，',W/2,380,62,{a:a*e,weight:500});
  text('它按比例生长。',W/2,520,110,{a:a*seg(t,bar(49),bar(49)+.6),gold:true,glow:40});
  text('你生活里的「二八」是什么？',W/2,720,52,{a:a*seg(t,bar(50),bar(50)+.5),gold:true,glow:20});
}

window.draw=function(t){
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  background(t);drawDust(t);
  s1(t);s2(t);mainChart(t);s3(t);s4(t);s5(t);s6(t);s7(t);s8(t);s9(t);topBar(t);
  finish(t);
  const fo=seg(t,END-.6,END);if(fo>0){ctx.fillStyle=`rgba(0,0,0,${fo})`;ctx.fillRect(0,0,W,H);}
};
window.ready=(async()=>{await document.fonts.load(`700 80px ${SERIF}`);await document.fonts.load(`500 80px ${SERIF}`);window.draw(0);return true;})();
</script></body></html>
