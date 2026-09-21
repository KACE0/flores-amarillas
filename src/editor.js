(() => {
  'use strict';
  const initial=JSON.parse(document.getElementById('giftConfig').textContent),template=JSON.parse(document.getElementById('giftTemplate').textContent);
  const $=id=>document.getElementById(id);
  let current=structuredClone(initial),objectURL='';
  try{const saved=JSON.parse(localStorage.getItem('florecer-workshop-v2'));if(saved&&Array.isArray(saved.notes)&&saved.notes.length===8)current=saved;}catch{}
  const host=document.createElement('div');host.dataset.editor='true';host.innerHTML=`
    <button id="openWorkshop" class="workshop-button"><span>✎</span> Crear mi regalo</button>
    <dialog id="workshop" class="workshop" aria-labelledby="workshopTitle">
      <div class="workshop-top"><p class="eyebrow">FLORECER · TALLER DE REGALOS</p><button id="closeWorkshop" aria-label="Cerrar editor">×</button><h2 id="workshopTitle">Un regalo que<br><em>solo tú puedes dar.</em></h2><p>Escribe lo que sientes. El archivo que envíes contendrá únicamente la experiencia del regalo.</p></div>
      <form id="giftForm">
        <div class="editor-row"><label>¿Para quién florece?<input name="recipient" id="editName" placeholder="Ej. Valentina" maxlength="50"></label><label>Tu firma<input name="sender" id="editFrom" placeholder="Con cariño, Daniel" maxlength="80"></label></div>
        <label>La dedicatoria principal<textarea id="editMessage" rows="5" maxlength="1800"></textarea></label>
        <div class="note-heading"><h3>Ocho flores, ocho secretos.</h3><p>Abre cada flor para escribir su mensaje.</p></div>
        <div id="noteFields"></div>
        <p class="editor-tip">El ramo tiene dos girasoles, tres rosas amarillas, dos tulipanes y una margarita. Todo queda dentro de un solo HTML y funciona sin internet.</p>
        <div class="editor-actions"><button type="button" id="previewGift" class="secondary-button">Vista previa ↗</button><button type="submit" class="primary">Generar regalo <span>↓</span></button></div>
        <div class="download-result" id="downloadResult" hidden><span>Tu regalo está listo.</span><a id="giftDownload" class="primary" download="regalo.html">Descargar HTML del regalo ↓</a><p>Este es el archivo para enviar. También puedes publicarlo como index.html en GitHub Pages.</p></div>
        <p id="editorStatus" class="editor-status" role="status"></p>
      </form>
    </dialog>
    <dialog id="previewDialog" class="preview-dialog" aria-label="Vista previa exacta del regalo"><div class="preview-bar"><span>ASÍ LO RECIBIRÁ ESA PERSONA</span><button id="closePreview" aria-label="Cerrar vista previa">Volver al editor ×</button></div><iframe id="giftPreview" title="Tu regalo personalizado" sandbox="allow-scripts"></iframe></dialog>`;
  document.body.append(host);
  const types=['Girasol','Rosa amarilla','Tulipán','Rosa de jardín','Girasol','Tulipán','Rosa amarilla','Margarita'];
  types.forEach((type,i)=>{const details=document.createElement('details');details.className='note-field';details.innerHTML=`<summary><span>${String(i+1).padStart(2,'0')}</span> ${type}<i>+</i></summary><div><label>El título<input id="noteTitle${i}" maxlength="80" required></label><label>Lo que guarda esta flor<textarea id="noteMessage${i}" rows="3" maxlength="650" required></textarea></label></div>`;$('noteFields').append(details);});
  function fill(){ $('editName').value=current.name||'';$('editFrom').value=current.from||initial.from;$('editMessage').value=current.message||initial.message;types.forEach((_,i)=>{$('noteTitle'+i).value=current.notes[i]?.title||initial.notes[i].title;$('noteMessage'+i).value=current.notes[i]?.message||initial.notes[i].message;});}
  function read(){return {name:$('editName').value.trim().slice(0,50),from:$('editFrom').value.trim().slice(0,80)||initial.from,message:$('editMessage').value.trim().slice(0,1800)||initial.message,notes:types.map((_,i)=>({title:$('noteTitle'+i).value.trim().slice(0,80)||initial.notes[i].title,message:$('noteMessage'+i).value.trim().slice(0,650)||initial.notes[i].message}))};}
  function build(){current=read();const safe=JSON.stringify(current).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026');try{localStorage.setItem('florecer-workshop-v2',JSON.stringify(current));}catch{}return template.replace('__GIFT_DATA__',()=>safe);}
  fill();
  $('openWorkshop').addEventListener('click',()=>{$('workshop').showModal();});$('closeWorkshop').addEventListener('click',()=>$('workshop').close());
  $('previewGift').addEventListener('click',()=>{$('giftPreview').srcdoc=build();$('previewDialog').showModal();});
  function closePreview(){$('previewDialog').close();$('giftPreview').removeAttribute('srcdoc');}
  $('closePreview').addEventListener('click',closePreview);$('previewDialog').addEventListener('cancel',()=>{$('giftPreview').removeAttribute('srcdoc');});
  $('giftForm').addEventListener('input',()=>{$('downloadResult').hidden=true;$('editorStatus').textContent='';});
  $('giftForm').addEventListener('submit',e=>{e.preventDefault();const html=build();if(objectURL)URL.revokeObjectURL(objectURL);objectURL=URL.createObjectURL(new Blob([html],{type:'text/html;charset=utf-8'}));const slug=(current.name||'ti').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-|-$/g,'').toLowerCase()||'ti';$('giftDownload').href=objectURL;$('giftDownload').download=`flores-para-${slug}.html`;$('downloadResult').hidden=false;$('editorStatus').textContent='El regalo está preparado, sin editor ni opciones de personalización.';$('giftDownload').focus();$('downloadResult').scrollIntoView({behavior:'smooth',block:'nearest'});});
})();
