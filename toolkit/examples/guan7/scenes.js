const CAL=[];const B=(s,...r)=>{CAL.push(s);return brush(s,...r);};
const PAIRS=[['讦','爱揭短','直','正直敢言'],['厉','太严苛','刚','刚强有担当'],['懦','太软弱','和','温和能容人'],['拘','太拘谨','介','有原则守底线']];
const LONGS=PAIRS.map(p=>p[2]).join('')+PAIRS.map(p=>p[0]).join('');
// bamboo slip with two faces; f in [0,1] flip progress
function slip(x,y,w,h,f,front,back,a){if(a<=0)return;const c=Math.cos(f*Math.PI),showBack=c<0;ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);ctx.scale(Math.max(.03,Math.abs(c)),1);
  const g=ctx.createLinearGradient(-w/2,0,w/2,0);
  if(showBack){g.addColorStop(0,'#8a6a32');g.addColorStop(.5,'#e9cf8e');g.addColorStop(1,'#8a6a32');ctx.shadowColor='#f0b850';ctx.shadowBlur=30;}
  else{g.addColorStop(0,'#5d4a2c');g.addColorStop(.5,'#a8915f');g.addColorStop(1,'#5d4a2c');}
  ctx.fillStyle=g;ctx.beginPath();ctx.roundRect(-w/2,-h/2,w,h,14);ctx.fill();ctx.shadowBlur=0;
  ctx.strokeStyle='rgba(40,25,10,.55)';ctx.lineWidth=5;[-h*.36,h*.36].forEach(v=>{ctx.beginPath();ctx.moveTo(-w/2,v);ctx.lineTo(w/2,v);ctx.stroke();});
  const [ch,lab]=showBack?back:front;
  ctx.font=`400 ${w*.72}px ${BRUSH}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=showBack?VERM:'#20160c';ctx.fillText(ch,0,-h*.08);
  ctx.font=`700 ${w*.14}px ${SERIF}`;ctx.fillStyle=showBack?'#3a220c':'#2a1e10';ctx.fillText(lab,0,h*.25);ctx.restore();}
function arrow(x1,y,x2,a,{dash=false,col='#e6bd62'}={}){if(a<=0)return;ctx.save();ctx.globalAlpha=a;ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=4;if(dash)ctx.setLineDash([14,10]);
  ctx.beginPath();ctx.moveTo(x1,y);ctx.lineTo(x2-18,y);ctx.stroke();ctx.setLineDash([]);ctx.beginPath();ctx.moveTo(x2,y);ctx.lineTo(x2-24,y-12);ctx.lineTo(x2-24,y+12);ctx.closePath();ctx.fill();ctx.restore();}
function mirror(x,y,r,a,t){if(a<=0)return;ctx.save();ctx.globalAlpha=a;ctx.shadowColor='#f0b850';ctx.shadowBlur=40;
  const rim=ctx.createLinearGradient(x-r,y-r,x+r,y+r);rim.addColorStop(0,'#f3d58c');rim.addColorStop(.5,'#8b6328');rim.addColorStop(1,'#e6bd62');ctx.fillStyle=rim;ctx.beginPath();ctx.arc(x,y,r,0,6.283);ctx.fill();ctx.shadowBlur=0;
  const f=ctx.createRadialGradient(x-r*.3,y-r*.35,10,x,y,r*.9);f.addColorStop(0,'#5a5040');f.addColorStop(.6,'#221d15');f.addColorStop(1,'#120f0a');ctx.fillStyle=f;ctx.beginPath();ctx.arc(x,y,r*.88,0,6.283);ctx.fill();
  ctx.strokeStyle='rgba(230,190,110,.35)';ctx.lineWidth=2;[.8,.83].forEach(k=>{ctx.beginPath();ctx.arc(x,y,r*k,0,6.283);ctx.stroke();});
  const sx=x-r+((t*.25)%1)*r*2.4;const sh=ctx.createLinearGradient(sx-80,y-r,sx+80,y+r);sh.addColorStop(0,'rgba(255,240,200,0)');sh.addColorStop(.5,'rgba(255,240,200,.12)');sh.addColorStop(1,'rgba(255,240,200,0)');
  ctx.beginPath();ctx.arc(x,y,r*.88,0,6.283);ctx.clip();ctx.fillStyle=sh;ctx.fillRect(x-r,y-r,r*2,r*2);ctx.restore();}

function s1(t){ // bars 1-3
  const a=1-seg(t,bar(4)-.3,bar(4)+.1);if(a<=0)return;
  text('你最受不了别人的哪个缺点？',W/2,280,58,{a});
  [['说话太冲',520,430],['太较真',840,470],['太好说话',1120,430],['太死板',1420,470]].forEach(([s,x,y],i)=>text(s,x,y,40,{a:a*seg(t,.3+i*.15,.6+i*.15)*.8,weight:500,color:'#cfc3a8'}));
  inkBurst(t,1.1,W/2,680,360);
  pop(t,1.1,W/2,680,k=>B('那可能，正是他的长处',W/2,680,130,{a:a*seg(t,1.05,1.2),gold:true,glow:36}),.3);
  text('近 1800 年前，就有人写下了这个道理',W/2,880,38,{a:a*seg(t,2.2,2.6),weight:500,color:'#d9cdb3'});
}
function s2(t){ // bars 4-8 scroll + eight seals
  const a=Math.min(seg(t,bar(4)-.1,bar(4)+.3),1-seg(t,bar(9)-.25,bar(9)));if(a<=0)return;
  const r=scroll(W/2,548,1560,720,seg(t,bar(4),bar(4)+1.6),a);
  clipTo(r,()=>{
    B('人物志',W/2,300,120,{a:a*seg(t,bar(4)+1,bar(4)+1.5),color:INK});
    text('三国 · 曹魏　刘劭 著',W/2,395,38,{a:a*seg(t,bar(4)+1.3,bar(4)+1.7),color:'#5a3a1c'});
    text('一部专讲「怎么看人」的书',W/2,455,34,{a:a*seg(t,bar(5),bar(5)+.4),weight:500,color:'#3a2a18'});
    text('其中一篇叫「八观」：看人的八个角度',W/2,535,34,{a:a*seg(t,bar(5)+.7,bar(5)+1.1),weight:500,color:'#3a2a18'});
    GUANS.forEach((g,i)=>{const t0=bar(6)+i*.22,lit=i===6?1:1-.7*seg(t,bar(7),bar(7)+.4);seal(W/2-3.5*150+i*150,650,100,g,a,seg(t,t0,t0+.25),{lit});});
    goldRing(t,bar(7),W/2+3*150,650,160);
    B('第七观 · 观其所短，以知所长',W/2,790,72,{a:a*seg(t,bar(7)+.3,bar(7)+.8),color:INK});
    text('看一个人的短处，就能知道他的长处',W/2,862,32,{a:a*seg(t,bar(8),bar(8)+.4),weight:500,color:'#7a2a1a'});
  });
}
function s3(t){ // bars 9-14 slips flip
  const a=Math.min(seg(t,bar(9),bar(9)+.08),1-seg(t,bar(15)-.15,bar(15)+.1));if(a<=0)return;
  inkBurst(t,bar(9),W/2,230,420,'rgba(160,110,40,.13)');
  pop(t,bar(9),W/2,215,k=>B('夫偏材之人，皆有所短',W/2,215,96,{a,gold:true,glow:30}),.3);
  text('偏材：某一方面特别突出的人。这样的人，都有短处',W/2,300,32,{a:a*seg(t,bar(9)+.6,bar(9)+1),weight:500,color:'#d9cdb3'});
  PAIRS.forEach(([s,sl,l,ll],i)=>{const x=W/2-1.5*320+i*320,m=eOut(seg(t,bar(10)+i*.22,bar(10)+i*.22+.4)),ft=bar(11)+.6+i*.55;
    slip(x,620-(1-m)*40,210,470,eInOut(seg(t,ft,ft+.5)),[s,sl],[l,ll],a*m);goldRing(t,ft+.35,x,620,240);});
  text('把这些缺点翻过来看看——',W/2,925,40,{a:a*seg(t,bar(10)+1.2,bar(10)+1.6)*(1-seg(t,bar(13)+.6,bar(13)+1)),weight:500});
  pop(t,bar(14),W/2,925,k=>B('直之失也讦，刚之失也厉，和之失也懦，介之失也拘',W/2,925,54,{a:a*seg(t,bar(14)-.05,bar(14)+.1),gold:true,glow:18}),.2);
}
function s4(t){ // bars 15-18
  const a=Math.min(seg(t,bar(15)-.1,bar(15)+.3),1-seg(t,bar(19)-.2,bar(19)+.1));if(a<=0)return;
  B('夫直者不讦，无以成其直',W/2,230,84,{a,gold:true,glow:20});
  text('一个直的人，如果从不说难听话，也就算不上「直」',W/2,315,36,{a:a*seg(t,bar(15)+.6,bar(15)+1),weight:500,color:'#d9cdb3'});
  B('既悦其直，不可非其讦',W/2,470,84,{a:a*seg(t,bar(16),bar(16)+.4),gold:true,glow:20});
  text('你喜欢他的直，就不能怪他说话冲',W/2,555,36,{a:a*seg(t,bar(16)+.6,bar(16)+1),weight:500,color:'#d9cdb3'});
  text('刚与厉、和与懦、介与拘，都是同一个道理',W/2,650,34,{a:a*seg(t,bar(17)+.2,bar(17)+.6),weight:500,color:'#cfc3a8'});
  inkBurst(t,bar(18),W/2,820,380,'rgba(160,110,40,.13)');
  pop(t,bar(18),W/2,820,k=>B('缺点，是长处的影子',W/2,820,130,{a:a*seg(t,bar(18)-.05,bar(18)+.1),gold:true,glow:40}),.3);
  text('原文：讦也者，直之征也　（征：迹象）',W/2,950,30,{a:a*seg(t,bar(18)+.6,bar(18)+1),weight:500,color:'#a99c80'});
}
function s5(t){ // bars 19-22 office
  const a=Math.min(seg(t,bar(19)-.1,bar(19)+.3),1-seg(t,bar(23)-.2,bar(23)+.1));if(a<=0)return;
  text('放到今天的办公室',W/2,200,56,{a});
  [['开会总当面挑毛病的同事','直','眼里揉不得沙子'],['要求严到让人窒息的领导','刚','扛得住事、拍得了板'],['谁都不得罪、不会拒绝的人','和','团队里的润滑剂'],['差一张票都不给报销的财务','介','守得住底线']].forEach(([l,c,r],i)=>{
    const t0=bar(19)+.5+i*.7,m=eOut(seg(t,t0,t0+.4));if(m<=0)return;const y=330+i*125;
    text(l,880-(1-m)*30,y,40,{a:a*m,align:'right',weight:500});arrow(910,y,1030,a*seg(t,t0+.2,t0+.5));
    seal(1090,y,74,c,a,seg(t,t0+.35,t0+.6));text(r,1150,y,40,{a:a*seg(t,t0+.4,t0+.7),align:'left',color:'#f1d99a'});});
  inkBurst(t,bar(22),W/2,900,380,'rgba(160,110,40,.12)');
  pop(t,bar(22),W/2,900,k=>B('先别急着讨厌，顺着缺点找长处',W/2,900,84,{a:a*seg(t,bar(22)-.05,bar(22)+.1),gold:true,glow:30}),.3);
}
function s6(t){ // bars 23-30 the twist
  const a=Math.min(seg(t,bar(23)-.1,bar(23)+.3),1-seg(t,bar(31)-.2,bar(31)+.1));if(a<=0)return;
  pop(t,bar(23),W/2,220,k=>B('然有短者，未必能长也',W/2,220,80,{a,gold:true,glow:20}),.25);
  B('有长者必以短为征',W/2,330,80,{a:a*seg(t,bar(24),bar(24)+.4),gold:true,glow:20});
  text('但书里马上补了一句：反过来，可不成立',W/2,420,34,{a:a*seg(t,bar(24)+.7,bar(25)),weight:500,color:'#d9cdb3'});
  const m1=seg(t,bar(25)+.4,bar(25)+.8),m2=seg(t,bar(26)+.4,bar(26)+.8);
  [[560,m1,'长','短','一定伴随',false,'✓'],[700,m2,'短','长','不一定有',true,'✗']].forEach(([y,m,c1,c2,lab,dash,mk])=>{if(m<=0)return;
    text(c1==='长'?'有长处的人':'有短处的人',560,y,38,{a:a*m,align:'right',weight:500});seal(640,y,84,c1,a,m);
    arrow(700,y,1150,a*m,{dash,col:dash?'#8cc8ff':'#e6bd62'});text(lab,925,y-34,30,{a:a*m,weight:500,color:dash?'#cfe6ff':'#f1d99a'});
    seal(1220,y,84,c2,a,m);text(mk,1320,y,64,{a:a*m,color:dash?'#ff8a7a':'#9be39b',align:'left'});});
  pop(t,bar(27),W/2,850,k=>text('爱怼人的，可能是直，也可能只是刻薄',W/2,850,56,{a:a*seg(t,bar(27)-.05,bar(27)+.1),gold:true,glow:20}),.2);
  text('所以，缺点只是「线索」，不是「证明」',W/2,950,42,{a:a*seg(t,bar(28)+.6,bar(29)),weight:500});
}
function s7(t){ // bars 31-36 how to use
  const a=Math.min(seg(t,bar(31)-.1,bar(31)+.3),1-seg(t,bar(37)-.25,bar(37)+.1));if(a<=0)return;
  text('那怎么用它看人？',W/2,200,58,{a});
  [['一','先看他最扎眼的缺点','说话冲？太严？太软？太死板？'],['二','问：这是哪种长处「用力过猛」？','冲→直　严→刚　软→和　死板→介'],['三','再看他身上，有没有那项长处','有，就用他的长；没有，就只是缺点']].forEach(([n,h,d],i)=>{
    const t0=bar(32+i),m=eOut(seg(t,t0,t0+.5));if(m<=0)return;const x=W/2+(i-1)*560,y=300+(1-m)*30;
    ctx.save();ctx.globalAlpha=a*m;ctx.fillStyle='rgba(239,230,210,.05)';ctx.strokeStyle='rgba(230,190,110,.45)';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x-255,y,510,360,22);ctx.fill();ctx.stroke();ctx.restore();
    seal(x,y+80,90,n,a*m,seg(t,t0+.1,t0+.4));text(h,x,y+190,34,{a:a*m,gold:true});text(d,x,y+270,27,{a:a*m,weight:500,color:'#d9cdb3'});});
  inkBurst(t,bar(35),W/2,820,380,'rgba(160,110,40,.12)');
  pop(t,bar(35),W/2,820,k=>B('用他的长，就要容他的短',W/2,820,100,{a:a*seg(t,bar(35)-.05,bar(35)+.1),gold:true,glow:34}),.3);
  text('这就是「既悦其直，不可非其讦」',W/2,940,36,{a:a*seg(t,bar(36),bar(36)+.4),weight:500,color:'#d9cdb3'});
}
function s8(t){ // bars 37-44 mirror
  const a=Math.min(seg(t,bar(37)-.1,bar(37)+.5),1-seg(t,bar(45)-.2,bar(45)+.05));if(a<=0)return;
  B('但是……',W/2,540,140,{a:a*span(t,bar(37),bar(39)),gold:true,glow:20});
  const mm=span(t,bar(39),bar(43)+.4);
  mirror(W/2,450,250,a*mm*eOut(seg(t,bar(39),bar(39)+.8)),t);
  [['说话太冲',W/2-80,370],['太犟',W/2+110,440],['太好说话',W/2-60,520],['太死板',W/2+70,590]].forEach(([s,x,y],i)=>text(s,x,y,40,{a:a*mm*seg(t,bar(41)+i*.6,bar(41)+i*.6+.4)*.85,weight:500,color:'#efe2c4'}));
  text('如果把这面镜子，转向你自己呢？',W/2,800,50,{a:a*mm*seg(t,bar(39)+.6,bar(40))*(1-seg(t,bar(40)+1.6,bar(40)+2))});
  text('别人说你最多的缺点，是什么？',W/2,800,50,{a:a*mm*seg(t,bar(41),bar(41)+.4),color:'#f1d99a'});
  B('它可能——',W/2,540,100,{a:a*seg(t,bar(43)+.6,bar(43)+1),gold:true,glow:20});
}
function s9(t){ // bars 45-52
  const a=Math.min(seg(t,bar(45),bar(45)+.12),1-seg(t,END-.7,END));if(a<=0)return;
  const top=span(t,bar(45),bar(48)+.4);
  inkBurst(t,bar(45),W/2,280,460,'rgba(160,110,40,.15)');
  pop(t,bar(45),W/2,280,k=>B('就是你长处的影子',W/2,280,140,{a:a*top,gold:true,glow:46}),.35);
  [['说话太冲','直','你正直'],['脾气太硬','刚','你刚强'],['太好说话','和','你温和'],['太死板','介','你有原则']].forEach(([s,c,l],i)=>{const t0=bar(45)+.9+i*.55,m=seg(t,t0,t0+.35),x=W/2+(i-1.5)*340;
    text(s,x,500,36,{a:a*top*m,weight:500,color:'#cfc3a8'});text('↓',x,555,32,{a:a*top*m,color:'#c9a45c'});seal(x,640,100,c,a*top,m);text(l,x,745,36,{a:a*top*seg(t,t0+.25,t0+.6),gold:true});});
  const e=seg(t,bar(48)+.6,bar(49));
  B('别急着磨平你的短，',W/2,320,84,{a:a*e,color:'#efe6d2'});
  B('先看清它指向的长。',W/2,460,110,{a:a*seg(t,bar(49),bar(49)+.6),gold:true,glow:40});
  text('你被说得最多的缺点，指向你的哪项长处？',W/2,640,46,{a:a*seg(t,bar(50),bar(50)+.5),gold:true,glow:16});
  const n=seg(t,bar(51),bar(51)+.5);seal(W/2-330,800,70,'感变',a,n);text('下一观｜观其感变：话在笑，脸没笑',W/2+40,800,36,{a:a*n,weight:500,color:'#d9cdb3'});
}

window.draw=function(t){
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.filter='none';
  background(t);drawDust(t);
  s1(t);s2(t);s3(t);s4(t);s5(t);s6(t);s7(t);s8(t);s9(t);topBar(t,7,'人物志 · 八观 ｜ 第七观：观其所短，以知所长');
  finish(t);
  const fo=seg(t,END-.6,END);if(fo>0){ctx.fillStyle=`rgba(0,0,0,${fo})`;ctx.fillRect(0,0,W,H);}
};
window.ready=(async()=>{await document.fonts.load(`700 80px ${SERIF}`);await document.fonts.load(`500 80px ${SERIF}`);
  const all=ALLTEXT;
  await document.fonts.load(`400 80px "Ma Shan Zheng"`,all);await document.fonts.ready;window.draw(0);return true;})();
</script></body></html>
