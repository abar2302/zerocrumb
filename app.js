(function(){
var C={ready:false,session:null,profiles:[],listings:[],notes:[],sig:''};
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function uid(){return Math.random().toString(36).slice(2,10)+Date.now().toString(36)}
var users=function(){return C.profiles},listings=function(){return C.listings};
var U=function(id){return C.profiles.find(function(x){return x.id===id})};
function me(){var u=C.session&&U(C.session.user.id);return u&&u.status==='active'?u:null}
var ROLES={donor:'Donor',recipient:'Recipient',courier:'Delivery person',admin:'Administrator'};
var STATUS={available:'Available',claimed:'Claimed',assigned:'Courier assigned',picked_up:'Picked up',delivered:'Delivered',cancelled:'Cancelled'};
var flash='';
function fmt(t){return t?new Date(t).toLocaleString([],{dateStyle:'medium',timeStyle:'short'}):''}
function expired(l){return l.status==='available'&&new Date(l.expires)<new Date()}
function tag(l){var x=expired(l),s=x?'Expired':STATUS[l.status];return '<span class="tag '+(l.status==='delivered'?'ok':(l.status==='cancelled'||x)?'bad':'')+'">'+s+'</span>'}
function nm(u){return u?esc(u.org?u.org+' ('+u.name+')':u.name):'Unknown'}
function ln(label,val){return val?'<p class="meta">'+label+': '+esc(val)+'</p>':''}
function note(){return flash?'<p class="panel" role="status">'+esc(flash)+'</p>':''}
function unread(){return C.notes.filter(function(n){return !n.read}).length}
function ago(t){var m=Math.floor((Date.now()-t)/6e4);if(m<1)return 'just now';if(m<60)return m+' min ago';var h=Math.floor(m/60);if(h<24)return h+' h ago';var d=Math.floor(h/24);return d<7?d+' d ago':fmt(t)}
function bell(){var n=unread();return '<button class="btn alt sm" type="button" data-act="bell" aria-expanded="'+(ui.notes?'true':'false')+'">Notifications'+(n?' ('+n+')':'')+'</button>'}
function notePanel(){
  if(!ui.notes)return '';
  return '<section class="notes" aria-label="Notifications"><div class="notes-head"><strong>Notifications</strong>'+(unread()?'<button class="btn alt sm" type="button" data-act="readall">Mark all as read</button>':'')+'</div>'+
  (C.notes.length?'<ul>'+C.notes.map(function(x){return '<li class="'+(x.read?'':'unread')+'"><button type="button" data-act="note" data-id="'+x.id+'"><span>'+esc(x.message)+'</span><span class="meta">'+ago(x.created)+'</span></button></li>'}).join('')+'</ul>':'<p class="meta" style="padding:12px 16px">No notifications yet. Updates about your listings and deliveries appear here.</p>')+'</section>';
}
function dashNav(u){var items={donor:[['overview','Overview'],['post','Post food'],['listings','My listings']],recipient:[['overview','Overview'],['browse','Browse food'],['claims','My claims']],courier:[['overview','Overview'],['jobs','Available jobs'],['active','Active deliveries'],['completed','Completed']],admin:[['overview','Overview'],['accounts','Accounts'],['listings','Listings']]}[u.role]||[];return '<div class="dash-nav" aria-label="Dashboard sections">'+items.map(function(x){return '<a href="#/app?section='+x[0]+'" data-nav-section="'+x[0]+'">'+x[1]+'</a>'}).join('')+'</div>'}
function shell(body){
  var u=me();
  var topActions=u?bell()+'<span class="meta user-meta">'+esc(u.name)+', '+ROLES[u.role]+'</span><button class="btn alt sm" data-act="logout" type="button">Sign out</button>':'<a href="#/">Sign in</a><a href="#/signup">Create account</a>';
  var content=u?'<div class="app-layout"><aside class="sidebar" aria-label="Dashboard sidebar"><a class="sidebar-home" href="#/app">Dashboard home</a><p class="sidebar-role">'+ROLES[u.role]+'</p>'+dashNav(u)+'</aside><main class="wrap app-main">'+body+'</main></div>':'<main class="wrap">'+body+'</main>';
  return '<header class="top"><div class="wrap topbar"><a class="brand" href="#/">ZeroCrumb</a><nav class="top-actions" aria-label="Account actions">'+topActions+'</nav></div>'+(u?notePanel():'')+'</header>'+content+'<footer><div class="wrap"><span>ZeroCrumb</span><span><a href="#/privacy">Privacy policy</a> &nbsp; <a href="#/terms">Terms and conditions</a></span></div></footer>';
}

function home(){
  return '<section class="hero"><div><h1>Surplus food, moved to people who can use it</h1>'+
  '<p class="lead">ZeroCrumb is a board where donors post food they cannot use, recipient organisations claim it, and delivery people carry it between the two.</p>'+
  '<ol class="track static" aria-label="Stages of a listing">'+STEPS.map(function(s){return '<li><span class="dot"></span><span class="lbl">'+STEPTXT[s]+'</span></li>'}).join('')+'</ol>'+
  '<p class="meta">Every listing passes through these stages. Each stage is changed by the person responsible for it.</p></div>'+
  '<form class="panel" data-form="login" novalidate><h2>Sign in</h2>'+(flash?'<p class="meta" role="status">'+esc(flash)+'</p>':'')+'<label for="le">Email</label><input id="le" name="email" type="email" autocomplete="email" required>'+
  '<label for="lp">Password</label><input id="lp" name="password" type="password" autocomplete="current-password" required><p class="err" role="alert"></p>'+
  '<div class="row"><button class="btn" type="submit">Sign in</button><a class="btn alt" href="#/signup">Create account</a></div></form></section>';
}

function signup(){
  
  return '<div class="doc"><h1>Create account</h1><form class="panel" data-form="signup" novalidate>'+
  '<div class="grid2"><div><label for="sn">Full name</label><input id="sn" name="name" autocomplete="name" required maxlength="80"></div>'+
  '<div><label for="se">Email</label><input id="se" name="email" type="email" autocomplete="email" required></div>'+
  '<div><label for="sr">Role</label><select id="sr" name="role"><option value="donor">Donor</option><option value="recipient">Recipient</option><option value="courier">Delivery person</option>'+'</select></div>'+
  '<div><label for="so">Organisation (optional)</label><input id="so" name="org" maxlength="80"></div>'+
  '<div><label for="sp">Phone</label><input id="sp" name="phone" type="tel" autocomplete="tel" maxlength="30"></div>'+
  '<div><label for="sa">Address</label><input id="sa" name="address" autocomplete="street-address" maxlength="160"></div><div style="grid-column:1/-1"><label for="sc">Map coordinates (optional)</label>'+coordField('sc','coords','')+'</div></div>'+
  '<p class="meta">Donors and recipients must enter an address. It is used as the default pickup or delivery address.</p>'+
  
  '<label for="sw">Password (at least 8 characters)</label><input id="sw" name="password" type="password" autocomplete="new-password" required><p class="err" role="alert"></p>'+
  '<div class="row"><button class="btn" type="submit">Create account</button><a class="btn alt" href="#/">Back to sign in</a></div></form></div>';
}

function listingForm(u){
  return '<form class="panel" data-form="listing" novalidate><h2>Post a listing</h2><div class="grid2">'+
  '<div><label for="t">Food item</label><input id="t" name="title" required maxlength="80"></div>'+
  '<div><label for="q">Quantity</label><input id="q" name="qty" required maxlength="40" placeholder="For example, 20 meal boxes"></div>'+
  '<div><label for="c">Category</label><select id="c" name="category"><option>Cooked meals</option><option>Bakery</option><option>Fresh produce</option><option>Packaged goods</option><option>Dairy and chilled</option><option>Other</option></select></div>'+
  '<div><label for="a">Pickup address</label><input id="a" name="pickup" required maxlength="160" value="'+esc(u.address)+'"></div>'+
  '<div><label for="r">Ready for pickup from</label><input id="r" name="readyBy" type="datetime-local" required></div>'+
  '<div><label for="x">Must be delivered by</label><input id="x" name="expires" type="datetime-local" required></div><div style="grid-column:1/-1"><label for="pc">Pickup map coordinates (optional)</label>'+coordField('pc','pickupLL',u.coords)+'</div></div>'+
  '<label for="n">Notes (allergens, storage, handling)</label><textarea id="n" name="notes" rows="3" maxlength="400"></textarea>'+
  '<p class="err" role="alert"></p><button class="btn" type="submit">Post listing</button></form>';
}

var STEPS=['available','claimed','assigned','picked_up','delivered'];
var STEPTXT={available:'Posted',claimed:'Claimed',assigned:'Courier assigned',picked_up:'Picked up',delivered:'Delivered'};
function stamp(l,k){l.log=l.log||{};l.log[k]=Date.now()}
function st(l,a){return a.indexOf(l.status)>-1}
function tally(a,f){return a.filter(f).length}
function left(l){var ms=new Date(l.expires)-new Date();if(ms<=0)return 'Deadline passed.';var m=Math.floor(ms/6e4),h=Math.floor(m/60),d=Math.floor(h/24);return 'Deliver within '+(d>0?d+' d '+(h%24)+' h':h>0?h+' h '+(m%60)+' min':m+' min')+'.'}
function hint(l){
  if(l.status==='delivered')return 'Delivered'+(l.log&&l.log.delivered?' on '+fmt(l.log.delivered):'')+'.';
  if(expired(l))return 'Expired. Nobody claimed it before the deadline.';
  var s={available:'Waiting for a recipient to claim it.',claimed:'Claimed. Waiting for a delivery person to accept.',assigned:'A courier is on the way to collect it.',picked_up:'Collected and on the way to the recipient.'}[l.status];
  return s+' '+left(l);
}
function track(l){
  if(l.status==='cancelled')return '<p class="state">This listing was cancelled.</p>';
  var cur=STEPS.indexOf(l.status),ts=Object.assign({},l.log,{available:l.created}),h='<ol class="track" aria-label="Delivery progress">';
  STEPS.forEach(function(s,i){var c=(i<cur||l.status==='delivered')?'done':i===cur?'now':'';
    h+='<li class="'+c+'"><span class="dot"></span><span class="lbl">'+STEPTXT[s]+'</span><span class="when">'+(c&&ts[s]?fmt(ts[s]):'')+'</span></li>'});
  return h+'</ol><p class="state">'+hint(l)+'</p>';
}
var ui={q:'',cat:'',sort:'deadline',loc:'',notes:false};
function parseLL(s){if(!s)return null;var m=String(s).trim().match(/^(-?\d{1,2}(?:\.\d+)?)\s*[, ]\s*(-?\d{1,3}(?:\.\d+)?)$/);if(!m)return null;var a=+m[1],b=+m[2];return(a>=-90&&a<=90&&b>=-180&&b<=180)?{lat:a,lng:b}:null}
function km(a,b){var R=6371,r=Math.PI/180,dl=(b.lat-a.lat)*r,dn=(b.lng-a.lng)*r,x=Math.sin(dl/2)*Math.sin(dl/2)+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(dn/2)*Math.sin(dn/2);return 2*R*Math.asin(Math.sqrt(x))}
function dkm(x){return x<1?Math.round(x*1000)+' m':x.toFixed(1)+' km'}
function myLL(u){return parseLL(ui.loc)||parseLL(u.coords)}
function dnote(l,u){var a=myLL(u);return a&&l.pll?'<p class="meta">About '+dkm(km(a,l.pll))+' from you in a straight line.</p>':''}
function enc(s){return encodeURIComponent(s)}
function pl(addr,ll){return ll?ll.lat+','+ll.lng:addr}
function coordField(id,name,val){return '<div class="coord"><input id="'+id+'" name="'+name+'" value="'+esc(val||'')+'" placeholder="Latitude, longitude" maxlength="40"><button class="btn alt sm" type="button" data-act="geo" data-target="'+id+'">Use my location</button></div><p class="meta" data-geo="'+id+'">Used to draw the route and measure distance. You can also paste coordinates from a map app.</p>'}
function toolbar(u){
  var cats=['','Cooked meals','Bakery','Fresh produce','Packaged goods','Dairy and chilled','Other'];
  function so(v,t){return '<option value="'+v+'"'+(ui.sort===v?' selected':'')+'>'+t+'</option>'}
  return '<div class="toolbar"><div><label for="uq">Search</label><input id="uq" data-ui="q" value="'+esc(ui.q)+'" placeholder="Item or donor"></div>'+
  '<div><label for="uc">Category</label><select id="uc" data-ui="cat">'+cats.map(function(c){return '<option value="'+c+'"'+(ui.cat===c?' selected':'')+'>'+(c||'All categories')+'</option>'}).join('')+'</select></div>'+
  '<div><label for="us">Sort by</label><select id="us" data-ui="sort">'+so('deadline','Deadline, soonest')+so('new','Newest')+so('near','Nearest to me')+'</select></div>'+
  '<div><label for="ul">Your location</label><div class="coord"><input id="ul" data-ui="loc" value="'+esc(ui.loc||u.coords||'')+'" placeholder="Latitude, longitude"><button class="btn alt sm" type="button" data-act="geo" data-target="ul">Use mine</button></div><p class="meta" data-geo="ul"></p></div></div>';
}
function applyUI(a,u){
  var q=ui.q.trim().toLowerCase(),me2=myLL(u);
  a=a.filter(function(l){var d=U(l.donorId);return (!ui.cat||l.category===ui.cat)&&(!q||(l.title+' '+(d?d.name+' '+d.org:'')).toLowerCase().indexOf(q)>-1)});
  return a.sort(function(x,y){if(ui.sort==='new')return y.created-x.created;if(ui.sort==='near'&&me2){return (x.pll?km(me2,x.pll):1e9)-(y.pll?km(me2,y.pll):1e9)}return new Date(x.expires)-new Date(y.expires)});
}
function uiHandler(e){var t=e.target;if(!t.dataset||!t.dataset.ui)return;ui[t.dataset.ui]=t.value;var id=t.id,pos=t.selectionStart;render();var n=document.getElementById(id);if(n){n.focus();try{n.setSelectionRange(pos,pos)}catch(x){}}}
document.addEventListener('input',uiHandler);document.addEventListener('change',uiHandler);
function cl(x){return Math.max(34,Math.min(366,x))}
function mapSvg(a,b){
  var W=400,H=150,P=36,dx=(b.lng-a.lng)*Math.cos((a.lat+b.lat)/2*Math.PI/180),dy=b.lat-a.lat;
  var s=Math.min(Math.abs(dx)>1e-9?(W-2*P)/Math.abs(dx):1e9,Math.abs(dy)>1e-9?(H-2*P)/Math.abs(dy):1e9);if(s>=1e9)s=1;
  var ax=W/2-dx*s/2,ay=H/2+dy*s/2,bx=W/2+dx*s/2,by=H/2-dy*s/2;
  return '<svg class="mapsvg" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Straight line between pickup and drop-off, '+dkm(km(a,b))+'">'+
  '<line class="ln" x1="'+ax+'" y1="'+ay+'" x2="'+bx+'" y2="'+by+'"/><rect class="pk" x="'+(ax-6)+'" y="'+(ay-6)+'" width="12" height="12"/><circle class="dp" cx="'+bx+'" cy="'+by+'" r="7"/>'+
  '<text x="'+cl(ax)+'" y="'+(ay+24)+'" text-anchor="middle">Pickup</text><text x="'+cl(bx)+'" y="'+(by-14)+'" text-anchor="middle">Drop-off</text>'+
  '<text x="'+cl((ax+bx)/2)+'" y="'+((ay+by)/2-9)+'" text-anchor="middle">'+dkm(km(a,b))+'</text></svg><p class="meta">Straight-line sketch from the coordinates given, north is up. It is not a driving route.</p>';
}
function mapLinks(l){
  var p=pl(l.pickup,l.pll),g='https://www.google.com/maps/',o='target="_blank" rel="noopener" class="btn alt sm" href="';
  var h='<a '+o+g+'search/?api=1&amp;query='+enc(p)+'">Pickup on map</a>';
  if(l.dropoff){var d=pl(l.dropoff,l.dll);h+='<a '+o+g+'search/?api=1&amp;query='+enc(d)+'">Drop-off on map</a><a '+o+g+'dir/?api=1&amp;origin='+enc(p)+'&amp;destination='+enc(d)+'">Route, pickup to drop-off</a>'}
  return '<div class="row">'+h+'</div>';
}
function route(l){return '<div class="route"><div><span>Pickup</span>'+esc(l.pickup)+'</div>'+(l.dropoff?'<div><span>Drop-off</span>'+esc(l.dropoff)+'</div>':'')+'</div>'+(l.pll&&l.dll?mapSvg(l.pll,l.dll):'')+mapLinks(l)}
function strip(a){return '<div class="strip">'+a.map(function(x){return '<div><span>'+x[0]+'</span><b>'+x[1]+'</b></div>'}).join('')+'</div>'}
function facts(l,nt){return (nt?'':track(l))+'<div class="facts">'+ln('Quantity',l.qty)+ln('Category',l.category)+ln('Ready from',fmt(l.readyBy))+ln('Deliver by',fmt(l.expires))+ln('Notes',l.notes)+'</div>'}

function dashSection(key,title,content){return '<section class="dash-section" data-section="'+key+'"><h2 class="section-title">'+title+'</h2>'+content+'</section>'}
function donorView(u){
  var ls=listings().filter(function(l){return l.donorId===u.id}).sort(function(a,b){return b.created-a.created});
  var overview='<p class="lead">A quick view of your surplus food and handovers.</p>'+strip([['Posted',ls.length],['Waiting',tally(ls,function(l){return l.status==='available'&&!expired(l)})],['In transit',tally(ls,function(l){return st(l,['claimed','assigned','picked_up'])})],['Delivered',tally(ls,function(l){return l.status==='delivered'})]]);
  var cards=ls.length?ls.map(function(l){var rc=l.recipientId?U(l.recipientId):null,cr=l.courierId?U(l.courierId):null;return '<article class="card"><h3>'+esc(l.title)+tag(l)+'</h3>'+facts(l)+route(l)+(rc?'<p class="meta">Recipient: '+nm(rc)+'</p>':'')+(cr?'<p class="meta">Courier: '+nm(cr)+(cr.phone?', '+esc(cr.phone):'')+'</p>':'')+(['available','claimed','assigned'].indexOf(l.status)>-1?'<div class="row"><button class="btn warn sm" data-act="cancel" data-id="'+l.id+'" type="button">Cancel listing</button></div>':'')+'</article>'}).join(''):'<p class="meta">You have not posted any listings yet.</p>';
  return '<h1>Donor dashboard</h1>'+note()+dashSection('overview','Overview',overview)+dashSection('post','Post food',listingForm(u))+dashSection('listings','My listings','<p class="lead">Review listing status and follow each handover.</p>'+cards);
}
function recipientView(u){
  var all=listings(),now=new Date();var open=all.filter(function(l){return l.status==='available'&&new Date(l.expires)>now&&new Date(l.readyBy)<=new Date(l.expires)}).sort(function(a,b){return new Date(a.expires)-new Date(b.expires)});var totalOpen=open.length;open=applyUI(open,u);var mine=all.filter(function(l){return l.recipientId===u.id}).sort(function(a,b){return b.created-a.created});
  var overview='<p class="lead">Find surplus food, make claims and follow deliveries to your organisation.</p>'+strip([['Available now',totalOpen],['Active claims',tally(mine,function(l){return st(l,['claimed','assigned','picked_up'])})],['Received',tally(mine,function(l){return l.status==='delivered'})]]);
  var browse=toolbar(u)+(open.length?open.map(function(l){return '<article class="card"><h3>'+esc(l.title)+'</h3>'+facts(l,true)+'<p class="meta">Donor: '+nm(U(l.donorId))+'. The pickup address is shared after you claim.</p>'+dnote(l,u)+'<form data-form="claim" novalidate><input type="hidden" name="id" value="'+l.id+'"><label for="d'+l.id+'">Delivery address</label><input id="d'+l.id+'" name="dropoff" required maxlength="160" value="'+esc(u.address)+'"><label for="dc'+l.id+'">Map coordinates (optional)</label>'+coordField('dc'+l.id,'dropLL',u.coords)+'<p class="err" role="alert"></p><button class="btn" type="submit">Claim listing</button></form></article>'}).join(''):(totalOpen?'<p class="meta">Nothing matches these filters.</p>':'<p class="meta">No food is available right now. New listings from donors appear here as they are posted.</p>'));
  var claims=mine.length?mine.map(function(l){var cr=l.courierId?U(l.courierId):null;return '<article class="card"><h3>'+esc(l.title)+tag(l)+'</h3>'+facts(l)+route(l)+(cr?'<p class="meta">Courier: '+nm(cr)+(cr.phone?', '+esc(cr.phone):'')+'</p>':'')+(['claimed','assigned'].indexOf(l.status)>-1?'<div class="row"><button class="btn warn sm" data-act="release" data-id="'+l.id+'" type="button">Release claim</button></div>':'')+'</article>'}).join(''):'<p class="meta">You have not claimed anything yet.</p>';
  return '<h1>Recipient dashboard</h1>'+note()+dashSection('overview','Overview',overview)+dashSection('browse','Browse food',browse)+dashSection('claims','My claims and delivery tracking',claims);
}
function courierView(u){
  var all=listings(),open=all.filter(function(l){return l.status==='claimed'}).sort(function(a,b){return new Date(a.expires)-new Date(b.expires)}),mine=all.filter(function(l){return l.courierId===u.id}).sort(function(a,b){return b.created-a.created});
  var overview='<p class="lead">Manage delivery jobs from acceptance through handover.</p>'+strip([['Open jobs',open.length],['In progress',tally(mine,function(l){return st(l,['assigned','picked_up'])})],['Completed',tally(mine,function(l){return l.status==='delivered'})]]);
  var jobs=open.length?open.map(function(l){return '<article class="card"><h3>'+esc(l.title)+'</h3>'+facts(l)+route(l)+'<div class="row"><button class="btn" data-act="accept" data-id="'+l.id+'" type="button">Accept delivery</button></div></article>'}).join(''):'<p class="meta">No jobs are waiting. A job appears here once a recipient claims a listing.</p>';
  function deliveryCards(items){return items.length?items.map(function(l){var d=U(l.donorId),r=U(l.recipientId),b='';if(l.status==='assigned')b='<button class="btn" data-act="pickup" data-id="'+l.id+'" type="button">Mark picked up</button><button class="btn warn" data-act="drop" data-id="'+l.id+'" type="button">Drop this job</button>';if(l.status==='picked_up')b='<button class="btn" data-act="deliver" data-id="'+l.id+'" type="button">Mark delivered</button>';return '<article class="card"><h3>'+esc(l.title)+tag(l)+'</h3>'+facts(l)+route(l)+(d&&d.phone?ln('Donor phone',d.phone):'')+(r&&r.phone?ln('Recipient phone',r.phone):'')+(b?'<div class="row">'+b+'</div>':'')+'</article>'}).join(''):'<p class="meta">No deliveries in this section yet.</p>'}
  return '<h1>Delivery dashboard</h1>'+note()+dashSection('overview','Overview',overview)+dashSection('jobs','Available jobs',jobs)+dashSection('active','Active deliveries',deliveryCards(mine.filter(function(l){return st(l,['assigned','picked_up'])})))+dashSection('completed','Completed deliveries',deliveryCards(mine.filter(function(l){return l.status==='delivered'})));
}
function adminView(u){
  var us=users(),ls=listings().slice().sort(function(a,b){return b.created-a.created});function cnt(arr,key,val){return arr.filter(function(x){return x[key]===val}).length}
  var overview='<p class="lead">Monitor platform activity and manage accounts and food listings.</p>'+strip([['Accounts',us.length],['Suspended',tally(us,function(x){return x.status!=='active'})],['Live listings',tally(ls,function(l){return st(l,['available','claimed','assigned','picked_up'])&&!expired(l)})],['Delivered',tally(ls,function(l){return l.status==='delivered'})]]);
  var accounts='<div class="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th></th></tr></thead><tbody>'+us.map(function(x){return '<tr><td>'+nm(x)+'</td><td>'+esc(x.email)+'</td><td>'+ROLES[x.role]+'</td><td>'+(x.status==='active'?'Active':'Suspended')+'</td><td>'+(x.id===u.id?'':'<button class="btn sm '+(x.status==='active'?'warn':'alt')+'" data-act="toggle" data-id="'+x.id+'" type="button">'+(x.status==='active'?'Suspend':'Reactivate')+'</button>')+'</td></tr>'}).join('')+'</tbody></table></div>';
  var listingsTable=ls.length?'<div class="table-wrap"><table><thead><tr><th>Item</th><th>Donor</th><th>Status</th><th>Deliver by</th><th></th></tr></thead><tbody>'+ls.map(function(l){return '<tr><td>'+esc(l.title)+'</td><td>'+nm(U(l.donorId))+'</td><td>'+tag(l).replace('margin-left:6px','')+'</td><td>'+fmt(l.expires)+'</td><td>'+(['delivered','cancelled'].indexOf(l.status)>-1?'':'<button class="btn warn sm" data-act="remove" data-id="'+l.id+'" type="button">Remove listing</button>')+'</td></tr>'}).join('')+'</tbody></table></div>':'<p class="meta">No listings have been posted yet.</p>';
  return '<h1>Admin dashboard</h1>'+note()+dashSection('overview','Overview',overview)+dashSection('accounts','Manage accounts',accounts)+dashSection('listings','Manage listings',listingsTable);
}

function co(){var c=CFG.company||{};return{name:c.name||'the operator of this service',email:c.email||'',address:c.address||''}}
function contact(){
  var c=co();
  return c.email?'<h2>Contact and grievances</h2><p>Questions, requests about your data and complaints can be sent to '+esc(c.name)+(c.address?', '+esc(c.address):'')+', by email at <a href="mailto:'+esc(c.email)+'">'+esc(c.email)+'</a>.</p>':'';
}

function privacy(){
  var n=esc(co().name);
  return '<article class="doc"><h1>Privacy policy</h1><p class="meta">Last updated 16 October 2026</p>'+
  '<h2>Who runs ZeroCrumb</h2><p>ZeroCrumb is operated by '+n+', a company based in Erode, Tamil Nadu, India. ZeroCrumb lets donors list surplus food, recipients claim it and delivery people move it from one to the other. This policy explains what personal data the service handles and why.</p>'+
  '<h2>Data we collect</h2><p>When you create an account we collect your name, email address, role and password. You may also give an organisation name, phone number, address and map coordinates. When you use the service we record the listings you post, claim or deliver, the delivery addresses you enter, and the time each stage of a delivery happened. Your password is handled by our authentication provider and is never visible to us in plain text.</p>'+
  '<h2>Why we use it</h2><p>We use your data only to run the service: to sign you in, show listings, coordinate pickup and delivery, keep the service safe and respond to you. We rely on the consent you give when you create an account and use the service, and on legal obligations where they apply. We do not sell your data and we do not show advertising.</p>'+
  '<h2>Who can see it</h2><p>Other users see only what a handover needs. Recipients see a donor name and organisation, and the pickup address is shown only after a listing is claimed. Before a claim, pickup coordinates are shown only roughly. Once a delivery person is assigned, the donor, recipient and delivery person can see each other names, organisations and phone numbers for that listing. Administrators can see all accounts and listings.</p>'+
  '<h2>Where it is stored</h2><p>Data is stored with our cloud database provider, Supabase, and the website is hosted by Netlify. These providers process data for us under their own security measures. Depending on the data centre region in use, your data may be processed outside India.</p>'+
  '<h2>Location and maps</h2><p>You may enter map coordinates or use your device location to fill them in. Your browser asks permission first, and the coordinates are stored like an address. The route sketch is drawn on your own device. The map buttons open Google Maps in a new tab and pass it the address or coordinates you chose to open, which Google handles under its own policy.</p>'+
  '<h2>Cookies and similar storage</h2><p>The service stores a sign-in session in your browser so you stay signed in. It does not use advertising cookies, analytics or tracking tools.</p>'+
  '<h2>How long we keep it</h2><p>We keep your data while your account is active and for as long as needed to run the service, resolve disputes and meet legal duties. You can ask us to delete your account and the personal data we hold about you.</p>'+
  '<h2>Your rights</h2><p>Under the Digital Personal Data Protection Act, 2023 and the rules made under it, you can ask to see the personal data we hold about you, ask us to correct or erase it, withdraw your consent, and make a complaint to us about how your data is handled. You can also nominate another person to exercise these rights for you.</p>'+
  '<h2>Children</h2><p>ZeroCrumb is for adults and registered organisations. It is not meant for anyone under 18.</p>'+
  '<h2>Security</h2><p>Connections are encrypted, and access rules on the database limit each role to the data it needs. No online service can promise perfect security, so please keep your password private.</p>'+
  contact()+
  '<h2>Changes</h2><p>If the way we handle data changes, we will update this page and the date above.</p></article>';
}

function terms(){
  var n=esc(co().name);
  return '<article class="doc"><h1>Terms and conditions</h1><p class="meta">Last updated 16 October 2026</p>'+
  '<h2>About these terms</h2><p>ZeroCrumb is operated by '+n+', a company based in Erode, Tamil Nadu, India. By creating an account or using the service you agree to these terms. If you do not agree, please do not use it.</p>'+
  '<h2>Who can use it</h2><p>You must be at least 18 years old, or act for a registered organisation. You must give accurate information and keep your password private. You are responsible for activity on your account.</p>'+
  '<h2>Food safety</h2><p>Donors are responsible for the safety of the food they list, for describing it accurately, including allergens, ingredients and storage needs, and for following the Food Safety and Standards Act, 2006 and the rules and regulations made under it. Do not list food that is spoiled, unsafe or past a safe use date. Recipients must check food before serving or distributing it. Delivery people must carry food with reasonable care and keep it at a suitable temperature.</p>'+
  '<h2>Our role</h2><p>ZeroCrumb is a coordination tool. It does not prepare, inspect, store or transport food, and it is not a party to any handover between users. Listings are the responsibility of the people who post them.</p>'+
  '<h2>Acceptable use</h2><p>Do not post false or misleading listings, harass other users, misuse contact details you receive for a handover, resell donated food, or try to interfere with or gain unauthorised access to the service.</p>'+
  '<h2>Suspension and removal</h2><p>We may remove listings and suspend or close accounts that break these terms or put people at risk. You may stop using the service at any time.</p>'+
  '<h2>No warranty and limits on liability</h2><p>The service is provided as it is and as available. To the extent the law allows, '+n+' is not liable for illness, loss or damage arising from food shared through the service, from a failed handover, or from the service being unavailable.</p>'+
  '<h2>Governing law</h2><p>These terms are governed by the laws of India. Courts at Erode, Tamil Nadu have jurisdiction over disputes arising from them.</p>'+
  contact()+
  '<h2>Changes</h2><p>We may change these terms. Continued use after a change means you accept the updated terms.</p></article>';
}

var TITLES={privacy:'Privacy policy',terms:'Terms and conditions',signup:'Create account',app:'Dashboard'};
function render(){
  if(!C.ready){document.getElementById('root').innerHTML=shell('<p class="meta" style="padding:32px 0">Loading...</p>');return}
  var hash=(location.hash.replace(/^#\/?/,'')||''),parts=hash.split('?'),r=parts[0],params=new URLSearchParams(parts[1]||''),section=params.get('section')||'overview',body;
  if(r==='privacy')body=privacy();
  else if(r==='terms')body=terms();
  else if(r==='signup')body=signup();
  else if(r==='app'){
    var u=me();
    if(!u){location.hash='#/';return}
    body=u.role==='donor'?donorView(u):u.role==='recipient'?recipientView(u):u.role==='courier'?courierView(u):adminView(u);
  }else body=home();
  document.getElementById('root').innerHTML=shell(body);
  if(r==='app'){var valid=document.querySelector('.dash-section[data-section="'+section+'"]');if(!valid)section='overview';document.querySelectorAll('.dash-section').forEach(function(el){el.hidden=el.dataset.section!==section});document.querySelectorAll('[data-nav-section]').forEach(function(a){var active=a.dataset.navSection===section;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});}
  document.title=(unread()?'('+unread()+') ':'')+(TITLES[r]?TITLES[r]+' | ':'')+'ZeroCrumb';
  flash='';
}

var sb=null,CFG=window.ZC_CONFIG||{};
function ll(a,b){return(a==null||b==null)?null:{lat:a,lng:b}}
function mapProfile(p){return{id:p.id,email:p.email,name:p.name,role:p.role,org:p.org,phone:p.phone,address:p.address,coords:p.coords,status:p.status,created:Date.parse(p.created_at)}}
function mapListing(r){return{id:r.id,donorId:r.donor_id,title:r.title,qty:r.qty,category:r.category,pickup:r.pickup||'',pll:ll(r.pickup_lat,r.pickup_lng),readyBy:r.ready_by,expires:r.expires,notes:r.notes,status:r.status||'available',recipientId:r.recipient_id||null,courierId:r.courier_id||null,dropoff:r.dropoff||'',dll:ll(r.drop_lat,r.drop_lng),log:r.log||{},created:Date.parse(r.created_at)}}
function typing(){
  var a=document.activeElement;
  if(a&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName))return true;
  return Array.prototype.some.call(document.querySelectorAll('form[data-form="listing"] input,form[data-form="listing"] textarea'),function(i){return i.value&&i.type!=='hidden'&&i.name!=='pickup'&&i.name!=='pickupLL'});
}
async function refresh(force){
  if(!sb)return;
  try{
    var s=(await sb.auth.getSession()).data.session,profiles=[],ls=[],notes=[];
    if(s){
      var pr=await sb.from('profiles').select('*');
      if(pr.error)throw pr.error;
      profiles=pr.data.map(mapProfile);
      var m=profiles.find(function(p){return p.id===s.user.id});
      if(!m||m.status!=='active'){
        await sb.auth.signOut();s=null;profiles=[];flash=m?'This account is suspended. Contact an administrator.':'';
      }else{
        var lr=await sb.from('listings').select('*').order('created_at',{ascending:false});
        if(lr.error)throw lr.error;
        ls=lr.data.map(mapListing);
        var nr=await sb.from('notifications').select('*').order('created_at',{ascending:false}).limit(30);
        if(!nr.error)notes=nr.data.map(function(n){return{id:n.id,listingId:n.listing_id,message:n.message,read:n.read,created:Date.parse(n.created_at)}});
        if(m.role==='recipient'){
          var br=await sb.rpc('browse_listings');
          if(br.error)throw br.error;
          br.data.forEach(function(r){
            ls.push(mapListing(r));
            if(!profiles.some(function(p){return p.id===r.donor_id}))profiles.push({id:r.donor_id,name:r.donor_name,org:r.donor_org,role:'donor',status:'active',email:'',phone:'',address:'',coords:'',created:0});
          });
        }
      }
    }
    var sig=JSON.stringify([s&&s.user.id,profiles,ls,notes]),changed=sig!==C.sig;
    C.session=s;C.profiles=profiles;C.listings=ls;C.notes=notes;C.sig=sig;
    if(!C.ready){C.ready=true;render()}
    else if(force||(changed&&!typing()))render();
  }catch(e){
    if(!C.ready){C.ready=true;flash='Could not reach the server. Check your connection and reload.';render()}
  }
}
async function act(id,action,extra,msg){
  var r=await sb.rpc('listing_action',Object.assign({p_id:id,p_action:action},extra||{}));
  flash=r.error?r.error.message:msg;
  await refresh(true);
}

async function doLogin(d,f){
  var err=f.querySelector('.err');err.textContent='';
  var r=await sb.auth.signInWithPassword({email:(d.email||'').trim().toLowerCase(),password:d.password||''});
  if(r.error){err.textContent=/confirm/i.test(r.error.message)?'Confirm your email address first, using the link we sent you.':'Email or password is incorrect.';return}
  await refresh();
  if(!C.session){err.textContent=flash||'Could not sign in.';flash='';return}
  location.hash='#/app';render();
}

async function doSignup(d,f){
  var err=f.querySelector('.err'),email=(d.email||'').trim().toLowerCase(),name=(d.name||'').trim(),address=(d.address||'').trim();
  function fail(m){err.textContent=m}
  if(!name)return fail('Enter your full name.');
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))return fail('Enter a valid email address.');
  if(['donor','recipient','courier'].indexOf(d.role)<0)return fail('Choose a role.');
  if((d.role==='donor'||d.role==='recipient')&&!address)return fail('Enter an address.');
  if((d.coords||'').trim()&&!parseLL(d.coords))return fail('Coordinates must look like 12.9716, 77.5946.');
  if((d.password||'').length<8)return fail('Use a password of at least 8 characters.');
  var r=await sb.auth.signUp({email:email,password:d.password,options:{data:{name:name,role:d.role,org:(d.org||'').trim(),phone:(d.phone||'').trim(),address:address,coords:(d.coords||'').trim()}}});
  if(r.error)return fail(r.error.message);
  if(!r.data.session){flash='Account created. Open the confirmation link we emailed you, then sign in.';location.hash='#/';render();return}
  flash='Account created.';await refresh(true);location.hash='#/app';render();
}

async function doListing(d,f){
  var u=me(),err=f.querySelector('.err');
  if(!u||u.role!=='donor')return;
  function fail(m){err.textContent=m}
  var t=(d.title||'').trim(),q=(d.qty||'').trim(),p=(d.pickup||'').trim();
  if(!t||!q||!p)return fail('Enter the food item, quantity and pickup address.');
  if(!d.readyBy||!d.expires)return fail('Enter both the pickup time and the delivery deadline.');
  var rb=new Date(d.readyBy),ex=new Date(d.expires);
  if(isNaN(rb)||isNaN(ex))return fail('Enter valid dates.');
  if(ex<=new Date())return fail('The delivery deadline must be in the future.');
  if(ex<=rb)return fail('The delivery deadline must be after the pickup time.');
  var pll=parseLL(d.pickupLL);if((d.pickupLL||'').trim()&&!pll)return fail('Coordinates must look like 12.9716, 77.5946.');
  var r=await sb.from('listings').insert({donor_id:u.id,title:t,qty:q,category:d.category,pickup:p,pickup_lat:pll?pll.lat:null,pickup_lng:pll?pll.lng:null,ready_by:rb.toISOString(),expires:ex.toISOString(),notes:(d.notes||'').trim()});
  if(r.error)return fail(r.error.message);
  flash='Listing posted.';await refresh(true);
}

async function doClaim(d,f){
  var u=me(),err=f.querySelector('.err');
  if(!u||u.role!=='recipient')return;
  var dropoff=(d.dropoff||'').trim();
  if(!dropoff){err.textContent='Enter a delivery address.';return}
  var dll=parseLL(d.dropLL);
  if((d.dropLL||'').trim()&&!dll){err.textContent='Coordinates must look like 12.9716, 77.5946.';return}
  await act(d.id,'claim',{p_dropoff:dropoff,p_lat:dll?dll.lat:null,p_lng:dll?dll.lng:null},'Listing claimed. A delivery person can now accept it.');
}

document.addEventListener('submit',function(e){
  var f=e.target.closest('form[data-form]');if(!f)return;
  e.preventDefault();
  var d={};new FormData(f).forEach(function(v,k){d[k]=v});
  var k=f.dataset.form;
  if(k==='login')doLogin(d,f);else if(k==='signup')doSignup(d,f);else if(k==='listing')doListing(d,f);else if(k==='claim')doClaim(d,f);
});

document.addEventListener('click',function(e){
  if(ui.notes&&!e.target.closest('.notes,[data-act="bell"]')){ui.notes=false;render()}
  var b=e.target.closest('[data-act]');if(!b)return;
  var a=b.dataset.act,id=b.dataset.id;
  if(a==='logout'){
    sb.auth.signOut().then(function(){C.session=null;C.profiles=[];C.listings=[];C.notes=[];ui.notes=false;C.sig='';flash='';location.hash='#/';render()});
    return;
  }
  if(a==='geo'){
    var tg=document.getElementById(b.dataset.target),msg=document.querySelector('[data-geo="'+b.dataset.target+'"]');
    if(!tg||!msg)return;
    if(!navigator.geolocation){msg.textContent='This browser cannot share a location. Enter coordinates by hand.';return}
    msg.textContent='Asking for your location...';
    navigator.geolocation.getCurrentPosition(function(p){tg.value=p.coords.latitude.toFixed(5)+', '+p.coords.longitude.toFixed(5);msg.textContent='Location filled in.';tg.dispatchEvent(new Event('input',{bubbles:true}))},function(){msg.textContent='Location was not shared. Enter coordinates by hand.'},{timeout:10000});
    return;
  }
  if(a==='bell'){ui.notes=!ui.notes;render();return}
  var u=me();if(!u)return;
  if(a==='readall'||a==='note'){
    C.notes.forEach(function(n){if(a==='readall'||n.id===id)n.read=true});
    var q=a==='note'?sb.from('notifications').update({read:true}).eq('id',id):sb.from('notifications').update({read:true}).eq('read',false);
    if(a==='note'){ui.notes=false;location.hash='#/app'}
    render();
    q.then(function(){refresh(true)});
    return;
  }
  if(a==='toggle'){
    if(u.role!=='admin'||id===u.id)return;
    var t=U(id);if(!t)return;
    var ns=t.status==='active'?'suspended':'active';
    sb.rpc('admin_set_status',{p_user:id,p_status:ns}).then(function(r){
      flash=r.error?r.error.message:(ns==='active'?'Account reactivated.':'Account suspended.');
      refresh(true);
    });
    return;
  }
  var MSG={cancel:'Listing cancelled.',release:'Claim released. The listing is available again.',accept:'Delivery accepted.',drop:'Job dropped. It is open to other delivery people.',pickup:'Marked as picked up.',deliver:'Marked as delivered.',remove:'Listing removed.'};
  if(MSG[a])act(id,a,null,MSG[a]);
});

window.addEventListener('hashchange',function(){render();window.scrollTo(0,0)});

if(!CFG.url||!CFG.anonKey||!window.supabase){
  document.getElementById('root').innerHTML=shell('<div class="doc"><h1>Backend not configured</h1><p>Add the Supabase project URL and anon key to config.js, then reload this page.</p></div>');
}else{
  sb=window.supabase.createClient(CFG.url,CFG.anonKey);
  refresh();
  setInterval(refresh,20000);
  try{sb.channel('zc-listings').on('postgres_changes',{event:'*',schema:'public',table:'listings'},function(){refresh()}).on('postgres_changes',{event:'*',schema:'public',table:'notifications'},function(){refresh()}).subscribe()}catch(x){}
}
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&ui.notes){ui.notes=false;render()}});
})();
