function __ruliGo(){

(() => {
  if (document.querySelector('.rp-assistant-host')) return;
  const answers = Array.isArray(window.RuleProofAnswers) ? window.RuleProofAnswers : [];
  const phoneNumber = ''; // Add the approved RuleProof phone number here before enabling direct calls.
  const home = '15 Homepage Clear navy frames glow.html';
  const proof = '22 Proof.html';
  const contact = '20 Contact.html';
  const route = page => encodeURIComponent(page);
  const stop = new Set('a an and are as at be can do does for from how i in is it me my of on or our the to us we what when where which who why with you your ruleproof'.split(' '));
  const words = value => (value || '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/rule\s+proof/g, 'ruleproof').replace(/audits?/g, 'audit').replace(/regulations?/g, 'regulation').replace(/policies/g, 'policy').replace(/controls?/g, 'control').replace(/trainings?/g, 'training').replace(/evidences?/g, 'evidence').replace(/requirements?/g, 'requirement').replace(/frameworks?/g, 'framework').replace(/systems?/g, 'system').replace(/tools?/g, 'tool').match(/[a-z0-9]+/g)?.filter(w => w.length > 2 && !stop.has(w)) || [];
  const icons = {
    layers:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></svg>',
    shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 2 8 4v6c0 5-3.4 8-8 10-4.6-2-8-5-8-10V6l8-4Z"/><path d="m9 12 2 2 4-4"/></svg>',
    file:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2h8l4 4v16H6V2Z"/><path d="M14 2v5h4M9 12h6M9 16h6"/></svg>',
    phone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.1 3.4 9.7 6l-1.8 2.3a15.1 15.1 0 0 0 7.8 7.8l2.3-1.8 2.6 2.6-1.4 3.1c-.3.7-1.1 1.1-1.9 1A18 18 0 0 1 2.8 6.7c-.1-.8.3-1.6 1-1.9l3.3-1.4Z"/><path d="M3 21 21 3"/></svg>',
    phoneOn:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.1 3.4 9.7 6l-1.8 2.3a15.1 15.1 0 0 0 7.8 7.8l2.3-1.8 2.6 2.6-1.4 3.1c-.3.7-1.1 1.1-1.9 1A18 18 0 0 1 2.8 6.7c-.1-.8.3-1.6 1-1.9l3.3-1.4Z"/></svg>'
  };
  const suggestions = [
    ['layers', 'What does RuleProof do?'],
    ['shield', 'How do controls become proof?'],
    ['file', 'How can I prepare for an audit?']
  ];
  const special = [
    {test:/^(hi|hey|hello|hiya|good morning|good afternoon|good evening)( there| ruli)?[!. ]*$/i, q:'Greeting', a:'Hey! I can help you explore Proof, Learning, or a walkthrough with the team. What are you working on?', page:null},
    {test:/^(can you help( me)?|help me|what can you help (me )?with)[?.! ]*$/i, q:'How can you help?', a:'Of course. Tell me what you need to do: understand a requirement, connect policies and controls, prepare for an audit, or train your team. I’ll point you to the right place.', page:null},
    {test:/^(what (do|can) you do|who are you)[?.! ]*$/i, q:'What can Ruli do?', a:'I answer questions about RuleProof and guide you to the page that covers your topic. You can ask about Proof, Learning, audits, or getting started.', page:null},
    {test:/^(thanks|thank you|thx)[!. ]*$/i, q:'Thanks', a:'You’re welcome. If you have another question about RuleProof, I’m here.', page:null},
    {test:/book (a )?(demo|meeting|call)|schedule (a )?(demo|meeting|call)|can i (get|have) a demo|talk to (your|the) team/i, q:'Can I book a demo?', a:'Yes. Bring a regulation, policy, control, audit question or training need. The team can walk through your own material and show how RuleProof fits your process.', page:contact},
    {test:/how (can|do) i contact (you|the team)|speak to (someone|the team)/i, q:'How can I contact RuleProof?', a:'You can reach the RuleProof team through the contact page. If you want a walkthrough, bring a regulation, policy, control or training need and they’ll focus the conversation on it.', page:contact},
    {test:/how (do i|can i) get started|where (do i|can i) start/i, q:'How do I get started?', a:'Start with one piece of work that is creating friction, such as a regulation, policy, control, audit requirement or training need. The team can use it in a walkthrough and suggest a practical starting point.', page:contact},
    {test:/price|pricing|cost|how much/i, q:'How much does RuleProof cost?', a:'The right scope depends on the part of RuleProof you need and how your programme works today. The team can discuss a suitable starting point and pricing with you.', page:contact},
    {test:/what (does|is) rule\s?proof (do|about)|how (does|do|can) rule\s?proof work/i, q:'What does RuleProof do?', a:'RuleProof connects regulatory requirements to obligations, policies, controls, testing and evidence requirements. Learning handles training and awareness. Your team can start with the part it needs most.', page:proof},
    {test:/how .*control.*(become|turn|lead|connect).*(proof|evidence)|how .*proof.*control/i, q:'How do controls become proof?', a:'Proof keeps controls connected to their source requirements and policies. Testing and audit specifications define what evidence is needed and what it should show, so the reasoning stays traceable.', page:proof},
    {test:/prepar.*audit|audit.*read(y|iness)|what proof.*audit/i, q:'How can I prepare for an audit?', a:'Trace each requirement through the policy, control and test that address it. Audit specifications define the evidence needed and what it should show, so the team can explain the chain when an audit arrives.', page:proof},
    {test:/can .*collect evidence|automatically collect evidence|evidence.*automat/i, q:'Does RuleProof automatically collect evidence from our systems?', a:'Not yet. RuleProof helps define and trace evidence requirements through audit specifications. Automated collection from other systems is part of the product direction.', page:proof},
    {test:/replace.*(grc|tool|system)|work.*existing.*(grc|tool|system)/i, q:'Does RuleProof replace our existing tools?', a:'You can use RuleProof alongside your existing GRC systems. The right setup depends on where your current process needs clearer links between requirements, policies, controls, tests and evidence.', page:proof},
    {test:/training.*(own|alone|independent)|learning.*(own|alone|independent)/i, q:'Can Learning be used on its own?', a:'Yes. Learning can be used independently for compliance training, onboarding and role-based learning, or connected to Proof so training stays linked to the underlying requirement.', page:'16 Training.html'}
  ];
  const pageLabels = {
    [home]:'Explore RuleProof', [proof]:'See how Proof works',
    '16 Training.html':'Explore Learning', '17 Compliance Training.html':'Explore compliance training',
    '18 Skills Training.html':'Explore skills training', '19 About.html':'Meet the RuleProof team',
    [contact]:'Contact RuleProof', '21 Partners.html':'Explore partnerships',
    '24 Banking.html':'Explore banking', '19 Terms & Policies.html':'Read Terms & Policies'
  };
  const polishedAnswers = {
    'What is RuleProof?':'RuleProof connects regulatory requirements to obligations, policies, controls, testing and evidence requirements. Learning covers training and awareness. You can start with one part of the process and connect the rest when you are ready.',
    'Is RuleProof a GRC platform?':'RuleProof helps teams manage the work between a requirement and the proof behind it: obligations, policies, controls, testing and evidence requirements. It can work alongside an existing GRC system.',
    'What are audit specifications?':'An audit specification says what evidence a requirement or control needs, what that evidence should show, and how it traces back to the source. It gives the team a clear basis for gathering meaningful proof.',
    'How does RuleProof use AI?':'AI helps read content, identify relevant clauses, map relationships and prepare drafts. Your team reviews and approves the decisions and outputs.',
    'How secure is RuleProof?':'Security and data handling depend on your setup and hosting needs. The team can walk you through current access controls, privacy and processing arrangements for your organisation.',
    'How long does implementation take?':'It depends on your starting point, content and scope. Bring a sample regulation, policy or training need to a walkthrough, and the team can recommend a practical first step.',
    'What is RuleProof Learning?':'Learning turns your policies and compliance content into scenario-based training. Teams can track assignments, completion and results, and keep a record for audit.',
    'Does RuleProof automatically collect evidence from our systems?':'Not yet. RuleProof helps define and trace evidence requirements through audit specifications. Automated collection from other systems is part of the product direction.',
    'Does Proof automatically collect evidence from our systems?':'Not yet. Proof helps define and trace evidence requirements through audit specifications. Automated collection from other systems is part of the product direction.'
  };
  const host = document.createElement('div');
  host.className = 'rp-assistant-host';
  host.innerHTML = `
    <div class="rp-assistant-panel" id="rp-panel" aria-label="Ruli assistant" data-open="false">
      <div class="rp-assistant-head"><span class="rp-assistant-orb" aria-hidden="true"></span><div><div class="rp-assistant-name">Ruli</div><div class="rp-assistant-status">Your RuleProof assistant</div></div><button class="rp-assistant-close" id="rp-close" type="button" aria-label="Close Ruli">&times;</button></div>
      <div class="rp-assistant-scroll" id="rp-scroll" aria-live="polite"><div class="rp-assistant-intro" id="rp-intro"><span class="rp-assistant-orb" aria-hidden="true"></span><h2>Hi! I’m <span>Ruli</span></h2><p>Ask me about regulations, obligations, controls, training or audit proof.</p><div class="rp-assistant-suggestions" id="rp-suggestions"></div></div><div id="rp-messages"></div></div>
      <div class="rp-assistant-compose"><div class="rp-assistant-compose-row"><form class="rp-assistant-form" id="rp-form"><input class="rp-assistant-input" id="rp-input" type="text" autocomplete="off" maxlength="300" placeholder="Ask Ruli anything..." aria-label="Ask Ruli a question"><button class="rp-assistant-send" type="submit" aria-label="Send question">➤</button></form><button type="button" class="rp-assistant-call" id="rp-call" aria-label="Call RuleProof" title="Call RuleProof">${icons.phone}</button></div></div>
      <div class="rp-assistant-overlay" id="rp-overlay" data-open="false"><div class="rp-assistant-consent" role="dialog" aria-modal="true" aria-labelledby="rp-consent-title"><h3 id="rp-consent-title">Before you call</h3><p>Please read RuleProof’s terms before continuing. Your phone provider may charge for the call.</p><label><input id="rp-agree" type="checkbox"> <span>I have read and agree to the <a href="${route('19 Terms & Policies.html')}">Terms &amp; Policies</a>.</span></label><div class="rp-assistant-consent-actions"><button type="button" id="rp-cancel">Cancel</button><button type="button" class="primary" id="rp-continue" disabled>Continue to call</button></div></div></div>
    </div>
    <button class="rp-assistant-launcher" id="rp-launcher" type="button" aria-controls="rp-panel" aria-expanded="false"><span class="rp-assistant-launcher-label">Ask Ruli <span class="rp-assistant-sparkle" aria-hidden="true">✦</span></span><span class="rp-assistant-orb" aria-hidden="true"></span></button>`;
  document.body.append(host);
  const $ = id => host.querySelector('#' + id);
  const panel = $('rp-panel'), launcher = $('rp-launcher'), scroll = $('rp-scroll'), messages = $('rp-messages'), input = $('rp-input'), overlay = $('rp-overlay');
  const stateKey='ruleproof-ruli-session-v2';
  const save = () => { try { sessionStorage.setItem(stateKey,JSON.stringify({html:messages.innerHTML,open:panel.dataset.open==='true'})); } catch {} };
  const open = value => { panel.dataset.open = String(value); launcher.setAttribute('aria-expanded', String(value)); save(); if(value) input.focus(); else launcher.focus(); };
  launcher.addEventListener('click', () => open(panel.dataset.open !== 'true'));
  $('rp-close').addEventListener('click', () => open(false));
  document.addEventListener('keydown', event => { if(event.key === 'Escape'){ if(overlay.dataset.open === 'true') closeConsent(); else if(panel.dataset.open === 'true') open(false); } });
  const message = (role, value) => { const node=document.createElement('div'); node.className='rp-assistant-message '+role; node.textContent=value; messages.append(node); scroll.scrollTop=scroll.scrollHeight; save(); return node; };
  const link = (page, label) => { const a=document.createElement('a'); a.className='rp-assistant-result-link'; a.href=route(page); a.textContent=(label || pageLabels[page] || 'Explore this page')+' →'; const last=[...messages.querySelectorAll('.rp-assistant-message.bot')].at(-1); (last||messages).append(a); scroll.scrollTop=scroll.scrollHeight; save(); };
  const related = list => { const row=document.createElement('div'); row.className='rp-assistant-more'; for(const item of list){ const btn=document.createElement('button'); btn.type='button'; btn.textContent=item.q; btn.dataset.question=item.q; row.append(btn); } const last=[...messages.querySelectorAll('.rp-assistant-message.bot')].at(-1); (last||messages).append(row); save(); };
  messages.addEventListener('click',event=>{const button=event.target.closest('button[data-question]');if(button)ask(button.dataset.question)});
  const score = (query,item) => {
    const question=words(item.q), answer=words(item.a), topic=words(item.topic), terms=words(query);
    if(!terms.length) return 0;
    let n=0; for(const term of terms){ if(question.includes(term)) n+=3; else if(topic.includes(term)) n+=1.6; else if(answer.includes(term)) n+=.55; }
    if(question.join(' ')===terms.join(' ')) n+=8;
    return n / Math.sqrt(Math.max(1,terms.length));
  };
  const find = query => answers.map((item,i)=>({item,score:score(query,item),i})).sort((a,b)=>b.score-a.score).filter(x=>x.score>0);
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const pause = ms => new Promise(resolve => setTimeout(resolve,ms));
  let replying = false;
  async function respond(text,page,choices,autoPage){
    const typing=document.createElement('div');
    typing.className='rp-assistant-typing';
    typing.setAttribute('role','status');
    typing.setAttribute('aria-label','Ruli is typing');
    typing.innerHTML='<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>';
    scroll.append(typing);
    host.classList.add('is-typing');
    scroll.scrollTop=scroll.scrollHeight;
    await pause(reduceMotion?.matches ? 80 : 420);
    typing.remove();
    host.classList.remove('is-typing');
    message('bot',text);
    if(page)link(page);
    if(choices?.length)related(choices);
    replying=false;
    if(autoPage && window.parent!==window){
      await pause(reduceMotion?.matches ? 0 : 500);
      try{window.parent.location.hash='page='+encodeURIComponent(autoPage)}catch{}
    }
  }
  async function ask(value){
    const query=value.trim(); if(!query || replying) return;
    replying=true; input.value=''; $('rp-intro').style.display='none'; message('user',query);
    const featured=special.find(x=>x.q.toLowerCase()===query.toLowerCase() || x.test.test(query));
    if(featured){
      const choices=featured.page || featured.q==='Thanks' ? [] : [{q:'What does RuleProof do?'},{q:'Can I book a demo?'}];
      const autoPage=featured.page===contact && /book|schedule|show me|open|take me|go to/i.test(query) ? contact : null;
      await respond(featured.a,featured.page,choices,autoPage); return;
    }
    const results=find(query), top=results[0];
    if(!top || top.score<1.9){ await respond('Could you tell me a little more? I can help with Proof, Learning, audits, or getting started.',null,[{q:'What does RuleProof do?'},{q:'Can I book a demo?'}]); return; }
    if(results[1] && results[1].score>=top.score*.92 && top.score<5){ await respond('I found a few related questions. Which one did you mean?',null,results.slice(0,3).map(x=>x.item)); return; }
    const choices=results[1] && results[1].score>top.score*.82 && results[1].item.q!==top.item.q ? results.slice(1,3).map(x=>x.item) : [];
    await respond(polishedAnswers[top.item.q] || top.item.a,top.item.page,choices);
  }
  $('rp-form').addEventListener('submit',event=>{event.preventDefault();ask(input.value)});
  for(const [icon,question] of suggestions){ const btn=document.createElement('button'); btn.className='rp-assistant-suggestion'; btn.type='button'; btn.innerHTML=`<span class="icon" aria-hidden="true">${icons[icon]}</span><span></span><span class="arrow" aria-hidden="true">→</span>`; btn.children[1].textContent=question; btn.addEventListener('click',()=>ask(question)); $('rp-suggestions').append(btn); }
  const closeConsent=()=>{ overlay.dataset.open='false'; $('rp-call').innerHTML=icons.phone; $('rp-call').dataset.active='false'; $('rp-call').focus(); };
  $('rp-call').addEventListener('click',()=>{ $('rp-agree').checked=false; $('rp-continue').disabled=true; $('rp-call').innerHTML=icons.phoneOn; $('rp-call').dataset.active='true'; overlay.dataset.open='true'; $('rp-agree').focus(); });
  $('rp-cancel').addEventListener('click',closeConsent);
  $('rp-agree').addEventListener('change',event=>{ $('rp-continue').disabled=!event.target.checked; });
  $('rp-continue').addEventListener('click',()=>{ if(!$('rp-agree').checked)return; closeConsent(); if(phoneNumber){window.location.href='tel:'+phoneNumber.replace(/[^+\d]/g,'');}else{message('bot','Direct calling will be available when the RuleProof phone number is added. You can book a meeting with the team now.');link(contact,'Book a meeting');} });
  try { const previous=JSON.parse(sessionStorage.getItem(stateKey)||'null'); if(previous?.html){ messages.innerHTML=previous.html; $('rp-intro').style.display='none'; } if(previous?.open)open(true); } catch {}
})();


}
if(document.body){__ruliGo()}else{new MutationObserver(function(m,o){if(document.body){o.disconnect();__ruliGo()}}).observe(document.documentElement,{childList:true})}
