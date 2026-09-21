(() => {
  'use strict';
  const $=id=>document.getElementById(id), config=JSON.parse($('giftConfig').textContent);
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const types=['Girasol','Rosa amarilla','Tulipán','Rosa de jardín','Girasol','Tulipán','Rosa amarilla','Margarita'];
  const icons=['✺','❀','♧','❀','✺','♧','❀','✿'];
  let opened=false,selected=-1,sceneReady=false,sceneActive=false,model=null,raf=0;
  const found=new Set();
  document.title=config.name?'Flores para '+config.name:'Un jardín solo para ti';
  $('welcomeName').textContent=config.name?`Para ${config.name}, con todo mi cariño.`:'Y lleva tu nombre.';
  $('envelopeTo').textContent=config.name?`Para ${config.name}`:'Para ti, con cariño';
  $('gardenFor').textContent=config.name?`ESTE JARDÍN ES PARA TI, ${config.name}`:'UN JARDÍN SOLO PARA TI';
  $('cardSignature').textContent=config.from;
  types.forEach((name,i)=>{const b=document.createElement('button');b.className='flower-choice';b.textContent=i+1;b.setAttribute('aria-label',`Abrir flor ${i+1}: ${name}`);b.setAttribute('aria-pressed','false');b.dataset.index=i;b.title=`${name} · ${config.notes[i].title}`;b.addEventListener('click',()=>selectFlower(i,true));$('flowerPicker').append(b);});
  function letter(){selected=-1;if(model)model.selected=-1;$('cardCategory').textContent='UNAS PALABRAS SOLO PARA TI';$('cardTitle').textContent=config.name?`Para ti, ${config.name}.`:'Qué bonito que existas.';$('cardMessage').textContent=config.message;$('cardSignature').textContent=config.from;$('cardFoot').textContent='Un ramo que no se marchita.';$('cardIcon').textContent='✿';$('readLetter').hidden=true;document.querySelectorAll('.flower-choice').forEach(b=>{b.classList.remove('selected');b.setAttribute('aria-pressed','false');});}
  function animateCard(){const card=$('messageCard');card.classList.remove('changing');void card.offsetWidth;card.classList.add('changing');}
  function selectFlower(i,scroll=false){
    selected=i;found.add(i);if(model){model.selected=i;model.needsRender=true;}
    const n=config.notes[i];$('cardCategory').textContent=`FLOR ${String(i+1).padStart(2,'0')} · ${types[i].toUpperCase()}`;$('cardTitle').textContent=n.title;$('cardMessage').textContent=n.message;$('cardSignature').textContent=config.from;$('cardFoot').textContent=`${found.size} de 8 flores abiertas con cariño`;$('cardIcon').textContent=icons[i];$('readLetter').hidden=false;
    document.querySelectorAll('.flower-choice').forEach((b,j)=>{b.classList.toggle('selected',j===i);b.classList.toggle('found',found.has(j));b.setAttribute('aria-pressed',String(j===i));});
    $('progressText').textContent=found.size===8?'Ocho flores abiertas. Todo este cariño es tuyo.':`${found.size} de 8 secretos descubiertos. Sigue floreciendo.`;
    if(found.size===8&&!$('completion').hidden){}else if(found.size===8){$('completion').hidden=false;petals(24);}
    animateCard();
    if(scroll&&matchMedia('(max-width:760px)').matches)$('messageCard').scrollIntoView({behavior:reduce.matches?'instant':'smooth',block:'center'});
    $('cardTitle').focus({preventScroll:true});
  }
  function petals(count=30){if(reduce.matches)return;$('petals').replaceChildren();for(let i=0;i<count;i++){const p=document.createElement('i');p.className='falling-petal';p.style.cssText=`--x:${Math.random()*100}%;--s:${5+Math.random()*8}px;--color:${['#f0cc61','#e6bd4b','#f7df98'][i%3]};--delay:${Math.random()*1.3}s;--t:${4+Math.random()*3}s;--dx:${Math.random()*180-90}px`;p.addEventListener('animationend',()=>p.remove(),{once:true});$('petals').append(p);}}
  $('openEnvelope').addEventListener('click',()=>{if(opened)return;opened=true;$('envelopeScene').classList.add('is-open');$('openEnvelope').disabled=true;$('envelopeInstruction').hidden=true;setTimeout(()=>{$('revealGarden').hidden=false;$('revealGarden').focus({preventScroll:true});},reduce.matches?10:1100);});
  $('revealGarden').addEventListener('click',()=>{$('welcome').classList.add('leaving');setTimeout(()=>{$('welcome').hidden=true;$('garden').hidden=false;sceneActive=true;if(!sceneReady){sceneReady=true;createScene();}else if(model){model.resize();startRendering();}window.scrollTo({top:0,behavior:'instant'});petals();$('cardTitle').focus({preventScroll:true});},reduce.matches?0:550);});
  $('readLetter').addEventListener('click',()=>{letter();animateCard();$('cardTitle').focus({preventScroll:true});});
  $('replayGift').addEventListener('click',()=>{sceneActive=false;cancelAnimationFrame(raf);opened=false;found.clear();letter();$('completion').hidden=true;$('progressText').textContent='Cada flor es una pequeña sorpresa.';document.querySelectorAll('.flower-choice').forEach(b=>b.classList.remove('found'));$('garden').hidden=true;$('welcome').hidden=false;$('welcome').classList.remove('leaving');$('envelopeScene').classList.remove('is-open');$('openEnvelope').disabled=false;$('revealGarden').hidden=true;$('envelopeInstruction').hidden=false;window.scrollTo({top:0,behavior:'instant'});$('openEnvelope').focus({preventScroll:true});if(model){model.targetX=0;model.targetY=0;}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(raf);else if(sceneActive)startRendering();});
  letter();

  function createScene(){
    const T=window.THREE,canvas=$('bouquetCanvas');let renderer;
    try{if(!T)throw Error('3D no disponible');renderer=new T.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});}catch{canvas.hidden=true;$('sceneFallback').hidden=false;$('sceneHint').textContent='Abre las flores con sus números';['rotateLeft','rotateRight','resetView'].forEach(id=>$(id).hidden=true);return;}
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.6));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;
    const scene=new T.Scene(),camera=new T.PerspectiveCamera(35,1,.1,70);camera.position.set(0,.5,10.6);camera.lookAt(0,.25,0);
    scene.add(new T.HemisphereLight(0xfff9e4,0x6b7546,1.8));const key=new T.DirectionalLight(0xfff5db,3.1);key.position.set(-4,6,7);scene.add(key);const rim=new T.DirectionalLight(0xffffff,1.5);rim.position.set(4,3,-4);scene.add(rim);const fill=new T.DirectionalLight(0xfbe2a0,.65);fill.position.set(2,-2,5);scene.add(fill);
    const bouquet=new T.Group();scene.add(bouquet);
    const material=(color,roughness=.76)=>new T.MeshStandardMaterial({color,roughness,metalness:0,side:T.DoubleSide});
    const stemMat=material('#526943'),leafMats=['#829374','#687f59','#a0ad88','#4e6c41'].map(c=>material(c)),paperMat=material('#e5d6b5'),tissueMat=material('#f9efda'),ribbonMat=material('#7b8552',.52);
    const vector=(x,y,z)=>new T.Vector3(x,y,z);
    function surface(fn,nu=12,nv=14){const pos=[],uv=[],idx=[];for(let v=0;v<=nv;v++)for(let u=0;u<=nu;u++){pos.push(...fn(u/nu,v/nv));uv.push(u/nu,v/nv);}for(let v=0;v<nv;v++)for(let u=0;u<nu;u++){const a=v*(nu+1)+u,b=a+nu+1;idx.push(a,b,a+1,b,b+1,a+1);}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;}
    function tube(points,radius,mat,parent=bouquet,segments=24){const curve=new T.CatmullRomCurve3(points);const mesh=new T.Mesh(new T.TubeGeometry(curve,segments,radius,6,false),mat);parent.add(mesh);return mesh;}
    function mesh(geo,mat,parent){const m=new T.Mesh(geo,mat);parent.add(m);return m;}
    const leafGeo=surface((u,t)=>{const w=Math.pow(Math.sin(Math.PI*t),.8)*.28;return[(u*2-1)*w,t*.94,.18*Math.sin(t*Math.PI)+.12*(u*2-1)**2];},8,12);
    function addLeaf(pos,scale,rz,ry,color=0){const group=new T.Group();group.position.copy(pos);group.rotation.set(.25,ry,rz);group.scale.setScalar(scale);bouquet.add(group);mesh(leafGeo,leafMats[color%4],group);tube([vector(0,0,0),vector(0,.47,.18),vector(0,.9,.02)],.009,stemMat,group,9);}
    const flowers=[],hitTargets=[],heads=[
      {x:-1.05,y:1.18,z:.65,type:'sun',s:.83,tilt:-.16},
      {x:.92,y:.66,z:1.03,type:'rose',s:.92,tilt:.25},
      {x:-1.48,y:2.05,z:-.15,type:'tulip',s:.82,tilt:-.22},
      {x:-.23,y:.30,z:1.30,type:'rose',s:.9,tilt:-.06},
      {x:.33,y:2.03,z:.08,type:'sun',s:.89,tilt:.15},
      {x:1.52,y:1.69,z:-.21,type:'tulip',s:.86,tilt:.24},
      {x:-1.26,y:-.08,z:.87,type:'rose',s:.72,tilt:-.18},
      {x:.68,y:-.37,z:1.12,type:'daisy',s:.77,tilt:.19}
    ];
    const seedGeo=new T.SphereGeometry(.021,5,4),matrix=new T.Matrix4();
    function sunflower(parent,isDaisy,petalList){
      const count=isDaisy?13:17,len=isDaisy?.57:.64,base=isDaisy?.13:.28;
      const geo=surface((u,t)=>{let x=(u*2-1)*Math.sin(Math.PI*t)**.7*(isDaisy?.105:.135);return[x,t*len,.075*Math.sin(Math.PI*t)+.1*(u*2-1)**2-.09*t*t];});
      const mats=(isDaisy?['#fff0a6','#f9dc66']:['#edb826','#f6cb36','#ffda58']).map(c=>material(c));
      for(let layer=0;layer<2;layer++)for(let i=0;i<count;i++){const pivot=new T.Group(),a=i/count*Math.PI*2+layer*.14;pivot.position.set(-Math.sin(a)*base,Math.cos(a)*base,-layer*.055);pivot.rotation.z=a;parent.add(pivot);const m=mesh(geo,mats[(i+layer)%mats.length],pivot);m.scale.setScalar(layer?.88:1);petalList.push({node:m,base:.13+layer*.2,open:-.29-layer*.1});m.rotation.x=.13+layer*.2;}
      const center=mesh(new T.SphereGeometry(isDaisy?.16:.3,24,12),material(isDaisy?'#c49c35':'#6e5627'),parent);center.scale.z=.33;center.position.z=.065;
      const n=isDaisy?58:160,seeds=new T.InstancedMesh(seedGeo,material(isDaisy?'#e5be53':'#a4813c'),n);for(let j=0;j<n;j++){const angle=j*2.39996,r=(isDaisy?.14:.279)*Math.sqrt(j/n),z=.074+(isDaisy?.16:.3)*.33*Math.sqrt(Math.max(0,1-r*r/((isDaisy?.16:.3)**2)));matrix.makeTranslation(Math.cos(angle)*r,Math.sin(angle)*r,z);seeds.setMatrixAt(j,matrix);}parent.add(seeds);
    }
    function rose(parent,petalList){
      const colors=['#f9db72','#f4cc55','#ecc041','#e9b634','#ddb03b'];
      for(let layer=0;layer<5;layer++){
        const n=9-layer,len=.72-layer*.119,width=.34-layer*.046,base=.055+layer*.008;
        const geo=surface((u,t)=>{const w=Math.sin(Math.PI*t)**.55*width;return[(u*2-1)*w,base+t*len,.06+layer*.075+(.45-layer*.038)*Math.sin(t*Math.PI*.65)+.10*(u*2-1)**2*Math.sin(t*Math.PI)-.10*Math.max(0,t-.77)*4];},12,16);
        for(let i=0;i<n;i++){const p=new T.Group();p.rotation.z=i/n*Math.PI*2+layer*.55;parent.add(p);const m=mesh(geo,material(colors[layer]),p);m.rotation.x=.08;petalList.push({node:m,base:.08,open:-.20+layer*.035});}
      }
      const curl=[];for(let j=0;j<=60;j++){const t=j/60,a=t*Math.PI*5;curl.push(vector(Math.cos(a)*(.012+t*.13),Math.sin(a)*(.012+t*.13),.56-t*.12));}tube(curl,.034,material('#e8b739'),parent,64);
      const calyx=mesh(new T.SphereGeometry(.23,12,8),leafMats[1],parent);calyx.scale.set(1,1,.5);calyx.position.z=-.06;
    }
    function tulip(parent,petalList){
      const geo=surface((u,t)=>{const a=(u*2-1)*.67,r=.035+Math.sin(t*Math.PI*.59)*.36;return[Math.sin(a)*r,Math.cos(a)*r,t*.84+.08*Math.sin(u*Math.PI)*t];},12,16);
      for(let i=0;i<6;i++){const p=new T.Group();p.rotation.z=i*Math.PI/3;parent.add(p);const m=mesh(geo,material(i%2?'#f7d66b':'#edc44a'),p);m.rotation.x=.10;petalList.push({node:m,base:.1,open:-.66});}
      const center=mesh(new T.SphereGeometry(.09,10,6),material('#b99a42'),parent);center.position.z=.3;
    }
    heads.forEach((h,i)=>{
      const pos=vector(h.x,h.y,h.z);tube([vector((i-4)*.022,-2.4,-.02),vector(h.x*.45,-.3,h.z*.3),pos],.022+(i%2)*.004,stemMat);
      const stalk=vector(h.x*.6,-.32+h.y*.28,h.z*.55);addLeaf(stalk,.66+(i%3)*.12,i%2?-.9:.9,h.x*.25,i);
      const head=new T.Group();head.position.copy(pos);head.rotation.set(h.type==='tulip'?-.57:-.10,h.tilt,h.tilt*.4);head.scale.setScalar(h.s);bouquet.add(head);const petals=[];
      if(h.type==='rose')rose(head,petals);else if(h.type==='tulip')tulip(head,petals);else sunflower(head,h.type==='daisy',petals);
      head.traverse(o=>{if(o.isMesh){o.userData.flower=i;hitTargets.push(o);}});flowers.push({head,petals,s:h.s,z:h.z,progress:0});
    });
    // Eucalyptus branches: staggered, cupped leaves around slender curved stems.
    for(let k=0;k<7;k++){const side=k%2?-1:1,xx=side*(1.15+(k%3)*.29),yy=.95+(k%4)*.45,zz=-.5-(k%2)*.23;const end=vector(xx,yy,zz);tube([vector(0,-1.5,-.3),vector(xx*.7,.2,zz),end],.013,stemMat);for(let j=0;j<5;j++){const t=.36+j*.13;const p=vector(xx*t,-1.2+(yy+1.2)*t,zz);addLeaf(p,.46+(j%2)*.15,(j%2?-1:1)*.95+side*.2,side*.7,k+j);}}
    // Small ivory-yellow accent blooms.
    const smallGeo=new T.SphereGeometry(.038,7,5),smallMat=material('#f6e9b6');
    for(let b=0;b<4;b++){const sx=b%2?-1:1,x=sx*(1.65-(b%2)*.1),y=b<2?.53:1.23;const p=vector(x,y,-.05);tube([vector(sx*.4,-.8,-.4),p],.008,stemMat);for(let j=0;j<8;j++){const a=j*2.4,tip=vector(x+Math.sin(a)*.19,y+j*.05,Math.cos(a)*.17);tube([p,tip],.004,stemMat,bouquet,3);for(let n=0;n<4;n++){const m=mesh(smallGeo,smallMat,bouquet);m.position.copy(tip).add(vector(Math.sin(n*Math.PI/2)*.038,Math.cos(n*Math.PI/2)*.038,0));}}}
    function paper(layer){return surface((u,t)=>{const a=u*Math.PI*2,front=Math.max(0,Math.sin(a)),radius=.14+t*(layer?1.25:1.35),ruffle=Math.sin(a*9)*.037*t*t,top=(layer?.03:-.17)-front*.47+.13*Math.cos(a*3);return[(radius+ruffle)*Math.cos(a),-2.64+t*(2.64+top),(radius+ruffle)*Math.sin(a)*.55-.19];},72,15);}
    mesh(paper(0),paperMat,bouquet);const tissue=mesh(paper(1),tissueMat,bouquet);tissue.position.set(0,.11,-.08);tissue.rotation.y=.17;
    // Real ribbon surfaces follow curved loops, with two loose ends.
    function ribbon(points,width){const curve=new T.CatmullRomCurve3(points);const g=surface((u,t)=>{const p=curve.getPoint(t),tan=curve.getTangent(t),side=vector(-tan.y,tan.x,.15*Math.sin(t*Math.PI)).normalize().multiplyScalar((u-.5)*width);return p.add(side).toArray();},4,36);return mesh(g,ribbonMat,bouquet);}
    ribbon([vector(-.58,-1.73,.10),vector(0,-1.78,.31),vector(.58,-1.73,.10)],.14);
    ribbon([vector(0,-1.76,.36),vector(-.65,-1.43,.39),vector(-.73,-1.74,.48),vector(-.18,-1.85,.49),vector(0,-1.76,.4)],.17);
    ribbon([vector(0,-1.76,.4),vector(.53,-1.4,.33),vector(.69,-1.65,.44),vector(.29,-1.84,.54),vector(0,-1.76,.4)],.17);
    ribbon([vector(0,-1.77,.44),vector(-.18,-2.04,.49),vector(-.46,-2.39,.58)],.18);ribbon([vector(.04,-1.78,.44),vector(.27,-2.03,.4),vector(.55,-2.2,.37)],.19);
    const knot=mesh(new T.SphereGeometry(.11,16,10),ribbonMat,bouquet);knot.position.set(0,-1.77,.45);knot.scale.set(1,.7,.7);
    const labelCanvas=document.createElement('canvas');labelCanvas.width=256;labelCanvas.height=160;const ctx=labelCanvas.getContext('2d');ctx.fillStyle='#fff9e9';ctx.fillRect(0,0,256,160);ctx.fillStyle='#8b906a';ctx.textAlign='center';ctx.font='italic 29px Georgia';ctx.fillText('para ti',128,82);ctx.font='24px Georgia';ctx.fillText('♡',128,120);const labelTex=new T.CanvasTexture(labelCanvas);labelTex.colorSpace=T.SRGBColorSpace;const tag=mesh(new T.PlaneGeometry(.43,.27),new T.MeshStandardMaterial({map:labelTex,roughness:1,side:T.DoubleSide}),bouquet);tag.position.set(.26,-2.05,.53);tag.rotation.z=-.19;tube([vector(.03,-1.78,.53),vector(.15,-1.88,.61),vector(.23,-1.96,.54)],.007,material('#bda975'),bouquet,12);
    const shadeCanvas=document.createElement('canvas');shadeCanvas.width=128;shadeCanvas.height=128;const sc=shadeCanvas.getContext('2d'),gradient=sc.createRadialGradient(64,64,0,64,64,62);gradient.addColorStop(0,'rgba(88,76,41,.22)');gradient.addColorStop(1,'rgba(88,76,41,0)');sc.fillStyle=gradient;sc.fillRect(0,0,128,128);const shadow=mesh(new T.PlaneGeometry(4,1.1),new T.MeshBasicMaterial({map:new T.CanvasTexture(shadeCanvas),transparent:true,depthWrite:false}),scene);shadow.position.set(0,-2.8,-.3);shadow.rotation.x=-.55;
    model={renderer,scene,camera,bouquet,flowers,selected:-1,targetY:0,targetX:0,needsRender:true,last:0,drag:null};
    model.resize=()=>{const r=$('scene').getBoundingClientRect();if(!r.width||!r.height)return;renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.position.z=camera.aspect<.72?12.8:10.6;camera.updateProjectionMatrix();model.needsRender=true;};new ResizeObserver(model.resize).observe($('scene'));model.resize();
    const raycaster=new T.Raycaster(),pointer=new T.Vector2();
    function hit(e){const r=canvas.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(pointer,camera);return raycaster.intersectObjects(hitTargets,false)[0];}
    canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;model.drag={x:e.clientX,y:e.clientY,yaw:model.targetY,pitch:model.targetX,moved:false};canvas.setPointerCapture(e.pointerId);});
    canvas.addEventListener('pointermove',e=>{if(model.drag){const d=model.drag,dx=e.clientX-d.x,dy=e.clientY-d.y;if(Math.hypot(dx,dy)>7)d.moved=true;model.targetY=T.MathUtils.clamp(d.yaw+dx*.006,-.95,.95);if(e.pointerType!=='touch')model.targetX=T.MathUtils.clamp(d.pitch+dy*.003,-.28,.28);model.needsRender=true;}else{canvas.style.cursor=hit(e)?'pointer':'grab';}});
    canvas.addEventListener('pointerup',e=>{if(!model.drag)return;const moved=model.drag.moved;model.drag=null;if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);if(!moved){const foundHit=hit(e);if(foundHit)selectFlower(foundHit.object.userData.flower,true);}});
    canvas.addEventListener('pointercancel',()=>{model.drag=null;});
    const rotate=amount=>{model.targetY=T.MathUtils.clamp(model.targetY+amount,-.95,.95);model.needsRender=true;};
    $('rotateLeft').addEventListener('click',()=>rotate(-.24));$('rotateRight').addEventListener('click',()=>rotate(.24));$('resetView').addEventListener('click',()=>{model.targetY=0;model.targetX=0;model.needsRender=true;});
    canvas.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Enter',' '].includes(e.key))e.preventDefault();if(e.key==='ArrowLeft')rotate(-.2);if(e.key==='ArrowRight')rotate(.2);if(e.key==='ArrowUp')model.targetX=Math.max(-.28,model.targetX-.08);if(e.key==='ArrowDown')model.targetX=Math.min(.28,model.targetX+.08);if(e.key==='Enter'||e.key===' ')selectFlower((selected+1)%8,true);});
    canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(raf);canvas.hidden=true;$('sceneFallback').hidden=false;$('sceneHint').textContent='Tus mensajes siguen aquí';});
    startRendering();
  }
  function startRendering(){cancelAnimationFrame(raf);if(!model)return;const frame=now=>{if(!sceneActive||document.hidden)return;raf=requestAnimationFrame(frame);if(now-model.last<32||document.querySelector('dialog[open]'))return;model.last=now;const m=model,lerp=reduce.matches?1:.10;m.bouquet.rotation.y+=(m.targetY-m.bouquet.rotation.y)*lerp;m.bouquet.rotation.x+=(m.targetX-m.bouquet.rotation.x)*lerp;m.bouquet.position.y=reduce.matches?0:Math.sin(now*.00065)*.025;m.flowers.forEach((f,i)=>{const target=i===m.selected?1:0;f.progress+=(target-f.progress)*(reduce.matches?1:.075);const p=f.progress;f.head.scale.setScalar(f.s*(1+p*.12));f.head.position.z=f.z+p*.18;f.petals.forEach(petal=>{petal.node.rotation.x=petal.base+(petal.open-petal.base)*p;});});m.renderer.render(m.scene,m.camera);};raf=requestAnimationFrame(frame);}
})();
