(()=>{var sp=Object.defineProperty;var rp=(n,t)=>()=>(n&&(t=n(n=0)),t);var op=(n,t)=>{for(var e in t)sp(n,e,{get:t[e],enumerable:!0})};var Jd={};op(Jd,{run:()=>Uv});async function Uv(n){let t=[],e=(o,l,c="")=>{let h=`SELFTEST ${l?"PASS":"FAIL"} ${o}${c?" \u2014 "+c:""}`;t.push(h),console.log(h)},i=[];window.addEventListener("error",o=>i.push(o.message));let s=o=>document.getElementById(o),r=1440;n.step(.5);try{n.seek(n.T_END*.9),n.playing&&Se(" "),n.step(.2);let o=n.T;Se(" "),n.step(1);let l=n.T;e("space starts playback (3 days/s \u2248 4320 min per s)",l>o+2e3,`advanced ${(l-o).toFixed(0)} min in 1 s`),Se(" ");let c=n.T;n.step(.5),e("space pauses",Math.abs(n.T-c)<.01),Se("ArrowRight"),e("\u2192 steps one day",Math.abs(n.T-c-r)<.01),Se("ArrowLeft",{shiftKey:!0}),e("shift+\u2190 steps back one hour",Math.abs(n.T-(c+r-60))<.01),Se("1"),Se(" "),n.step(2);let h=n.T;n.step(1),Se(" "),e("1 = 1 hr/s settles at ~60 sim-min per s (after a smooth ramp)",n.T-h>45&&n.T-h<90,`${(n.T-h).toFixed(1)} min in 1 s`),Se("5"),e("5 selects 1 wk/s",s("speed-label").textContent.includes("wk")),Se("3");let u=s("timeline"),d=u.getBoundingClientRect(),p=d.top+d.height/2,g=D=>d.left+10+(d.width-20)*D;Gs(u,"pointerdown",g(.25),p,1),n.step(.05),Gs(u,"pointerup",g(.25),p),n.step(.1),e("timeline click seeks",Math.abs(n.T-n.T_END*.25)<n.T_END*.01,`T=${n.T.toFixed(0)} want\u2248${(n.T_END*.25).toFixed(0)}`),Gs(u,"pointerdown",g(.5),p,1);for(let D=1;D<=10;D++)Gs(u,"pointermove",g(.5+.025*D),p,1),n.step(.02);Gs(u,"pointerup",g(.75),p),n.step(.1),e("timeline drag scrubs",Math.abs(n.T-n.T_END*.75)<n.T_END*.01,`T=${n.T.toFixed(0)} want\u2248${(n.T_END*.75).toFixed(0)}`),e("scrub on a paused lapse stays paused",!n.playing),u.dispatchEvent(new PointerEvent("pointerleave",{bubbles:!0})),n.seek(n.T_END*.3),n.step(.1);let _=s("c-total").textContent;n.seek(n.T_END*.97),n.step(.1);let m=s("c-total").textContent;n.seek(n.T_END*.3),n.step(.1),e("seek back-and-forth is deterministic",s("c-total").textContent===_&&String(n.R.reduce((D,V)=>D+V.cum,0))===_.replace(/,/g,"")&&_!==m,`${_} \u2194 ${m}`),n.seek(n.T_END-60),n.step(.3),document.querySelector("#board .row:not([hidden])").click(),n.step(1.8),e("board click opens the repo card",!s("focus").hidden&&s("f-name").textContent.length>0,s("f-name").textContent),e("focused repo lists its top-level directories",document.querySelectorAll("#f-tops li").length>0,`${document.querySelectorAll("#f-tops li").length} dirs`);let f=document.querySelector("#stage canvas"),M=f.getBoundingClientRect(),x="";for(let[D,V]of[[0,0],[10,20],[-20,30],[30,-10],[0,60],[-40,50],[60,80],[-80,10]])if(Gs(f,"pointermove",M.left+M.width/2+D,M.top+M.height*.58+V),n.step(.12),!s("tip").hidden&&/lines/.test(s("tip").textContent)){x=s("tip").textContent;break}e("hovering the city shows a file / repo tooltip",!!x,x.slice(0,90)),Se("Escape"),n.step(.3),e("Esc closes the repo card",s("focus").hidden);let w=n.camera.position.distanceTo(n.controls.target);f.dispatchEvent(new WheelEvent("wheel",{deltaY:-600,clientX:M.left+M.width/2,clientY:M.top+M.height/2,bubbles:!0,cancelable:!0})),n.step(.8);let P=n.camera.position.distanceTo(n.controls.target);e("wheel zooms the camera",P<w*.97,`${w.toFixed(1)} \u2192 ${P.toFixed(1)}`),n.seek(n.T_END*.5),Se("h"),Se(" ");let A=n.T;n.step(1);let E=n.T;e("hidden UI keeps rendering and playing",document.body.classList.contains("bare")&&E>A,`${A.toFixed(0)} \u2192 ${E.toFixed(0)}`),Se("h"),Se(" "),n.seek(n.T_END*.8),n.step(.2),Se("a"),n.step(.4);let F=document.querySelectorAll("#who-list li").length;e("A turns the agent lens on",n.lens&&document.body.classList.contains("lens")&&!s("whobox").hidden&&F>=1,`${F} actors: ${s("who-list").textContent.slice(0,80)}`);let y=[...n.whoSoFar].reduce((D,V)=>D+V,0);e("the who split accounts for every commit so far",String(y)===s("c-total").textContent.replace(/,/g,""),`${y} vs ${s("c-total").textContent}`),n.seek(n.T_END*.3),n.step(.4);let T=[...n.whoSoFar].reduce((D,V)=>D+V,0);e("the who split follows a seek",T<=y&&String(T)===s("c-total").textContent.replace(/,/g,""),`${T}`),Se("a"),n.step(.2),e("A again turns the lens off",!n.lens&&s("whobox").hidden),n.seek(n.T_END-20),Se(" "),n.step(1),e("lapse stops at the end",!n.playing&&n.T>=n.T_END-1e-6),Se(" "),n.step(.2),e("play at the end restarts from the start",n.playing&&n.T<5e3,`T=${n.T.toFixed(0)}`),Se(" ")}catch(o){e("selftest ran to completion",!1,o.message+" "+(o.stack||"").split(`
`)[1])}if(n.recMime()){let o=null,l=null;n.setLens(!0,!0),n.record({fmt:"9:16",secs:1}).then(h=>o=h,h=>l=h);let c=null;for(let h=0;h<600&&!o&&!l;h++)n.recording&&n.step(1/30,!0),h===24&&n.recCanvas&&(c=n.recCanvas.toDataURL("image/jpeg",.85)),await fetch(`/favicon.svg?settle=${h}`,{cache:"no-store"}).catch(()=>{});if(!o&&!l&&(l=new Error(`no clip ${JSON.stringify(n.recInfo)}`),n.stopRecord()),e("R records a clip and restores the page",!!o&&o.blob.size>2e3&&!document.body.classList.contains("rec")&&!n.recording,o?`${o.mime} \xB7 ${(o.blob.size/1e3).toFixed(0)} kB \xB7 ${o.W}x${o.H}`:String(l&&l.message)),n.setLens(!1,!0),c){let h=new Image;h.src=c,h.id="selftest-clip",h.style.cssText="position:fixed;right:16px;top:16px;z-index:99;height:calc(100vh - 32px);border-radius:8px;box-shadow:0 0 0 1px #fff3",document.body.appendChild(h)}}else e("recording skipped: no MediaRecorder in this browser",!0);e("no uncaught page errors",i.length===0,i.slice(0,3).join(" | "));let a=document.createElement("pre");a.id="selftest",a.style.cssText="position:fixed;left:16px;top:16px;z-index:99;background:#000d;color:#cfe;padding:12px 14px;font:12px/1.5 ui-monospace,monospace;border-radius:10px;max-width:80vw;white-space:pre-wrap",a.textContent=t.join(`
`),document.body.appendChild(a),console.log("SELFTEST DONE")}var Se,Gs,Kd=rp(()=>{Se=(n,t={})=>window.dispatchEvent(new KeyboardEvent("keydown",{key:n,bubbles:!0,...t})),Gs=(n,t,e,i,s=0)=>n.dispatchEvent(new PointerEvent(t,{clientX:e,clientY:i,pointerId:1,pointerType:"mouse",isPrimary:!0,buttons:s,bubbles:!0}))});var xc="160",ki={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},Vi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},ap=0,Rh=1,lp=2;var ad=1,cp=2,Jn=3,pi=0,Be=1,Kn=2;var Bn=0,ws=1,rn=2,Ch=3,Ph=4,hp=5,Li=100,up=101,dp=102,Lh=103,Ih=104,fp=200,pp=201,mp=202,gp=203,Rl=204,Cl=205,_p=206,xp=207,vp=208,yp=209,Mp=210,bp=211,Sp=212,Ep=213,wp=214,Tp=0,Ap=1,Rp=2,Co=3,Cp=4,Pp=5,Lp=6,Ip=7,ld=0,Dp=1,Up=2,di=0,vc=1,yc=2,Mc=3,Rr=4,Np=5,bc=6;var cd=300,Cs=301,Ps=302,Pl=303,Ll=304,ra=306,Il=1e3,An=1001,Dl=1002,Ge=1003,Dh=1004;var $a=1005;var gn=1006,Fp=1007;var mr=1008;var fi=1009,Op=1010,Bp=1011,Sc=1012,hd=1013,hi=1014,ui=1015,on=1016,ud=1017,dd=1018,Ui=1020,zp=1021,Rn=1023,Hp=1024,kp=1025,Ni=1026,Ls=1027,Vp=1028,fd=1029,Gp=1030,pd=1031,md=1033,Za=33776,Ja=33777,Ka=33778,ja=33779,Uh=35840,Nh=35841,Fh=35842,Oh=35843,gd=36196,Bh=37492,zh=37496,Hh=37808,kh=37809,Vh=37810,Gh=37811,Wh=37812,Xh=37813,qh=37814,Yh=37815,$h=37816,Zh=37817,Jh=37818,Kh=37819,jh=37820,Qh=37821,Qa=36492,tu=36494,eu=36495,Wp=36283,nu=36284,iu=36285,su=36286;var Po=2300,Lo=2301,tl=2302,ru=2400,ou=2401,au=2402;var _d=3e3,Fi=3001,Xp=3200,qp=3201,Yp=0,$p=1,_n="",ye="srgb",Qn="srgb-linear",Ec="display-p3",oa="display-p3-linear",Io="linear",se="srgb",Do="rec709",Uo="p3";var rs=7680;var lu=519,Zp=512,Jp=513,Kp=514,xd=515,jp=516,Qp=517,tm=518,em=519,cu=35044,_i=35048;var hu="300 es",Ul=1035,jn=2e3,No=2001,zn=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;let i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;let s=this._listeners[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;let i=this._listeners[t.type];if(i!==void 0){t.target=this;let s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}},Fe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],uu=1234567,Ts=Math.PI/180,gr=180/Math.PI;function Bs(){let n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Fe[n&255]+Fe[n>>8&255]+Fe[n>>16&255]+Fe[n>>24&255]+"-"+Fe[t&255]+Fe[t>>8&255]+"-"+Fe[t>>16&15|64]+Fe[t>>24&255]+"-"+Fe[e&63|128]+Fe[e>>8&255]+"-"+Fe[e>>16&255]+Fe[e>>24&255]+Fe[i&255]+Fe[i>>8&255]+Fe[i>>16&255]+Fe[i>>24&255]).toLowerCase()}function Ce(n,t,e){return Math.max(t,Math.min(e,n))}function wc(n,t){return(n%t+t)%t}function nm(n,t,e,i,s){return i+(n-t)*(s-i)/(e-t)}function im(n,t,e){return n!==t?(e-n)/(t-n):0}function hr(n,t,e){return(1-e)*n+e*t}function sm(n,t,e,i){return hr(n,t,1-Math.exp(-e*i))}function rm(n,t=1){return t-Math.abs(wc(n,t*2)-t)}function om(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function am(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function lm(n,t){return n+Math.floor(Math.random()*(t-n+1))}function cm(n,t){return n+Math.random()*(t-n)}function hm(n){return n*(.5-Math.random())}function um(n){n!==void 0&&(uu=n);let t=uu+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function dm(n){return n*Ts}function fm(n){return n*gr}function Nl(n){return(n&n-1)===0&&n!==0}function pm(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Fo(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function mm(n,t,e,i,s){let r=Math.cos,a=Math.sin,o=r(e/2),l=a(e/2),c=r((t+i)/2),h=a((t+i)/2),u=r((t-i)/2),d=a((t-i)/2),p=r((i-t)/2),g=a((i-t)/2);switch(s){case"XYX":n.set(o*h,l*u,l*d,o*c);break;case"YZY":n.set(l*d,o*h,l*u,o*c);break;case"ZXZ":n.set(l*u,l*d,o*h,o*c);break;case"XZX":n.set(o*h,l*g,l*p,o*c);break;case"YXY":n.set(l*p,o*h,l*g,o*c);break;case"ZYZ":n.set(l*g,l*p,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function bs(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function ke(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}var aa={DEG2RAD:Ts,RAD2DEG:gr,generateUUID:Bs,clamp:Ce,euclideanModulo:wc,mapLinear:nm,inverseLerp:im,lerp:hr,damp:sm,pingpong:rm,smoothstep:om,smootherstep:am,randInt:lm,randFloat:cm,randFloatSpread:hm,seededRandom:um,degToRad:dm,radToDeg:fm,isPowerOfTwo:Nl,ceilPowerOfTwo:pm,floorPowerOfTwo:Fo,setQuaternionFromProperEuler:mm,normalize:ke,denormalize:bs},ot=class n{constructor(t=0,e=0){n.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let i=this.dot(t)/e;return Math.acos(Ce(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let i=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*i-a*s+t.x,this.y=r*s+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Wt=class n{constructor(t,e,i,s,r,a,o,l,c){n.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,a,o,l,c)}set(t,e,i,s,r,a,o,l,c){let h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=l,h[6]=i,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let i=t.elements,s=e.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],h=i[4],u=i[7],d=i[2],p=i[5],g=i[8],_=s[0],m=s[3],f=s[6],M=s[1],x=s[4],w=s[7],P=s[2],A=s[5],E=s[8];return r[0]=a*_+o*M+l*P,r[3]=a*m+o*x+l*A,r[6]=a*f+o*w+l*E,r[1]=c*_+h*M+u*P,r[4]=c*m+h*x+u*A,r[7]=c*f+h*w+u*E,r[2]=d*_+p*M+g*P,r[5]=d*m+p*x+g*A,r[8]=d*f+p*w+g*E,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-i*r*h+i*o*l+s*r*c-s*a*l}invert(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=h*a-o*c,d=o*l-h*r,p=c*r-a*l,g=e*u+i*d+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return t[0]=u*_,t[1]=(s*c-h*i)*_,t[2]=(o*i-s*a)*_,t[3]=d*_,t[4]=(h*e-s*l)*_,t[5]=(s*r-o*e)*_,t[6]=p*_,t[7]=(i*l-c*e)*_,t[8]=(a*e-i*r)*_,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+t,-s*c,s*l,-s*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(el.makeScale(t,e)),this}rotate(t){return this.premultiply(el.makeRotation(-t)),this}translate(t,e){return this.premultiply(el.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){let i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}},el=new Wt;function vd(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function Oo(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function gm(){let n=Oo("canvas");return n.style.display="block",n}var du={};function ur(n){n in du||(du[n]=!0,console.warn(n))}var fu=new Wt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),pu=new Wt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Kr={[Qn]:{transfer:Io,primaries:Do,toReference:n=>n,fromReference:n=>n},[ye]:{transfer:se,primaries:Do,toReference:n=>n.convertSRGBToLinear(),fromReference:n=>n.convertLinearToSRGB()},[oa]:{transfer:Io,primaries:Uo,toReference:n=>n.applyMatrix3(pu),fromReference:n=>n.applyMatrix3(fu)},[Ec]:{transfer:se,primaries:Uo,toReference:n=>n.convertSRGBToLinear().applyMatrix3(pu),fromReference:n=>n.applyMatrix3(fu).convertLinearToSRGB()}},_m=new Set([Qn,oa]),ne={enabled:!0,_workingColorSpace:Qn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(n){if(!_m.has(n))throw new Error(`Unsupported working color space, "${n}".`);this._workingColorSpace=n},convert:function(n,t,e){if(this.enabled===!1||t===e||!t||!e)return n;let i=Kr[t].toReference,s=Kr[e].fromReference;return s(i(n))},fromWorkingColorSpace:function(n,t){return this.convert(n,this._workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this._workingColorSpace)},getPrimaries:function(n){return Kr[n].primaries},getTransfer:function(n){return n===_n?Io:Kr[n].transfer}};function As(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function nl(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var os,Bo=class{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{os===void 0&&(os=Oo("canvas")),os.width=t.width,os.height=t.height;let i=os.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=os}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=Oo("canvas");e.width=t.width,e.height=t.height;let i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);let s=i.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=As(r[a]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(As(e[i]/255)*255):e[i]=As(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},xm=0,zo=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:xm++}),this.uuid=Bs(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(il(s[a].image)):r.push(il(s[a]))}else r=il(s);i.url=r}return e||(t.images[this.uuid]=i),i}};function il(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Bo.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var vm=0,xn=class n extends zn{constructor(t=n.DEFAULT_IMAGE,e=n.DEFAULT_MAPPING,i=An,s=An,r=gn,a=mr,o=Rn,l=fi,c=n.DEFAULT_ANISOTROPY,h=_n){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:vm++}),this.uuid=Bs(),this.name="",this.source=new zo(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ot(0,0),this.repeat=new ot(1,1),this.center=new ot(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Wt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(ur("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===Fi?ye:_n),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==cd)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Il:t.x=t.x-Math.floor(t.x);break;case An:t.x=t.x<0?0:1;break;case Dl:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Il:t.y=t.y-Math.floor(t.y);break;case An:t.y=t.y<0?0:1;break;case Dl:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return ur("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===ye?Fi:_d}set encoding(t){ur("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===Fi?ye:_n}};xn.DEFAULT_IMAGE=null;xn.DEFAULT_MAPPING=cd;xn.DEFAULT_ANISOTROPY=1;var Ie=class n{constructor(t=0,e=0,i=0,s=1){n.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,i=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*i+a[11]*s+a[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,r,l=t.elements,c=l[0],h=l[4],u=l[8],d=l[1],p=l[5],g=l[9],_=l[2],m=l[6],f=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let x=(c+1)/2,w=(p+1)/2,P=(f+1)/2,A=(h+d)/4,E=(u+_)/4,F=(g+m)/4;return x>w&&x>P?x<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(x),s=A/i,r=E/i):w>P?w<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(w),i=A/s,r=F/s):P<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(P),i=E/r,s=F/r),this.set(i,s,r,e),this}let M=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(M)<.001&&(M=1),this.x=(m-g)/M,this.y=(u-_)/M,this.z=(d-h)/M,this.w=Math.acos((c+p+f-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Fl=class extends zn{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Ie(0,0,t,e),this.scissorTest=!1,this.viewport=new Ie(0,0,t,e);let s={width:t,height:e,depth:1};i.encoding!==void 0&&(ur("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),i.colorSpace=i.encoding===Fi?ye:_n),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:gn,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},i),this.texture=new xn(s,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=i.generateMipmaps,this.texture.internalFormat=i.internalFormat,this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}setSize(t,e,i=1){(this.width!==t||this.height!==e||this.depth!==i)&&(this.width=t,this.height=e,this.depth=i,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=i,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;let e=Object.assign({},t.texture.image);return this.texture.source=new zo(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},De=class extends Fl{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}},Ho=class extends xn{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Ge,this.minFilter=Ge,this.wrapR=An,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Ol=class extends xn{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Ge,this.minFilter=Ge,this.wrapR=An,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var an=class{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,r,a,o){let l=i[s+0],c=i[s+1],h=i[s+2],u=i[s+3],d=r[a+0],p=r[a+1],g=r[a+2],_=r[a+3];if(o===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(o===1){t[e+0]=d,t[e+1]=p,t[e+2]=g,t[e+3]=_;return}if(u!==_||l!==d||c!==p||h!==g){let m=1-o,f=l*d+c*p+h*g+u*_,M=f>=0?1:-1,x=1-f*f;if(x>Number.EPSILON){let P=Math.sqrt(x),A=Math.atan2(P,f*M);m=Math.sin(m*A)/P,o=Math.sin(o*A)/P}let w=o*M;if(l=l*m+d*w,c=c*m+p*w,h=h*m+g*w,u=u*m+_*w,m===1-o){let P=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=P,c*=P,h*=P,u*=P}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,s,r,a){let o=i[s],l=i[s+1],c=i[s+2],h=i[s+3],u=r[a],d=r[a+1],p=r[a+2],g=r[a+3];return t[e]=o*g+h*u+l*p-c*d,t[e+1]=l*g+h*d+c*u-o*p,t[e+2]=c*g+h*p+o*d-l*u,t[e+3]=h*g-o*u-l*d-c*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let i=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(s/2),u=o(r/2),d=l(i/2),p=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=d*h*u+c*p*g,this._y=c*p*u-d*h*g,this._z=c*h*g+d*p*u,this._w=c*h*u-d*p*g;break;case"YXZ":this._x=d*h*u+c*p*g,this._y=c*p*u-d*h*g,this._z=c*h*g-d*p*u,this._w=c*h*u+d*p*g;break;case"ZXY":this._x=d*h*u-c*p*g,this._y=c*p*u+d*h*g,this._z=c*h*g+d*p*u,this._w=c*h*u-d*p*g;break;case"ZYX":this._x=d*h*u-c*p*g,this._y=c*p*u+d*h*g,this._z=c*h*g-d*p*u,this._w=c*h*u+d*p*g;break;case"YZX":this._x=d*h*u+c*p*g,this._y=c*p*u+d*h*g,this._z=c*h*g-d*p*u,this._w=c*h*u-d*p*g;break;case"XZY":this._x=d*h*u-c*p*g,this._y=c*p*u-d*h*g,this._z=c*h*g+d*p*u,this._w=c*h*u+d*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,i=e[0],s=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],u=e[10],d=i+o+u;if(d>0){let p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(h-l)*p,this._y=(r-c)*p,this._z=(a-s)*p}else if(i>o&&i>u){let p=2*Math.sqrt(1+i-o-u);this._w=(h-l)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+c)/p}else if(o>u){let p=2*Math.sqrt(1+o-i-u);this._w=(r-c)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(l+h)/p}else{let p=2*Math.sqrt(1+u-i-o);this._w=(a-s)/p,this._x=(r+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ce(this.dot(t),-1,1)))}rotateTowards(t,e){let i=this.angleTo(t);if(i===0)return this;let s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let i=t._x,s=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-i*c,this._z=r*h+a*c+i*l-s*o,this._w=a*h-i*o-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let i=this._x,s=this._y,r=this._z,a=this._w,o=a*t._w+i*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=i,this._y=s,this._z=r,this;let l=1-o*o;if(l<=Number.EPSILON){let p=1-e;return this._w=p*a+e*this._w,this._x=p*i+e*this._x,this._y=p*s+e*this._y,this._z=p*r+e*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,o),u=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=a*u+this._w*d,this._x=i*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){let t=Math.random(),e=Math.sqrt(1-t),i=Math.sqrt(t),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(s),i*Math.sin(r),i*Math.cos(r),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},C=class n{constructor(t=0,e=0,i=0){n.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(mu.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(mu.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6]*s,this.y=r[1]*e+r[4]*i+r[7]*s,this.z=r[2]*e+r[5]*i+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,i=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(t){let e=this.x,i=this.y,s=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*s-o*i),h=2*(o*e-r*s),u=2*(r*i-a*e);return this.x=e+l*c+a*u-o*h,this.y=i+l*h+o*c-r*u,this.z=s+l*u+r*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*s,this.y=r[1]*e+r[5]*i+r[9]*s,this.z=r[2]*e+r[6]*i+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let i=t.x,s=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=s*l-r*o,this.y=r*a-i*l,this.z=i*o-s*a,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return sl.copy(this).projectOnVector(t),this.sub(sl)}reflect(t){return this.sub(sl.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let i=this.dot(t)/e;return Math.acos(Ce(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){let s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,i=Math.sqrt(1-t**2);return this.x=i*Math.cos(e),this.y=i*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},sl=new C,mu=new an,ti=class{constructor(t=new C(1/0,1/0,1/0),e=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(Sn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(Sn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let i=Sn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let i=t.geometry;if(i!==void 0){let r=i.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Sn):Sn.fromBufferAttribute(r,a),Sn.applyMatrix4(t.matrixWorld),this.expandByPoint(Sn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),jr.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),jr.copy(i.boundingBox)),jr.applyMatrix4(t.matrixWorld),this.union(jr)}let s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,Sn),Sn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(sr),Qr.subVectors(this.max,sr),as.subVectors(t.a,sr),ls.subVectors(t.b,sr),cs.subVectors(t.c,sr),ri.subVectors(ls,as),oi.subVectors(cs,ls),Ti.subVectors(as,cs);let e=[0,-ri.z,ri.y,0,-oi.z,oi.y,0,-Ti.z,Ti.y,ri.z,0,-ri.x,oi.z,0,-oi.x,Ti.z,0,-Ti.x,-ri.y,ri.x,0,-oi.y,oi.x,0,-Ti.y,Ti.x,0];return!rl(e,as,ls,cs,Qr)||(e=[1,0,0,0,1,0,0,0,1],!rl(e,as,ls,cs,Qr))?!1:(to.crossVectors(ri,oi),e=[to.x,to.y,to.z],rl(e,as,ls,cs,Qr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Sn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Sn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Xn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Xn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Xn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Xn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Xn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Xn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Xn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Xn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Xn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}},Xn=[new C,new C,new C,new C,new C,new C,new C,new C],Sn=new C,jr=new ti,as=new C,ls=new C,cs=new C,ri=new C,oi=new C,Ti=new C,sr=new C,Qr=new C,to=new C,Ai=new C;function rl(n,t,e,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){Ai.fromArray(n,r);let o=s.x*Math.abs(Ai.x)+s.y*Math.abs(Ai.y)+s.z*Math.abs(Ai.z),l=t.dot(Ai),c=e.dot(Ai),h=i.dot(Ai);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}var ym=new ti,rr=new C,ol=new C,Pn=class{constructor(t=new C,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let i=this.center;e!==void 0?i.copy(e):ym.setFromPoints(t).getCenter(i);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,i.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;rr.subVectors(t,this.center);let e=rr.lengthSq();if(e>this.radius*this.radius){let i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(rr,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ol.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(rr.copy(t.center).add(ol)),this.expandByPoint(rr.copy(t.center).sub(ol))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}},qn=new C,al=new C,eo=new C,ai=new C,ll=new C,no=new C,cl=new C,mi=class{constructor(t=new C,e=new C(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,qn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=qn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(qn.copy(this.origin).addScaledVector(this.direction,e),qn.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){al.copy(t).add(e).multiplyScalar(.5),eo.copy(e).sub(t).normalize(),ai.copy(this.origin).sub(al);let r=t.distanceTo(e)*.5,a=-this.direction.dot(eo),o=ai.dot(this.direction),l=-ai.dot(eo),c=ai.lengthSq(),h=Math.abs(1-a*a),u,d,p,g;if(h>0)if(u=a*l-o,d=a*o-l,g=r*h,u>=0)if(d>=-g)if(d<=g){let _=1/h;u*=_,d*=_,p=u*(u+a*d+2*o)+d*(a*u+d+2*l)+c}else d=r,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-l),r),p=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-r,-l),r),p=d*(d+2*l)+c):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-l),r),p=-u*u+d*(d+2*l)+c);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),p=-u*u+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(al).addScaledVector(eo,d),p}intersectSphere(t,e){qn.subVectors(t.center,this.origin);let i=qn.dot(this.direction),s=qn.dot(qn)-i*i,r=t.radius*t.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){let i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,r,a,o,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(i=(t.min.x-d.x)*c,s=(t.max.x-d.x)*c):(i=(t.max.x-d.x)*c,s=(t.min.x-d.x)*c),h>=0?(r=(t.min.y-d.y)*h,a=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,a=(t.min.y-d.y)*h),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(o=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,qn)!==null}intersectTriangle(t,e,i,s,r){ll.subVectors(e,t),no.subVectors(i,t),cl.crossVectors(ll,no);let a=this.direction.dot(cl),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;ai.subVectors(this.origin,t);let l=o*this.direction.dot(no.crossVectors(ai,no));if(l<0)return null;let c=o*this.direction.dot(ll.cross(ai));if(c<0||l+c>a)return null;let h=-o*ai.dot(cl);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ie=class n{constructor(t,e,i,s,r,a,o,l,c,h,u,d,p,g,_,m){n.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,a,o,l,c,h,u,d,p,g,_,m)}set(t,e,i,s,r,a,o,l,c,h,u,d,p,g,_,m){let f=this.elements;return f[0]=t,f[4]=e,f[8]=i,f[12]=s,f[1]=r,f[5]=a,f[9]=o,f[13]=l,f[2]=c,f[6]=h,f[10]=u,f[14]=d,f[3]=p,f[7]=g,f[11]=_,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new n().fromArray(this.elements)}copy(t){let e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){let e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,i=t.elements,s=1/hs.setFromMatrixColumn(t,0).length(),r=1/hs.setFromMatrixColumn(t,1).length(),a=1/hs.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*r,e[5]=i[5]*r,e[6]=i[6]*r,e[7]=0,e[8]=i[8]*a,e[9]=i[9]*a,e[10]=i[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,i=t.x,s=t.y,r=t.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){let d=a*h,p=a*u,g=o*h,_=o*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=p+g*c,e[5]=d-_*c,e[9]=-o*l,e[2]=_-d*c,e[6]=g+p*c,e[10]=a*l}else if(t.order==="YXZ"){let d=l*h,p=l*u,g=c*h,_=c*u;e[0]=d+_*o,e[4]=g*o-p,e[8]=a*c,e[1]=a*u,e[5]=a*h,e[9]=-o,e[2]=p*o-g,e[6]=_+d*o,e[10]=a*l}else if(t.order==="ZXY"){let d=l*h,p=l*u,g=c*h,_=c*u;e[0]=d-_*o,e[4]=-a*u,e[8]=g+p*o,e[1]=p+g*o,e[5]=a*h,e[9]=_-d*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){let d=a*h,p=a*u,g=o*h,_=o*u;e[0]=l*h,e[4]=g*c-p,e[8]=d*c+_,e[1]=l*u,e[5]=_*c+d,e[9]=p*c-g,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){let d=a*l,p=a*c,g=o*l,_=o*c;e[0]=l*h,e[4]=_-d*u,e[8]=g*u+p,e[1]=u,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=p*u+g,e[10]=d-_*u}else if(t.order==="XZY"){let d=a*l,p=a*c,g=o*l,_=o*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=d*u+_,e[5]=a*h,e[9]=p*u-g,e[2]=g*u-p,e[6]=o*h,e[10]=_*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Mm,t,bm)}lookAt(t,e,i){let s=this.elements;return nn.subVectors(t,e),nn.lengthSq()===0&&(nn.z=1),nn.normalize(),li.crossVectors(i,nn),li.lengthSq()===0&&(Math.abs(i.z)===1?nn.x+=1e-4:nn.z+=1e-4,nn.normalize(),li.crossVectors(i,nn)),li.normalize(),io.crossVectors(nn,li),s[0]=li.x,s[4]=io.x,s[8]=nn.x,s[1]=li.y,s[5]=io.y,s[9]=nn.y,s[2]=li.z,s[6]=io.z,s[10]=nn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let i=t.elements,s=e.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],h=i[1],u=i[5],d=i[9],p=i[13],g=i[2],_=i[6],m=i[10],f=i[14],M=i[3],x=i[7],w=i[11],P=i[15],A=s[0],E=s[4],F=s[8],y=s[12],T=s[1],D=s[5],V=s[9],Q=s[13],I=s[2],N=s[6],G=s[10],Y=s[14],q=s[3],X=s[7],Z=s[11],nt=s[15];return r[0]=a*A+o*T+l*I+c*q,r[4]=a*E+o*D+l*N+c*X,r[8]=a*F+o*V+l*G+c*Z,r[12]=a*y+o*Q+l*Y+c*nt,r[1]=h*A+u*T+d*I+p*q,r[5]=h*E+u*D+d*N+p*X,r[9]=h*F+u*V+d*G+p*Z,r[13]=h*y+u*Q+d*Y+p*nt,r[2]=g*A+_*T+m*I+f*q,r[6]=g*E+_*D+m*N+f*X,r[10]=g*F+_*V+m*G+f*Z,r[14]=g*y+_*Q+m*Y+f*nt,r[3]=M*A+x*T+w*I+P*q,r[7]=M*E+x*D+w*N+P*X,r[11]=M*F+x*V+w*G+P*Z,r[15]=M*y+x*Q+w*Y+P*nt,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],i=t[4],s=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],u=t[6],d=t[10],p=t[14],g=t[3],_=t[7],m=t[11],f=t[15];return g*(+r*l*u-s*c*u-r*o*d+i*c*d+s*o*p-i*l*p)+_*(+e*l*p-e*c*d+r*a*d-s*a*p+s*c*h-r*l*h)+m*(+e*c*u-e*o*p-r*a*u+i*a*p+r*o*h-i*c*h)+f*(-s*o*h-e*l*u+e*o*d+s*a*u-i*a*d+i*l*h)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=t[9],d=t[10],p=t[11],g=t[12],_=t[13],m=t[14],f=t[15],M=u*m*c-_*d*c+_*l*p-o*m*p-u*l*f+o*d*f,x=g*d*c-h*m*c-g*l*p+a*m*p+h*l*f-a*d*f,w=h*_*c-g*u*c+g*o*p-a*_*p-h*o*f+a*u*f,P=g*u*l-h*_*l-g*o*d+a*_*d+h*o*m-a*u*m,A=e*M+i*x+s*w+r*P;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let E=1/A;return t[0]=M*E,t[1]=(_*d*r-u*m*r-_*s*p+i*m*p+u*s*f-i*d*f)*E,t[2]=(o*m*r-_*l*r+_*s*c-i*m*c-o*s*f+i*l*f)*E,t[3]=(u*l*r-o*d*r-u*s*c+i*d*c+o*s*p-i*l*p)*E,t[4]=x*E,t[5]=(h*m*r-g*d*r+g*s*p-e*m*p-h*s*f+e*d*f)*E,t[6]=(g*l*r-a*m*r-g*s*c+e*m*c+a*s*f-e*l*f)*E,t[7]=(a*d*r-h*l*r+h*s*c-e*d*c-a*s*p+e*l*p)*E,t[8]=w*E,t[9]=(g*u*r-h*_*r-g*i*p+e*_*p+h*i*f-e*u*f)*E,t[10]=(a*_*r-g*o*r+g*i*c-e*_*c-a*i*f+e*o*f)*E,t[11]=(h*o*r-a*u*r-h*i*c+e*u*c+a*i*p-e*o*p)*E,t[12]=P*E,t[13]=(h*_*s-g*u*s+g*i*d-e*_*d-h*i*m+e*u*m)*E,t[14]=(g*o*s-a*_*s-g*i*l+e*_*l+a*i*m-e*o*m)*E,t[15]=(a*u*s-h*o*s+h*i*l-e*u*l-a*i*d+e*o*d)*E,this}scale(t){let e=this.elements,i=t.x,s=t.y,r=t.z;return e[0]*=i,e[4]*=s,e[8]*=r,e[1]*=i,e[5]*=s,e[9]*=r,e[2]*=i,e[6]*=s,e[10]*=r,e[3]*=i,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let i=Math.cos(e),s=Math.sin(e),r=1-i,a=t.x,o=t.y,l=t.z,c=r*a,h=r*o;return this.set(c*a+i,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+i,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,r,a){return this.set(1,i,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){let s=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,h=a+a,u=o+o,d=r*c,p=r*h,g=r*u,_=a*h,m=a*u,f=o*u,M=l*c,x=l*h,w=l*u,P=i.x,A=i.y,E=i.z;return s[0]=(1-(_+f))*P,s[1]=(p+w)*P,s[2]=(g-x)*P,s[3]=0,s[4]=(p-w)*A,s[5]=(1-(d+f))*A,s[6]=(m+M)*A,s[7]=0,s[8]=(g+x)*E,s[9]=(m-M)*E,s[10]=(1-(d+_))*E,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){let s=this.elements,r=hs.set(s[0],s[1],s[2]).length(),a=hs.set(s[4],s[5],s[6]).length(),o=hs.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],En.copy(this);let c=1/r,h=1/a,u=1/o;return En.elements[0]*=c,En.elements[1]*=c,En.elements[2]*=c,En.elements[4]*=h,En.elements[5]*=h,En.elements[6]*=h,En.elements[8]*=u,En.elements[9]*=u,En.elements[10]*=u,e.setFromRotationMatrix(En),i.x=r,i.y=a,i.z=o,this}makePerspective(t,e,i,s,r,a,o=jn){let l=this.elements,c=2*r/(e-t),h=2*r/(i-s),u=(e+t)/(e-t),d=(i+s)/(i-s),p,g;if(o===jn)p=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===No)p=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,s,r,a,o=jn){let l=this.elements,c=1/(e-t),h=1/(i-s),u=1/(a-r),d=(e+t)*c,p=(i+s)*h,g,_;if(o===jn)g=(a+r)*u,_=-2*u;else if(o===No)g=r*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){let e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){let i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}},hs=new C,En=new ie,Mm=new C(0,0,0),bm=new C(1,1,1),li=new C,io=new C,nn=new C,gu=new ie,_u=new an,ko=class n{constructor(t=0,e=0,i=0,s=n.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){let s=t.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin(Ce(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ce(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ce(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ce(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Ce(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-Ce(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return gu.makeRotationFromQuaternion(t),this.setFromRotationMatrix(gu,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return _u.setFromEuler(this),this.setFromQuaternion(_u,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};ko.DEFAULT_ORDER="XYZ";var _r=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Sm=0,xu=new C,us=new an,Yn=new ie,so=new C,or=new C,Em=new C,wm=new an,vu=new C(1,0,0),yu=new C(0,1,0),Mu=new C(0,0,1),Tm={type:"added"},Am={type:"removed"},Xe=class n extends zn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Sm++}),this.uuid=Bs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let t=new C,e=new ko,i=new an,s=new C(1,1,1);function r(){i.setFromEuler(e,!1)}function a(){e.setFromQuaternion(i,void 0,!1)}e._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ie},normalMatrix:{value:new Wt}}),this.matrix=new ie,this.matrixWorld=new ie,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new _r,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return us.setFromAxisAngle(t,e),this.quaternion.multiply(us),this}rotateOnWorldAxis(t,e){return us.setFromAxisAngle(t,e),this.quaternion.premultiply(us),this}rotateX(t){return this.rotateOnAxis(vu,t)}rotateY(t){return this.rotateOnAxis(yu,t)}rotateZ(t){return this.rotateOnAxis(Mu,t)}translateOnAxis(t,e){return xu.copy(t).applyQuaternion(this.quaternion),this.position.add(xu.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(vu,t)}translateY(t){return this.translateOnAxis(yu,t)}translateZ(t){return this.translateOnAxis(Mu,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Yn.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?so.copy(t):so.set(t,e,i);let s=this.parent;this.updateWorldMatrix(!0,!1),or.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Yn.lookAt(or,so,this.up):Yn.lookAt(so,or,this.up),this.quaternion.setFromRotationMatrix(Yn),s&&(Yn.extractRotation(s.matrixWorld),us.setFromRotationMatrix(Yn),this.quaternion.premultiply(us.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(Tm)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Am)),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Yn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Yn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Yn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){let a=this.children[i].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(or,t,Em),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(or,wm,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let i=0,s=e.length;i<s;i++){let r=e[i];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){let i=this.parent;if(t===!0&&i!==null&&i.matrixWorldAutoUpdate===!0&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++){let o=s[r];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(t){let e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(r(t.animations,l))}}if(e){let o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),u=a(t.shapes),d=a(t.skeletons),p=a(t.animations),g=a(t.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),p.length>0&&(i.animations=p),g.length>0&&(i.nodes=g)}return i.object=s,i;function a(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){let s=t.children[i];this.add(s.clone())}return this}};Xe.DEFAULT_UP=new C(0,1,0);Xe.DEFAULT_MATRIX_AUTO_UPDATE=!0;Xe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var wn=new C,$n=new C,hl=new C,Zn=new C,ds=new C,fs=new C,bu=new C,ul=new C,dl=new C,fl=new C,ro=!1,Di=class n{constructor(t=new C,e=new C,i=new C){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),wn.subVectors(t,e),s.cross(wn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,i,s,r){wn.subVectors(s,e),$n.subVectors(i,e),hl.subVectors(t,e);let a=wn.dot(wn),o=wn.dot($n),l=wn.dot(hl),c=$n.dot($n),h=$n.dot(hl),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;let d=1/u,p=(c*l-o*h)*d,g=(a*h-o*l)*d;return r.set(1-p-g,g,p)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,Zn)===null?!1:Zn.x>=0&&Zn.y>=0&&Zn.x+Zn.y<=1}static getUV(t,e,i,s,r,a,o,l){return ro===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),ro=!0),this.getInterpolation(t,e,i,s,r,a,o,l)}static getInterpolation(t,e,i,s,r,a,o,l){return this.getBarycoord(t,e,i,s,Zn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Zn.x),l.addScaledVector(a,Zn.y),l.addScaledVector(o,Zn.z),l)}static isFrontFacing(t,e,i,s){return wn.subVectors(i,e),$n.subVectors(t,e),wn.cross($n).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return wn.subVectors(this.c,this.b),$n.subVectors(this.a,this.b),wn.cross($n).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return n.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return n.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,i,s,r){return ro===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),ro=!0),n.getInterpolation(t,this.a,this.b,this.c,e,i,s,r)}getInterpolation(t,e,i,s,r){return n.getInterpolation(t,this.a,this.b,this.c,e,i,s,r)}containsPoint(t){return n.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return n.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let i=this.a,s=this.b,r=this.c,a,o;ds.subVectors(s,i),fs.subVectors(r,i),ul.subVectors(t,i);let l=ds.dot(ul),c=fs.dot(ul);if(l<=0&&c<=0)return e.copy(i);dl.subVectors(t,s);let h=ds.dot(dl),u=fs.dot(dl);if(h>=0&&u<=h)return e.copy(s);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(i).addScaledVector(ds,a);fl.subVectors(t,r);let p=ds.dot(fl),g=fs.dot(fl);if(g>=0&&p<=g)return e.copy(r);let _=p*c-l*g;if(_<=0&&c>=0&&g<=0)return o=c/(c-g),e.copy(i).addScaledVector(fs,o);let m=h*g-p*u;if(m<=0&&u-h>=0&&p-g>=0)return bu.subVectors(r,s),o=(u-h)/(u-h+(p-g)),e.copy(s).addScaledVector(bu,o);let f=1/(m+_+d);return a=_*f,o=d*f,e.copy(i).addScaledVector(ds,a).addScaledVector(fs,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},yd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ci={h:0,s:0,l:0},oo={h:0,s:0,l:0};function pl(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}var at=class{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=ye){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ne.toWorkingColorSpace(this,e),this}setRGB(t,e,i,s=ne.workingColorSpace){return this.r=t,this.g=e,this.b=i,ne.toWorkingColorSpace(this,s),this}setHSL(t,e,i,s=ne.workingColorSpace){if(t=wc(t,1),e=Ce(e,0,1),i=Ce(i,0,1),e===0)this.r=this.g=this.b=i;else{let r=i<=.5?i*(1+e):i+e-i*e,a=2*i-r;this.r=pl(a,r,t+1/3),this.g=pl(a,r,t),this.b=pl(a,r,t-1/3)}return ne.toWorkingColorSpace(this,s),this}setStyle(t,e=ye){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=ye){let i=yd[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=As(t.r),this.g=As(t.g),this.b=As(t.b),this}copyLinearToSRGB(t){return this.r=nl(t.r),this.g=nl(t.g),this.b=nl(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=ye){return ne.fromWorkingColorSpace(Oe.copy(this),t),Math.round(Ce(Oe.r*255,0,255))*65536+Math.round(Ce(Oe.g*255,0,255))*256+Math.round(Ce(Oe.b*255,0,255))}getHexString(t=ye){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ne.workingColorSpace){ne.fromWorkingColorSpace(Oe.copy(this),e);let i=Oe.r,s=Oe.g,r=Oe.b,a=Math.max(i,s,r),o=Math.min(i,s,r),l,c,h=(o+a)/2;if(o===a)l=0,c=0;else{let u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case i:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-i)/u+2;break;case r:l=(i-s)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=ne.workingColorSpace){return ne.fromWorkingColorSpace(Oe.copy(this),e),t.r=Oe.r,t.g=Oe.g,t.b=Oe.b,t}getStyle(t=ye){ne.fromWorkingColorSpace(Oe.copy(this),t);let e=Oe.r,i=Oe.g,s=Oe.b;return t!==ye?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(ci),this.setHSL(ci.h+t,ci.s+e,ci.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(ci),t.getHSL(oo);let i=hr(ci.h,oo.h,e),s=hr(ci.s,oo.s,e),r=hr(ci.l,oo.l,e);return this.setHSL(i,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,i=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*i+r[6]*s,this.g=r[1]*e+r[4]*i+r[7]*s,this.b=r[2]*e+r[5]*i+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Oe=new at;at.NAMES=yd;var Rm=0,gi=class extends zn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Rm++}),this.uuid=Bs(),this.name="",this.type="Material",this.blending=ws,this.side=pi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Rl,this.blendDst=Cl,this.blendEquation=Li,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new at(0,0,0),this.blendAlpha=0,this.depthFunc=Co,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=lu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=rs,this.stencilZFail=rs,this.stencilZPass=rs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==ws&&(i.blending=this.blending),this.side!==pi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Rl&&(i.blendSrc=this.blendSrc),this.blendDst!==Cl&&(i.blendDst=this.blendDst),this.blendEquation!==Li&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Co&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==lu&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==rs&&(i.stencilFail=this.stencilFail),this.stencilZFail!==rs&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==rs&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(e){let r=s(t.textures),a=s(t.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,i=null;if(e!==null){let s=e.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=e[r].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},Ze=class extends gi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new at(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=ld,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var be=new C,ao=new ot,te=class{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=cu,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=ui,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)ao.fromBufferAttribute(this,e),ao.applyMatrix3(t),this.setXY(e,ao.x,ao.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)be.fromBufferAttribute(this,e),be.applyMatrix3(t),this.setXYZ(e,be.x,be.y,be.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)be.fromBufferAttribute(this,e),be.applyMatrix4(t),this.setXYZ(e,be.x,be.y,be.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)be.fromBufferAttribute(this,e),be.applyNormalMatrix(t),this.setXYZ(e,be.x,be.y,be.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)be.fromBufferAttribute(this,e),be.transformDirection(t),this.setXYZ(e,be.x,be.y,be.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=bs(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=ke(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=bs(e,this.array)),e}setX(t,e){return this.normalized&&(e=ke(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=bs(e,this.array)),e}setY(t,e){return this.normalized&&(e=ke(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=bs(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ke(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=bs(e,this.array)),e}setW(t,e){return this.normalized&&(e=ke(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=ke(e,this.array),i=ke(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=ke(e,this.array),i=ke(i,this.array),s=ke(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,r){return t*=this.itemSize,this.normalized&&(e=ke(e,this.array),i=ke(i,this.array),s=ke(s,this.array),r=ke(r,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==cu&&(t.usage=this.usage),t}};var Vo=class extends te{constructor(t,e,i){super(new Uint16Array(t),e,i)}};var Go=class extends te{constructor(t,e,i){super(new Uint32Array(t),e,i)}};var Zt=class extends te{constructor(t,e,i){super(new Float32Array(t),e,i)}};var Cm=0,mn=new ie,ml=new Xe,ps=new C,sn=new ti,ar=new ti,Re=new C,he=class n extends zn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Cm++}),this.uuid=Bs(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(vd(t)?Go:Vo)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let r=new Wt().getNormalMatrix(t);i.applyNormalMatrix(r),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return mn.makeRotationFromQuaternion(t),this.applyMatrix4(mn),this}rotateX(t){return mn.makeRotationX(t),this.applyMatrix4(mn),this}rotateY(t){return mn.makeRotationY(t),this.applyMatrix4(mn),this}rotateZ(t){return mn.makeRotationZ(t),this.applyMatrix4(mn),this}translate(t,e,i){return mn.makeTranslation(t,e,i),this.applyMatrix4(mn),this}scale(t,e,i){return mn.makeScale(t,e,i),this.applyMatrix4(mn),this}lookAt(t){return ml.lookAt(t),ml.updateMatrix(),this.applyMatrix4(ml.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ps).negate(),this.translate(ps.x,ps.y,ps.z),this}setFromPoints(t){let e=[];for(let i=0,s=t.length;i<s;i++){let r=t[i];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new Zt(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ti);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){let r=e[i];sn.setFromBufferAttribute(r),this.morphTargetsRelative?(Re.addVectors(this.boundingBox.min,sn.min),this.boundingBox.expandByPoint(Re),Re.addVectors(this.boundingBox.max,sn.max),this.boundingBox.expandByPoint(Re)):(this.boundingBox.expandByPoint(sn.min),this.boundingBox.expandByPoint(sn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Pn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new C,1/0);return}if(t){let i=this.boundingSphere.center;if(sn.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){let o=e[r];ar.setFromBufferAttribute(o),this.morphTargetsRelative?(Re.addVectors(sn.min,ar.min),sn.expandByPoint(Re),Re.addVectors(sn.max,ar.max),sn.expandByPoint(Re)):(sn.expandByPoint(ar.min),sn.expandByPoint(ar.max))}sn.getCenter(i);let s=0;for(let r=0,a=t.count;r<a;r++)Re.fromBufferAttribute(t,r),s=Math.max(s,i.distanceToSquared(Re));if(e)for(let r=0,a=e.length;r<a;r++){let o=e[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Re.fromBufferAttribute(o,c),l&&(ps.fromBufferAttribute(t,c),Re.add(ps)),s=Math.max(s,i.distanceToSquared(Re))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=t.array,s=e.position.array,r=e.normal.array,a=e.uv.array,o=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new te(new Float32Array(4*o),4));let l=this.getAttribute("tangent").array,c=[],h=[];for(let T=0;T<o;T++)c[T]=new C,h[T]=new C;let u=new C,d=new C,p=new C,g=new ot,_=new ot,m=new ot,f=new C,M=new C;function x(T,D,V){u.fromArray(s,T*3),d.fromArray(s,D*3),p.fromArray(s,V*3),g.fromArray(a,T*2),_.fromArray(a,D*2),m.fromArray(a,V*2),d.sub(u),p.sub(u),_.sub(g),m.sub(g);let Q=1/(_.x*m.y-m.x*_.y);isFinite(Q)&&(f.copy(d).multiplyScalar(m.y).addScaledVector(p,-_.y).multiplyScalar(Q),M.copy(p).multiplyScalar(_.x).addScaledVector(d,-m.x).multiplyScalar(Q),c[T].add(f),c[D].add(f),c[V].add(f),h[T].add(M),h[D].add(M),h[V].add(M))}let w=this.groups;w.length===0&&(w=[{start:0,count:i.length}]);for(let T=0,D=w.length;T<D;++T){let V=w[T],Q=V.start,I=V.count;for(let N=Q,G=Q+I;N<G;N+=3)x(i[N+0],i[N+1],i[N+2])}let P=new C,A=new C,E=new C,F=new C;function y(T){E.fromArray(r,T*3),F.copy(E);let D=c[T];P.copy(D),P.sub(E.multiplyScalar(E.dot(D))).normalize(),A.crossVectors(F,D);let Q=A.dot(h[T])<0?-1:1;l[T*4]=P.x,l[T*4+1]=P.y,l[T*4+2]=P.z,l[T*4+3]=Q}for(let T=0,D=w.length;T<D;++T){let V=w[T],Q=V.start,I=V.count;for(let N=Q,G=Q+I;N<G;N+=3)y(i[N+0]),y(i[N+1]),y(i[N+2])}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new te(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,p=i.count;d<p;d++)i.setXYZ(d,0,0,0);let s=new C,r=new C,a=new C,o=new C,l=new C,c=new C,h=new C,u=new C;if(t)for(let d=0,p=t.count;d<p;d+=3){let g=t.getX(d+0),_=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),a.fromBufferAttribute(e,m),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(i,g),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,m),o.add(h),l.add(h),c.add(h),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,p=e.count;d<p;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Re.fromBufferAttribute(t,e),Re.normalize(),t.setXYZ(e,Re.x,Re.y,Re.z)}toNonIndexed(){function t(o,l){let c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h),p=0,g=0;for(let _=0,m=l.length;_<m;_++){o.isInterleavedBufferAttribute?p=l[_]*o.data.stride+o.offset:p=l[_]*h;for(let f=0;f<h;f++)d[g++]=c[p++]}return new te(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new n,i=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=t(l,i);e.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){let d=c[h],p=t(d,i);l.push(p)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let i=this.attributes;for(let l in i){let c=i[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let p=c[u];h.push(p.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let i=t.index;i!==null&&this.setIndex(i.clone(e));let s=t.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(e))}let r=t.morphAttributes;for(let c in r){let h=[],u=r[c];for(let d=0,p=u.length;d<p;d++)h.push(u[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let a=t.groups;for(let c=0,h=a.length;c<h;c++){let u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Su=new ie,Ri=new mi,lo=new Pn,Eu=new C,ms=new C,gs=new C,_s=new C,gl=new C,co=new C,ho=new ot,uo=new ot,fo=new ot,wu=new C,Tu=new C,Au=new C,po=new C,mo=new C,ae=class extends Xe{constructor(t=new he,e=new Ze){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){let s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){let i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;e.fromBufferAttribute(s,t);let o=this.morphTargetInfluences;if(r&&o){co.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=o[l],u=r[l];h!==0&&(gl.fromBufferAttribute(u,t),a?co.addScaledVector(gl,h):co.addScaledVector(gl.sub(e),h))}e.add(co)}return e}raycast(t,e){let i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),lo.copy(i.boundingSphere),lo.applyMatrix4(r),Ri.copy(t.ray).recast(t.near),!(lo.containsPoint(Ri.origin)===!1&&(Ri.intersectSphere(lo,Eu)===null||Ri.origin.distanceToSquared(Eu)>(t.far-t.near)**2))&&(Su.copy(r).invert(),Ri.copy(t.ray).applyMatrix4(Su),!(i.boundingBox!==null&&Ri.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,Ri)))}_computeIntersections(t,e,i){let s,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){let m=d[g],f=a[m.materialIndex],M=Math.max(m.start,p.start),x=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let w=M,P=x;w<P;w+=3){let A=o.getX(w),E=o.getX(w+1),F=o.getX(w+2);s=go(this,f,t,i,c,h,u,A,E,F),s&&(s.faceIndex=Math.floor(w/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let g=Math.max(0,p.start),_=Math.min(o.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){let M=o.getX(m),x=o.getX(m+1),w=o.getX(m+2);s=go(this,a,t,i,c,h,u,M,x,w),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){let m=d[g],f=a[m.materialIndex],M=Math.max(m.start,p.start),x=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let w=M,P=x;w<P;w+=3){let A=w,E=w+1,F=w+2;s=go(this,f,t,i,c,h,u,A,E,F),s&&(s.faceIndex=Math.floor(w/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let g=Math.max(0,p.start),_=Math.min(l.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){let M=m,x=m+1,w=m+2;s=go(this,a,t,i,c,h,u,M,x,w),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}};function Pm(n,t,e,i,s,r,a,o){let l;if(t.side===Be?l=i.intersectTriangle(a,r,s,!0,o):l=i.intersectTriangle(s,r,a,t.side===pi,o),l===null)return null;mo.copy(o),mo.applyMatrix4(n.matrixWorld);let c=e.ray.origin.distanceTo(mo);return c<e.near||c>e.far?null:{distance:c,point:mo.clone(),object:n}}function go(n,t,e,i,s,r,a,o,l,c){n.getVertexPosition(o,ms),n.getVertexPosition(l,gs),n.getVertexPosition(c,_s);let h=Pm(n,t,e,i,ms,gs,_s,po);if(h){s&&(ho.fromBufferAttribute(s,o),uo.fromBufferAttribute(s,l),fo.fromBufferAttribute(s,c),h.uv=Di.getInterpolation(po,ms,gs,_s,ho,uo,fo,new ot)),r&&(ho.fromBufferAttribute(r,o),uo.fromBufferAttribute(r,l),fo.fromBufferAttribute(r,c),h.uv1=Di.getInterpolation(po,ms,gs,_s,ho,uo,fo,new ot),h.uv2=h.uv1),a&&(wu.fromBufferAttribute(a,o),Tu.fromBufferAttribute(a,l),Au.fromBufferAttribute(a,c),h.normal=Di.getInterpolation(po,ms,gs,_s,wu,Tu,Au,new C),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));let u={a:o,b:l,c,normal:new C,materialIndex:0};Di.getNormal(ms,gs,_s,u.normal),h.face=u}return h}var Oi=class n extends he{constructor(t=1,e=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],h=[],u=[],d=0,p=0;g("z","y","x",-1,-1,i,e,t,a,r,0),g("z","y","x",1,-1,i,e,-t,a,r,1),g("x","z","y",1,1,t,i,e,s,a,2),g("x","z","y",1,-1,t,i,-e,s,a,3),g("x","y","z",1,-1,t,e,i,s,r,4),g("x","y","z",-1,-1,t,e,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new Zt(c,3)),this.setAttribute("normal",new Zt(h,3)),this.setAttribute("uv",new Zt(u,2));function g(_,m,f,M,x,w,P,A,E,F,y){let T=w/E,D=P/F,V=w/2,Q=P/2,I=A/2,N=E+1,G=F+1,Y=0,q=0,X=new C;for(let Z=0;Z<G;Z++){let nt=Z*D-Q;for(let dt=0;dt<N;dt++){let W=dt*T-V;X[_]=W*M,X[m]=nt*x,X[f]=I,c.push(X.x,X.y,X.z),X[_]=0,X[m]=0,X[f]=A>0?1:-1,h.push(X.x,X.y,X.z),u.push(dt/E),u.push(1-Z/F),Y+=1}}for(let Z=0;Z<F;Z++)for(let nt=0;nt<E;nt++){let dt=d+nt+N*Z,W=d+nt+N*(Z+1),$=d+(nt+1)+N*(Z+1),ut=d+(nt+1)+N*Z;l.push(dt,W,ut),l.push(W,$,ut),q+=6}o.addGroup(p,q,y),p+=q,d+=Y}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function Is(n){let t={};for(let e in n){t[e]={};for(let i in n[e]){let s=n[e][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone():Array.isArray(s)?t[e][i]=s.slice():t[e][i]=s}}return t}function Ve(n){let t={};for(let e=0;e<n.length;e++){let i=Is(n[e]);for(let s in i)t[s]=i[s]}return t}function Lm(n){let t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Md(n){return n.getRenderTarget()===null?n.outputColorSpace:ne.workingColorSpace}var xi={clone:Is,merge:Ve},Im=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Dm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,re=class extends gi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Im,this.fragmentShader=Dm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Is(t.uniforms),this.uniformsGroups=Lm(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}},Wo=class extends Xe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ie,this.projectionMatrix=new ie,this.projectionMatrixInverse=new ie,this.coordinateSystem=jn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},We=class extends Wo{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=gr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Ts*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return gr*2*Math.atan(Math.tan(Ts*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,i,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(Ts*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,e-=a.offsetY*i/c,s*=a.width/l,i*=a.height/c}let o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},xs=-90,vs=1,Bl=class extends Xe{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new We(xs,vs,t,e);s.layers=this.layers,this.add(s);let r=new We(xs,vs,t,e);r.layers=this.layers,this.add(r);let a=new We(xs,vs,t,e);a.layers=this.layers,this.add(a);let o=new We(xs,vs,t,e);o.layers=this.layers,this.add(o);let l=new We(xs,vs,t,e);l.layers=this.layers,this.add(l);let c=new We(xs,vs,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[i,s,r,a,o,l]=e;for(let c of e)this.remove(c);if(t===jn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===No)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,c,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;let _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,s),t.render(e,r),t.setRenderTarget(i,1,s),t.render(e,a),t.setRenderTarget(i,2,s),t.render(e,o),t.setRenderTarget(i,3,s),t.render(e,l),t.setRenderTarget(i,4,s),t.render(e,c),i.texture.generateMipmaps=_,t.setRenderTarget(i,5,s),t.render(e,h),t.setRenderTarget(u,d,p),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}},Xo=class extends xn{constructor(t,e,i,s,r,a,o,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:Cs,super(t,e,i,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},zl=class extends De{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];e.encoding!==void 0&&(ur("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===Fi?ye:_n),this.texture=new Xo(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:gn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Oi(5,5,5),r=new re({name:"CubemapFromEquirect",uniforms:Is(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Be,blending:Bn});r.uniforms.tEquirect.value=e;let a=new ae(s,r),o=e.minFilter;return e.minFilter===mr&&(e.minFilter=gn),new Bl(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,i,s){let r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,i,s);t.setRenderTarget(r)}},_l=new C,Um=new C,Nm=new Wt,Tn=class{constructor(t=new C(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){let s=_l.subVectors(i,e).cross(Um.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let i=t.delta(_l),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(i,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let i=e||Nm.getNormalMatrix(t),s=this.coplanarPoint(_l).applyMatrix4(t),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},Ci=new Pn,_o=new C,qo=class{constructor(t=new Tn,e=new Tn,i=new Tn,s=new Tn,r=new Tn,a=new Tn){this.planes=[t,e,i,s,r,a]}set(t,e,i,s,r,a){let o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){let e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=jn){let i=this.planes,s=t.elements,r=s[0],a=s[1],o=s[2],l=s[3],c=s[4],h=s[5],u=s[6],d=s[7],p=s[8],g=s[9],_=s[10],m=s[11],f=s[12],M=s[13],x=s[14],w=s[15];if(i[0].setComponents(l-r,d-c,m-p,w-f).normalize(),i[1].setComponents(l+r,d+c,m+p,w+f).normalize(),i[2].setComponents(l+a,d+h,m+g,w+M).normalize(),i[3].setComponents(l-a,d-h,m-g,w-M).normalize(),i[4].setComponents(l-o,d-u,m-_,w-x).normalize(),e===jn)i[5].setComponents(l+o,d+u,m+_,w+x).normalize();else if(e===No)i[5].setComponents(o,u,_,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ci.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ci.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ci)}intersectsSprite(t){return Ci.center.set(0,0,0),Ci.radius=.7071067811865476,Ci.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ci)}intersectsSphere(t){let e=this.planes,i=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let i=0;i<6;i++){let s=e[i];if(_o.x=s.normal.x>0?t.max.x:t.min.x,_o.y=s.normal.y>0?t.max.y:t.min.y,_o.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(_o)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function bd(){let n=null,t=!1,e=null,i=null;function s(r,a){e(r,a),i=n.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){n=r}}}function Fm(n,t){let e=t.isWebGL2,i=new WeakMap;function s(c,h){let u=c.array,d=c.usage,p=u.byteLength,g=n.createBuffer();n.bindBuffer(h,g),n.bufferData(h,u,d),c.onUploadCallback();let _;if(u instanceof Float32Array)_=n.FLOAT;else if(u instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(e)_=n.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else _=n.UNSIGNED_SHORT;else if(u instanceof Int16Array)_=n.SHORT;else if(u instanceof Uint32Array)_=n.UNSIGNED_INT;else if(u instanceof Int32Array)_=n.INT;else if(u instanceof Int8Array)_=n.BYTE;else if(u instanceof Uint8Array)_=n.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)_=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:g,type:_,bytesPerElement:u.BYTES_PER_ELEMENT,version:c.version,size:p}}function r(c,h,u){let d=h.array,p=h._updateRange,g=h.updateRanges;if(n.bindBuffer(u,c),p.count===-1&&g.length===0&&n.bufferSubData(u,0,d),g.length!==0){for(let _=0,m=g.length;_<m;_++){let f=g[_];e?n.bufferSubData(u,f.start*d.BYTES_PER_ELEMENT,d,f.start,f.count):n.bufferSubData(u,f.start*d.BYTES_PER_ELEMENT,d.subarray(f.start,f.start+f.count))}h.clearUpdateRanges()}p.count!==-1&&(e?n.bufferSubData(u,p.offset*d.BYTES_PER_ELEMENT,d,p.offset,p.count):n.bufferSubData(u,p.offset*d.BYTES_PER_ELEMENT,d.subarray(p.offset,p.offset+p.count)),p.count=-1),h.onUploadCallback()}function a(c){return c.isInterleavedBufferAttribute&&(c=c.data),i.get(c)}function o(c){c.isInterleavedBufferAttribute&&(c=c.data);let h=i.get(c);h&&(n.deleteBuffer(h.buffer),i.delete(c))}function l(c,h){if(c.isGLBufferAttribute){let d=i.get(c);(!d||d.version<c.version)&&i.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);let u=i.get(c);if(u===void 0)i.set(c,s(c,h));else if(u.version<c.version){if(u.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(u.buffer,c,h),u.version=c.version}}return{get:a,remove:o,update:l}}var xr=class n extends he{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};let r=t/2,a=e/2,o=Math.floor(i),l=Math.floor(s),c=o+1,h=l+1,u=t/o,d=e/l,p=[],g=[],_=[],m=[];for(let f=0;f<h;f++){let M=f*d-a;for(let x=0;x<c;x++){let w=x*u-r;g.push(w,-M,0),_.push(0,0,1),m.push(x/o),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let M=0;M<o;M++){let x=M+c*f,w=M+c*(f+1),P=M+1+c*(f+1),A=M+1+c*f;p.push(x,w,A),p.push(w,P,A)}this.setIndex(p),this.setAttribute("position",new Zt(g,3)),this.setAttribute("normal",new Zt(_,3)),this.setAttribute("uv",new Zt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.width,t.height,t.widthSegments,t.heightSegments)}},Om=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Bm=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,zm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Hm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,km=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Vm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Gm=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Wm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Xm=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,qm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Ym=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,$m=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Zm=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Jm=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Km=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,jm=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,Qm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,tg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,eg=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,ng=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,ig=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,sg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,rg=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,og=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,ag=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,lg=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,cg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,hg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,ug=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,dg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,fg="gl_FragColor = linearToOutputTexel( gl_FragColor );",pg=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,mg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,gg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,_g=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,xg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,vg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,yg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Mg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,bg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Sg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Eg=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,wg=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,Tg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ag=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Rg=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Cg=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Pg=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Lg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Ig=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Dg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Ug=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Ng=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Fg=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Og=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Bg=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,zg=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Hg=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,kg=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Vg=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Gg=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,Wg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Xg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,qg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Yg=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,$g=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Zg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Jg=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Kg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,jg=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,Qg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,t0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,e0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,n0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,i0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,s0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,r0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,o0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,a0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,l0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,c0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,h0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,u0=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,d0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,f0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,p0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,m0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,g0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,_0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,x0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,v0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,y0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,M0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,b0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,S0=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,E0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,w0=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,T0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,A0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,R0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,C0=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color *= toneMappingExposure;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	return color;
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,P0=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,L0=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,I0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,D0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,U0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,N0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,F0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,O0=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,B0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,z0=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,H0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,k0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,V0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,G0=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,W0=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,X0=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,q0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Y0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$0=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Z0=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,J0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,K0=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,j0=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Q0=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,t_=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,e_=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,n_=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,i_=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,s_=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,r_=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,o_=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,a_=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,l_=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,c_=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,h_=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,u_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,d_=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,f_=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,p_=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,m_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ht={alphahash_fragment:Om,alphahash_pars_fragment:Bm,alphamap_fragment:zm,alphamap_pars_fragment:Hm,alphatest_fragment:km,alphatest_pars_fragment:Vm,aomap_fragment:Gm,aomap_pars_fragment:Wm,batching_pars_vertex:Xm,batching_vertex:qm,begin_vertex:Ym,beginnormal_vertex:$m,bsdfs:Zm,iridescence_fragment:Jm,bumpmap_pars_fragment:Km,clipping_planes_fragment:jm,clipping_planes_pars_fragment:Qm,clipping_planes_pars_vertex:tg,clipping_planes_vertex:eg,color_fragment:ng,color_pars_fragment:ig,color_pars_vertex:sg,color_vertex:rg,common:og,cube_uv_reflection_fragment:ag,defaultnormal_vertex:lg,displacementmap_pars_vertex:cg,displacementmap_vertex:hg,emissivemap_fragment:ug,emissivemap_pars_fragment:dg,colorspace_fragment:fg,colorspace_pars_fragment:pg,envmap_fragment:mg,envmap_common_pars_fragment:gg,envmap_pars_fragment:_g,envmap_pars_vertex:xg,envmap_physical_pars_fragment:Pg,envmap_vertex:vg,fog_vertex:yg,fog_pars_vertex:Mg,fog_fragment:bg,fog_pars_fragment:Sg,gradientmap_pars_fragment:Eg,lightmap_fragment:wg,lightmap_pars_fragment:Tg,lights_lambert_fragment:Ag,lights_lambert_pars_fragment:Rg,lights_pars_begin:Cg,lights_toon_fragment:Lg,lights_toon_pars_fragment:Ig,lights_phong_fragment:Dg,lights_phong_pars_fragment:Ug,lights_physical_fragment:Ng,lights_physical_pars_fragment:Fg,lights_fragment_begin:Og,lights_fragment_maps:Bg,lights_fragment_end:zg,logdepthbuf_fragment:Hg,logdepthbuf_pars_fragment:kg,logdepthbuf_pars_vertex:Vg,logdepthbuf_vertex:Gg,map_fragment:Wg,map_pars_fragment:Xg,map_particle_fragment:qg,map_particle_pars_fragment:Yg,metalnessmap_fragment:$g,metalnessmap_pars_fragment:Zg,morphcolor_vertex:Jg,morphnormal_vertex:Kg,morphtarget_pars_vertex:jg,morphtarget_vertex:Qg,normal_fragment_begin:t0,normal_fragment_maps:e0,normal_pars_fragment:n0,normal_pars_vertex:i0,normal_vertex:s0,normalmap_pars_fragment:r0,clearcoat_normal_fragment_begin:o0,clearcoat_normal_fragment_maps:a0,clearcoat_pars_fragment:l0,iridescence_pars_fragment:c0,opaque_fragment:h0,packing:u0,premultiplied_alpha_fragment:d0,project_vertex:f0,dithering_fragment:p0,dithering_pars_fragment:m0,roughnessmap_fragment:g0,roughnessmap_pars_fragment:_0,shadowmap_pars_fragment:x0,shadowmap_pars_vertex:v0,shadowmap_vertex:y0,shadowmask_pars_fragment:M0,skinbase_vertex:b0,skinning_pars_vertex:S0,skinning_vertex:E0,skinnormal_vertex:w0,specularmap_fragment:T0,specularmap_pars_fragment:A0,tonemapping_fragment:R0,tonemapping_pars_fragment:C0,transmission_fragment:P0,transmission_pars_fragment:L0,uv_pars_fragment:I0,uv_pars_vertex:D0,uv_vertex:U0,worldpos_vertex:N0,background_vert:F0,background_frag:O0,backgroundCube_vert:B0,backgroundCube_frag:z0,cube_vert:H0,cube_frag:k0,depth_vert:V0,depth_frag:G0,distanceRGBA_vert:W0,distanceRGBA_frag:X0,equirect_vert:q0,equirect_frag:Y0,linedashed_vert:$0,linedashed_frag:Z0,meshbasic_vert:J0,meshbasic_frag:K0,meshlambert_vert:j0,meshlambert_frag:Q0,meshmatcap_vert:t_,meshmatcap_frag:e_,meshnormal_vert:n_,meshnormal_frag:i_,meshphong_vert:s_,meshphong_frag:r_,meshphysical_vert:o_,meshphysical_frag:a_,meshtoon_vert:l_,meshtoon_frag:c_,points_vert:h_,points_frag:u_,shadow_vert:d_,shadow_frag:f_,sprite_vert:p_,sprite_frag:m_},rt={common:{diffuse:{value:new at(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Wt},alphaMap:{value:null},alphaMapTransform:{value:new Wt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Wt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Wt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Wt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Wt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Wt},normalScale:{value:new ot(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Wt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Wt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Wt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Wt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new at(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new at(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Wt},alphaTest:{value:0},uvTransform:{value:new Wt}},sprite:{diffuse:{value:new at(16777215)},opacity:{value:1},center:{value:new ot(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Wt},alphaMap:{value:null},alphaMapTransform:{value:new Wt},alphaTest:{value:0}}},On={basic:{uniforms:Ve([rt.common,rt.specularmap,rt.envmap,rt.aomap,rt.lightmap,rt.fog]),vertexShader:Ht.meshbasic_vert,fragmentShader:Ht.meshbasic_frag},lambert:{uniforms:Ve([rt.common,rt.specularmap,rt.envmap,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.fog,rt.lights,{emissive:{value:new at(0)}}]),vertexShader:Ht.meshlambert_vert,fragmentShader:Ht.meshlambert_frag},phong:{uniforms:Ve([rt.common,rt.specularmap,rt.envmap,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.fog,rt.lights,{emissive:{value:new at(0)},specular:{value:new at(1118481)},shininess:{value:30}}]),vertexShader:Ht.meshphong_vert,fragmentShader:Ht.meshphong_frag},standard:{uniforms:Ve([rt.common,rt.envmap,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.roughnessmap,rt.metalnessmap,rt.fog,rt.lights,{emissive:{value:new at(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ht.meshphysical_vert,fragmentShader:Ht.meshphysical_frag},toon:{uniforms:Ve([rt.common,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.gradientmap,rt.fog,rt.lights,{emissive:{value:new at(0)}}]),vertexShader:Ht.meshtoon_vert,fragmentShader:Ht.meshtoon_frag},matcap:{uniforms:Ve([rt.common,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.fog,{matcap:{value:null}}]),vertexShader:Ht.meshmatcap_vert,fragmentShader:Ht.meshmatcap_frag},points:{uniforms:Ve([rt.points,rt.fog]),vertexShader:Ht.points_vert,fragmentShader:Ht.points_frag},dashed:{uniforms:Ve([rt.common,rt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ht.linedashed_vert,fragmentShader:Ht.linedashed_frag},depth:{uniforms:Ve([rt.common,rt.displacementmap]),vertexShader:Ht.depth_vert,fragmentShader:Ht.depth_frag},normal:{uniforms:Ve([rt.common,rt.bumpmap,rt.normalmap,rt.displacementmap,{opacity:{value:1}}]),vertexShader:Ht.meshnormal_vert,fragmentShader:Ht.meshnormal_frag},sprite:{uniforms:Ve([rt.sprite,rt.fog]),vertexShader:Ht.sprite_vert,fragmentShader:Ht.sprite_frag},background:{uniforms:{uvTransform:{value:new Wt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ht.background_vert,fragmentShader:Ht.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Ht.backgroundCube_vert,fragmentShader:Ht.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ht.cube_vert,fragmentShader:Ht.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ht.equirect_vert,fragmentShader:Ht.equirect_frag},distanceRGBA:{uniforms:Ve([rt.common,rt.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ht.distanceRGBA_vert,fragmentShader:Ht.distanceRGBA_frag},shadow:{uniforms:Ve([rt.lights,rt.fog,{color:{value:new at(0)},opacity:{value:1}}]),vertexShader:Ht.shadow_vert,fragmentShader:Ht.shadow_frag}};On.physical={uniforms:Ve([On.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Wt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Wt},clearcoatNormalScale:{value:new ot(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Wt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Wt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Wt},sheen:{value:0},sheenColor:{value:new at(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Wt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Wt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Wt},transmissionSamplerSize:{value:new ot},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Wt},attenuationDistance:{value:0},attenuationColor:{value:new at(0)},specularColor:{value:new at(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Wt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Wt},anisotropyVector:{value:new ot},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Wt}}]),vertexShader:Ht.meshphysical_vert,fragmentShader:Ht.meshphysical_frag};var xo={r:0,b:0,g:0};function g_(n,t,e,i,s,r,a){let o=new at(0),l=r===!0?0:1,c,h,u=null,d=0,p=null;function g(m,f){let M=!1,x=f.isScene===!0?f.background:null;x&&x.isTexture&&(x=(f.backgroundBlurriness>0?e:t).get(x)),x===null?_(o,l):x&&x.isColor&&(_(x,1),M=!0);let w=n.xr.getEnvironmentBlendMode();w==="additive"?i.buffers.color.setClear(0,0,0,1,a):w==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||M)&&n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil),x&&(x.isCubeTexture||x.mapping===ra)?(h===void 0&&(h=new ae(new Oi(1,1,1),new re({name:"BackgroundCubeMaterial",uniforms:Is(On.backgroundCube.uniforms),vertexShader:On.backgroundCube.vertexShader,fragmentShader:On.backgroundCube.fragmentShader,side:Be,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(P,A,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=x,h.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=f.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=f.backgroundIntensity,h.material.toneMapped=ne.getTransfer(x.colorSpace)!==se,(u!==x||d!==x.version||p!==n.toneMapping)&&(h.material.needsUpdate=!0,u=x,d=x.version,p=n.toneMapping),h.layers.enableAll(),m.unshift(h,h.geometry,h.material,0,0,null)):x&&x.isTexture&&(c===void 0&&(c=new ae(new xr(2,2),new re({name:"BackgroundMaterial",uniforms:Is(On.background.uniforms),vertexShader:On.background.vertexShader,fragmentShader:On.background.fragmentShader,side:pi,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=x,c.material.uniforms.backgroundIntensity.value=f.backgroundIntensity,c.material.toneMapped=ne.getTransfer(x.colorSpace)!==se,x.matrixAutoUpdate===!0&&x.updateMatrix(),c.material.uniforms.uvTransform.value.copy(x.matrix),(u!==x||d!==x.version||p!==n.toneMapping)&&(c.material.needsUpdate=!0,u=x,d=x.version,p=n.toneMapping),c.layers.enableAll(),m.unshift(c,c.geometry,c.material,0,0,null))}function _(m,f){m.getRGB(xo,Md(n)),i.buffers.color.setClear(xo.r,xo.g,xo.b,f,a)}return{getClearColor:function(){return o},setClearColor:function(m,f=1){o.set(m),l=f,_(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(m){l=m,_(o,l)},render:g}}function __(n,t,e,i){let s=n.getParameter(n.MAX_VERTEX_ATTRIBS),r=i.isWebGL2?null:t.get("OES_vertex_array_object"),a=i.isWebGL2||r!==null,o={},l=m(null),c=l,h=!1;function u(I,N,G,Y,q){let X=!1;if(a){let Z=_(Y,G,N);c!==Z&&(c=Z,p(c.object)),X=f(I,Y,G,q),X&&M(I,Y,G,q)}else{let Z=N.wireframe===!0;(c.geometry!==Y.id||c.program!==G.id||c.wireframe!==Z)&&(c.geometry=Y.id,c.program=G.id,c.wireframe=Z,X=!0)}q!==null&&e.update(q,n.ELEMENT_ARRAY_BUFFER),(X||h)&&(h=!1,F(I,N,G,Y),q!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(q).buffer))}function d(){return i.isWebGL2?n.createVertexArray():r.createVertexArrayOES()}function p(I){return i.isWebGL2?n.bindVertexArray(I):r.bindVertexArrayOES(I)}function g(I){return i.isWebGL2?n.deleteVertexArray(I):r.deleteVertexArrayOES(I)}function _(I,N,G){let Y=G.wireframe===!0,q=o[I.id];q===void 0&&(q={},o[I.id]=q);let X=q[N.id];X===void 0&&(X={},q[N.id]=X);let Z=X[Y];return Z===void 0&&(Z=m(d()),X[Y]=Z),Z}function m(I){let N=[],G=[],Y=[];for(let q=0;q<s;q++)N[q]=0,G[q]=0,Y[q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:N,enabledAttributes:G,attributeDivisors:Y,object:I,attributes:{},index:null}}function f(I,N,G,Y){let q=c.attributes,X=N.attributes,Z=0,nt=G.getAttributes();for(let dt in nt)if(nt[dt].location>=0){let $=q[dt],ut=X[dt];if(ut===void 0&&(dt==="instanceMatrix"&&I.instanceMatrix&&(ut=I.instanceMatrix),dt==="instanceColor"&&I.instanceColor&&(ut=I.instanceColor)),$===void 0||$.attribute!==ut||ut&&$.data!==ut.data)return!0;Z++}return c.attributesNum!==Z||c.index!==Y}function M(I,N,G,Y){let q={},X=N.attributes,Z=0,nt=G.getAttributes();for(let dt in nt)if(nt[dt].location>=0){let $=X[dt];$===void 0&&(dt==="instanceMatrix"&&I.instanceMatrix&&($=I.instanceMatrix),dt==="instanceColor"&&I.instanceColor&&($=I.instanceColor));let ut={};ut.attribute=$,$&&$.data&&(ut.data=$.data),q[dt]=ut,Z++}c.attributes=q,c.attributesNum=Z,c.index=Y}function x(){let I=c.newAttributes;for(let N=0,G=I.length;N<G;N++)I[N]=0}function w(I){P(I,0)}function P(I,N){let G=c.newAttributes,Y=c.enabledAttributes,q=c.attributeDivisors;G[I]=1,Y[I]===0&&(n.enableVertexAttribArray(I),Y[I]=1),q[I]!==N&&((i.isWebGL2?n:t.get("ANGLE_instanced_arrays"))[i.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](I,N),q[I]=N)}function A(){let I=c.newAttributes,N=c.enabledAttributes;for(let G=0,Y=N.length;G<Y;G++)N[G]!==I[G]&&(n.disableVertexAttribArray(G),N[G]=0)}function E(I,N,G,Y,q,X,Z){Z===!0?n.vertexAttribIPointer(I,N,G,q,X):n.vertexAttribPointer(I,N,G,Y,q,X)}function F(I,N,G,Y){if(i.isWebGL2===!1&&(I.isInstancedMesh||Y.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;x();let q=Y.attributes,X=G.getAttributes(),Z=N.defaultAttributeValues;for(let nt in X){let dt=X[nt];if(dt.location>=0){let W=q[nt];if(W===void 0&&(nt==="instanceMatrix"&&I.instanceMatrix&&(W=I.instanceMatrix),nt==="instanceColor"&&I.instanceColor&&(W=I.instanceColor)),W!==void 0){let $=W.normalized,ut=W.itemSize,Mt=e.get(W);if(Mt===void 0)continue;let vt=Mt.buffer,Ut=Mt.type,Nt=Mt.bytesPerElement,Rt=i.isWebGL2===!0&&(Ut===n.INT||Ut===n.UNSIGNED_INT||W.gpuType===hd);if(W.isInterleavedBufferAttribute){let qt=W.data,B=qt.stride,Le=W.offset;if(qt.isInstancedInterleavedBuffer){for(let wt=0;wt<dt.locationSize;wt++)P(dt.location+wt,qt.meshPerAttribute);I.isInstancedMesh!==!0&&Y._maxInstanceCount===void 0&&(Y._maxInstanceCount=qt.meshPerAttribute*qt.count)}else for(let wt=0;wt<dt.locationSize;wt++)w(dt.location+wt);n.bindBuffer(n.ARRAY_BUFFER,vt);for(let wt=0;wt<dt.locationSize;wt++)E(dt.location+wt,ut/dt.locationSize,Ut,$,B*Nt,(Le+ut/dt.locationSize*wt)*Nt,Rt)}else{if(W.isInstancedBufferAttribute){for(let qt=0;qt<dt.locationSize;qt++)P(dt.location+qt,W.meshPerAttribute);I.isInstancedMesh!==!0&&Y._maxInstanceCount===void 0&&(Y._maxInstanceCount=W.meshPerAttribute*W.count)}else for(let qt=0;qt<dt.locationSize;qt++)w(dt.location+qt);n.bindBuffer(n.ARRAY_BUFFER,vt);for(let qt=0;qt<dt.locationSize;qt++)E(dt.location+qt,ut/dt.locationSize,Ut,$,ut*Nt,ut/dt.locationSize*qt*Nt,Rt)}}else if(Z!==void 0){let $=Z[nt];if($!==void 0)switch($.length){case 2:n.vertexAttrib2fv(dt.location,$);break;case 3:n.vertexAttrib3fv(dt.location,$);break;case 4:n.vertexAttrib4fv(dt.location,$);break;default:n.vertexAttrib1fv(dt.location,$)}}}}A()}function y(){V();for(let I in o){let N=o[I];for(let G in N){let Y=N[G];for(let q in Y)g(Y[q].object),delete Y[q];delete N[G]}delete o[I]}}function T(I){if(o[I.id]===void 0)return;let N=o[I.id];for(let G in N){let Y=N[G];for(let q in Y)g(Y[q].object),delete Y[q];delete N[G]}delete o[I.id]}function D(I){for(let N in o){let G=o[N];if(G[I.id]===void 0)continue;let Y=G[I.id];for(let q in Y)g(Y[q].object),delete Y[q];delete G[I.id]}}function V(){Q(),h=!0,c!==l&&(c=l,p(c.object))}function Q(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:u,reset:V,resetDefaultState:Q,dispose:y,releaseStatesOfGeometry:T,releaseStatesOfProgram:D,initAttributes:x,enableAttribute:w,disableUnusedAttributes:A}}function x_(n,t,e,i){let s=i.isWebGL2,r;function a(h){r=h}function o(h,u){n.drawArrays(r,h,u),e.update(u,r,1)}function l(h,u,d){if(d===0)return;let p,g;if(s)p=n,g="drawArraysInstanced";else if(p=t.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",p===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[g](r,h,u,d),e.update(u,r,d)}function c(h,u,d){if(d===0)return;let p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<d;g++)this.render(h[g],u[g]);else{p.multiDrawArraysWEBGL(r,h,0,u,0,d);let g=0;for(let _=0;_<d;_++)g+=u[_];e.update(g,r,1)}}this.setMode=a,this.render=o,this.renderInstances=l,this.renderMultiDraw=c}function v_(n,t,e){let i;function s(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){let E=t.get("EXT_texture_filter_anisotropic");i=n.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function r(E){if(E==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let a=typeof WebGL2RenderingContext<"u"&&n.constructor.name==="WebGL2RenderingContext",o=e.precision!==void 0?e.precision:"highp",l=r(o);l!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",l,"instead."),o=l);let c=a||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,u=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),d=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),p=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),_=n.getParameter(n.MAX_VERTEX_ATTRIBS),m=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),f=n.getParameter(n.MAX_VARYING_VECTORS),M=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),x=d>0,w=a||t.has("OES_texture_float"),P=x&&w,A=a?n.getParameter(n.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:c,getMaxAnisotropy:s,getMaxPrecision:r,precision:o,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:d,maxTextureSize:p,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:m,maxVaryings:f,maxFragmentUniforms:M,vertexTextures:x,floatFragmentTextures:w,floatVertexTextures:P,maxSamples:A}}function y_(n){let t=this,e=null,i=0,s=!1,r=!1,a=new Tn,o=new Wt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let p=u.length!==0||d||i!==0||s;return s=d,i=u.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,p){let g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,f=n.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):c();else{let M=r?0:i,x=M*4,w=f.clippingState||null;l.value=w,w=h(g,d,x,p);for(let P=0;P!==x;++P)w[P]=e[P];f.clippingState=w,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(u,d,p,g){let _=u!==null?u.length:0,m=null;if(_!==0){if(m=l.value,g!==!0||m===null){let f=p+_*4,M=d.matrixWorldInverse;o.getNormalMatrix(M),(m===null||m.length<f)&&(m=new Float32Array(f));for(let x=0,w=p;x!==_;++x,w+=4)a.copy(u[x]).applyMatrix4(M,o),a.normal.toArray(m,w),m[w+3]=a.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function M_(n){let t=new WeakMap;function e(a,o){return o===Pl?a.mapping=Cs:o===Ll&&(a.mapping=Ps),a}function i(a){if(a&&a.isTexture){let o=a.mapping;if(o===Pl||o===Ll)if(t.has(a)){let l=t.get(a).texture;return e(l,a.mapping)}else{let l=a.image;if(l&&l.height>0){let c=new zl(l.height/2);return c.fromEquirectangularTexture(n,a),t.set(a,c),a.addEventListener("dispose",s),e(c.texture,a.mapping)}else return null}}return a}function s(a){let o=a.target;o.removeEventListener("dispose",s);let l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function r(){t=new WeakMap}return{get:i,dispose:r}}var vr=class extends Wo{constructor(t=-1,e=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=i-t,a=i+t,o=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Ss=4,Ru=[.125,.215,.35,.446,.526,.582],Ii=20,xl=new vr,Cu=new at,vl=null,yl=0,Ml=0,Pi=(1+Math.sqrt(5))/2,ys=1/Pi,Pu=[new C(1,1,1),new C(-1,1,1),new C(1,1,-1),new C(-1,1,-1),new C(0,Pi,ys),new C(0,Pi,-ys),new C(ys,0,Pi),new C(-ys,0,Pi),new C(Pi,ys,0),new C(-Pi,ys,0)],Yo=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,s=100){vl=this._renderer.getRenderTarget(),yl=this._renderer.getActiveCubeFace(),Ml=this._renderer.getActiveMipmapLevel(),this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,i,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Du(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Iu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(vl,yl,Ml),t.scissorTest=!1,vo(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Cs||t.mapping===Ps?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),vl=this._renderer.getRenderTarget(),yl=this._renderer.getActiveCubeFace(),Ml=this._renderer.getActiveMipmapLevel();let i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:gn,minFilter:gn,generateMipmaps:!1,type:on,format:Rn,colorSpace:Qn,depthBuffer:!1},s=Lu(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Lu(t,e,i);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=b_(r)),this._blurMaterial=S_(r,t,e)}return s}_compileMaterial(t){let e=new ae(this._lodPlanes[0],t);this._renderer.compile(e,xl)}_sceneToCubeUV(t,e,i,s){let o=new We(90,1,e,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(Cu),h.toneMapping=di,h.autoClear=!1;let p=new Ze({name:"PMREM.Background",side:Be,depthWrite:!1,depthTest:!1}),g=new ae(new Oi,p),_=!1,m=t.background;m?m.isColor&&(p.color.copy(m),t.background=null,_=!0):(p.color.copy(Cu),_=!0);for(let f=0;f<6;f++){let M=f%3;M===0?(o.up.set(0,l[f],0),o.lookAt(c[f],0,0)):M===1?(o.up.set(0,0,l[f]),o.lookAt(0,c[f],0)):(o.up.set(0,l[f],0),o.lookAt(0,0,c[f]));let x=this._cubeSize;vo(s,M*x,f>2?x:0,x,x),h.setRenderTarget(s),_&&h.render(g,o),h.render(t,o)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){let i=this._renderer,s=t.mapping===Cs||t.mapping===Ps;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Du()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Iu());let r=s?this._cubemapMaterial:this._equirectMaterial,a=new ae(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;let l=this._cubeSize;vo(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(a,xl)}_applyPMREM(t){let e=this._renderer,i=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){let r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=Pu[(s-1)%Pu.length];this._blur(t,s-1,s,r,a)}e.autoClear=i}_blur(t,e,i,s,r){let a=this._pingPongRenderTarget;this._halfBlur(t,a,e,i,s,"latitudinal",r),this._halfBlur(a,t,i,i,s,"longitudinal",r)}_halfBlur(t,e,i,s,r,a,o){let l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new ae(this._lodPlanes[s],c),d=c.uniforms,p=this._sizeLods[i]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*Ii-1),_=r/g,m=isFinite(r)?1+Math.floor(h*_):Ii;m>Ii&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Ii}`);let f=[],M=0;for(let E=0;E<Ii;++E){let F=E/_,y=Math.exp(-F*F/2);f.push(y),E===0?M+=y:E<m&&(M+=2*y)}for(let E=0;E<f.length;E++)f[E]=f[E]/M;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=f,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);let{_lodMax:x}=this;d.dTheta.value=g,d.mipInt.value=x-i;let w=this._sizeLods[s],P=3*w*(s>x-Ss?s-x+Ss:0),A=4*(this._cubeSize-w);vo(e,P,A,3*w,2*w),l.setRenderTarget(e),l.render(u,xl)}};function b_(n){let t=[],e=[],i=[],s=n,r=n-Ss+1+Ru.length;for(let a=0;a<r;a++){let o=Math.pow(2,s);e.push(o);let l=1/o;a>n-Ss?l=Ru[a-n+Ss-1]:a===0&&(l=0),i.push(l);let c=1/(o-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],p=6,g=6,_=3,m=2,f=1,M=new Float32Array(_*g*p),x=new Float32Array(m*g*p),w=new Float32Array(f*g*p);for(let A=0;A<p;A++){let E=A%3*2/3-1,F=A>2?0:-1,y=[E,F,0,E+2/3,F,0,E+2/3,F+1,0,E,F,0,E+2/3,F+1,0,E,F+1,0];M.set(y,_*g*A),x.set(d,m*g*A);let T=[A,A,A,A,A,A];w.set(T,f*g*A)}let P=new he;P.setAttribute("position",new te(M,_)),P.setAttribute("uv",new te(x,m)),P.setAttribute("faceIndex",new te(w,f)),t.push(P),s>Ss&&s--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function Lu(n,t,e){let i=new De(n,t,e);return i.texture.mapping=ra,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function vo(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function S_(n,t,e){let i=new Float32Array(Ii),s=new C(0,1,0);return new re({name:"SphericalGaussianBlur",defines:{n:Ii,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Tc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Bn,depthTest:!1,depthWrite:!1})}function Iu(){return new re({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Tc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Bn,depthTest:!1,depthWrite:!1})}function Du(){return new re({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Tc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Bn,depthTest:!1,depthWrite:!1})}function Tc(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function E_(n){let t=new WeakMap,e=null;function i(o){if(o&&o.isTexture){let l=o.mapping,c=l===Pl||l===Ll,h=l===Cs||l===Ps;if(c||h)if(o.isRenderTargetTexture&&o.needsPMREMUpdate===!0){o.needsPMREMUpdate=!1;let u=t.get(o);return e===null&&(e=new Yo(n)),u=c?e.fromEquirectangular(o,u):e.fromCubemap(o,u),t.set(o,u),u.texture}else{if(t.has(o))return t.get(o).texture;{let u=o.image;if(c&&u&&u.height>0||h&&u&&s(u)){e===null&&(e=new Yo(n));let d=c?e.fromEquirectangular(o):e.fromCubemap(o);return t.set(o,d),o.addEventListener("dispose",r),d.texture}else return null}}}return o}function s(o){let l=0,c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){let l=o.target;l.removeEventListener("dispose",r);let c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:a}}function w_(n){let t={};function e(i){if(t[i]!==void 0)return t[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(i){i.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(i){let s=e(i);return s===null&&console.warn("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function T_(n,t,e,i){let s={},r=new WeakMap;function a(u){let d=u.target;d.index!==null&&t.remove(d.index);for(let g in d.attributes)t.remove(d.attributes[g]);for(let g in d.morphAttributes){let _=d.morphAttributes[g];for(let m=0,f=_.length;m<f;m++)t.remove(_[m])}d.removeEventListener("dispose",a),delete s[d.id];let p=r.get(d);p&&(t.remove(p),r.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(u,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,e.memory.geometries++),d}function l(u){let d=u.attributes;for(let g in d)t.update(d[g],n.ARRAY_BUFFER);let p=u.morphAttributes;for(let g in p){let _=p[g];for(let m=0,f=_.length;m<f;m++)t.update(_[m],n.ARRAY_BUFFER)}}function c(u){let d=[],p=u.index,g=u.attributes.position,_=0;if(p!==null){let M=p.array;_=p.version;for(let x=0,w=M.length;x<w;x+=3){let P=M[x+0],A=M[x+1],E=M[x+2];d.push(P,A,A,E,E,P)}}else if(g!==void 0){let M=g.array;_=g.version;for(let x=0,w=M.length/3-1;x<w;x+=3){let P=x+0,A=x+1,E=x+2;d.push(P,A,A,E,E,P)}}else return;let m=new(vd(d)?Go:Vo)(d,1);m.version=_;let f=r.get(u);f&&t.remove(f),r.set(u,m)}function h(u){let d=r.get(u);if(d){let p=u.index;p!==null&&d.version<p.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function A_(n,t,e,i){let s=i.isWebGL2,r;function a(p){r=p}let o,l;function c(p){o=p.type,l=p.bytesPerElement}function h(p,g){n.drawElements(r,g,o,p*l),e.update(g,r,1)}function u(p,g,_){if(_===0)return;let m,f;if(s)m=n,f="drawElementsInstanced";else if(m=t.get("ANGLE_instanced_arrays"),f="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[f](r,g,o,p*l,_),e.update(g,r,_)}function d(p,g,_){if(_===0)return;let m=t.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<_;f++)this.render(p[f]/l,g[f]);else{m.multiDrawElementsWEBGL(r,g,0,o,p,0,_);let f=0;for(let M=0;M<_;M++)f+=g[M];e.update(f,r,1)}}this.setMode=a,this.setIndex=c,this.render=h,this.renderInstances=u,this.renderMultiDraw=d}function R_(n){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(e.calls++,a){case n.TRIANGLES:e.triangles+=o*(r/3);break;case n.LINES:e.lines+=o*(r/2);break;case n.LINE_STRIP:e.lines+=o*(r-1);break;case n.LINE_LOOP:e.lines+=o*r;break;case n.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function C_(n,t){return n[0]-t[0]}function P_(n,t){return Math.abs(t[1])-Math.abs(n[1])}function L_(n,t,e){let i={},s=new Float32Array(8),r=new WeakMap,a=new Ie,o=[];for(let c=0;c<8;c++)o[c]=[c,0];function l(c,h,u){let d=c.morphTargetInfluences;if(t.isWebGL2===!0){let p=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,g=p!==void 0?p.length:0,_=r.get(h);if(_===void 0||_.count!==g){let I=function(){V.dispose(),r.delete(h),h.removeEventListener("dispose",I)};_!==void 0&&_.texture.dispose();let M=h.morphAttributes.position!==void 0,x=h.morphAttributes.normal!==void 0,w=h.morphAttributes.color!==void 0,P=h.morphAttributes.position||[],A=h.morphAttributes.normal||[],E=h.morphAttributes.color||[],F=0;M===!0&&(F=1),x===!0&&(F=2),w===!0&&(F=3);let y=h.attributes.position.count*F,T=1;y>t.maxTextureSize&&(T=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize);let D=new Float32Array(y*T*4*g),V=new Ho(D,y,T,g);V.type=ui,V.needsUpdate=!0;let Q=F*4;for(let N=0;N<g;N++){let G=P[N],Y=A[N],q=E[N],X=y*T*4*N;for(let Z=0;Z<G.count;Z++){let nt=Z*Q;M===!0&&(a.fromBufferAttribute(G,Z),D[X+nt+0]=a.x,D[X+nt+1]=a.y,D[X+nt+2]=a.z,D[X+nt+3]=0),x===!0&&(a.fromBufferAttribute(Y,Z),D[X+nt+4]=a.x,D[X+nt+5]=a.y,D[X+nt+6]=a.z,D[X+nt+7]=0),w===!0&&(a.fromBufferAttribute(q,Z),D[X+nt+8]=a.x,D[X+nt+9]=a.y,D[X+nt+10]=a.z,D[X+nt+11]=q.itemSize===4?a.w:1)}}_={count:g,texture:V,size:new ot(y,T)},r.set(h,_),h.addEventListener("dispose",I)}let m=0;for(let M=0;M<d.length;M++)m+=d[M];let f=h.morphTargetsRelative?1:1-m;u.getUniforms().setValue(n,"morphTargetBaseInfluence",f),u.getUniforms().setValue(n,"morphTargetInfluences",d),u.getUniforms().setValue(n,"morphTargetsTexture",_.texture,e),u.getUniforms().setValue(n,"morphTargetsTextureSize",_.size)}else{let p=d===void 0?0:d.length,g=i[h.id];if(g===void 0||g.length!==p){g=[];for(let x=0;x<p;x++)g[x]=[x,0];i[h.id]=g}for(let x=0;x<p;x++){let w=g[x];w[0]=x,w[1]=d[x]}g.sort(P_);for(let x=0;x<8;x++)x<p&&g[x][1]?(o[x][0]=g[x][0],o[x][1]=g[x][1]):(o[x][0]=Number.MAX_SAFE_INTEGER,o[x][1]=0);o.sort(C_);let _=h.morphAttributes.position,m=h.morphAttributes.normal,f=0;for(let x=0;x<8;x++){let w=o[x],P=w[0],A=w[1];P!==Number.MAX_SAFE_INTEGER&&A?(_&&h.getAttribute("morphTarget"+x)!==_[P]&&h.setAttribute("morphTarget"+x,_[P]),m&&h.getAttribute("morphNormal"+x)!==m[P]&&h.setAttribute("morphNormal"+x,m[P]),s[x]=A,f+=A):(_&&h.hasAttribute("morphTarget"+x)===!0&&h.deleteAttribute("morphTarget"+x),m&&h.hasAttribute("morphNormal"+x)===!0&&h.deleteAttribute("morphNormal"+x),s[x]=0)}let M=h.morphTargetsRelative?1:1-f;u.getUniforms().setValue(n,"morphTargetBaseInfluence",M),u.getUniforms().setValue(n,"morphTargetInfluences",s)}}return{update:l}}function I_(n,t,e,i){let s=new WeakMap;function r(l){let c=i.render.frame,h=l.geometry,u=t.get(l,h);if(s.get(u)!==c&&(t.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(e.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,n.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return u}function a(){s=new WeakMap}function o(l){let c=l.target;c.removeEventListener("dispose",o),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:a}}var $o=class extends xn{constructor(t,e,i,s,r,a,o,l,c,h){if(h=h!==void 0?h:Ni,h!==Ni&&h!==Ls)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===Ni&&(i=hi),i===void 0&&h===Ls&&(i=Ui),super(null,s,r,a,o,l,h,i,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:Ge,this.minFilter=l!==void 0?l:Ge,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},Sd=new xn,Ed=new $o(1,1);Ed.compareFunction=xd;var wd=new Ho,Td=new Ol,Ad=new Xo,Uu=[],Nu=[],Fu=new Float32Array(16),Ou=new Float32Array(9),Bu=new Float32Array(4);function zs(n,t,e){let i=n[0];if(i<=0||i>0)return n;let s=t*e,r=Uu[s];if(r===void 0&&(r=new Float32Array(s),Uu[s]=r),t!==0){i.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,n[a].toArray(r,o)}return r}function we(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function Te(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function la(n,t){let e=Nu[t];e===void 0&&(e=new Int32Array(t),Nu[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function D_(n,t){let e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function U_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;n.uniform2fv(this.addr,t),Te(e,t)}}function N_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(we(e,t))return;n.uniform3fv(this.addr,t),Te(e,t)}}function F_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;n.uniform4fv(this.addr,t),Te(e,t)}}function O_(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(we(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),Te(e,t)}else{if(we(e,i))return;Bu.set(i),n.uniformMatrix2fv(this.addr,!1,Bu),Te(e,i)}}function B_(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(we(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),Te(e,t)}else{if(we(e,i))return;Ou.set(i),n.uniformMatrix3fv(this.addr,!1,Ou),Te(e,i)}}function z_(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(we(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),Te(e,t)}else{if(we(e,i))return;Fu.set(i),n.uniformMatrix4fv(this.addr,!1,Fu),Te(e,i)}}function H_(n,t){let e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function k_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;n.uniform2iv(this.addr,t),Te(e,t)}}function V_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(we(e,t))return;n.uniform3iv(this.addr,t),Te(e,t)}}function G_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;n.uniform4iv(this.addr,t),Te(e,t)}}function W_(n,t){let e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function X_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;n.uniform2uiv(this.addr,t),Te(e,t)}}function q_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(we(e,t))return;n.uniform3uiv(this.addr,t),Te(e,t)}}function Y_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;n.uniform4uiv(this.addr,t),Te(e,t)}}function $_(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r=this.type===n.SAMPLER_2D_SHADOW?Ed:Sd;e.setTexture2D(t||r,s)}function Z_(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||Td,s)}function J_(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||Ad,s)}function K_(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||wd,s)}function j_(n){switch(n){case 5126:return D_;case 35664:return U_;case 35665:return N_;case 35666:return F_;case 35674:return O_;case 35675:return B_;case 35676:return z_;case 5124:case 35670:return H_;case 35667:case 35671:return k_;case 35668:case 35672:return V_;case 35669:case 35673:return G_;case 5125:return W_;case 36294:return X_;case 36295:return q_;case 36296:return Y_;case 35678:case 36198:case 36298:case 36306:case 35682:return $_;case 35679:case 36299:case 36307:return Z_;case 35680:case 36300:case 36308:case 36293:return J_;case 36289:case 36303:case 36311:case 36292:return K_}}function Q_(n,t){n.uniform1fv(this.addr,t)}function tx(n,t){let e=zs(t,this.size,2);n.uniform2fv(this.addr,e)}function ex(n,t){let e=zs(t,this.size,3);n.uniform3fv(this.addr,e)}function nx(n,t){let e=zs(t,this.size,4);n.uniform4fv(this.addr,e)}function ix(n,t){let e=zs(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function sx(n,t){let e=zs(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function rx(n,t){let e=zs(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function ox(n,t){n.uniform1iv(this.addr,t)}function ax(n,t){n.uniform2iv(this.addr,t)}function lx(n,t){n.uniform3iv(this.addr,t)}function cx(n,t){n.uniform4iv(this.addr,t)}function hx(n,t){n.uniform1uiv(this.addr,t)}function ux(n,t){n.uniform2uiv(this.addr,t)}function dx(n,t){n.uniform3uiv(this.addr,t)}function fx(n,t){n.uniform4uiv(this.addr,t)}function px(n,t,e){let i=this.cache,s=t.length,r=la(e,s);we(i,r)||(n.uniform1iv(this.addr,r),Te(i,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||Sd,r[a])}function mx(n,t,e){let i=this.cache,s=t.length,r=la(e,s);we(i,r)||(n.uniform1iv(this.addr,r),Te(i,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||Td,r[a])}function gx(n,t,e){let i=this.cache,s=t.length,r=la(e,s);we(i,r)||(n.uniform1iv(this.addr,r),Te(i,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||Ad,r[a])}function _x(n,t,e){let i=this.cache,s=t.length,r=la(e,s);we(i,r)||(n.uniform1iv(this.addr,r),Te(i,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||wd,r[a])}function xx(n){switch(n){case 5126:return Q_;case 35664:return tx;case 35665:return ex;case 35666:return nx;case 35674:return ix;case 35675:return sx;case 35676:return rx;case 5124:case 35670:return ox;case 35667:case 35671:return ax;case 35668:case 35672:return lx;case 35669:case 35673:return cx;case 5125:return hx;case 36294:return ux;case 36295:return dx;case 36296:return fx;case 35678:case 36198:case 36298:case 36306:case 35682:return px;case 35679:case 36299:case 36307:return mx;case 35680:case 36300:case 36308:case 36293:return gx;case 36289:case 36303:case 36311:case 36292:return _x}}var Hl=class{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=j_(e.type)}},kl=class{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=xx(e.type)}},Vl=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(t,e[o.id],i)}}},bl=/(\w+)(\])?(\[|\.)?/g;function zu(n,t){n.seq.push(t),n.map[t.id]=t}function vx(n,t,e){let i=n.name,s=i.length;for(bl.lastIndex=0;;){let r=bl.exec(i),a=bl.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){zu(e,c===void 0?new Hl(o,n,t):new kl(o,n,t));break}else{let u=e.map[o];u===void 0&&(u=new Vl(o),zu(e,u)),e=u}}}var Rs=class{constructor(t,e){this.seq=[],this.map={};let i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){let r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);vx(r,a,this)}}setValue(t,e,i,s){let r=this.map[e];r!==void 0&&r.setValue(t,i,s)}setOptional(t,e,i){let s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let r=0,a=e.length;r!==a;++r){let o=e[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,e){let i=[];for(let s=0,r=t.length;s!==r;++s){let a=t[s];a.id in e&&i.push(a)}return i}};function Hu(n,t,e){let i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}var yx=37297,Mx=0;function bx(n,t){let e=n.split(`
`),i=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){let o=a+1;i.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return i.join(`
`)}function Sx(n){let t=ne.getPrimaries(ne.workingColorSpace),e=ne.getPrimaries(n),i;switch(t===e?i="":t===Uo&&e===Do?i="LinearDisplayP3ToLinearSRGB":t===Do&&e===Uo&&(i="LinearSRGBToLinearDisplayP3"),n){case Qn:case oa:return[i,"LinearTransferOETF"];case ye:case Ec:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",n),[i,"LinearTransferOETF"]}}function ku(n,t,e){let i=n.getShaderParameter(t,n.COMPILE_STATUS),s=n.getShaderInfoLog(t).trim();if(i&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let a=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+bx(n.getShaderSource(t),a)}else return s}function Ex(n,t){let e=Sx(t);return`vec4 ${n}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function wx(n,t){let e;switch(t){case vc:e="Linear";break;case yc:e="Reinhard";break;case Mc:e="OptimizedCineon";break;case Rr:e="ACESFilmic";break;case bc:e="AgX";break;case Np:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function Tx(n){return[n.extensionDerivatives||n.envMapCubeUVHeight||n.bumpMap||n.normalMapTangentSpace||n.clearcoatNormalMap||n.flatShading||n.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(n.extensionFragDepth||n.logarithmicDepthBuffer)&&n.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",n.extensionDrawBuffers&&n.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(n.extensionShaderTextureLOD||n.envMap||n.transmission)&&n.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Es).join(`
`)}function Ax(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Es).join(`
`)}function Rx(n){let t=[];for(let e in n){let i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function Cx(n,t){let e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=n.getActiveAttrib(t,s),a=r.name,o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:n.getAttribLocation(t,a),locationSize:o}}return e}function Es(n){return n!==""}function Vu(n,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Gu(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Px=/^[ \t]*#include +<([\w\d./]+)>/gm;function Gl(n){return n.replace(Px,Ix)}var Lx=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function Ix(n,t){let e=Ht[t];if(e===void 0){let i=Lx.get(t);if(i!==void 0)e=Ht[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return Gl(e)}var Dx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Wu(n){return n.replace(Dx,Ux)}function Ux(n,t,e,i){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Xu(n){let t="precision "+n.precision+` float;
precision `+n.precision+" int;";return n.precision==="highp"?t+=`
#define HIGH_PRECISION`:n.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Nx(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===ad?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===cp?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Jn&&(t="SHADOWMAP_TYPE_VSM"),t}function Fx(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Cs:case Ps:t="ENVMAP_TYPE_CUBE";break;case ra:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Ox(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Ps:t="ENVMAP_MODE_REFRACTION";break}return t}function Bx(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case ld:t="ENVMAP_BLENDING_MULTIPLY";break;case Dp:t="ENVMAP_BLENDING_MIX";break;case Up:t="ENVMAP_BLENDING_ADD";break}return t}function zx(n){let t=n.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function Hx(n,t,e,i){let s=n.getContext(),r=e.defines,a=e.vertexShader,o=e.fragmentShader,l=Nx(e),c=Fx(e),h=Ox(e),u=Bx(e),d=zx(e),p=e.isWebGL2?"":Tx(e),g=Ax(e),_=Rx(r),m=s.createProgram(),f,M,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(Es).join(`
`),f.length>0&&(f+=`
`),M=[p,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(Es).join(`
`),M.length>0&&(M+=`
`)):(f=[Xu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Es).join(`
`),M=[p,Xu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==di?"#define TONE_MAPPING":"",e.toneMapping!==di?Ht.tonemapping_pars_fragment:"",e.toneMapping!==di?wx("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Ht.colorspace_pars_fragment,Ex("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Es).join(`
`)),a=Gl(a),a=Vu(a,e),a=Gu(a,e),o=Gl(o),o=Vu(o,e),o=Gu(o,e),a=Wu(a),o=Wu(o),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,f=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,M=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===hu?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===hu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+M);let w=x+f+a,P=x+M+o,A=Hu(s,s.VERTEX_SHADER,w),E=Hu(s,s.FRAGMENT_SHADER,P);s.attachShader(m,A),s.attachShader(m,E),e.index0AttributeName!==void 0?s.bindAttribLocation(m,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(m,0,"position"),s.linkProgram(m);function F(V){if(n.debug.checkShaderErrors){let Q=s.getProgramInfoLog(m).trim(),I=s.getShaderInfoLog(A).trim(),N=s.getShaderInfoLog(E).trim(),G=!0,Y=!0;if(s.getProgramParameter(m,s.LINK_STATUS)===!1)if(G=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,m,A,E);else{let q=ku(s,A,"vertex"),X=ku(s,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(m,s.VALIDATE_STATUS)+`

Program Info Log: `+Q+`
`+q+`
`+X)}else Q!==""?console.warn("THREE.WebGLProgram: Program Info Log:",Q):(I===""||N==="")&&(Y=!1);Y&&(V.diagnostics={runnable:G,programLog:Q,vertexShader:{log:I,prefix:f},fragmentShader:{log:N,prefix:M}})}s.deleteShader(A),s.deleteShader(E),y=new Rs(s,m),T=Cx(s,m)}let y;this.getUniforms=function(){return y===void 0&&F(this),y};let T;this.getAttributes=function(){return T===void 0&&F(this),T};let D=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return D===!1&&(D=s.getProgramParameter(m,yx)),D},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(m),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Mx++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=A,this.fragmentShader=E,this}var kx=0,Wl=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){let e=this.shaderCache,i=e.get(t);return i===void 0&&(i=new Xl(t),e.set(t,i)),i}},Xl=class{constructor(t){this.id=kx++,this.code=t,this.usedTimes=0}};function Vx(n,t,e,i,s,r,a){let o=new _r,l=new Wl,c=[],h=s.isWebGL2,u=s.logarithmicDepthBuffer,d=s.vertexTextures,p=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(y){return y===0?"uv":`uv${y}`}function m(y,T,D,V,Q){let I=V.fog,N=Q.geometry,G=y.isMeshStandardMaterial?V.environment:null,Y=(y.isMeshStandardMaterial?e:t).get(y.envMap||G),q=Y&&Y.mapping===ra?Y.image.height:null,X=g[y.type];y.precision!==null&&(p=s.getMaxPrecision(y.precision),p!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",p,"instead."));let Z=N.morphAttributes.position||N.morphAttributes.normal||N.morphAttributes.color,nt=Z!==void 0?Z.length:0,dt=0;N.morphAttributes.position!==void 0&&(dt=1),N.morphAttributes.normal!==void 0&&(dt=2),N.morphAttributes.color!==void 0&&(dt=3);let W,$,ut,Mt;if(X){let xe=On[X];W=xe.vertexShader,$=xe.fragmentShader}else W=y.vertexShader,$=y.fragmentShader,l.update(y),ut=l.getVertexShaderID(y),Mt=l.getFragmentShaderID(y);let vt=n.getRenderTarget(),Ut=Q.isInstancedMesh===!0,Nt=Q.isBatchedMesh===!0,Rt=!!y.map,qt=!!y.matcap,B=!!Y,Le=!!y.aoMap,wt=!!y.lightMap,Lt=!!y.bumpMap,_t=!!y.normalMap,oe=!!y.displacementMap,Ot=!!y.emissiveMap,S=!!y.metalnessMap,v=!!y.roughnessMap,O=y.anisotropy>0,tt=y.clearcoat>0,K=y.iridescence>0,et=y.sheen>0,xt=y.transmission>0,ct=O&&!!y.anisotropyMap,gt=tt&&!!y.clearcoatMap,At=tt&&!!y.clearcoatNormalMap,Bt=tt&&!!y.clearcoatRoughnessMap,J=K&&!!y.iridescenceMap,Qt=K&&!!y.iridescenceThicknessMap,kt=et&&!!y.sheenColorMap,It=et&&!!y.sheenRoughnessMap,St=!!y.specularMap,ft=!!y.specularColorMap,R=!!y.specularIntensityMap,it=xt&&!!y.transmissionMap,yt=xt&&!!y.thicknessMap,mt=!!y.gradientMap,j=!!y.alphaMap,L=y.alphaTest>0,st=!!y.alphaHash,lt=!!y.extensions,Ct=!!N.attributes.uv1,Tt=!!N.attributes.uv2,Yt=!!N.attributes.uv3,$t=di;return y.toneMapped&&(vt===null||vt.isXRRenderTarget===!0)&&($t=n.toneMapping),{isWebGL2:h,shaderID:X,shaderType:y.type,shaderName:y.name,vertexShader:W,fragmentShader:$,defines:y.defines,customVertexShaderID:ut,customFragmentShaderID:Mt,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:p,batching:Nt,instancing:Ut,instancingColor:Ut&&Q.instanceColor!==null,supportsVertexTextures:d,outputColorSpace:vt===null?n.outputColorSpace:vt.isXRRenderTarget===!0?vt.texture.colorSpace:Qn,map:Rt,matcap:qt,envMap:B,envMapMode:B&&Y.mapping,envMapCubeUVHeight:q,aoMap:Le,lightMap:wt,bumpMap:Lt,normalMap:_t,displacementMap:d&&oe,emissiveMap:Ot,normalMapObjectSpace:_t&&y.normalMapType===$p,normalMapTangentSpace:_t&&y.normalMapType===Yp,metalnessMap:S,roughnessMap:v,anisotropy:O,anisotropyMap:ct,clearcoat:tt,clearcoatMap:gt,clearcoatNormalMap:At,clearcoatRoughnessMap:Bt,iridescence:K,iridescenceMap:J,iridescenceThicknessMap:Qt,sheen:et,sheenColorMap:kt,sheenRoughnessMap:It,specularMap:St,specularColorMap:ft,specularIntensityMap:R,transmission:xt,transmissionMap:it,thicknessMap:yt,gradientMap:mt,opaque:y.transparent===!1&&y.blending===ws,alphaMap:j,alphaTest:L,alphaHash:st,combine:y.combine,mapUv:Rt&&_(y.map.channel),aoMapUv:Le&&_(y.aoMap.channel),lightMapUv:wt&&_(y.lightMap.channel),bumpMapUv:Lt&&_(y.bumpMap.channel),normalMapUv:_t&&_(y.normalMap.channel),displacementMapUv:oe&&_(y.displacementMap.channel),emissiveMapUv:Ot&&_(y.emissiveMap.channel),metalnessMapUv:S&&_(y.metalnessMap.channel),roughnessMapUv:v&&_(y.roughnessMap.channel),anisotropyMapUv:ct&&_(y.anisotropyMap.channel),clearcoatMapUv:gt&&_(y.clearcoatMap.channel),clearcoatNormalMapUv:At&&_(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Bt&&_(y.clearcoatRoughnessMap.channel),iridescenceMapUv:J&&_(y.iridescenceMap.channel),iridescenceThicknessMapUv:Qt&&_(y.iridescenceThicknessMap.channel),sheenColorMapUv:kt&&_(y.sheenColorMap.channel),sheenRoughnessMapUv:It&&_(y.sheenRoughnessMap.channel),specularMapUv:St&&_(y.specularMap.channel),specularColorMapUv:ft&&_(y.specularColorMap.channel),specularIntensityMapUv:R&&_(y.specularIntensityMap.channel),transmissionMapUv:it&&_(y.transmissionMap.channel),thicknessMapUv:yt&&_(y.thicknessMap.channel),alphaMapUv:j&&_(y.alphaMap.channel),vertexTangents:!!N.attributes.tangent&&(_t||O),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!N.attributes.color&&N.attributes.color.itemSize===4,vertexUv1s:Ct,vertexUv2s:Tt,vertexUv3s:Yt,pointsUvs:Q.isPoints===!0&&!!N.attributes.uv&&(Rt||j),fog:!!I,useFog:y.fog===!0,fogExp2:I&&I.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:Q.isSkinnedMesh===!0,morphTargets:N.morphAttributes.position!==void 0,morphNormals:N.morphAttributes.normal!==void 0,morphColors:N.morphAttributes.color!==void 0,morphTargetsCount:nt,morphTextureStride:dt,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:y.dithering,shadowMapEnabled:n.shadowMap.enabled&&D.length>0,shadowMapType:n.shadowMap.type,toneMapping:$t,useLegacyLights:n._useLegacyLights,decodeVideoTexture:Rt&&y.map.isVideoTexture===!0&&ne.getTransfer(y.map.colorSpace)===se,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===Kn,flipSided:y.side===Be,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionDerivatives:lt&&y.extensions.derivatives===!0,extensionFragDepth:lt&&y.extensions.fragDepth===!0,extensionDrawBuffers:lt&&y.extensions.drawBuffers===!0,extensionShaderTextureLOD:lt&&y.extensions.shaderTextureLOD===!0,extensionClipCullDistance:lt&&y.extensions.clipCullDistance&&i.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||i.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||i.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||i.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()}}function f(y){let T=[];if(y.shaderID?T.push(y.shaderID):(T.push(y.customVertexShaderID),T.push(y.customFragmentShaderID)),y.defines!==void 0)for(let D in y.defines)T.push(D),T.push(y.defines[D]);return y.isRawShaderMaterial===!1&&(M(T,y),x(T,y),T.push(n.outputColorSpace)),T.push(y.customProgramCacheKey),T.join()}function M(y,T){y.push(T.precision),y.push(T.outputColorSpace),y.push(T.envMapMode),y.push(T.envMapCubeUVHeight),y.push(T.mapUv),y.push(T.alphaMapUv),y.push(T.lightMapUv),y.push(T.aoMapUv),y.push(T.bumpMapUv),y.push(T.normalMapUv),y.push(T.displacementMapUv),y.push(T.emissiveMapUv),y.push(T.metalnessMapUv),y.push(T.roughnessMapUv),y.push(T.anisotropyMapUv),y.push(T.clearcoatMapUv),y.push(T.clearcoatNormalMapUv),y.push(T.clearcoatRoughnessMapUv),y.push(T.iridescenceMapUv),y.push(T.iridescenceThicknessMapUv),y.push(T.sheenColorMapUv),y.push(T.sheenRoughnessMapUv),y.push(T.specularMapUv),y.push(T.specularColorMapUv),y.push(T.specularIntensityMapUv),y.push(T.transmissionMapUv),y.push(T.thicknessMapUv),y.push(T.combine),y.push(T.fogExp2),y.push(T.sizeAttenuation),y.push(T.morphTargetsCount),y.push(T.morphAttributeCount),y.push(T.numDirLights),y.push(T.numPointLights),y.push(T.numSpotLights),y.push(T.numSpotLightMaps),y.push(T.numHemiLights),y.push(T.numRectAreaLights),y.push(T.numDirLightShadows),y.push(T.numPointLightShadows),y.push(T.numSpotLightShadows),y.push(T.numSpotLightShadowsWithMaps),y.push(T.numLightProbes),y.push(T.shadowMapType),y.push(T.toneMapping),y.push(T.numClippingPlanes),y.push(T.numClipIntersection),y.push(T.depthPacking)}function x(y,T){o.disableAll(),T.isWebGL2&&o.enable(0),T.supportsVertexTextures&&o.enable(1),T.instancing&&o.enable(2),T.instancingColor&&o.enable(3),T.matcap&&o.enable(4),T.envMap&&o.enable(5),T.normalMapObjectSpace&&o.enable(6),T.normalMapTangentSpace&&o.enable(7),T.clearcoat&&o.enable(8),T.iridescence&&o.enable(9),T.alphaTest&&o.enable(10),T.vertexColors&&o.enable(11),T.vertexAlphas&&o.enable(12),T.vertexUv1s&&o.enable(13),T.vertexUv2s&&o.enable(14),T.vertexUv3s&&o.enable(15),T.vertexTangents&&o.enable(16),T.anisotropy&&o.enable(17),T.alphaHash&&o.enable(18),T.batching&&o.enable(19),y.push(o.mask),o.disableAll(),T.fog&&o.enable(0),T.useFog&&o.enable(1),T.flatShading&&o.enable(2),T.logarithmicDepthBuffer&&o.enable(3),T.skinning&&o.enable(4),T.morphTargets&&o.enable(5),T.morphNormals&&o.enable(6),T.morphColors&&o.enable(7),T.premultipliedAlpha&&o.enable(8),T.shadowMapEnabled&&o.enable(9),T.useLegacyLights&&o.enable(10),T.doubleSided&&o.enable(11),T.flipSided&&o.enable(12),T.useDepthPacking&&o.enable(13),T.dithering&&o.enable(14),T.transmission&&o.enable(15),T.sheen&&o.enable(16),T.opaque&&o.enable(17),T.pointsUvs&&o.enable(18),T.decodeVideoTexture&&o.enable(19),y.push(o.mask)}function w(y){let T=g[y.type],D;if(T){let V=On[T];D=xi.clone(V.uniforms)}else D=y.uniforms;return D}function P(y,T){let D;for(let V=0,Q=c.length;V<Q;V++){let I=c[V];if(I.cacheKey===T){D=I,++D.usedTimes;break}}return D===void 0&&(D=new Hx(n,T,y,r),c.push(D)),D}function A(y){if(--y.usedTimes===0){let T=c.indexOf(y);c[T]=c[c.length-1],c.pop(),y.destroy()}}function E(y){l.remove(y)}function F(){l.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:w,acquireProgram:P,releaseProgram:A,releaseShaderCache:E,programs:c,dispose:F}}function Gx(){let n=new WeakMap;function t(r){let a=n.get(r);return a===void 0&&(a={},n.set(r,a)),a}function e(r){n.delete(r)}function i(r,a,o){n.get(r)[a]=o}function s(){n=new WeakMap}return{get:t,remove:e,update:i,dispose:s}}function Wx(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function qu(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Yu(){let n=[],t=0,e=[],i=[],s=[];function r(){t=0,e.length=0,i.length=0,s.length=0}function a(u,d,p,g,_,m){let f=n[t];return f===void 0?(f={id:u.id,object:u,geometry:d,material:p,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},n[t]=f):(f.id=u.id,f.object=u,f.geometry=d,f.material=p,f.groupOrder=g,f.renderOrder=u.renderOrder,f.z=_,f.group=m),t++,f}function o(u,d,p,g,_,m){let f=a(u,d,p,g,_,m);p.transmission>0?i.push(f):p.transparent===!0?s.push(f):e.push(f)}function l(u,d,p,g,_,m){let f=a(u,d,p,g,_,m);p.transmission>0?i.unshift(f):p.transparent===!0?s.unshift(f):e.unshift(f)}function c(u,d){e.length>1&&e.sort(u||Wx),i.length>1&&i.sort(d||qu),s.length>1&&s.sort(d||qu)}function h(){for(let u=t,d=n.length;u<d;u++){let p=n[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:i,transparent:s,init:r,push:o,unshift:l,finish:h,sort:c}}function Xx(){let n=new WeakMap;function t(i,s){let r=n.get(i),a;return r===void 0?(a=new Yu,n.set(i,[a])):s>=r.length?(a=new Yu,r.push(a)):a=r[s],a}function e(){n=new WeakMap}return{get:t,dispose:e}}function qx(){let n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new C,color:new at};break;case"SpotLight":e={position:new C,direction:new C,color:new at,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new C,color:new at,distance:0,decay:0};break;case"HemisphereLight":e={direction:new C,skyColor:new at,groundColor:new at};break;case"RectAreaLight":e={color:new at,position:new C,halfWidth:new C,halfHeight:new C};break}return n[t.id]=e,e}}}function Yx(){let n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}var $x=0;function Zx(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function Jx(n,t){let e=new qx,i=Yx(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)s.probe.push(new C);let r=new C,a=new ie,o=new ie;function l(h,u){let d=0,p=0,g=0;for(let V=0;V<9;V++)s.probe[V].set(0,0,0);let _=0,m=0,f=0,M=0,x=0,w=0,P=0,A=0,E=0,F=0,y=0;h.sort(Zx);let T=u===!0?Math.PI:1;for(let V=0,Q=h.length;V<Q;V++){let I=h[V],N=I.color,G=I.intensity,Y=I.distance,q=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)d+=N.r*G*T,p+=N.g*G*T,g+=N.b*G*T;else if(I.isLightProbe){for(let X=0;X<9;X++)s.probe[X].addScaledVector(I.sh.coefficients[X],G);y++}else if(I.isDirectionalLight){let X=e.get(I);if(X.color.copy(I.color).multiplyScalar(I.intensity*T),I.castShadow){let Z=I.shadow,nt=i.get(I);nt.shadowBias=Z.bias,nt.shadowNormalBias=Z.normalBias,nt.shadowRadius=Z.radius,nt.shadowMapSize=Z.mapSize,s.directionalShadow[_]=nt,s.directionalShadowMap[_]=q,s.directionalShadowMatrix[_]=I.shadow.matrix,w++}s.directional[_]=X,_++}else if(I.isSpotLight){let X=e.get(I);X.position.setFromMatrixPosition(I.matrixWorld),X.color.copy(N).multiplyScalar(G*T),X.distance=Y,X.coneCos=Math.cos(I.angle),X.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),X.decay=I.decay,s.spot[f]=X;let Z=I.shadow;if(I.map&&(s.spotLightMap[E]=I.map,E++,Z.updateMatrices(I),I.castShadow&&F++),s.spotLightMatrix[f]=Z.matrix,I.castShadow){let nt=i.get(I);nt.shadowBias=Z.bias,nt.shadowNormalBias=Z.normalBias,nt.shadowRadius=Z.radius,nt.shadowMapSize=Z.mapSize,s.spotShadow[f]=nt,s.spotShadowMap[f]=q,A++}f++}else if(I.isRectAreaLight){let X=e.get(I);X.color.copy(N).multiplyScalar(G),X.halfWidth.set(I.width*.5,0,0),X.halfHeight.set(0,I.height*.5,0),s.rectArea[M]=X,M++}else if(I.isPointLight){let X=e.get(I);if(X.color.copy(I.color).multiplyScalar(I.intensity*T),X.distance=I.distance,X.decay=I.decay,I.castShadow){let Z=I.shadow,nt=i.get(I);nt.shadowBias=Z.bias,nt.shadowNormalBias=Z.normalBias,nt.shadowRadius=Z.radius,nt.shadowMapSize=Z.mapSize,nt.shadowCameraNear=Z.camera.near,nt.shadowCameraFar=Z.camera.far,s.pointShadow[m]=nt,s.pointShadowMap[m]=q,s.pointShadowMatrix[m]=I.shadow.matrix,P++}s.point[m]=X,m++}else if(I.isHemisphereLight){let X=e.get(I);X.skyColor.copy(I.color).multiplyScalar(G*T),X.groundColor.copy(I.groundColor).multiplyScalar(G*T),s.hemi[x]=X,x++}}M>0&&(t.isWebGL2?n.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=rt.LTC_FLOAT_1,s.rectAreaLTC2=rt.LTC_FLOAT_2):(s.rectAreaLTC1=rt.LTC_HALF_1,s.rectAreaLTC2=rt.LTC_HALF_2):n.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=rt.LTC_FLOAT_1,s.rectAreaLTC2=rt.LTC_FLOAT_2):n.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=rt.LTC_HALF_1,s.rectAreaLTC2=rt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=d,s.ambient[1]=p,s.ambient[2]=g;let D=s.hash;(D.directionalLength!==_||D.pointLength!==m||D.spotLength!==f||D.rectAreaLength!==M||D.hemiLength!==x||D.numDirectionalShadows!==w||D.numPointShadows!==P||D.numSpotShadows!==A||D.numSpotMaps!==E||D.numLightProbes!==y)&&(s.directional.length=_,s.spot.length=f,s.rectArea.length=M,s.point.length=m,s.hemi.length=x,s.directionalShadow.length=w,s.directionalShadowMap.length=w,s.pointShadow.length=P,s.pointShadowMap.length=P,s.spotShadow.length=A,s.spotShadowMap.length=A,s.directionalShadowMatrix.length=w,s.pointShadowMatrix.length=P,s.spotLightMatrix.length=A+E-F,s.spotLightMap.length=E,s.numSpotLightShadowsWithMaps=F,s.numLightProbes=y,D.directionalLength=_,D.pointLength=m,D.spotLength=f,D.rectAreaLength=M,D.hemiLength=x,D.numDirectionalShadows=w,D.numPointShadows=P,D.numSpotShadows=A,D.numSpotMaps=E,D.numLightProbes=y,s.version=$x++)}function c(h,u){let d=0,p=0,g=0,_=0,m=0,f=u.matrixWorldInverse;for(let M=0,x=h.length;M<x;M++){let w=h[M];if(w.isDirectionalLight){let P=s.directional[d];P.direction.setFromMatrixPosition(w.matrixWorld),r.setFromMatrixPosition(w.target.matrixWorld),P.direction.sub(r),P.direction.transformDirection(f),d++}else if(w.isSpotLight){let P=s.spot[g];P.position.setFromMatrixPosition(w.matrixWorld),P.position.applyMatrix4(f),P.direction.setFromMatrixPosition(w.matrixWorld),r.setFromMatrixPosition(w.target.matrixWorld),P.direction.sub(r),P.direction.transformDirection(f),g++}else if(w.isRectAreaLight){let P=s.rectArea[_];P.position.setFromMatrixPosition(w.matrixWorld),P.position.applyMatrix4(f),o.identity(),a.copy(w.matrixWorld),a.premultiply(f),o.extractRotation(a),P.halfWidth.set(w.width*.5,0,0),P.halfHeight.set(0,w.height*.5,0),P.halfWidth.applyMatrix4(o),P.halfHeight.applyMatrix4(o),_++}else if(w.isPointLight){let P=s.point[p];P.position.setFromMatrixPosition(w.matrixWorld),P.position.applyMatrix4(f),p++}else if(w.isHemisphereLight){let P=s.hemi[m];P.direction.setFromMatrixPosition(w.matrixWorld),P.direction.transformDirection(f),m++}}}return{setup:l,setupView:c,state:s}}function $u(n,t){let e=new Jx(n,t),i=[],s=[];function r(){i.length=0,s.length=0}function a(u){i.push(u)}function o(u){s.push(u)}function l(u){e.setup(i,u)}function c(u){e.setupView(i,u)}return{init:r,state:{lightsArray:i,shadowsArray:s,lights:e},setupLights:l,setupLightsView:c,pushLight:a,pushShadow:o}}function Kx(n,t){let e=new WeakMap;function i(r,a=0){let o=e.get(r),l;return o===void 0?(l=new $u(n,t),e.set(r,[l])):a>=o.length?(l=new $u(n,t),o.push(l)):l=o[a],l}function s(){e=new WeakMap}return{get:i,dispose:s}}var ql=class extends gi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Xp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Yl=class extends gi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}},jx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Qx=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function tv(n,t,e){let i=new qo,s=new ot,r=new ot,a=new Ie,o=new ql({depthPacking:qp}),l=new Yl,c={},h=e.maxTextureSize,u={[pi]:Be,[Be]:pi,[Kn]:Kn},d=new re({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ot},radius:{value:4}},vertexShader:jx,fragmentShader:Qx}),p=d.clone();p.defines.HORIZONTAL_PASS=1;let g=new he;g.setAttribute("position",new te(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new ae(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ad;let f=this.type;this.render=function(A,E,F){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;let y=n.getRenderTarget(),T=n.getActiveCubeFace(),D=n.getActiveMipmapLevel(),V=n.state;V.setBlending(Bn),V.buffers.color.setClear(1,1,1,1),V.buffers.depth.setTest(!0),V.setScissorTest(!1);let Q=f!==Jn&&this.type===Jn,I=f===Jn&&this.type!==Jn;for(let N=0,G=A.length;N<G;N++){let Y=A[N],q=Y.shadow;if(q===void 0){console.warn("THREE.WebGLShadowMap:",Y,"has no shadow.");continue}if(q.autoUpdate===!1&&q.needsUpdate===!1)continue;s.copy(q.mapSize);let X=q.getFrameExtents();if(s.multiply(X),r.copy(q.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/X.x),s.x=r.x*X.x,q.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/X.y),s.y=r.y*X.y,q.mapSize.y=r.y)),q.map===null||Q===!0||I===!0){let nt=this.type!==Jn?{minFilter:Ge,magFilter:Ge}:{};q.map!==null&&q.map.dispose(),q.map=new De(s.x,s.y,nt),q.map.texture.name=Y.name+".shadowMap",q.camera.updateProjectionMatrix()}n.setRenderTarget(q.map),n.clear();let Z=q.getViewportCount();for(let nt=0;nt<Z;nt++){let dt=q.getViewport(nt);a.set(r.x*dt.x,r.y*dt.y,r.x*dt.z,r.y*dt.w),V.viewport(a),q.updateMatrices(Y,nt),i=q.getFrustum(),w(E,F,q.camera,Y,this.type)}q.isPointLightShadow!==!0&&this.type===Jn&&M(q,F),q.needsUpdate=!1}f=this.type,m.needsUpdate=!1,n.setRenderTarget(y,T,D)};function M(A,E){let F=t.update(_);d.defines.VSM_SAMPLES!==A.blurSamples&&(d.defines.VSM_SAMPLES=A.blurSamples,p.defines.VSM_SAMPLES=A.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new De(s.x,s.y)),d.uniforms.shadow_pass.value=A.map.texture,d.uniforms.resolution.value=A.mapSize,d.uniforms.radius.value=A.radius,n.setRenderTarget(A.mapPass),n.clear(),n.renderBufferDirect(E,null,F,d,_,null),p.uniforms.shadow_pass.value=A.mapPass.texture,p.uniforms.resolution.value=A.mapSize,p.uniforms.radius.value=A.radius,n.setRenderTarget(A.map),n.clear(),n.renderBufferDirect(E,null,F,p,_,null)}function x(A,E,F,y){let T=null,D=F.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(D!==void 0)T=D;else if(T=F.isPointLight===!0?l:o,n.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){let V=T.uuid,Q=E.uuid,I=c[V];I===void 0&&(I={},c[V]=I);let N=I[Q];N===void 0&&(N=T.clone(),I[Q]=N,E.addEventListener("dispose",P)),T=N}if(T.visible=E.visible,T.wireframe=E.wireframe,y===Jn?T.side=E.shadowSide!==null?E.shadowSide:E.side:T.side=E.shadowSide!==null?E.shadowSide:u[E.side],T.alphaMap=E.alphaMap,T.alphaTest=E.alphaTest,T.map=E.map,T.clipShadows=E.clipShadows,T.clippingPlanes=E.clippingPlanes,T.clipIntersection=E.clipIntersection,T.displacementMap=E.displacementMap,T.displacementScale=E.displacementScale,T.displacementBias=E.displacementBias,T.wireframeLinewidth=E.wireframeLinewidth,T.linewidth=E.linewidth,F.isPointLight===!0&&T.isMeshDistanceMaterial===!0){let V=n.properties.get(T);V.light=F}return T}function w(A,E,F,y,T){if(A.visible===!1)return;if(A.layers.test(E.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&T===Jn)&&(!A.frustumCulled||i.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(F.matrixWorldInverse,A.matrixWorld);let Q=t.update(A),I=A.material;if(Array.isArray(I)){let N=Q.groups;for(let G=0,Y=N.length;G<Y;G++){let q=N[G],X=I[q.materialIndex];if(X&&X.visible){let Z=x(A,X,y,T);A.onBeforeShadow(n,A,E,F,Q,Z,q),n.renderBufferDirect(F,null,Q,Z,A,q),A.onAfterShadow(n,A,E,F,Q,Z,q)}}}else if(I.visible){let N=x(A,I,y,T);A.onBeforeShadow(n,A,E,F,Q,N,null),n.renderBufferDirect(F,null,Q,N,A,null),A.onAfterShadow(n,A,E,F,Q,N,null)}}let V=A.children;for(let Q=0,I=V.length;Q<I;Q++)w(V[Q],E,F,y,T)}function P(A){A.target.removeEventListener("dispose",P);for(let F in c){let y=c[F],T=A.target.uuid;T in y&&(y[T].dispose(),delete y[T])}}}function ev(n,t,e){let i=e.isWebGL2;function s(){let L=!1,st=new Ie,lt=null,Ct=new Ie(0,0,0,0);return{setMask:function(Tt){lt!==Tt&&!L&&(n.colorMask(Tt,Tt,Tt,Tt),lt=Tt)},setLocked:function(Tt){L=Tt},setClear:function(Tt,Yt,$t,me,xe){xe===!0&&(Tt*=me,Yt*=me,$t*=me),st.set(Tt,Yt,$t,me),Ct.equals(st)===!1&&(n.clearColor(Tt,Yt,$t,me),Ct.copy(st))},reset:function(){L=!1,lt=null,Ct.set(-1,0,0,0)}}}function r(){let L=!1,st=null,lt=null,Ct=null;return{setTest:function(Tt){Tt?Nt(n.DEPTH_TEST):Rt(n.DEPTH_TEST)},setMask:function(Tt){st!==Tt&&!L&&(n.depthMask(Tt),st=Tt)},setFunc:function(Tt){if(lt!==Tt){switch(Tt){case Tp:n.depthFunc(n.NEVER);break;case Ap:n.depthFunc(n.ALWAYS);break;case Rp:n.depthFunc(n.LESS);break;case Co:n.depthFunc(n.LEQUAL);break;case Cp:n.depthFunc(n.EQUAL);break;case Pp:n.depthFunc(n.GEQUAL);break;case Lp:n.depthFunc(n.GREATER);break;case Ip:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}lt=Tt}},setLocked:function(Tt){L=Tt},setClear:function(Tt){Ct!==Tt&&(n.clearDepth(Tt),Ct=Tt)},reset:function(){L=!1,st=null,lt=null,Ct=null}}}function a(){let L=!1,st=null,lt=null,Ct=null,Tt=null,Yt=null,$t=null,me=null,xe=null;return{setTest:function(jt){L||(jt?Nt(n.STENCIL_TEST):Rt(n.STENCIL_TEST))},setMask:function(jt){st!==jt&&!L&&(n.stencilMask(jt),st=jt)},setFunc:function(jt,Me,Fn){(lt!==jt||Ct!==Me||Tt!==Fn)&&(n.stencilFunc(jt,Me,Fn),lt=jt,Ct=Me,Tt=Fn)},setOp:function(jt,Me,Fn){(Yt!==jt||$t!==Me||me!==Fn)&&(n.stencilOp(jt,Me,Fn),Yt=jt,$t=Me,me=Fn)},setLocked:function(jt){L=jt},setClear:function(jt){xe!==jt&&(n.clearStencil(jt),xe=jt)},reset:function(){L=!1,st=null,lt=null,Ct=null,Tt=null,Yt=null,$t=null,me=null,xe=null}}}let o=new s,l=new r,c=new a,h=new WeakMap,u=new WeakMap,d={},p={},g=new WeakMap,_=[],m=null,f=!1,M=null,x=null,w=null,P=null,A=null,E=null,F=null,y=new at(0,0,0),T=0,D=!1,V=null,Q=null,I=null,N=null,G=null,Y=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),q=!1,X=0,Z=n.getParameter(n.VERSION);Z.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec(Z)[1]),q=X>=1):Z.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec(Z)[1]),q=X>=2);let nt=null,dt={},W=n.getParameter(n.SCISSOR_BOX),$=n.getParameter(n.VIEWPORT),ut=new Ie().fromArray(W),Mt=new Ie().fromArray($);function vt(L,st,lt,Ct){let Tt=new Uint8Array(4),Yt=n.createTexture();n.bindTexture(L,Yt),n.texParameteri(L,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(L,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let $t=0;$t<lt;$t++)i&&(L===n.TEXTURE_3D||L===n.TEXTURE_2D_ARRAY)?n.texImage3D(st,0,n.RGBA,1,1,Ct,0,n.RGBA,n.UNSIGNED_BYTE,Tt):n.texImage2D(st+$t,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Tt);return Yt}let Ut={};Ut[n.TEXTURE_2D]=vt(n.TEXTURE_2D,n.TEXTURE_2D,1),Ut[n.TEXTURE_CUBE_MAP]=vt(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),i&&(Ut[n.TEXTURE_2D_ARRAY]=vt(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Ut[n.TEXTURE_3D]=vt(n.TEXTURE_3D,n.TEXTURE_3D,1,1)),o.setClear(0,0,0,1),l.setClear(1),c.setClear(0),Nt(n.DEPTH_TEST),l.setFunc(Co),Ot(!1),S(Rh),Nt(n.CULL_FACE),_t(Bn);function Nt(L){d[L]!==!0&&(n.enable(L),d[L]=!0)}function Rt(L){d[L]!==!1&&(n.disable(L),d[L]=!1)}function qt(L,st){return p[L]!==st?(n.bindFramebuffer(L,st),p[L]=st,i&&(L===n.DRAW_FRAMEBUFFER&&(p[n.FRAMEBUFFER]=st),L===n.FRAMEBUFFER&&(p[n.DRAW_FRAMEBUFFER]=st)),!0):!1}function B(L,st){let lt=_,Ct=!1;if(L)if(lt=g.get(st),lt===void 0&&(lt=[],g.set(st,lt)),L.isWebGLMultipleRenderTargets){let Tt=L.texture;if(lt.length!==Tt.length||lt[0]!==n.COLOR_ATTACHMENT0){for(let Yt=0,$t=Tt.length;Yt<$t;Yt++)lt[Yt]=n.COLOR_ATTACHMENT0+Yt;lt.length=Tt.length,Ct=!0}}else lt[0]!==n.COLOR_ATTACHMENT0&&(lt[0]=n.COLOR_ATTACHMENT0,Ct=!0);else lt[0]!==n.BACK&&(lt[0]=n.BACK,Ct=!0);Ct&&(e.isWebGL2?n.drawBuffers(lt):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(lt))}function Le(L){return m!==L?(n.useProgram(L),m=L,!0):!1}let wt={[Li]:n.FUNC_ADD,[up]:n.FUNC_SUBTRACT,[dp]:n.FUNC_REVERSE_SUBTRACT};if(i)wt[Lh]=n.MIN,wt[Ih]=n.MAX;else{let L=t.get("EXT_blend_minmax");L!==null&&(wt[Lh]=L.MIN_EXT,wt[Ih]=L.MAX_EXT)}let Lt={[fp]:n.ZERO,[pp]:n.ONE,[mp]:n.SRC_COLOR,[Rl]:n.SRC_ALPHA,[Mp]:n.SRC_ALPHA_SATURATE,[vp]:n.DST_COLOR,[_p]:n.DST_ALPHA,[gp]:n.ONE_MINUS_SRC_COLOR,[Cl]:n.ONE_MINUS_SRC_ALPHA,[yp]:n.ONE_MINUS_DST_COLOR,[xp]:n.ONE_MINUS_DST_ALPHA,[bp]:n.CONSTANT_COLOR,[Sp]:n.ONE_MINUS_CONSTANT_COLOR,[Ep]:n.CONSTANT_ALPHA,[wp]:n.ONE_MINUS_CONSTANT_ALPHA};function _t(L,st,lt,Ct,Tt,Yt,$t,me,xe,jt){if(L===Bn){f===!0&&(Rt(n.BLEND),f=!1);return}if(f===!1&&(Nt(n.BLEND),f=!0),L!==hp){if(L!==M||jt!==D){if((x!==Li||A!==Li)&&(n.blendEquation(n.FUNC_ADD),x=Li,A=Li),jt)switch(L){case ws:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case rn:n.blendFunc(n.ONE,n.ONE);break;case Ch:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Ph:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case ws:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case rn:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Ch:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Ph:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}w=null,P=null,E=null,F=null,y.set(0,0,0),T=0,M=L,D=jt}return}Tt=Tt||st,Yt=Yt||lt,$t=$t||Ct,(st!==x||Tt!==A)&&(n.blendEquationSeparate(wt[st],wt[Tt]),x=st,A=Tt),(lt!==w||Ct!==P||Yt!==E||$t!==F)&&(n.blendFuncSeparate(Lt[lt],Lt[Ct],Lt[Yt],Lt[$t]),w=lt,P=Ct,E=Yt,F=$t),(me.equals(y)===!1||xe!==T)&&(n.blendColor(me.r,me.g,me.b,xe),y.copy(me),T=xe),M=L,D=!1}function oe(L,st){L.side===Kn?Rt(n.CULL_FACE):Nt(n.CULL_FACE);let lt=L.side===Be;st&&(lt=!lt),Ot(lt),L.blending===ws&&L.transparent===!1?_t(Bn):_t(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),l.setFunc(L.depthFunc),l.setTest(L.depthTest),l.setMask(L.depthWrite),o.setMask(L.colorWrite);let Ct=L.stencilWrite;c.setTest(Ct),Ct&&(c.setMask(L.stencilWriteMask),c.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),c.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),O(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?Nt(n.SAMPLE_ALPHA_TO_COVERAGE):Rt(n.SAMPLE_ALPHA_TO_COVERAGE)}function Ot(L){V!==L&&(L?n.frontFace(n.CW):n.frontFace(n.CCW),V=L)}function S(L){L!==ap?(Nt(n.CULL_FACE),L!==Q&&(L===Rh?n.cullFace(n.BACK):L===lp?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Rt(n.CULL_FACE),Q=L}function v(L){L!==I&&(q&&n.lineWidth(L),I=L)}function O(L,st,lt){L?(Nt(n.POLYGON_OFFSET_FILL),(N!==st||G!==lt)&&(n.polygonOffset(st,lt),N=st,G=lt)):Rt(n.POLYGON_OFFSET_FILL)}function tt(L){L?Nt(n.SCISSOR_TEST):Rt(n.SCISSOR_TEST)}function K(L){L===void 0&&(L=n.TEXTURE0+Y-1),nt!==L&&(n.activeTexture(L),nt=L)}function et(L,st,lt){lt===void 0&&(nt===null?lt=n.TEXTURE0+Y-1:lt=nt);let Ct=dt[lt];Ct===void 0&&(Ct={type:void 0,texture:void 0},dt[lt]=Ct),(Ct.type!==L||Ct.texture!==st)&&(nt!==lt&&(n.activeTexture(lt),nt=lt),n.bindTexture(L,st||Ut[L]),Ct.type=L,Ct.texture=st)}function xt(){let L=dt[nt];L!==void 0&&L.type!==void 0&&(n.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function ct(){try{n.compressedTexImage2D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function gt(){try{n.compressedTexImage3D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function At(){try{n.texSubImage2D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Bt(){try{n.texSubImage3D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function J(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Qt(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function kt(){try{n.texStorage2D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function It(){try{n.texStorage3D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function St(){try{n.texImage2D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ft(){try{n.texImage3D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function R(L){ut.equals(L)===!1&&(n.scissor(L.x,L.y,L.z,L.w),ut.copy(L))}function it(L){Mt.equals(L)===!1&&(n.viewport(L.x,L.y,L.z,L.w),Mt.copy(L))}function yt(L,st){let lt=u.get(st);lt===void 0&&(lt=new WeakMap,u.set(st,lt));let Ct=lt.get(L);Ct===void 0&&(Ct=n.getUniformBlockIndex(st,L.name),lt.set(L,Ct))}function mt(L,st){let Ct=u.get(st).get(L);h.get(st)!==Ct&&(n.uniformBlockBinding(st,Ct,L.__bindingPointIndex),h.set(st,Ct))}function j(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),i===!0&&(n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null)),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),d={},nt=null,dt={},p={},g=new WeakMap,_=[],m=null,f=!1,M=null,x=null,w=null,P=null,A=null,E=null,F=null,y=new at(0,0,0),T=0,D=!1,V=null,Q=null,I=null,N=null,G=null,ut.set(0,0,n.canvas.width,n.canvas.height),Mt.set(0,0,n.canvas.width,n.canvas.height),o.reset(),l.reset(),c.reset()}return{buffers:{color:o,depth:l,stencil:c},enable:Nt,disable:Rt,bindFramebuffer:qt,drawBuffers:B,useProgram:Le,setBlending:_t,setMaterial:oe,setFlipSided:Ot,setCullFace:S,setLineWidth:v,setPolygonOffset:O,setScissorTest:tt,activeTexture:K,bindTexture:et,unbindTexture:xt,compressedTexImage2D:ct,compressedTexImage3D:gt,texImage2D:St,texImage3D:ft,updateUBOMapping:yt,uniformBlockBinding:mt,texStorage2D:kt,texStorage3D:It,texSubImage2D:At,texSubImage3D:Bt,compressedTexSubImage2D:J,compressedTexSubImage3D:Qt,scissor:R,viewport:it,reset:j}}function nv(n,t,e,i,s,r,a){let o=s.isWebGL2,l=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap,u,d=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(S,v){return p?new OffscreenCanvas(S,v):Oo("canvas")}function _(S,v,O,tt){let K=1;if((S.width>tt||S.height>tt)&&(K=tt/Math.max(S.width,S.height)),K<1||v===!0)if(typeof HTMLImageElement<"u"&&S instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&S instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&S instanceof ImageBitmap){let et=v?Fo:Math.floor,xt=et(K*S.width),ct=et(K*S.height);u===void 0&&(u=g(xt,ct));let gt=O?g(xt,ct):u;return gt.width=xt,gt.height=ct,gt.getContext("2d").drawImage(S,0,0,xt,ct),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+S.width+"x"+S.height+") to ("+xt+"x"+ct+")."),gt}else return"data"in S&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+S.width+"x"+S.height+")."),S;return S}function m(S){return Nl(S.width)&&Nl(S.height)}function f(S){return o?!1:S.wrapS!==An||S.wrapT!==An||S.minFilter!==Ge&&S.minFilter!==gn}function M(S,v){return S.generateMipmaps&&v&&S.minFilter!==Ge&&S.minFilter!==gn}function x(S){n.generateMipmap(S)}function w(S,v,O,tt,K=!1){if(o===!1)return v;if(S!==null){if(n[S]!==void 0)return n[S];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+S+"'")}let et=v;if(v===n.RED&&(O===n.FLOAT&&(et=n.R32F),O===n.HALF_FLOAT&&(et=n.R16F),O===n.UNSIGNED_BYTE&&(et=n.R8)),v===n.RED_INTEGER&&(O===n.UNSIGNED_BYTE&&(et=n.R8UI),O===n.UNSIGNED_SHORT&&(et=n.R16UI),O===n.UNSIGNED_INT&&(et=n.R32UI),O===n.BYTE&&(et=n.R8I),O===n.SHORT&&(et=n.R16I),O===n.INT&&(et=n.R32I)),v===n.RG&&(O===n.FLOAT&&(et=n.RG32F),O===n.HALF_FLOAT&&(et=n.RG16F),O===n.UNSIGNED_BYTE&&(et=n.RG8)),v===n.RGBA){let xt=K?Io:ne.getTransfer(tt);O===n.FLOAT&&(et=n.RGBA32F),O===n.HALF_FLOAT&&(et=n.RGBA16F),O===n.UNSIGNED_BYTE&&(et=xt===se?n.SRGB8_ALPHA8:n.RGBA8),O===n.UNSIGNED_SHORT_4_4_4_4&&(et=n.RGBA4),O===n.UNSIGNED_SHORT_5_5_5_1&&(et=n.RGB5_A1)}return(et===n.R16F||et===n.R32F||et===n.RG16F||et===n.RG32F||et===n.RGBA16F||et===n.RGBA32F)&&t.get("EXT_color_buffer_float"),et}function P(S,v,O){return M(S,O)===!0||S.isFramebufferTexture&&S.minFilter!==Ge&&S.minFilter!==gn?Math.log2(Math.max(v.width,v.height))+1:S.mipmaps!==void 0&&S.mipmaps.length>0?S.mipmaps.length:S.isCompressedTexture&&Array.isArray(S.image)?v.mipmaps.length:1}function A(S){return S===Ge||S===Dh||S===$a?n.NEAREST:n.LINEAR}function E(S){let v=S.target;v.removeEventListener("dispose",E),y(v),v.isVideoTexture&&h.delete(v)}function F(S){let v=S.target;v.removeEventListener("dispose",F),D(v)}function y(S){let v=i.get(S);if(v.__webglInit===void 0)return;let O=S.source,tt=d.get(O);if(tt){let K=tt[v.__cacheKey];K.usedTimes--,K.usedTimes===0&&T(S),Object.keys(tt).length===0&&d.delete(O)}i.remove(S)}function T(S){let v=i.get(S);n.deleteTexture(v.__webglTexture);let O=S.source,tt=d.get(O);delete tt[v.__cacheKey],a.memory.textures--}function D(S){let v=S.texture,O=i.get(S),tt=i.get(v);if(tt.__webglTexture!==void 0&&(n.deleteTexture(tt.__webglTexture),a.memory.textures--),S.depthTexture&&S.depthTexture.dispose(),S.isWebGLCubeRenderTarget)for(let K=0;K<6;K++){if(Array.isArray(O.__webglFramebuffer[K]))for(let et=0;et<O.__webglFramebuffer[K].length;et++)n.deleteFramebuffer(O.__webglFramebuffer[K][et]);else n.deleteFramebuffer(O.__webglFramebuffer[K]);O.__webglDepthbuffer&&n.deleteRenderbuffer(O.__webglDepthbuffer[K])}else{if(Array.isArray(O.__webglFramebuffer))for(let K=0;K<O.__webglFramebuffer.length;K++)n.deleteFramebuffer(O.__webglFramebuffer[K]);else n.deleteFramebuffer(O.__webglFramebuffer);if(O.__webglDepthbuffer&&n.deleteRenderbuffer(O.__webglDepthbuffer),O.__webglMultisampledFramebuffer&&n.deleteFramebuffer(O.__webglMultisampledFramebuffer),O.__webglColorRenderbuffer)for(let K=0;K<O.__webglColorRenderbuffer.length;K++)O.__webglColorRenderbuffer[K]&&n.deleteRenderbuffer(O.__webglColorRenderbuffer[K]);O.__webglDepthRenderbuffer&&n.deleteRenderbuffer(O.__webglDepthRenderbuffer)}if(S.isWebGLMultipleRenderTargets)for(let K=0,et=v.length;K<et;K++){let xt=i.get(v[K]);xt.__webglTexture&&(n.deleteTexture(xt.__webglTexture),a.memory.textures--),i.remove(v[K])}i.remove(v),i.remove(S)}let V=0;function Q(){V=0}function I(){let S=V;return S>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+S+" texture units while this GPU supports only "+s.maxTextures),V+=1,S}function N(S){let v=[];return v.push(S.wrapS),v.push(S.wrapT),v.push(S.wrapR||0),v.push(S.magFilter),v.push(S.minFilter),v.push(S.anisotropy),v.push(S.internalFormat),v.push(S.format),v.push(S.type),v.push(S.generateMipmaps),v.push(S.premultiplyAlpha),v.push(S.flipY),v.push(S.unpackAlignment),v.push(S.colorSpace),v.join()}function G(S,v){let O=i.get(S);if(S.isVideoTexture&&oe(S),S.isRenderTargetTexture===!1&&S.version>0&&O.__version!==S.version){let tt=S.image;if(tt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(tt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ut(O,S,v);return}}e.bindTexture(n.TEXTURE_2D,O.__webglTexture,n.TEXTURE0+v)}function Y(S,v){let O=i.get(S);if(S.version>0&&O.__version!==S.version){ut(O,S,v);return}e.bindTexture(n.TEXTURE_2D_ARRAY,O.__webglTexture,n.TEXTURE0+v)}function q(S,v){let O=i.get(S);if(S.version>0&&O.__version!==S.version){ut(O,S,v);return}e.bindTexture(n.TEXTURE_3D,O.__webglTexture,n.TEXTURE0+v)}function X(S,v){let O=i.get(S);if(S.version>0&&O.__version!==S.version){Mt(O,S,v);return}e.bindTexture(n.TEXTURE_CUBE_MAP,O.__webglTexture,n.TEXTURE0+v)}let Z={[Il]:n.REPEAT,[An]:n.CLAMP_TO_EDGE,[Dl]:n.MIRRORED_REPEAT},nt={[Ge]:n.NEAREST,[Dh]:n.NEAREST_MIPMAP_NEAREST,[$a]:n.NEAREST_MIPMAP_LINEAR,[gn]:n.LINEAR,[Fp]:n.LINEAR_MIPMAP_NEAREST,[mr]:n.LINEAR_MIPMAP_LINEAR},dt={[Zp]:n.NEVER,[em]:n.ALWAYS,[Jp]:n.LESS,[xd]:n.LEQUAL,[Kp]:n.EQUAL,[tm]:n.GEQUAL,[jp]:n.GREATER,[Qp]:n.NOTEQUAL};function W(S,v,O){if(O?(n.texParameteri(S,n.TEXTURE_WRAP_S,Z[v.wrapS]),n.texParameteri(S,n.TEXTURE_WRAP_T,Z[v.wrapT]),(S===n.TEXTURE_3D||S===n.TEXTURE_2D_ARRAY)&&n.texParameteri(S,n.TEXTURE_WRAP_R,Z[v.wrapR]),n.texParameteri(S,n.TEXTURE_MAG_FILTER,nt[v.magFilter]),n.texParameteri(S,n.TEXTURE_MIN_FILTER,nt[v.minFilter])):(n.texParameteri(S,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(S,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),(S===n.TEXTURE_3D||S===n.TEXTURE_2D_ARRAY)&&n.texParameteri(S,n.TEXTURE_WRAP_R,n.CLAMP_TO_EDGE),(v.wrapS!==An||v.wrapT!==An)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),n.texParameteri(S,n.TEXTURE_MAG_FILTER,A(v.magFilter)),n.texParameteri(S,n.TEXTURE_MIN_FILTER,A(v.minFilter)),v.minFilter!==Ge&&v.minFilter!==gn&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),v.compareFunction&&(n.texParameteri(S,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(S,n.TEXTURE_COMPARE_FUNC,dt[v.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){let tt=t.get("EXT_texture_filter_anisotropic");if(v.magFilter===Ge||v.minFilter!==$a&&v.minFilter!==mr||v.type===ui&&t.has("OES_texture_float_linear")===!1||o===!1&&v.type===on&&t.has("OES_texture_half_float_linear")===!1)return;(v.anisotropy>1||i.get(v).__currentAnisotropy)&&(n.texParameterf(S,tt.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,s.getMaxAnisotropy())),i.get(v).__currentAnisotropy=v.anisotropy)}}function $(S,v){let O=!1;S.__webglInit===void 0&&(S.__webglInit=!0,v.addEventListener("dispose",E));let tt=v.source,K=d.get(tt);K===void 0&&(K={},d.set(tt,K));let et=N(v);if(et!==S.__cacheKey){K[et]===void 0&&(K[et]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,O=!0),K[et].usedTimes++;let xt=K[S.__cacheKey];xt!==void 0&&(K[S.__cacheKey].usedTimes--,xt.usedTimes===0&&T(v)),S.__cacheKey=et,S.__webglTexture=K[et].texture}return O}function ut(S,v,O){let tt=n.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(tt=n.TEXTURE_2D_ARRAY),v.isData3DTexture&&(tt=n.TEXTURE_3D);let K=$(S,v),et=v.source;e.bindTexture(tt,S.__webglTexture,n.TEXTURE0+O);let xt=i.get(et);if(et.version!==xt.__version||K===!0){e.activeTexture(n.TEXTURE0+O);let ct=ne.getPrimaries(ne.workingColorSpace),gt=v.colorSpace===_n?null:ne.getPrimaries(v.colorSpace),At=v.colorSpace===_n||ct===gt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,v.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,v.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,At);let Bt=f(v)&&m(v.image)===!1,J=_(v.image,Bt,!1,s.maxTextureSize);J=Ot(v,J);let Qt=m(J)||o,kt=r.convert(v.format,v.colorSpace),It=r.convert(v.type),St=w(v.internalFormat,kt,It,v.colorSpace,v.isVideoTexture);W(tt,v,Qt);let ft,R=v.mipmaps,it=o&&v.isVideoTexture!==!0&&St!==gd,yt=xt.__version===void 0||K===!0,mt=P(v,J,Qt);if(v.isDepthTexture)St=n.DEPTH_COMPONENT,o?v.type===ui?St=n.DEPTH_COMPONENT32F:v.type===hi?St=n.DEPTH_COMPONENT24:v.type===Ui?St=n.DEPTH24_STENCIL8:St=n.DEPTH_COMPONENT16:v.type===ui&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),v.format===Ni&&St===n.DEPTH_COMPONENT&&v.type!==Sc&&v.type!==hi&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),v.type=hi,It=r.convert(v.type)),v.format===Ls&&St===n.DEPTH_COMPONENT&&(St=n.DEPTH_STENCIL,v.type!==Ui&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),v.type=Ui,It=r.convert(v.type))),yt&&(it?e.texStorage2D(n.TEXTURE_2D,1,St,J.width,J.height):e.texImage2D(n.TEXTURE_2D,0,St,J.width,J.height,0,kt,It,null));else if(v.isDataTexture)if(R.length>0&&Qt){it&&yt&&e.texStorage2D(n.TEXTURE_2D,mt,St,R[0].width,R[0].height);for(let j=0,L=R.length;j<L;j++)ft=R[j],it?e.texSubImage2D(n.TEXTURE_2D,j,0,0,ft.width,ft.height,kt,It,ft.data):e.texImage2D(n.TEXTURE_2D,j,St,ft.width,ft.height,0,kt,It,ft.data);v.generateMipmaps=!1}else it?(yt&&e.texStorage2D(n.TEXTURE_2D,mt,St,J.width,J.height),e.texSubImage2D(n.TEXTURE_2D,0,0,0,J.width,J.height,kt,It,J.data)):e.texImage2D(n.TEXTURE_2D,0,St,J.width,J.height,0,kt,It,J.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){it&&yt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,mt,St,R[0].width,R[0].height,J.depth);for(let j=0,L=R.length;j<L;j++)ft=R[j],v.format!==Rn?kt!==null?it?e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,j,0,0,0,ft.width,ft.height,J.depth,kt,ft.data,0,0):e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,j,St,ft.width,ft.height,J.depth,0,ft.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):it?e.texSubImage3D(n.TEXTURE_2D_ARRAY,j,0,0,0,ft.width,ft.height,J.depth,kt,It,ft.data):e.texImage3D(n.TEXTURE_2D_ARRAY,j,St,ft.width,ft.height,J.depth,0,kt,It,ft.data)}else{it&&yt&&e.texStorage2D(n.TEXTURE_2D,mt,St,R[0].width,R[0].height);for(let j=0,L=R.length;j<L;j++)ft=R[j],v.format!==Rn?kt!==null?it?e.compressedTexSubImage2D(n.TEXTURE_2D,j,0,0,ft.width,ft.height,kt,ft.data):e.compressedTexImage2D(n.TEXTURE_2D,j,St,ft.width,ft.height,0,ft.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):it?e.texSubImage2D(n.TEXTURE_2D,j,0,0,ft.width,ft.height,kt,It,ft.data):e.texImage2D(n.TEXTURE_2D,j,St,ft.width,ft.height,0,kt,It,ft.data)}else if(v.isDataArrayTexture)it?(yt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,mt,St,J.width,J.height,J.depth),e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,J.width,J.height,J.depth,kt,It,J.data)):e.texImage3D(n.TEXTURE_2D_ARRAY,0,St,J.width,J.height,J.depth,0,kt,It,J.data);else if(v.isData3DTexture)it?(yt&&e.texStorage3D(n.TEXTURE_3D,mt,St,J.width,J.height,J.depth),e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,J.width,J.height,J.depth,kt,It,J.data)):e.texImage3D(n.TEXTURE_3D,0,St,J.width,J.height,J.depth,0,kt,It,J.data);else if(v.isFramebufferTexture){if(yt)if(it)e.texStorage2D(n.TEXTURE_2D,mt,St,J.width,J.height);else{let j=J.width,L=J.height;for(let st=0;st<mt;st++)e.texImage2D(n.TEXTURE_2D,st,St,j,L,0,kt,It,null),j>>=1,L>>=1}}else if(R.length>0&&Qt){it&&yt&&e.texStorage2D(n.TEXTURE_2D,mt,St,R[0].width,R[0].height);for(let j=0,L=R.length;j<L;j++)ft=R[j],it?e.texSubImage2D(n.TEXTURE_2D,j,0,0,kt,It,ft):e.texImage2D(n.TEXTURE_2D,j,St,kt,It,ft);v.generateMipmaps=!1}else it?(yt&&e.texStorage2D(n.TEXTURE_2D,mt,St,J.width,J.height),e.texSubImage2D(n.TEXTURE_2D,0,0,0,kt,It,J)):e.texImage2D(n.TEXTURE_2D,0,St,kt,It,J);M(v,Qt)&&x(tt),xt.__version=et.version,v.onUpdate&&v.onUpdate(v)}S.__version=v.version}function Mt(S,v,O){if(v.image.length!==6)return;let tt=$(S,v),K=v.source;e.bindTexture(n.TEXTURE_CUBE_MAP,S.__webglTexture,n.TEXTURE0+O);let et=i.get(K);if(K.version!==et.__version||tt===!0){e.activeTexture(n.TEXTURE0+O);let xt=ne.getPrimaries(ne.workingColorSpace),ct=v.colorSpace===_n?null:ne.getPrimaries(v.colorSpace),gt=v.colorSpace===_n||xt===ct?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,v.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,v.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,gt);let At=v.isCompressedTexture||v.image[0].isCompressedTexture,Bt=v.image[0]&&v.image[0].isDataTexture,J=[];for(let j=0;j<6;j++)!At&&!Bt?J[j]=_(v.image[j],!1,!0,s.maxCubemapSize):J[j]=Bt?v.image[j].image:v.image[j],J[j]=Ot(v,J[j]);let Qt=J[0],kt=m(Qt)||o,It=r.convert(v.format,v.colorSpace),St=r.convert(v.type),ft=w(v.internalFormat,It,St,v.colorSpace),R=o&&v.isVideoTexture!==!0,it=et.__version===void 0||tt===!0,yt=P(v,Qt,kt);W(n.TEXTURE_CUBE_MAP,v,kt);let mt;if(At){R&&it&&e.texStorage2D(n.TEXTURE_CUBE_MAP,yt,ft,Qt.width,Qt.height);for(let j=0;j<6;j++){mt=J[j].mipmaps;for(let L=0;L<mt.length;L++){let st=mt[L];v.format!==Rn?It!==null?R?e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,L,0,0,st.width,st.height,It,st.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,L,ft,st.width,st.height,0,st.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):R?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,L,0,0,st.width,st.height,It,St,st.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,L,ft,st.width,st.height,0,It,St,st.data)}}}else{mt=v.mipmaps,R&&it&&(mt.length>0&&yt++,e.texStorage2D(n.TEXTURE_CUBE_MAP,yt,ft,J[0].width,J[0].height));for(let j=0;j<6;j++)if(Bt){R?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,J[j].width,J[j].height,It,St,J[j].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,ft,J[j].width,J[j].height,0,It,St,J[j].data);for(let L=0;L<mt.length;L++){let lt=mt[L].image[j].image;R?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,L+1,0,0,lt.width,lt.height,It,St,lt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,L+1,ft,lt.width,lt.height,0,It,St,lt.data)}}else{R?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,It,St,J[j]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,ft,It,St,J[j]);for(let L=0;L<mt.length;L++){let st=mt[L];R?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,L+1,0,0,It,St,st.image[j]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,L+1,ft,It,St,st.image[j])}}}M(v,kt)&&x(n.TEXTURE_CUBE_MAP),et.__version=K.version,v.onUpdate&&v.onUpdate(v)}S.__version=v.version}function vt(S,v,O,tt,K,et){let xt=r.convert(O.format,O.colorSpace),ct=r.convert(O.type),gt=w(O.internalFormat,xt,ct,O.colorSpace);if(!i.get(v).__hasExternalTextures){let Bt=Math.max(1,v.width>>et),J=Math.max(1,v.height>>et);K===n.TEXTURE_3D||K===n.TEXTURE_2D_ARRAY?e.texImage3D(K,et,gt,Bt,J,v.depth,0,xt,ct,null):e.texImage2D(K,et,gt,Bt,J,0,xt,ct,null)}e.bindFramebuffer(n.FRAMEBUFFER,S),_t(v)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,tt,K,i.get(O).__webglTexture,0,Lt(v)):(K===n.TEXTURE_2D||K>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,tt,K,i.get(O).__webglTexture,et),e.bindFramebuffer(n.FRAMEBUFFER,null)}function Ut(S,v,O){if(n.bindRenderbuffer(n.RENDERBUFFER,S),v.depthBuffer&&!v.stencilBuffer){let tt=o===!0?n.DEPTH_COMPONENT24:n.DEPTH_COMPONENT16;if(O||_t(v)){let K=v.depthTexture;K&&K.isDepthTexture&&(K.type===ui?tt=n.DEPTH_COMPONENT32F:K.type===hi&&(tt=n.DEPTH_COMPONENT24));let et=Lt(v);_t(v)?l.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,et,tt,v.width,v.height):n.renderbufferStorageMultisample(n.RENDERBUFFER,et,tt,v.width,v.height)}else n.renderbufferStorage(n.RENDERBUFFER,tt,v.width,v.height);n.framebufferRenderbuffer(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.RENDERBUFFER,S)}else if(v.depthBuffer&&v.stencilBuffer){let tt=Lt(v);O&&_t(v)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,tt,n.DEPTH24_STENCIL8,v.width,v.height):_t(v)?l.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,tt,n.DEPTH24_STENCIL8,v.width,v.height):n.renderbufferStorage(n.RENDERBUFFER,n.DEPTH_STENCIL,v.width,v.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.RENDERBUFFER,S)}else{let tt=v.isWebGLMultipleRenderTargets===!0?v.texture:[v.texture];for(let K=0;K<tt.length;K++){let et=tt[K],xt=r.convert(et.format,et.colorSpace),ct=r.convert(et.type),gt=w(et.internalFormat,xt,ct,et.colorSpace),At=Lt(v);O&&_t(v)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,At,gt,v.width,v.height):_t(v)?l.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,At,gt,v.width,v.height):n.renderbufferStorage(n.RENDERBUFFER,gt,v.width,v.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Nt(S,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,S),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(v.depthTexture).__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),G(v.depthTexture,0);let tt=i.get(v.depthTexture).__webglTexture,K=Lt(v);if(v.depthTexture.format===Ni)_t(v)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,tt,0,K):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,tt,0);else if(v.depthTexture.format===Ls)_t(v)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,tt,0,K):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,tt,0);else throw new Error("Unknown depthTexture format")}function Rt(S){let v=i.get(S),O=S.isWebGLCubeRenderTarget===!0;if(S.depthTexture&&!v.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");Nt(v.__webglFramebuffer,S)}else if(O){v.__webglDepthbuffer=[];for(let tt=0;tt<6;tt++)e.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer[tt]),v.__webglDepthbuffer[tt]=n.createRenderbuffer(),Ut(v.__webglDepthbuffer[tt],S,!1)}else e.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer=n.createRenderbuffer(),Ut(v.__webglDepthbuffer,S,!1);e.bindFramebuffer(n.FRAMEBUFFER,null)}function qt(S,v,O){let tt=i.get(S);v!==void 0&&vt(tt.__webglFramebuffer,S,S.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),O!==void 0&&Rt(S)}function B(S){let v=S.texture,O=i.get(S),tt=i.get(v);S.addEventListener("dispose",F),S.isWebGLMultipleRenderTargets!==!0&&(tt.__webglTexture===void 0&&(tt.__webglTexture=n.createTexture()),tt.__version=v.version,a.memory.textures++);let K=S.isWebGLCubeRenderTarget===!0,et=S.isWebGLMultipleRenderTargets===!0,xt=m(S)||o;if(K){O.__webglFramebuffer=[];for(let ct=0;ct<6;ct++)if(o&&v.mipmaps&&v.mipmaps.length>0){O.__webglFramebuffer[ct]=[];for(let gt=0;gt<v.mipmaps.length;gt++)O.__webglFramebuffer[ct][gt]=n.createFramebuffer()}else O.__webglFramebuffer[ct]=n.createFramebuffer()}else{if(o&&v.mipmaps&&v.mipmaps.length>0){O.__webglFramebuffer=[];for(let ct=0;ct<v.mipmaps.length;ct++)O.__webglFramebuffer[ct]=n.createFramebuffer()}else O.__webglFramebuffer=n.createFramebuffer();if(et)if(s.drawBuffers){let ct=S.texture;for(let gt=0,At=ct.length;gt<At;gt++){let Bt=i.get(ct[gt]);Bt.__webglTexture===void 0&&(Bt.__webglTexture=n.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&S.samples>0&&_t(S)===!1){let ct=et?v:[v];O.__webglMultisampledFramebuffer=n.createFramebuffer(),O.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let gt=0;gt<ct.length;gt++){let At=ct[gt];O.__webglColorRenderbuffer[gt]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,O.__webglColorRenderbuffer[gt]);let Bt=r.convert(At.format,At.colorSpace),J=r.convert(At.type),Qt=w(At.internalFormat,Bt,J,At.colorSpace,S.isXRRenderTarget===!0),kt=Lt(S);n.renderbufferStorageMultisample(n.RENDERBUFFER,kt,Qt,S.width,S.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+gt,n.RENDERBUFFER,O.__webglColorRenderbuffer[gt])}n.bindRenderbuffer(n.RENDERBUFFER,null),S.depthBuffer&&(O.__webglDepthRenderbuffer=n.createRenderbuffer(),Ut(O.__webglDepthRenderbuffer,S,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(K){e.bindTexture(n.TEXTURE_CUBE_MAP,tt.__webglTexture),W(n.TEXTURE_CUBE_MAP,v,xt);for(let ct=0;ct<6;ct++)if(o&&v.mipmaps&&v.mipmaps.length>0)for(let gt=0;gt<v.mipmaps.length;gt++)vt(O.__webglFramebuffer[ct][gt],S,v,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ct,gt);else vt(O.__webglFramebuffer[ct],S,v,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0);M(v,xt)&&x(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(et){let ct=S.texture;for(let gt=0,At=ct.length;gt<At;gt++){let Bt=ct[gt],J=i.get(Bt);e.bindTexture(n.TEXTURE_2D,J.__webglTexture),W(n.TEXTURE_2D,Bt,xt),vt(O.__webglFramebuffer,S,Bt,n.COLOR_ATTACHMENT0+gt,n.TEXTURE_2D,0),M(Bt,xt)&&x(n.TEXTURE_2D)}e.unbindTexture()}else{let ct=n.TEXTURE_2D;if((S.isWebGL3DRenderTarget||S.isWebGLArrayRenderTarget)&&(o?ct=S.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(ct,tt.__webglTexture),W(ct,v,xt),o&&v.mipmaps&&v.mipmaps.length>0)for(let gt=0;gt<v.mipmaps.length;gt++)vt(O.__webglFramebuffer[gt],S,v,n.COLOR_ATTACHMENT0,ct,gt);else vt(O.__webglFramebuffer,S,v,n.COLOR_ATTACHMENT0,ct,0);M(v,xt)&&x(ct),e.unbindTexture()}S.depthBuffer&&Rt(S)}function Le(S){let v=m(S)||o,O=S.isWebGLMultipleRenderTargets===!0?S.texture:[S.texture];for(let tt=0,K=O.length;tt<K;tt++){let et=O[tt];if(M(et,v)){let xt=S.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:n.TEXTURE_2D,ct=i.get(et).__webglTexture;e.bindTexture(xt,ct),x(xt),e.unbindTexture()}}}function wt(S){if(o&&S.samples>0&&_t(S)===!1){let v=S.isWebGLMultipleRenderTargets?S.texture:[S.texture],O=S.width,tt=S.height,K=n.COLOR_BUFFER_BIT,et=[],xt=S.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ct=i.get(S),gt=S.isWebGLMultipleRenderTargets===!0;if(gt)for(let At=0;At<v.length;At++)e.bindFramebuffer(n.FRAMEBUFFER,ct.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+At,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,ct.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+At,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,ct.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,ct.__webglFramebuffer);for(let At=0;At<v.length;At++){et.push(n.COLOR_ATTACHMENT0+At),S.depthBuffer&&et.push(xt);let Bt=ct.__ignoreDepthValues!==void 0?ct.__ignoreDepthValues:!1;if(Bt===!1&&(S.depthBuffer&&(K|=n.DEPTH_BUFFER_BIT),S.stencilBuffer&&(K|=n.STENCIL_BUFFER_BIT)),gt&&n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,ct.__webglColorRenderbuffer[At]),Bt===!0&&(n.invalidateFramebuffer(n.READ_FRAMEBUFFER,[xt]),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[xt])),gt){let J=i.get(v[At]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,J,0)}n.blitFramebuffer(0,0,O,tt,0,0,O,tt,K,n.NEAREST),c&&n.invalidateFramebuffer(n.READ_FRAMEBUFFER,et)}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),gt)for(let At=0;At<v.length;At++){e.bindFramebuffer(n.FRAMEBUFFER,ct.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+At,n.RENDERBUFFER,ct.__webglColorRenderbuffer[At]);let Bt=i.get(v[At]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,ct.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+At,n.TEXTURE_2D,Bt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,ct.__webglMultisampledFramebuffer)}}function Lt(S){return Math.min(s.maxSamples,S.samples)}function _t(S){let v=i.get(S);return o&&S.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function oe(S){let v=a.render.frame;h.get(S)!==v&&(h.set(S,v),S.update())}function Ot(S,v){let O=S.colorSpace,tt=S.format,K=S.type;return S.isCompressedTexture===!0||S.isVideoTexture===!0||S.format===Ul||O!==Qn&&O!==_n&&(ne.getTransfer(O)===se?o===!1?t.has("EXT_sRGB")===!0&&tt===Rn?(S.format=Ul,S.minFilter=gn,S.generateMipmaps=!1):v=Bo.sRGBToLinear(v):(tt!==Rn||K!==fi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),v}this.allocateTextureUnit=I,this.resetTextureUnits=Q,this.setTexture2D=G,this.setTexture2DArray=Y,this.setTexture3D=q,this.setTextureCube=X,this.rebindTextures=qt,this.setupRenderTarget=B,this.updateRenderTargetMipmap=Le,this.updateMultisampleRenderTarget=wt,this.setupDepthRenderbuffer=Rt,this.setupFrameBufferTexture=vt,this.useMultisampledRTT=_t}function iv(n,t,e){let i=e.isWebGL2;function s(r,a=_n){let o,l=ne.getTransfer(a);if(r===fi)return n.UNSIGNED_BYTE;if(r===ud)return n.UNSIGNED_SHORT_4_4_4_4;if(r===dd)return n.UNSIGNED_SHORT_5_5_5_1;if(r===Op)return n.BYTE;if(r===Bp)return n.SHORT;if(r===Sc)return n.UNSIGNED_SHORT;if(r===hd)return n.INT;if(r===hi)return n.UNSIGNED_INT;if(r===ui)return n.FLOAT;if(r===on)return i?n.HALF_FLOAT:(o=t.get("OES_texture_half_float"),o!==null?o.HALF_FLOAT_OES:null);if(r===zp)return n.ALPHA;if(r===Rn)return n.RGBA;if(r===Hp)return n.LUMINANCE;if(r===kp)return n.LUMINANCE_ALPHA;if(r===Ni)return n.DEPTH_COMPONENT;if(r===Ls)return n.DEPTH_STENCIL;if(r===Ul)return o=t.get("EXT_sRGB"),o!==null?o.SRGB_ALPHA_EXT:null;if(r===Vp)return n.RED;if(r===fd)return n.RED_INTEGER;if(r===Gp)return n.RG;if(r===pd)return n.RG_INTEGER;if(r===md)return n.RGBA_INTEGER;if(r===Za||r===Ja||r===Ka||r===ja)if(l===se)if(o=t.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(r===Za)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Ja)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===Ka)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===ja)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=t.get("WEBGL_compressed_texture_s3tc"),o!==null){if(r===Za)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Ja)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Ka)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===ja)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Uh||r===Nh||r===Fh||r===Oh)if(o=t.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(r===Uh)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Nh)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===Fh)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Oh)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===gd)return o=t.get("WEBGL_compressed_texture_etc1"),o!==null?o.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===Bh||r===zh)if(o=t.get("WEBGL_compressed_texture_etc"),o!==null){if(r===Bh)return l===se?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(r===zh)return l===se?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Hh||r===kh||r===Vh||r===Gh||r===Wh||r===Xh||r===qh||r===Yh||r===$h||r===Zh||r===Jh||r===Kh||r===jh||r===Qh)if(o=t.get("WEBGL_compressed_texture_astc"),o!==null){if(r===Hh)return l===se?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===kh)return l===se?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Vh)return l===se?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Gh)return l===se?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Wh)return l===se?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Xh)return l===se?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===qh)return l===se?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Yh)return l===se?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===$h)return l===se?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Zh)return l===se?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Jh)return l===se?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Kh)return l===se?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===jh)return l===se?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Qh)return l===se?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===Qa||r===tu||r===eu)if(o=t.get("EXT_texture_compression_bptc"),o!==null){if(r===Qa)return l===se?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===tu)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===eu)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Wp||r===nu||r===iu||r===su)if(o=t.get("EXT_texture_compression_rgtc"),o!==null){if(r===Qa)return o.COMPRESSED_RED_RGTC1_EXT;if(r===nu)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===iu)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===su)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Ui?i?n.UNSIGNED_INT_24_8:(o=t.get("WEBGL_depth_texture"),o!==null?o.UNSIGNED_INT_24_8_WEBGL:null):n[r]!==void 0?n[r]:null}return{convert:s}}var $l=class extends We{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}},Cn=class extends Xe{constructor(){super(),this.isGroup=!0,this.type="Group"}},sv={type:"move"},dr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Cn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Cn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Cn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(let _ of t.hand.values()){let m=e.getJointPose(_,i),f=this._getHandJoint(c,_);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),p=.02,g=.005;c.inputState.pinching&&d>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(sv)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let i=new Cn;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}},Zl=class extends zn{constructor(t,e){super();let i=this,s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,p=null,g=null,_=e.getContextAttributes(),m=null,f=null,M=[],x=[],w=new ot,P=null,A=new We;A.layers.enable(1),A.viewport=new Ie;let E=new We;E.layers.enable(2),E.viewport=new Ie;let F=[A,E],y=new $l;y.layers.enable(1),y.layers.enable(2);let T=null,D=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(W){let $=M[W];return $===void 0&&($=new dr,M[W]=$),$.getTargetRaySpace()},this.getControllerGrip=function(W){let $=M[W];return $===void 0&&($=new dr,M[W]=$),$.getGripSpace()},this.getHand=function(W){let $=M[W];return $===void 0&&($=new dr,M[W]=$),$.getHandSpace()};function V(W){let $=x.indexOf(W.inputSource);if($===-1)return;let ut=M[$];ut!==void 0&&(ut.update(W.inputSource,W.frame,c||a),ut.dispatchEvent({type:W.type,data:W.inputSource}))}function Q(){s.removeEventListener("select",V),s.removeEventListener("selectstart",V),s.removeEventListener("selectend",V),s.removeEventListener("squeeze",V),s.removeEventListener("squeezestart",V),s.removeEventListener("squeezeend",V),s.removeEventListener("end",Q),s.removeEventListener("inputsourceschange",I);for(let W=0;W<M.length;W++){let $=x[W];$!==null&&(x[W]=null,M[W].disconnect($))}T=null,D=null,t.setRenderTarget(m),p=null,d=null,u=null,s=null,f=null,dt.stop(),i.isPresenting=!1,t.setPixelRatio(P),t.setSize(w.width,w.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(W){r=W,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(W){o=W,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(W){c=W},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(W){if(s=W,s!==null){if(m=t.getRenderTarget(),s.addEventListener("select",V),s.addEventListener("selectstart",V),s.addEventListener("selectend",V),s.addEventListener("squeeze",V),s.addEventListener("squeezestart",V),s.addEventListener("squeezeend",V),s.addEventListener("end",Q),s.addEventListener("inputsourceschange",I),_.xrCompatible!==!0&&await e.makeXRCompatible(),P=t.getPixelRatio(),t.getSize(w),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){let $={antialias:s.renderState.layers===void 0?_.antialias:!0,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,e,$),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),f=new De(p.framebufferWidth,p.framebufferHeight,{format:Rn,type:fi,colorSpace:t.outputColorSpace,stencilBuffer:_.stencil})}else{let $=null,ut=null,Mt=null;_.depth&&(Mt=_.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,$=_.stencil?Ls:Ni,ut=_.stencil?Ui:hi);let vt={colorFormat:e.RGBA8,depthFormat:Mt,scaleFactor:r};u=new XRWebGLBinding(s,e),d=u.createProjectionLayer(vt),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),f=new De(d.textureWidth,d.textureHeight,{format:Rn,type:fi,depthTexture:new $o(d.textureWidth,d.textureHeight,ut,void 0,void 0,void 0,void 0,void 0,void 0,$),stencilBuffer:_.stencil,colorSpace:t.outputColorSpace,samples:_.antialias?4:0});let Ut=t.properties.get(f);Ut.__ignoreDepthValues=d.ignoreDepthValues}f.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),dt.setContext(s),dt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function I(W){for(let $=0;$<W.removed.length;$++){let ut=W.removed[$],Mt=x.indexOf(ut);Mt>=0&&(x[Mt]=null,M[Mt].disconnect(ut))}for(let $=0;$<W.added.length;$++){let ut=W.added[$],Mt=x.indexOf(ut);if(Mt===-1){for(let Ut=0;Ut<M.length;Ut++)if(Ut>=x.length){x.push(ut),Mt=Ut;break}else if(x[Ut]===null){x[Ut]=ut,Mt=Ut;break}if(Mt===-1)break}let vt=M[Mt];vt&&vt.connect(ut)}}let N=new C,G=new C;function Y(W,$,ut){N.setFromMatrixPosition($.matrixWorld),G.setFromMatrixPosition(ut.matrixWorld);let Mt=N.distanceTo(G),vt=$.projectionMatrix.elements,Ut=ut.projectionMatrix.elements,Nt=vt[14]/(vt[10]-1),Rt=vt[14]/(vt[10]+1),qt=(vt[9]+1)/vt[5],B=(vt[9]-1)/vt[5],Le=(vt[8]-1)/vt[0],wt=(Ut[8]+1)/Ut[0],Lt=Nt*Le,_t=Nt*wt,oe=Mt/(-Le+wt),Ot=oe*-Le;$.matrixWorld.decompose(W.position,W.quaternion,W.scale),W.translateX(Ot),W.translateZ(oe),W.matrixWorld.compose(W.position,W.quaternion,W.scale),W.matrixWorldInverse.copy(W.matrixWorld).invert();let S=Nt+oe,v=Rt+oe,O=Lt-Ot,tt=_t+(Mt-Ot),K=qt*Rt/v*S,et=B*Rt/v*S;W.projectionMatrix.makePerspective(O,tt,K,et,S,v),W.projectionMatrixInverse.copy(W.projectionMatrix).invert()}function q(W,$){$===null?W.matrixWorld.copy(W.matrix):W.matrixWorld.multiplyMatrices($.matrixWorld,W.matrix),W.matrixWorldInverse.copy(W.matrixWorld).invert()}this.updateCamera=function(W){if(s===null)return;y.near=E.near=A.near=W.near,y.far=E.far=A.far=W.far,(T!==y.near||D!==y.far)&&(s.updateRenderState({depthNear:y.near,depthFar:y.far}),T=y.near,D=y.far);let $=W.parent,ut=y.cameras;q(y,$);for(let Mt=0;Mt<ut.length;Mt++)q(ut[Mt],$);ut.length===2?Y(y,A,E):y.projectionMatrix.copy(A.projectionMatrix),X(W,y,$)};function X(W,$,ut){ut===null?W.matrix.copy($.matrixWorld):(W.matrix.copy(ut.matrixWorld),W.matrix.invert(),W.matrix.multiply($.matrixWorld)),W.matrix.decompose(W.position,W.quaternion,W.scale),W.updateMatrixWorld(!0),W.projectionMatrix.copy($.projectionMatrix),W.projectionMatrixInverse.copy($.projectionMatrixInverse),W.isPerspectiveCamera&&(W.fov=gr*2*Math.atan(1/W.projectionMatrix.elements[5]),W.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(d===null&&p===null))return l},this.setFoveation=function(W){l=W,d!==null&&(d.fixedFoveation=W),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=W)};let Z=null;function nt(W,$){if(h=$.getViewerPose(c||a),g=$,h!==null){let ut=h.views;p!==null&&(t.setRenderTargetFramebuffer(f,p.framebuffer),t.setRenderTarget(f));let Mt=!1;ut.length!==y.cameras.length&&(y.cameras.length=0,Mt=!0);for(let vt=0;vt<ut.length;vt++){let Ut=ut[vt],Nt=null;if(p!==null)Nt=p.getViewport(Ut);else{let qt=u.getViewSubImage(d,Ut);Nt=qt.viewport,vt===0&&(t.setRenderTargetTextures(f,qt.colorTexture,d.ignoreDepthValues?void 0:qt.depthStencilTexture),t.setRenderTarget(f))}let Rt=F[vt];Rt===void 0&&(Rt=new We,Rt.layers.enable(vt),Rt.viewport=new Ie,F[vt]=Rt),Rt.matrix.fromArray(Ut.transform.matrix),Rt.matrix.decompose(Rt.position,Rt.quaternion,Rt.scale),Rt.projectionMatrix.fromArray(Ut.projectionMatrix),Rt.projectionMatrixInverse.copy(Rt.projectionMatrix).invert(),Rt.viewport.set(Nt.x,Nt.y,Nt.width,Nt.height),vt===0&&(y.matrix.copy(Rt.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),Mt===!0&&y.cameras.push(Rt)}}for(let ut=0;ut<M.length;ut++){let Mt=x[ut],vt=M[ut];Mt!==null&&vt!==void 0&&vt.update(Mt,$,c||a)}Z&&Z(W,$),$.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:$}),g=null}let dt=new bd;dt.setAnimationLoop(nt),this.setAnimationLoop=function(W){Z=W},this.dispose=function(){}}};function rv(n,t){function e(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function i(m,f){f.color.getRGB(m.fogColor.value,Md(n)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function s(m,f,M,x,w){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(m,f):f.isMeshToonMaterial?(r(m,f),u(m,f)):f.isMeshPhongMaterial?(r(m,f),h(m,f)):f.isMeshStandardMaterial?(r(m,f),d(m,f),f.isMeshPhysicalMaterial&&p(m,f,w)):f.isMeshMatcapMaterial?(r(m,f),g(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),_(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(a(m,f),f.isLineDashedMaterial&&o(m,f)):f.isPointsMaterial?l(m,f,M,x):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,e(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Be&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,e(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Be&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,e(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,e(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);let M=t.get(f).envMap;if(M&&(m.envMap.value=M,m.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap){m.lightMap.value=f.lightMap;let x=n._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=f.lightMapIntensity*x,e(f.lightMap,m.lightMapTransform)}f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,m.aoMapTransform))}function a(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform))}function o(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,M,x){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*M,m.scale.value=x*.5,f.map&&(m.map.value=f.map,e(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function u(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,m.roughnessMapTransform)),t.get(f).envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,M){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Be&&m.clearcoatNormalScale.value.negate())),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function _(m,f){let M=t.get(f).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function ov(n,t,e,i){let s={},r={},a=[],o=e.isWebGL2?n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(M,x){let w=x.program;i.uniformBlockBinding(M,w)}function c(M,x){let w=s[M.id];w===void 0&&(g(M),w=h(M),s[M.id]=w,M.addEventListener("dispose",m));let P=x.program;i.updateUBOMapping(M,P);let A=t.render.frame;r[M.id]!==A&&(d(M),r[M.id]=A)}function h(M){let x=u();M.__bindingPointIndex=x;let w=n.createBuffer(),P=M.__size,A=M.usage;return n.bindBuffer(n.UNIFORM_BUFFER,w),n.bufferData(n.UNIFORM_BUFFER,P,A),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,x,w),w}function u(){for(let M=0;M<o;M++)if(a.indexOf(M)===-1)return a.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(M){let x=s[M.id],w=M.uniforms,P=M.__cache;n.bindBuffer(n.UNIFORM_BUFFER,x);for(let A=0,E=w.length;A<E;A++){let F=Array.isArray(w[A])?w[A]:[w[A]];for(let y=0,T=F.length;y<T;y++){let D=F[y];if(p(D,A,y,P)===!0){let V=D.__offset,Q=Array.isArray(D.value)?D.value:[D.value],I=0;for(let N=0;N<Q.length;N++){let G=Q[N],Y=_(G);typeof G=="number"||typeof G=="boolean"?(D.__data[0]=G,n.bufferSubData(n.UNIFORM_BUFFER,V+I,D.__data)):G.isMatrix3?(D.__data[0]=G.elements[0],D.__data[1]=G.elements[1],D.__data[2]=G.elements[2],D.__data[3]=0,D.__data[4]=G.elements[3],D.__data[5]=G.elements[4],D.__data[6]=G.elements[5],D.__data[7]=0,D.__data[8]=G.elements[6],D.__data[9]=G.elements[7],D.__data[10]=G.elements[8],D.__data[11]=0):(G.toArray(D.__data,I),I+=Y.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,V,D.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(M,x,w,P){let A=M.value,E=x+"_"+w;if(P[E]===void 0)return typeof A=="number"||typeof A=="boolean"?P[E]=A:P[E]=A.clone(),!0;{let F=P[E];if(typeof A=="number"||typeof A=="boolean"){if(F!==A)return P[E]=A,!0}else if(F.equals(A)===!1)return F.copy(A),!0}return!1}function g(M){let x=M.uniforms,w=0,P=16;for(let E=0,F=x.length;E<F;E++){let y=Array.isArray(x[E])?x[E]:[x[E]];for(let T=0,D=y.length;T<D;T++){let V=y[T],Q=Array.isArray(V.value)?V.value:[V.value];for(let I=0,N=Q.length;I<N;I++){let G=Q[I],Y=_(G),q=w%P;q!==0&&P-q<Y.boundary&&(w+=P-q),V.__data=new Float32Array(Y.storage/Float32Array.BYTES_PER_ELEMENT),V.__offset=w,w+=Y.storage}}}let A=w%P;return A>0&&(w+=P-A),M.__size=w,M.__cache={},this}function _(M){let x={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(x.boundary=4,x.storage=4):M.isVector2?(x.boundary=8,x.storage=8):M.isVector3||M.isColor?(x.boundary=16,x.storage=12):M.isVector4?(x.boundary=16,x.storage=16):M.isMatrix3?(x.boundary=48,x.storage=48):M.isMatrix4?(x.boundary=64,x.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),x}function m(M){let x=M.target;x.removeEventListener("dispose",m);let w=a.indexOf(x.__bindingPointIndex);a.splice(w,1),n.deleteBuffer(s[x.id]),delete s[x.id],delete r[x.id]}function f(){for(let M in s)n.deleteBuffer(s[M]);a=[],s={},r={}}return{bind:l,update:c,dispose:f}}var yr=class{constructor(t={}){let{canvas:e=gm(),context:i=null,depth:s=!0,stencil:r=!0,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let d;i!==null?d=i.getContextAttributes().alpha:d=a;let p=new Uint32Array(4),g=new Int32Array(4),_=null,m=null,f=[],M=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=ye,this._useLegacyLights=!1,this.toneMapping=di,this.toneMappingExposure=1;let x=this,w=!1,P=0,A=0,E=null,F=-1,y=null,T=new Ie,D=new Ie,V=null,Q=new at(0),I=0,N=e.width,G=e.height,Y=1,q=null,X=null,Z=new Ie(0,0,N,G),nt=new Ie(0,0,N,G),dt=!1,W=new qo,$=!1,ut=!1,Mt=null,vt=new ie,Ut=new ot,Nt=new C,Rt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function qt(){return E===null?Y:1}let B=i;function Le(b,U){for(let H=0;H<b.length;H++){let k=b[H],z=e.getContext(k,U);if(z!==null)return z}return null}try{let b={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${xc}`),e.addEventListener("webglcontextlost",j,!1),e.addEventListener("webglcontextrestored",L,!1),e.addEventListener("webglcontextcreationerror",st,!1),B===null){let U=["webgl2","webgl","experimental-webgl"];if(x.isWebGL1Renderer===!0&&U.shift(),B=Le(U,b),B===null)throw Le(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&B instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),B.getShaderPrecisionFormat===void 0&&(B.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(b){throw console.error("THREE.WebGLRenderer: "+b.message),b}let wt,Lt,_t,oe,Ot,S,v,O,tt,K,et,xt,ct,gt,At,Bt,J,Qt,kt,It,St,ft,R,it;function yt(){wt=new w_(B),Lt=new v_(B,wt,t),wt.init(Lt),ft=new iv(B,wt,Lt),_t=new ev(B,wt,Lt),oe=new R_(B),Ot=new Gx,S=new nv(B,wt,_t,Ot,Lt,ft,oe),v=new M_(x),O=new E_(x),tt=new Fm(B,Lt),R=new __(B,wt,tt,Lt),K=new T_(B,tt,oe,R),et=new I_(B,K,tt,oe),kt=new L_(B,Lt,S),Bt=new y_(Ot),xt=new Vx(x,v,O,wt,Lt,R,Bt),ct=new rv(x,Ot),gt=new Xx,At=new Kx(wt,Lt),Qt=new g_(x,v,O,_t,et,d,l),J=new tv(x,et,Lt),it=new ov(B,oe,Lt,_t),It=new x_(B,wt,oe,Lt),St=new A_(B,wt,oe,Lt),oe.programs=xt.programs,x.capabilities=Lt,x.extensions=wt,x.properties=Ot,x.renderLists=gt,x.shadowMap=J,x.state=_t,x.info=oe}yt();let mt=new Zl(x,B);this.xr=mt,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){let b=wt.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){let b=wt.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return Y},this.setPixelRatio=function(b){b!==void 0&&(Y=b,this.setSize(N,G,!1))},this.getSize=function(b){return b.set(N,G)},this.setSize=function(b,U,H=!0){if(mt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}N=b,G=U,e.width=Math.floor(b*Y),e.height=Math.floor(U*Y),H===!0&&(e.style.width=b+"px",e.style.height=U+"px"),this.setViewport(0,0,b,U)},this.getDrawingBufferSize=function(b){return b.set(N*Y,G*Y).floor()},this.setDrawingBufferSize=function(b,U,H){N=b,G=U,Y=H,e.width=Math.floor(b*H),e.height=Math.floor(U*H),this.setViewport(0,0,b,U)},this.getCurrentViewport=function(b){return b.copy(T)},this.getViewport=function(b){return b.copy(Z)},this.setViewport=function(b,U,H,k){b.isVector4?Z.set(b.x,b.y,b.z,b.w):Z.set(b,U,H,k),_t.viewport(T.copy(Z).multiplyScalar(Y).floor())},this.getScissor=function(b){return b.copy(nt)},this.setScissor=function(b,U,H,k){b.isVector4?nt.set(b.x,b.y,b.z,b.w):nt.set(b,U,H,k),_t.scissor(D.copy(nt).multiplyScalar(Y).floor())},this.getScissorTest=function(){return dt},this.setScissorTest=function(b){_t.setScissorTest(dt=b)},this.setOpaqueSort=function(b){q=b},this.setTransparentSort=function(b){X=b},this.getClearColor=function(b){return b.copy(Qt.getClearColor())},this.setClearColor=function(){Qt.setClearColor.apply(Qt,arguments)},this.getClearAlpha=function(){return Qt.getClearAlpha()},this.setClearAlpha=function(){Qt.setClearAlpha.apply(Qt,arguments)},this.clear=function(b=!0,U=!0,H=!0){let k=0;if(b){let z=!1;if(E!==null){let pt=E.texture.format;z=pt===md||pt===pd||pt===fd}if(z){let pt=E.texture.type,bt=pt===fi||pt===hi||pt===Sc||pt===Ui||pt===ud||pt===dd,Pt=Qt.getClearColor(),Dt=Qt.getClearAlpha(),Vt=Pt.r,Ft=Pt.g,zt=Pt.b;bt?(p[0]=Vt,p[1]=Ft,p[2]=zt,p[3]=Dt,B.clearBufferuiv(B.COLOR,0,p)):(g[0]=Vt,g[1]=Ft,g[2]=zt,g[3]=Dt,B.clearBufferiv(B.COLOR,0,g))}else k|=B.COLOR_BUFFER_BIT}U&&(k|=B.DEPTH_BUFFER_BIT),H&&(k|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),B.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",j,!1),e.removeEventListener("webglcontextrestored",L,!1),e.removeEventListener("webglcontextcreationerror",st,!1),gt.dispose(),At.dispose(),Ot.dispose(),v.dispose(),O.dispose(),et.dispose(),R.dispose(),it.dispose(),xt.dispose(),mt.dispose(),mt.removeEventListener("sessionstart",xe),mt.removeEventListener("sessionend",jt),Mt&&(Mt.dispose(),Mt=null),Me.stop()};function j(b){b.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function L(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;let b=oe.autoReset,U=J.enabled,H=J.autoUpdate,k=J.needsUpdate,z=J.type;yt(),oe.autoReset=b,J.enabled=U,J.autoUpdate=H,J.needsUpdate=k,J.type=z}function st(b){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function lt(b){let U=b.target;U.removeEventListener("dispose",lt),Ct(U)}function Ct(b){Tt(b),Ot.remove(b)}function Tt(b){let U=Ot.get(b).programs;U!==void 0&&(U.forEach(function(H){xt.releaseProgram(H)}),b.isShaderMaterial&&xt.releaseShaderCache(b))}this.renderBufferDirect=function(b,U,H,k,z,pt){U===null&&(U=Rt);let bt=z.isMesh&&z.matrixWorld.determinant()<0,Pt=tp(b,U,H,k,z);_t.setMaterial(k,bt);let Dt=H.index,Vt=1;if(k.wireframe===!0){if(Dt=K.getWireframeAttribute(H),Dt===void 0)return;Vt=2}let Ft=H.drawRange,zt=H.attributes.position,ve=Ft.start*Vt,en=(Ft.start+Ft.count)*Vt;pt!==null&&(ve=Math.max(ve,pt.start*Vt),en=Math.min(en,(pt.start+pt.count)*Vt)),Dt!==null?(ve=Math.max(ve,0),en=Math.min(en,Dt.count)):zt!=null&&(ve=Math.max(ve,0),en=Math.min(en,zt.count));let Ae=en-ve;if(Ae<0||Ae===1/0)return;R.setup(z,k,Pt,H,Dt);let Wn,de=It;if(Dt!==null&&(Wn=tt.get(Dt),de=St,de.setIndex(Wn)),z.isMesh)k.wireframe===!0?(_t.setLineWidth(k.wireframeLinewidth*qt()),de.setMode(B.LINES)):de.setMode(B.TRIANGLES);else if(z.isLine){let Gt=k.linewidth;Gt===void 0&&(Gt=1),_t.setLineWidth(Gt*qt()),z.isLineSegments?de.setMode(B.LINES):z.isLineLoop?de.setMode(B.LINE_LOOP):de.setMode(B.LINE_STRIP)}else z.isPoints?de.setMode(B.POINTS):z.isSprite&&de.setMode(B.TRIANGLES);if(z.isBatchedMesh)de.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else if(z.isInstancedMesh)de.renderInstances(ve,Ae,z.count);else if(H.isInstancedBufferGeometry){let Gt=H._maxInstanceCount!==void 0?H._maxInstanceCount:1/0,Wa=Math.min(H.instanceCount,Gt);de.renderInstances(ve,Ae,Wa)}else de.render(ve,Ae)};function Yt(b,U,H){b.transparent===!0&&b.side===Kn&&b.forceSinglePass===!1?(b.side=Be,b.needsUpdate=!0,Jr(b,U,H),b.side=pi,b.needsUpdate=!0,Jr(b,U,H),b.side=Kn):Jr(b,U,H)}this.compile=function(b,U,H=null){H===null&&(H=b),m=At.get(H),m.init(),M.push(m),H.traverseVisible(function(z){z.isLight&&z.layers.test(U.layers)&&(m.pushLight(z),z.castShadow&&m.pushShadow(z))}),b!==H&&b.traverseVisible(function(z){z.isLight&&z.layers.test(U.layers)&&(m.pushLight(z),z.castShadow&&m.pushShadow(z))}),m.setupLights(x._useLegacyLights);let k=new Set;return b.traverse(function(z){let pt=z.material;if(pt)if(Array.isArray(pt))for(let bt=0;bt<pt.length;bt++){let Pt=pt[bt];Yt(Pt,H,z),k.add(Pt)}else Yt(pt,H,z),k.add(pt)}),M.pop(),m=null,k},this.compileAsync=function(b,U,H=null){let k=this.compile(b,U,H);return new Promise(z=>{function pt(){if(k.forEach(function(bt){Ot.get(bt).currentProgram.isReady()&&k.delete(bt)}),k.size===0){z(b);return}setTimeout(pt,10)}wt.get("KHR_parallel_shader_compile")!==null?pt():setTimeout(pt,10)})};let $t=null;function me(b){$t&&$t(b)}function xe(){Me.stop()}function jt(){Me.start()}let Me=new bd;Me.setAnimationLoop(me),typeof self<"u"&&Me.setContext(self),this.setAnimationLoop=function(b){$t=b,mt.setAnimationLoop(b),b===null?Me.stop():Me.start()},mt.addEventListener("sessionstart",xe),mt.addEventListener("sessionend",jt),this.render=function(b,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),mt.enabled===!0&&mt.isPresenting===!0&&(mt.cameraAutoUpdate===!0&&mt.updateCamera(U),U=mt.getCamera()),b.isScene===!0&&b.onBeforeRender(x,b,U,E),m=At.get(b,M.length),m.init(),M.push(m),vt.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),W.setFromProjectionMatrix(vt),ut=this.localClippingEnabled,$=Bt.init(this.clippingPlanes,ut),_=gt.get(b,f.length),_.init(),f.push(_),Fn(b,U,0,x.sortObjects),_.finish(),x.sortObjects===!0&&_.sort(q,X),this.info.render.frame++,$===!0&&Bt.beginShadows();let H=m.state.shadowsArray;if(J.render(H,b,U),$===!0&&Bt.endShadows(),this.info.autoReset===!0&&this.info.reset(),Qt.render(_,b),m.setupLights(x._useLegacyLights),U.isArrayCamera){let k=U.cameras;for(let z=0,pt=k.length;z<pt;z++){let bt=k[z];bh(_,b,bt,bt.viewport)}}else bh(_,b,U);E!==null&&(S.updateMultisampleRenderTarget(E),S.updateRenderTargetMipmap(E)),b.isScene===!0&&b.onAfterRender(x,b,U),R.resetDefaultState(),F=-1,y=null,M.pop(),M.length>0?m=M[M.length-1]:m=null,f.pop(),f.length>0?_=f[f.length-1]:_=null};function Fn(b,U,H,k){if(b.visible===!1)return;if(b.layers.test(U.layers)){if(b.isGroup)H=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(U);else if(b.isLight)m.pushLight(b),b.castShadow&&m.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||W.intersectsSprite(b)){k&&Nt.setFromMatrixPosition(b.matrixWorld).applyMatrix4(vt);let bt=et.update(b),Pt=b.material;Pt.visible&&_.push(b,bt,Pt,H,Nt.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||W.intersectsObject(b))){let bt=et.update(b),Pt=b.material;if(k&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),Nt.copy(b.boundingSphere.center)):(bt.boundingSphere===null&&bt.computeBoundingSphere(),Nt.copy(bt.boundingSphere.center)),Nt.applyMatrix4(b.matrixWorld).applyMatrix4(vt)),Array.isArray(Pt)){let Dt=bt.groups;for(let Vt=0,Ft=Dt.length;Vt<Ft;Vt++){let zt=Dt[Vt],ve=Pt[zt.materialIndex];ve&&ve.visible&&_.push(b,bt,ve,H,Nt.z,zt)}}else Pt.visible&&_.push(b,bt,Pt,H,Nt.z,null)}}let pt=b.children;for(let bt=0,Pt=pt.length;bt<Pt;bt++)Fn(pt[bt],U,H,k)}function bh(b,U,H,k){let z=b.opaque,pt=b.transmissive,bt=b.transparent;m.setupLightsView(H),$===!0&&Bt.setGlobalState(x.clippingPlanes,H),pt.length>0&&Qf(z,pt,U,H),k&&_t.viewport(T.copy(k)),z.length>0&&Zr(z,U,H),pt.length>0&&Zr(pt,U,H),bt.length>0&&Zr(bt,U,H),_t.buffers.depth.setTest(!0),_t.buffers.depth.setMask(!0),_t.buffers.color.setMask(!0),_t.setPolygonOffset(!1)}function Qf(b,U,H,k){if((H.isScene===!0?H.overrideMaterial:null)!==null)return;let pt=Lt.isWebGL2;Mt===null&&(Mt=new De(1,1,{generateMipmaps:!0,type:wt.has("EXT_color_buffer_half_float")?on:fi,minFilter:mr,samples:pt?4:0})),x.getDrawingBufferSize(Ut),pt?Mt.setSize(Ut.x,Ut.y):Mt.setSize(Fo(Ut.x),Fo(Ut.y));let bt=x.getRenderTarget();x.setRenderTarget(Mt),x.getClearColor(Q),I=x.getClearAlpha(),I<1&&x.setClearColor(16777215,.5),x.clear();let Pt=x.toneMapping;x.toneMapping=di,Zr(b,H,k),S.updateMultisampleRenderTarget(Mt),S.updateRenderTargetMipmap(Mt);let Dt=!1;for(let Vt=0,Ft=U.length;Vt<Ft;Vt++){let zt=U[Vt],ve=zt.object,en=zt.geometry,Ae=zt.material,Wn=zt.group;if(Ae.side===Kn&&ve.layers.test(k.layers)){let de=Ae.side;Ae.side=Be,Ae.needsUpdate=!0,Sh(ve,H,k,en,Ae,Wn),Ae.side=de,Ae.needsUpdate=!0,Dt=!0}}Dt===!0&&(S.updateMultisampleRenderTarget(Mt),S.updateRenderTargetMipmap(Mt)),x.setRenderTarget(bt),x.setClearColor(Q,I),x.toneMapping=Pt}function Zr(b,U,H){let k=U.isScene===!0?U.overrideMaterial:null;for(let z=0,pt=b.length;z<pt;z++){let bt=b[z],Pt=bt.object,Dt=bt.geometry,Vt=k===null?bt.material:k,Ft=bt.group;Pt.layers.test(H.layers)&&Sh(Pt,U,H,Dt,Vt,Ft)}}function Sh(b,U,H,k,z,pt){b.onBeforeRender(x,U,H,k,z,pt),b.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),z.onBeforeRender(x,U,H,k,b,pt),z.transparent===!0&&z.side===Kn&&z.forceSinglePass===!1?(z.side=Be,z.needsUpdate=!0,x.renderBufferDirect(H,U,k,z,b,pt),z.side=pi,z.needsUpdate=!0,x.renderBufferDirect(H,U,k,z,b,pt),z.side=Kn):x.renderBufferDirect(H,U,k,z,b,pt),b.onAfterRender(x,U,H,k,z,pt)}function Jr(b,U,H){U.isScene!==!0&&(U=Rt);let k=Ot.get(b),z=m.state.lights,pt=m.state.shadowsArray,bt=z.state.version,Pt=xt.getParameters(b,z.state,pt,U,H),Dt=xt.getProgramCacheKey(Pt),Vt=k.programs;k.environment=b.isMeshStandardMaterial?U.environment:null,k.fog=U.fog,k.envMap=(b.isMeshStandardMaterial?O:v).get(b.envMap||k.environment),Vt===void 0&&(b.addEventListener("dispose",lt),Vt=new Map,k.programs=Vt);let Ft=Vt.get(Dt);if(Ft!==void 0){if(k.currentProgram===Ft&&k.lightsStateVersion===bt)return wh(b,Pt),Ft}else Pt.uniforms=xt.getUniforms(b),b.onBuild(H,Pt,x),b.onBeforeCompile(Pt,x),Ft=xt.acquireProgram(Pt,Dt),Vt.set(Dt,Ft),k.uniforms=Pt.uniforms;let zt=k.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(zt.clippingPlanes=Bt.uniform),wh(b,Pt),k.needsLights=np(b),k.lightsStateVersion=bt,k.needsLights&&(zt.ambientLightColor.value=z.state.ambient,zt.lightProbe.value=z.state.probe,zt.directionalLights.value=z.state.directional,zt.directionalLightShadows.value=z.state.directionalShadow,zt.spotLights.value=z.state.spot,zt.spotLightShadows.value=z.state.spotShadow,zt.rectAreaLights.value=z.state.rectArea,zt.ltc_1.value=z.state.rectAreaLTC1,zt.ltc_2.value=z.state.rectAreaLTC2,zt.pointLights.value=z.state.point,zt.pointLightShadows.value=z.state.pointShadow,zt.hemisphereLights.value=z.state.hemi,zt.directionalShadowMap.value=z.state.directionalShadowMap,zt.directionalShadowMatrix.value=z.state.directionalShadowMatrix,zt.spotShadowMap.value=z.state.spotShadowMap,zt.spotLightMatrix.value=z.state.spotLightMatrix,zt.spotLightMap.value=z.state.spotLightMap,zt.pointShadowMap.value=z.state.pointShadowMap,zt.pointShadowMatrix.value=z.state.pointShadowMatrix),k.currentProgram=Ft,k.uniformsList=null,Ft}function Eh(b){if(b.uniformsList===null){let U=b.currentProgram.getUniforms();b.uniformsList=Rs.seqWithValue(U.seq,b.uniforms)}return b.uniformsList}function wh(b,U){let H=Ot.get(b);H.outputColorSpace=U.outputColorSpace,H.batching=U.batching,H.instancing=U.instancing,H.instancingColor=U.instancingColor,H.skinning=U.skinning,H.morphTargets=U.morphTargets,H.morphNormals=U.morphNormals,H.morphColors=U.morphColors,H.morphTargetsCount=U.morphTargetsCount,H.numClippingPlanes=U.numClippingPlanes,H.numIntersection=U.numClipIntersection,H.vertexAlphas=U.vertexAlphas,H.vertexTangents=U.vertexTangents,H.toneMapping=U.toneMapping}function tp(b,U,H,k,z){U.isScene!==!0&&(U=Rt),S.resetTextureUnits();let pt=U.fog,bt=k.isMeshStandardMaterial?U.environment:null,Pt=E===null?x.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:Qn,Dt=(k.isMeshStandardMaterial?O:v).get(k.envMap||bt),Vt=k.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,Ft=!!H.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),zt=!!H.morphAttributes.position,ve=!!H.morphAttributes.normal,en=!!H.morphAttributes.color,Ae=di;k.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&(Ae=x.toneMapping);let Wn=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,de=Wn!==void 0?Wn.length:0,Gt=Ot.get(k),Wa=m.state.lights;if($===!0&&(ut===!0||b!==y)){let pn=b===y&&k.id===F;Bt.setState(k,b,pn)}let ge=!1;k.version===Gt.__version?(Gt.needsLights&&Gt.lightsStateVersion!==Wa.state.version||Gt.outputColorSpace!==Pt||z.isBatchedMesh&&Gt.batching===!1||!z.isBatchedMesh&&Gt.batching===!0||z.isInstancedMesh&&Gt.instancing===!1||!z.isInstancedMesh&&Gt.instancing===!0||z.isSkinnedMesh&&Gt.skinning===!1||!z.isSkinnedMesh&&Gt.skinning===!0||z.isInstancedMesh&&Gt.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&Gt.instancingColor===!1&&z.instanceColor!==null||Gt.envMap!==Dt||k.fog===!0&&Gt.fog!==pt||Gt.numClippingPlanes!==void 0&&(Gt.numClippingPlanes!==Bt.numPlanes||Gt.numIntersection!==Bt.numIntersection)||Gt.vertexAlphas!==Vt||Gt.vertexTangents!==Ft||Gt.morphTargets!==zt||Gt.morphNormals!==ve||Gt.morphColors!==en||Gt.toneMapping!==Ae||Lt.isWebGL2===!0&&Gt.morphTargetsCount!==de)&&(ge=!0):(ge=!0,Gt.__version=k.version);let Ei=Gt.currentProgram;ge===!0&&(Ei=Jr(k,U,z));let Th=!1,ir=!1,Xa=!1,Ne=Ei.getUniforms(),wi=Gt.uniforms;if(_t.useProgram(Ei.program)&&(Th=!0,ir=!0,Xa=!0),k.id!==F&&(F=k.id,ir=!0),Th||y!==b){Ne.setValue(B,"projectionMatrix",b.projectionMatrix),Ne.setValue(B,"viewMatrix",b.matrixWorldInverse);let pn=Ne.map.cameraPosition;pn!==void 0&&pn.setValue(B,Nt.setFromMatrixPosition(b.matrixWorld)),Lt.logarithmicDepthBuffer&&Ne.setValue(B,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&Ne.setValue(B,"isOrthographic",b.isOrthographicCamera===!0),y!==b&&(y=b,ir=!0,Xa=!0)}if(z.isSkinnedMesh){Ne.setOptional(B,z,"bindMatrix"),Ne.setOptional(B,z,"bindMatrixInverse");let pn=z.skeleton;pn&&(Lt.floatVertexTextures?(pn.boneTexture===null&&pn.computeBoneTexture(),Ne.setValue(B,"boneTexture",pn.boneTexture,S)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}z.isBatchedMesh&&(Ne.setOptional(B,z,"batchingTexture"),Ne.setValue(B,"batchingTexture",z._matricesTexture,S));let qa=H.morphAttributes;if((qa.position!==void 0||qa.normal!==void 0||qa.color!==void 0&&Lt.isWebGL2===!0)&&kt.update(z,H,Ei),(ir||Gt.receiveShadow!==z.receiveShadow)&&(Gt.receiveShadow=z.receiveShadow,Ne.setValue(B,"receiveShadow",z.receiveShadow)),k.isMeshGouraudMaterial&&k.envMap!==null&&(wi.envMap.value=Dt,wi.flipEnvMap.value=Dt.isCubeTexture&&Dt.isRenderTargetTexture===!1?-1:1),ir&&(Ne.setValue(B,"toneMappingExposure",x.toneMappingExposure),Gt.needsLights&&ep(wi,Xa),pt&&k.fog===!0&&ct.refreshFogUniforms(wi,pt),ct.refreshMaterialUniforms(wi,k,Y,G,Mt),Rs.upload(B,Eh(Gt),wi,S)),k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(Rs.upload(B,Eh(Gt),wi,S),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&Ne.setValue(B,"center",z.center),Ne.setValue(B,"modelViewMatrix",z.modelViewMatrix),Ne.setValue(B,"normalMatrix",z.normalMatrix),Ne.setValue(B,"modelMatrix",z.matrixWorld),k.isShaderMaterial||k.isRawShaderMaterial){let pn=k.uniformsGroups;for(let Ya=0,ip=pn.length;Ya<ip;Ya++)if(Lt.isWebGL2){let Ah=pn[Ya];it.update(Ah,Ei),it.bind(Ah,Ei)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Ei}function ep(b,U){b.ambientLightColor.needsUpdate=U,b.lightProbe.needsUpdate=U,b.directionalLights.needsUpdate=U,b.directionalLightShadows.needsUpdate=U,b.pointLights.needsUpdate=U,b.pointLightShadows.needsUpdate=U,b.spotLights.needsUpdate=U,b.spotLightShadows.needsUpdate=U,b.rectAreaLights.needsUpdate=U,b.hemisphereLights.needsUpdate=U}function np(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(b,U,H){Ot.get(b.texture).__webglTexture=U,Ot.get(b.depthTexture).__webglTexture=H;let k=Ot.get(b);k.__hasExternalTextures=!0,k.__hasExternalTextures&&(k.__autoAllocateDepthBuffer=H===void 0,k.__autoAllocateDepthBuffer||wt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),k.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(b,U){let H=Ot.get(b);H.__webglFramebuffer=U,H.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(b,U=0,H=0){E=b,P=U,A=H;let k=!0,z=null,pt=!1,bt=!1;if(b){let Dt=Ot.get(b);Dt.__useDefaultFramebuffer!==void 0?(_t.bindFramebuffer(B.FRAMEBUFFER,null),k=!1):Dt.__webglFramebuffer===void 0?S.setupRenderTarget(b):Dt.__hasExternalTextures&&S.rebindTextures(b,Ot.get(b.texture).__webglTexture,Ot.get(b.depthTexture).__webglTexture);let Vt=b.texture;(Vt.isData3DTexture||Vt.isDataArrayTexture||Vt.isCompressedArrayTexture)&&(bt=!0);let Ft=Ot.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Ft[U])?z=Ft[U][H]:z=Ft[U],pt=!0):Lt.isWebGL2&&b.samples>0&&S.useMultisampledRTT(b)===!1?z=Ot.get(b).__webglMultisampledFramebuffer:Array.isArray(Ft)?z=Ft[H]:z=Ft,T.copy(b.viewport),D.copy(b.scissor),V=b.scissorTest}else T.copy(Z).multiplyScalar(Y).floor(),D.copy(nt).multiplyScalar(Y).floor(),V=dt;if(_t.bindFramebuffer(B.FRAMEBUFFER,z)&&Lt.drawBuffers&&k&&_t.drawBuffers(b,z),_t.viewport(T),_t.scissor(D),_t.setScissorTest(V),pt){let Dt=Ot.get(b.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+U,Dt.__webglTexture,H)}else if(bt){let Dt=Ot.get(b.texture),Vt=U||0;B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,Dt.__webglTexture,H||0,Vt)}F=-1},this.readRenderTargetPixels=function(b,U,H,k,z,pt,bt){if(!(b&&b.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Pt=Ot.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&bt!==void 0&&(Pt=Pt[bt]),Pt){_t.bindFramebuffer(B.FRAMEBUFFER,Pt);try{let Dt=b.texture,Vt=Dt.format,Ft=Dt.type;if(Vt!==Rn&&ft.convert(Vt)!==B.getParameter(B.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}let zt=Ft===on&&(wt.has("EXT_color_buffer_half_float")||Lt.isWebGL2&&wt.has("EXT_color_buffer_float"));if(Ft!==fi&&ft.convert(Ft)!==B.getParameter(B.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Ft===ui&&(Lt.isWebGL2||wt.has("OES_texture_float")||wt.has("WEBGL_color_buffer_float")))&&!zt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=b.width-k&&H>=0&&H<=b.height-z&&B.readPixels(U,H,k,z,ft.convert(Vt),ft.convert(Ft),pt)}finally{let Dt=E!==null?Ot.get(E).__webglFramebuffer:null;_t.bindFramebuffer(B.FRAMEBUFFER,Dt)}}},this.copyFramebufferToTexture=function(b,U,H=0){let k=Math.pow(2,-H),z=Math.floor(U.image.width*k),pt=Math.floor(U.image.height*k);S.setTexture2D(U,0),B.copyTexSubImage2D(B.TEXTURE_2D,H,0,0,b.x,b.y,z,pt),_t.unbindTexture()},this.copyTextureToTexture=function(b,U,H,k=0){let z=U.image.width,pt=U.image.height,bt=ft.convert(H.format),Pt=ft.convert(H.type);S.setTexture2D(H,0),B.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,H.flipY),B.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,H.premultiplyAlpha),B.pixelStorei(B.UNPACK_ALIGNMENT,H.unpackAlignment),U.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,k,b.x,b.y,z,pt,bt,Pt,U.image.data):U.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,k,b.x,b.y,U.mipmaps[0].width,U.mipmaps[0].height,bt,U.mipmaps[0].data):B.texSubImage2D(B.TEXTURE_2D,k,b.x,b.y,bt,Pt,U.image),k===0&&H.generateMipmaps&&B.generateMipmap(B.TEXTURE_2D),_t.unbindTexture()},this.copyTextureToTexture3D=function(b,U,H,k,z=0){if(x.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}let pt=b.max.x-b.min.x+1,bt=b.max.y-b.min.y+1,Pt=b.max.z-b.min.z+1,Dt=ft.convert(k.format),Vt=ft.convert(k.type),Ft;if(k.isData3DTexture)S.setTexture3D(k,0),Ft=B.TEXTURE_3D;else if(k.isDataArrayTexture||k.isCompressedArrayTexture)S.setTexture2DArray(k,0),Ft=B.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}B.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,k.flipY),B.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),B.pixelStorei(B.UNPACK_ALIGNMENT,k.unpackAlignment);let zt=B.getParameter(B.UNPACK_ROW_LENGTH),ve=B.getParameter(B.UNPACK_IMAGE_HEIGHT),en=B.getParameter(B.UNPACK_SKIP_PIXELS),Ae=B.getParameter(B.UNPACK_SKIP_ROWS),Wn=B.getParameter(B.UNPACK_SKIP_IMAGES),de=H.isCompressedTexture?H.mipmaps[z]:H.image;B.pixelStorei(B.UNPACK_ROW_LENGTH,de.width),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,de.height),B.pixelStorei(B.UNPACK_SKIP_PIXELS,b.min.x),B.pixelStorei(B.UNPACK_SKIP_ROWS,b.min.y),B.pixelStorei(B.UNPACK_SKIP_IMAGES,b.min.z),H.isDataTexture||H.isData3DTexture?B.texSubImage3D(Ft,z,U.x,U.y,U.z,pt,bt,Pt,Dt,Vt,de.data):H.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),B.compressedTexSubImage3D(Ft,z,U.x,U.y,U.z,pt,bt,Pt,Dt,de.data)):B.texSubImage3D(Ft,z,U.x,U.y,U.z,pt,bt,Pt,Dt,Vt,de),B.pixelStorei(B.UNPACK_ROW_LENGTH,zt),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,ve),B.pixelStorei(B.UNPACK_SKIP_PIXELS,en),B.pixelStorei(B.UNPACK_SKIP_ROWS,Ae),B.pixelStorei(B.UNPACK_SKIP_IMAGES,Wn),z===0&&k.generateMipmaps&&B.generateMipmap(Ft),_t.unbindTexture()},this.initTexture=function(b){b.isCubeTexture?S.setTextureCube(b,0):b.isData3DTexture?S.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?S.setTexture2DArray(b,0):S.setTexture2D(b,0),_t.unbindTexture()},this.resetState=function(){P=0,A=0,E=null,_t.reset(),R.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return jn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=t===Ec?"display-p3":"srgb",e.unpackColorSpace=ne.workingColorSpace===oa?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===ye?Fi:_d}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===Fi?ye:Qn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}},Jl=class extends yr{};Jl.prototype.isWebGL1Renderer=!0;var Zo=class extends Xe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}};var Ds=class extends te{constructor(t,e,i,s=1){super(t,e,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},Ms=new ie,Zu=new ie,yo=[],Ju=new ti,av=new ie,lr=new ae,cr=new Pn,Us=class extends ae{constructor(t,e,i){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Ds(new Float32Array(i*16),16),this.instanceColor=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,av)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new ti),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,Ms),Ju.copy(t.boundingBox).applyMatrix4(Ms),this.boundingBox.union(Ju)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Pn),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,Ms),cr.copy(t.boundingSphere).applyMatrix4(Ms),this.boundingSphere.union(cr)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){let i=this.matrixWorld,s=this.count;if(lr.geometry=this.geometry,lr.material=this.material,lr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),cr.copy(this.boundingSphere),cr.applyMatrix4(i),t.ray.intersectsSphere(cr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ms),Zu.multiplyMatrices(i,Ms),lr.matrixWorld=Zu,lr.raycast(t,yo);for(let a=0,o=yo.length;a<o;a++){let l=yo[a];l.instanceId=r,l.object=this,e.push(l)}yo.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Ds(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}};var Ns=class extends gi{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new at(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}},Ku=new C,ju=new C,Qu=new ie,Sl=new mi,Mo=new Pn,Mr=class extends Xe{constructor(t=new he,e=new Ns){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,i=[0];for(let s=1,r=e.count;s<r;s++)Ku.fromBufferAttribute(e,s-1),ju.fromBufferAttribute(e,s),i[s]=i[s-1],i[s]+=Ku.distanceTo(ju);t.setAttribute("lineDistance",new Zt(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){let i=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Mo.copy(i.boundingSphere),Mo.applyMatrix4(s),Mo.radius+=r,t.ray.intersectsSphere(Mo)===!1)return;Qu.copy(s).invert(),Sl.copy(t.ray).applyMatrix4(Qu);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=new C,h=new C,u=new C,d=new C,p=this.isLineSegments?2:1,g=i.index,m=i.attributes.position;if(g!==null){let f=Math.max(0,a.start),M=Math.min(g.count,a.start+a.count);for(let x=f,w=M-1;x<w;x+=p){let P=g.getX(x),A=g.getX(x+1);if(c.fromBufferAttribute(m,P),h.fromBufferAttribute(m,A),Sl.distanceSqToSegment(c,h,d,u)>l)continue;d.applyMatrix4(this.matrixWorld);let F=t.ray.origin.distanceTo(d);F<t.near||F>t.far||e.push({distance:F,point:u.clone().applyMatrix4(this.matrixWorld),index:x,face:null,faceIndex:null,object:this})}}else{let f=Math.max(0,a.start),M=Math.min(m.count,a.start+a.count);for(let x=f,w=M-1;x<w;x+=p){if(c.fromBufferAttribute(m,x),h.fromBufferAttribute(m,x+1),Sl.distanceSqToSegment(c,h,d,u)>l)continue;d.applyMatrix4(this.matrixWorld);let A=t.ray.origin.distanceTo(d);A<t.near||A>t.far||e.push({distance:A,point:u.clone().applyMatrix4(this.matrixWorld),index:x,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){let e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){let s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}},td=new C,ed=new C,Jo=class extends Mr{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,i=[];for(let s=0,r=e.count;s<r;s+=2)td.fromBufferAttribute(e,s),ed.fromBufferAttribute(e,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+td.distanceTo(ed);t.setAttribute("lineDistance",new Zt(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var Kl=class extends gi{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new at(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},nd=new ie,jl=new mi,bo=new Pn,So=new C,Bi=class extends Xe{constructor(t=new he,e=new Kl){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){let i=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),bo.copy(i.boundingSphere),bo.applyMatrix4(s),bo.radius+=r,t.ray.intersectsSphere(bo)===!1)return;nd.copy(s).invert(),jl.copy(t.ray).applyMatrix4(nd);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,u=i.attributes.position;if(c!==null){let d=Math.max(0,a.start),p=Math.min(c.count,a.start+a.count);for(let g=d,_=p;g<_;g++){let m=c.getX(g);So.fromBufferAttribute(u,m),id(So,m,l,s,t,e,this)}}else{let d=Math.max(0,a.start),p=Math.min(u.count,a.start+a.count);for(let g=d,_=p;g<_;g++)So.fromBufferAttribute(u,g),id(So,g,l,s,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){let s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function id(n,t,e,i,s,r,a){let o=jl.distanceSqToPoint(n);if(o<e){let l=new C;jl.closestPointToPoint(n,l),l.applyMatrix4(i);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,object:a})}}var br=class extends xn{constructor(t,e,i,s,r,a,o,l,c){super(t,e,i,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Ln=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){let i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){let e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){let e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],i,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)i=this.getPoint(a/t),r+=i.distanceTo(s),e.push(r),s=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){let i=this.getLengths(),s=0,r=i.length,a;e?a=e:a=t*i[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=i[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,i[s]===a)return s/(r-1);let h=i[s],d=i[s+1]-h,p=(a-h)/d;return(s+p)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),l=e||(a.isVector2?new ot:new C);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){let i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){let i=new C,s=[],r=[],a=[],o=new C,l=new ie;for(let p=0;p<=t;p++){let g=p/t;s[p]=this.getTangentAt(g,new C)}r[0]=new C,a[0]=new C;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=c&&(c=h,i.set(1,0,0)),u<=c&&(c=u,i.set(0,1,0)),d<=c&&i.set(0,0,1),o.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let p=1;p<=t;p++){if(r[p]=r[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(s[p-1],s[p]),o.length()>Number.EPSILON){o.normalize();let g=Math.acos(Ce(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(l.makeRotationAxis(o,g))}a[p].crossVectors(s[p],r[p])}if(e===!0){let p=Math.acos(Ce(r[0].dot(r[t]),-1,1));p/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(p=-p);for(let g=1;g<=t;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],p*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},Ko=class extends Ln{constructor(t=0,e=0,i=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e){let i=e||new ot,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+t*r,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,p=c-this.aY;l=d*h-p*u+this.aX,c=d*u+p*h+this.aY}return i.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},Ql=class extends Ko{constructor(t,e,i,s,r,a){super(t,e,i,i,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function Ac(){let n=0,t=0,e=0,i=0;function s(r,a,o,l){n=r,t=o,e=-3*r+3*a-2*o-l,i=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,u){let d=(a-r)/c-(o-r)/(c+h)+(o-a)/h,p=(o-a)/h-(l-a)/(h+u)+(l-o)/u;d*=h,p*=h,s(a,o,d,p)},calc:function(r){let a=r*r,o=a*r;return n+t*r+e*a+i*o}}}var Eo=new C,El=new Ac,wl=new Ac,Tl=new Ac,tc=class extends Ln{constructor(t=[],e=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=s}getPoint(t,e=new C){let i=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t,o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%r]:(Eo.subVectors(s[0],s[1]).add(s[0]),c=Eo);let u=s[o%r],d=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(Eo.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Eo),this.curveType==="centripetal"||this.curveType==="chordal"){let p=this.curveType==="chordal"?.5:.25,g=Math.pow(c.distanceToSquared(u),p),_=Math.pow(u.distanceToSquared(d),p),m=Math.pow(d.distanceToSquared(h),p);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),El.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,g,_,m),wl.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,g,_,m),Tl.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,g,_,m)}else this.curveType==="catmullrom"&&(El.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),wl.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),Tl.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return i.set(El.calc(l),wl.calc(l),Tl.calc(l)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){let s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){let s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){let s=t.points[e];this.points.push(new C().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function sd(n,t,e,i,s){let r=(i-t)*.5,a=(s-e)*.5,o=n*n,l=n*o;return(2*e-2*i+r+a)*l+(-3*e+3*i-2*r-a)*o+r*n+e}function lv(n,t){let e=1-n;return e*e*t}function cv(n,t){return 2*(1-n)*n*t}function hv(n,t){return n*n*t}function fr(n,t,e,i){return lv(n,t)+cv(n,e)+hv(n,i)}function uv(n,t){let e=1-n;return e*e*e*t}function dv(n,t){let e=1-n;return 3*e*e*n*t}function fv(n,t){return 3*(1-n)*n*n*t}function pv(n,t){return n*n*n*t}function pr(n,t,e,i,s){return uv(n,t)+dv(n,e)+fv(n,i)+pv(n,s)}var ec=class extends Ln{constructor(t=new ot,e=new ot,i=new ot,s=new ot){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new ot){let i=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(pr(t,s.x,r.x,a.x,o.x),pr(t,s.y,r.y,a.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},nc=class extends Ln{constructor(t=new C,e=new C,i=new C,s=new C){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new C){let i=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(pr(t,s.x,r.x,a.x,o.x),pr(t,s.y,r.y,a.y,o.y),pr(t,s.z,r.z,a.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},ic=class extends Ln{constructor(t=new ot,e=new ot){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ot){let i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ot){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},sc=class extends Ln{constructor(t=new C,e=new C){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new C){let i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new C){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},rc=class extends Ln{constructor(t=new ot,e=new ot,i=new ot){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new ot){let i=e,s=this.v0,r=this.v1,a=this.v2;return i.set(fr(t,s.x,r.x,a.x),fr(t,s.y,r.y,a.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Fs=class extends Ln{constructor(t=new C,e=new C,i=new C){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new C){let i=e,s=this.v0,r=this.v1,a=this.v2;return i.set(fr(t,s.x,r.x,a.x),fr(t,s.y,r.y,a.y),fr(t,s.z,r.z,a.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},oc=class extends Ln{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ot){let i=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return i.set(sd(o,l.x,c.x,h.x,u.x),sd(o,l.y,c.y,h.y,u.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){let s=t.points[e];this.points.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){let s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){let s=t.points[e];this.points.push(new ot().fromArray(s))}return this}},mv=Object.freeze({__proto__:null,ArcCurve:Ql,CatmullRomCurve3:tc,CubicBezierCurve:ec,CubicBezierCurve3:nc,EllipseCurve:Ko,LineCurve:ic,LineCurve3:sc,QuadraticBezierCurve:rc,QuadraticBezierCurve3:Fs,SplineCurve:oc});var Sr=class n extends he{constructor(t=1,e=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:s},e=Math.max(3,e);let r=[],a=[],o=[],l=[],c=new C,h=new ot;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){let p=i+u/e*s;c.x=t*Math.cos(p),c.y=t*Math.sin(p),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[d]/t+1)/2,h.y=(a[d+1]/t+1)/2,l.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new Zt(a,3)),this.setAttribute("normal",new Zt(o,3)),this.setAttribute("uv",new Zt(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radius,t.segments,t.thetaStart,t.thetaLength)}},jo=class n extends he{constructor(t=1,e=1,i=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],d=[],p=[],g=0,_=[],m=i/2,f=0;M(),a===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new Zt(u,3)),this.setAttribute("normal",new Zt(d,3)),this.setAttribute("uv",new Zt(p,2));function M(){let w=new C,P=new C,A=0,E=(e-t)/i;for(let F=0;F<=r;F++){let y=[],T=F/r,D=T*(e-t)+t;for(let V=0;V<=s;V++){let Q=V/s,I=Q*l+o,N=Math.sin(I),G=Math.cos(I);P.x=D*N,P.y=-T*i+m,P.z=D*G,u.push(P.x,P.y,P.z),w.set(N,E,G).normalize(),d.push(w.x,w.y,w.z),p.push(Q,1-T),y.push(g++)}_.push(y)}for(let F=0;F<s;F++)for(let y=0;y<r;y++){let T=_[y][F],D=_[y+1][F],V=_[y+1][F+1],Q=_[y][F+1];h.push(T,D,Q),h.push(D,V,Q),A+=6}c.addGroup(f,A,0),f+=A}function x(w){let P=g,A=new ot,E=new C,F=0,y=w===!0?t:e,T=w===!0?1:-1;for(let V=1;V<=s;V++)u.push(0,m*T,0),d.push(0,T,0),p.push(.5,.5),g++;let D=g;for(let V=0;V<=s;V++){let I=V/s*l+o,N=Math.cos(I),G=Math.sin(I);E.x=y*G,E.y=m*T,E.z=y*N,u.push(E.x,E.y,E.z),d.push(0,T,0),A.x=N*.5+.5,A.y=G*.5*T+.5,p.push(A.x,A.y),g++}for(let V=0;V<s;V++){let Q=P+V,I=D+V;w===!0?h.push(I,I+1,Q):h.push(I+1,I,Q),F+=3}c.addGroup(f,F,w===!0?1:2),f+=F}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}};var wo=new C,To=new C,Al=new C,Ao=new Di,Qo=class extends he{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){let s=Math.pow(10,4),r=Math.cos(Ts*e),a=t.getIndex(),o=t.getAttribute("position"),l=a?a.count:o.count,c=[0,0,0],h=["a","b","c"],u=new Array(3),d={},p=[];for(let g=0;g<l;g+=3){a?(c[0]=a.getX(g),c[1]=a.getX(g+1),c[2]=a.getX(g+2)):(c[0]=g,c[1]=g+1,c[2]=g+2);let{a:_,b:m,c:f}=Ao;if(_.fromBufferAttribute(o,c[0]),m.fromBufferAttribute(o,c[1]),f.fromBufferAttribute(o,c[2]),Ao.getNormal(Al),u[0]=`${Math.round(_.x*s)},${Math.round(_.y*s)},${Math.round(_.z*s)}`,u[1]=`${Math.round(m.x*s)},${Math.round(m.y*s)},${Math.round(m.z*s)}`,u[2]=`${Math.round(f.x*s)},${Math.round(f.y*s)},${Math.round(f.z*s)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let M=0;M<3;M++){let x=(M+1)%3,w=u[M],P=u[x],A=Ao[h[M]],E=Ao[h[x]],F=`${w}_${P}`,y=`${P}_${w}`;y in d&&d[y]?(Al.dot(d[y].normal)<=r&&(p.push(A.x,A.y,A.z),p.push(E.x,E.y,E.z)),d[y]=null):F in d||(d[F]={index0:c[M],index1:c[x],normal:Al.clone()})}}for(let g in d)if(d[g]){let{index0:_,index1:m}=d[g];wo.fromBufferAttribute(o,_),To.fromBufferAttribute(o,m),p.push(wo.x,wo.y,wo.z),p.push(To.x,To.y,To.z)}this.setAttribute("position",new Zt(p,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}};var ta=class n extends he{constructor(t=.5,e=1,i=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:s,thetaStart:r,thetaLength:a},i=Math.max(3,i),s=Math.max(1,s);let o=[],l=[],c=[],h=[],u=t,d=(e-t)/s,p=new C,g=new ot;for(let _=0;_<=s;_++){for(let m=0;m<=i;m++){let f=r+m/i*a;p.x=u*Math.cos(f),p.y=u*Math.sin(f),l.push(p.x,p.y,p.z),c.push(0,0,1),g.x=(p.x/e+1)/2,g.y=(p.y/e+1)/2,h.push(g.x,g.y)}u+=d}for(let _=0;_<s;_++){let m=_*(i+1);for(let f=0;f<i;f++){let M=f+m,x=M,w=M+i+1,P=M+i+2,A=M+1;o.push(x,w,A),o.push(w,P,A)}}this.setIndex(o),this.setAttribute("position",new Zt(l,3)),this.setAttribute("normal",new Zt(c,3)),this.setAttribute("uv",new Zt(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}};var Er=class n extends he{constructor(t=1,e=32,i=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));let l=Math.min(a+o,Math.PI),c=0,h=[],u=new C,d=new C,p=[],g=[],_=[],m=[];for(let f=0;f<=i;f++){let M=[],x=f/i,w=0;f===0&&a===0?w=.5/e:f===i&&l===Math.PI&&(w=-.5/e);for(let P=0;P<=e;P++){let A=P/e;u.x=-t*Math.cos(s+A*r)*Math.sin(a+x*o),u.y=t*Math.cos(a+x*o),u.z=t*Math.sin(s+A*r)*Math.sin(a+x*o),g.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),m.push(A+w,1-x),M.push(c++)}h.push(M)}for(let f=0;f<i;f++)for(let M=0;M<e;M++){let x=h[f][M+1],w=h[f][M],P=h[f+1][M],A=h[f+1][M+1];(f!==0||a>0)&&p.push(x,w,A),(f!==i-1||l<Math.PI)&&p.push(w,P,A)}this.setIndex(p),this.setAttribute("position",new Zt(g,3)),this.setAttribute("normal",new Zt(_,3)),this.setAttribute("uv",new Zt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var wr=class n extends he{constructor(t=1,e=.4,i=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:s,arc:r},i=Math.floor(i),s=Math.floor(s);let a=[],o=[],l=[],c=[],h=new C,u=new C,d=new C;for(let p=0;p<=i;p++)for(let g=0;g<=s;g++){let _=g/s*r,m=p/i*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(_),u.y=(t+e*Math.cos(m))*Math.sin(_),u.z=e*Math.sin(m),o.push(u.x,u.y,u.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),d.subVectors(u,h).normalize(),l.push(d.x,d.y,d.z),c.push(g/s),c.push(p/i)}for(let p=1;p<=i;p++)for(let g=1;g<=s;g++){let _=(s+1)*p+g-1,m=(s+1)*(p-1)+g-1,f=(s+1)*(p-1)+g,M=(s+1)*p+g;a.push(_,m,M),a.push(m,f,M)}this.setIndex(a),this.setAttribute("position",new Zt(o,3)),this.setAttribute("normal",new Zt(l,3)),this.setAttribute("uv",new Zt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}};var ea=class n extends he{constructor(t=new Fs(new C(-1,-1,0),new C(-1,1,0),new C(1,1,0)),e=64,i=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:i,radialSegments:s,closed:r};let a=t.computeFrenetFrames(e,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;let o=new C,l=new C,c=new ot,h=new C,u=[],d=[],p=[],g=[];_(),this.setIndex(g),this.setAttribute("position",new Zt(u,3)),this.setAttribute("normal",new Zt(d,3)),this.setAttribute("uv",new Zt(p,2));function _(){for(let x=0;x<e;x++)m(x);m(r===!1?e:0),M(),f()}function m(x){h=t.getPointAt(x/e,h);let w=a.normals[x],P=a.binormals[x];for(let A=0;A<=s;A++){let E=A/s*Math.PI*2,F=Math.sin(E),y=-Math.cos(E);l.x=y*w.x+F*P.x,l.y=y*w.y+F*P.y,l.z=y*w.z+F*P.z,l.normalize(),d.push(l.x,l.y,l.z),o.x=h.x+i*l.x,o.y=h.y+i*l.y,o.z=h.z+i*l.z,u.push(o.x,o.y,o.z)}}function f(){for(let x=1;x<=e;x++)for(let w=1;w<=s;w++){let P=(s+1)*(x-1)+(w-1),A=(s+1)*x+(w-1),E=(s+1)*x+w,F=(s+1)*(x-1)+w;g.push(P,A,F),g.push(A,E,F)}}function M(){for(let x=0;x<=e;x++)for(let w=0;w<=s;w++)c.x=x/e,c.y=w/s,p.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new n(new mv[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}};var na=class extends re{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}};function Ro(n,t,e){return!n||!e&&n.constructor===t?n:typeof t.BYTES_PER_ELEMENT=="number"?new t(n):Array.prototype.slice.call(n)}function gv(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}var Os=class{constructor(t,e,i,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(i),this.sampleValues=e,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,i=this._cachedIndex,s=e[i],r=e[i-1];n:{t:{let a;e:{i:if(!(t<s)){for(let o=i+2;;){if(s===void 0){if(t<r)break i;return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(r=s,s=e[++i],t<s)break t}a=e.length;break e}if(!(t>=r)){let o=e[1];t<o&&(i=2,r=o);for(let l=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(s=r,r=e[--i-1],t>=r)break t}a=i,i=0;break e}break n}for(;i<a;){let o=i+a>>>1;t<e[o]?a=o:i=o+1}if(s=e[i],r=e[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=t*s;for(let a=0;a!==s;++a)e[a]=i[r+a];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},ac=class extends Os{constructor(t,e,i,s){super(t,e,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:ru,endingEnd:ru}}intervalChanged_(t,e,i){let s=this.parameterPositions,r=t-2,a=t+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case ou:r=t,o=2*e-i;break;case au:r=s.length-2,o=e+s[r]-s[r+1];break;default:r=t,o=i}if(l===void 0)switch(this.getSettings_().endingEnd){case ou:a=t,l=2*i-e;break;case au:a=1,l=i+s[1]-s[0];break;default:a=t-1,l=e}let c=(i-e)*.5,h=this.valueSize;this._weightPrev=c/(e-o),this._weightNext=c/(l-i),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(t,e,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,p=this._weightNext,g=(i-e)/(s-e),_=g*g,m=_*g,f=-d*m+2*d*_-d*g,M=(1+d)*m+(-1.5-2*d)*_+(-.5+d)*g+1,x=(-1-p)*m+(1.5+p)*_+.5*g,w=p*m-p*_;for(let P=0;P!==o;++P)r[P]=f*a[h+P]+M*a[c+P]+x*a[l+P]+w*a[u+P];return r}},lc=class extends Os{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t,e,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=(i-e)/(s-e),u=1-h;for(let d=0;d!==o;++d)r[d]=a[c+d]*u+a[l+d]*h;return r}},cc=class extends Os{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t){return this.copySampleValue_(t-1)}},In=class{constructor(t,e,i,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Ro(e,this.TimeBufferType),this.values=Ro(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,i;if(e.toJSON!==this.toJSON)i=e.toJSON(t);else{i={name:t.name,times:Ro(t.times,Array),values:Ro(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(i.interpolation=s)}return i.type=t.ValueTypeName,i}InterpolantFactoryMethodDiscrete(t){return new cc(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new lc(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new ac(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case Po:e=this.InterpolantFactoryMethodDiscrete;break;case Lo:e=this.InterpolantFactoryMethodLinear;break;case tl:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Po;case this.InterpolantFactoryMethodLinear:return Lo;case this.InterpolantFactoryMethodSmooth:return tl}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let i=0,s=e.length;i!==s;++i)e[i]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let i=0,s=e.length;i!==s;++i)e[i]*=t}return this}trim(t,e){let i=this.times,s=i.length,r=0,a=s-1;for(;r!==s&&i[r]<t;)++r;for(;a!==-1&&i[a]>e;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=i.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let i=this.times,s=this.values,r=i.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let a=null;for(let o=0;o!==r;o++){let l=i[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),t=!1;break}if(a!==null&&a>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,a),t=!1;break}a=l}if(s!==void 0&&gv(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===tl,r=t.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=t[o],h=t[o+1];if(c!==h&&(o!==1||c!==t[0]))if(s)l=!0;else{let u=o*i,d=u-i,p=u+i;for(let g=0;g!==i;++g){let _=e[u+g];if(_!==e[d+g]||_!==e[p+g]){l=!0;break}}}if(l){if(o!==a){t[a]=t[o];let u=o*i,d=a*i;for(let p=0;p!==i;++p)e[d+p]=e[u+p]}++a}}if(r>0){t[a]=t[r];for(let o=r*i,l=a*i,c=0;c!==i;++c)e[l+c]=e[o+c];++a}return a!==t.length?(this.times=t.slice(0,a),this.values=e.slice(0,a*i)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),i=this.constructor,s=new i(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};In.prototype.TimeBufferType=Float32Array;In.prototype.ValueBufferType=Float32Array;In.prototype.DefaultInterpolation=Lo;var zi=class extends In{};zi.prototype.ValueTypeName="bool";zi.prototype.ValueBufferType=Array;zi.prototype.DefaultInterpolation=Po;zi.prototype.InterpolantFactoryMethodLinear=void 0;zi.prototype.InterpolantFactoryMethodSmooth=void 0;var hc=class extends In{};hc.prototype.ValueTypeName="color";var uc=class extends In{};uc.prototype.ValueTypeName="number";var dc=class extends Os{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t,e,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(i-e)/(s-e),c=t*o;for(let h=c+o;c!==h;c+=4)an.slerpFlat(r,0,a,c-o,a,c,l);return r}},Tr=class extends In{InterpolantFactoryMethodLinear(t){return new dc(this.times,this.values,this.getValueSize(),t)}};Tr.prototype.ValueTypeName="quaternion";Tr.prototype.DefaultInterpolation=Lo;Tr.prototype.InterpolantFactoryMethodSmooth=void 0;var Hi=class extends In{};Hi.prototype.ValueTypeName="string";Hi.prototype.ValueBufferType=Array;Hi.prototype.DefaultInterpolation=Po;Hi.prototype.InterpolantFactoryMethodLinear=void 0;Hi.prototype.InterpolantFactoryMethodSmooth=void 0;var fc=class extends In{};fc.prototype.ValueTypeName="vector";var pc=class{constructor(t,e,i){let s=this,r=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=i,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let p=c[u],g=c[u+1];if(p.global&&(p.lastIndex=0),p.test(h))return g}return null}}},_v=new pc,mc=class{constructor(t){this.manager=t!==void 0?t:_v,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let i=this;return new Promise(function(s,r){i.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}};mc.DEFAULT_MATERIAL_NAME="__DEFAULT";var ia=class{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=rd(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let e=rd();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}};function rd(){return(typeof performance>"u"?Date:performance).now()}var Rc="\\[\\]\\.:\\/",xv=new RegExp("["+Rc+"]","g"),Cc="[^"+Rc+"]",vv="[^"+Rc.replace("\\.","")+"]",yv=/((?:WC+[\/:])*)/.source.replace("WC",Cc),Mv=/(WCOD+)?/.source.replace("WCOD",vv),bv=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Cc),Sv=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Cc),Ev=new RegExp("^"+yv+Mv+bv+Sv+"$"),wv=["material","materials","bones","map"],gc=class{constructor(t,e,i){let s=i||ce.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(t,e)}setValue(t,e){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].unbind()}},ce=class n{constructor(t,e,i){this.path=e,this.parsedPath=i||n.parseTrackName(e),this.node=n.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,i){return t&&t.isAnimationObjectGroup?new n.Composite(t,e,i):new n(t,e,i)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(xv,"")}static parseTrackName(t){let e=Ev.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let i={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=i.nodeName.substring(s+1);wv.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return i}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let i=t.skeleton.getBoneByName(e);if(i!==void 0)return i}if(t.children){let i=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===e||o.uuid===e)return o;let l=i(o.children);if(l)return l}return null},s=i(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)t[e++]=i[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,i=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=n.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=e.objectIndex;switch(i){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[i]}if(c!==void 0){if(t[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let a=t[s];if(a===void 0){let c=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:t.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ce.Composite=gc;ce.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ce.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ce.prototype.GetterByBindingType=[ce.prototype._getValue_direct,ce.prototype._getValue_array,ce.prototype._getValue_arrayElement,ce.prototype._getValue_toArray];ce.prototype.SetterByBindingTypeAndVersioning=[[ce.prototype._setValue_direct,ce.prototype._setValue_direct_setNeedsUpdate,ce.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ce.prototype._setValue_array,ce.prototype._setValue_array_setNeedsUpdate,ce.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ce.prototype._setValue_arrayElement,ce.prototype._setValue_arrayElement_setNeedsUpdate,ce.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ce.prototype._setValue_fromArray,ce.prototype._setValue_fromArray_setNeedsUpdate,ce.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var qy=new Float32Array(1);var sa=class{constructor(t,e,i=0,s=1/0){this.ray=new mi(t,e),this.near=i,this.far=s,this.camera=null,this.layers=new _r,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,i=[]){return _c(t,this,i,e),i.sort(od),i}intersectObjects(t,e=!0,i=[]){for(let s=0,r=t.length;s<r;s++)_c(t[s],this,i,e);return i.sort(od),i}};function od(n,t){return n.distance-t.distance}function _c(n,t,e,i){if(n.layers.test(t.layers)&&n.raycast(t,e),i===!0){let s=n.children;for(let r=0,a=s.length;r<a;r++)_c(s[r],t,e,!0)}}var Ar=class{constructor(t=1,e=0,i=0){return this.radius=t,this.phi=e,this.theta=i,this}set(t,e,i){return this.radius=t,this.phi=e,this.theta=i,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,i){return this.radius=Math.sqrt(t*t+e*e+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,i),this.phi=Math.acos(Ce(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:xc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=xc);var Rd={type:"change"},Pc={type:"start"},Cd={type:"end"},ca=new mi,Pd=new Tn,Av=Math.cos(70*aa.DEG2RAD),ha=class extends zn{constructor(t,e){super(),this.object=t,this.domElement=e,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new C,this.cursor=new C,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:ki.ROTATE,MIDDLE:ki.DOLLY,RIGHT:ki.PAN},this.touches={ONE:Vi.ROTATE,TWO:Vi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return o.phi},this.getAzimuthalAngle=function(){return o.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(R){R.addEventListener("keydown",At),this._domElementKeyEvents=R},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",At),this._domElementKeyEvents=null},this.saveState=function(){i.target0.copy(i.target),i.position0.copy(i.object.position),i.zoom0=i.object.zoom},this.reset=function(){i.target.copy(i.target0),i.object.position.copy(i.position0),i.object.zoom=i.zoom0,i.object.updateProjectionMatrix(),i.dispatchEvent(Rd),i.update(),r=s.NONE},this.update=function(){let R=new C,it=new an().setFromUnitVectors(t.up,new C(0,1,0)),yt=it.clone().invert(),mt=new C,j=new an,L=new C,st=2*Math.PI;return function(Ct=null){let Tt=i.object.position;R.copy(Tt).sub(i.target),R.applyQuaternion(it),o.setFromVector3(R),i.autoRotate&&r===s.NONE&&V(T(Ct)),i.enableDamping?(o.theta+=l.theta*i.dampingFactor,o.phi+=l.phi*i.dampingFactor):(o.theta+=l.theta,o.phi+=l.phi);let Yt=i.minAzimuthAngle,$t=i.maxAzimuthAngle;isFinite(Yt)&&isFinite($t)&&(Yt<-Math.PI?Yt+=st:Yt>Math.PI&&(Yt-=st),$t<-Math.PI?$t+=st:$t>Math.PI&&($t-=st),Yt<=$t?o.theta=Math.max(Yt,Math.min($t,o.theta)):o.theta=o.theta>(Yt+$t)/2?Math.max(Yt,o.theta):Math.min($t,o.theta)),o.phi=Math.max(i.minPolarAngle,Math.min(i.maxPolarAngle,o.phi)),o.makeSafe(),i.enableDamping===!0?i.target.addScaledVector(h,i.dampingFactor):i.target.add(h),i.target.sub(i.cursor),i.target.clampLength(i.minTargetRadius,i.maxTargetRadius),i.target.add(i.cursor),i.zoomToCursor&&A||i.object.isOrthographicCamera?o.radius=Z(o.radius):o.radius=Z(o.radius*c),R.setFromSpherical(o),R.applyQuaternion(yt),Tt.copy(i.target).add(R),i.object.lookAt(i.target),i.enableDamping===!0?(l.theta*=1-i.dampingFactor,l.phi*=1-i.dampingFactor,h.multiplyScalar(1-i.dampingFactor)):(l.set(0,0,0),h.set(0,0,0));let me=!1;if(i.zoomToCursor&&A){let xe=null;if(i.object.isPerspectiveCamera){let jt=R.length();xe=Z(jt*c);let Me=jt-xe;i.object.position.addScaledVector(w,Me),i.object.updateMatrixWorld()}else if(i.object.isOrthographicCamera){let jt=new C(P.x,P.y,0);jt.unproject(i.object),i.object.zoom=Math.max(i.minZoom,Math.min(i.maxZoom,i.object.zoom/c)),i.object.updateProjectionMatrix(),me=!0;let Me=new C(P.x,P.y,0);Me.unproject(i.object),i.object.position.sub(Me).add(jt),i.object.updateMatrixWorld(),xe=R.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),i.zoomToCursor=!1;xe!==null&&(this.screenSpacePanning?i.target.set(0,0,-1).transformDirection(i.object.matrix).multiplyScalar(xe).add(i.object.position):(ca.origin.copy(i.object.position),ca.direction.set(0,0,-1).transformDirection(i.object.matrix),Math.abs(i.object.up.dot(ca.direction))<Av?t.lookAt(i.target):(Pd.setFromNormalAndCoplanarPoint(i.object.up,i.target),ca.intersectPlane(Pd,i.target))))}else i.object.isOrthographicCamera&&(i.object.zoom=Math.max(i.minZoom,Math.min(i.maxZoom,i.object.zoom/c)),i.object.updateProjectionMatrix(),me=!0);return c=1,A=!1,me||mt.distanceToSquared(i.object.position)>a||8*(1-j.dot(i.object.quaternion))>a||L.distanceToSquared(i.target)>0?(i.dispatchEvent(Rd),mt.copy(i.object.position),j.copy(i.object.quaternion),L.copy(i.target),!0):!1}}(),this.dispose=function(){i.domElement.removeEventListener("contextmenu",Qt),i.domElement.removeEventListener("pointerdown",S),i.domElement.removeEventListener("pointercancel",O),i.domElement.removeEventListener("wheel",et),i.domElement.removeEventListener("pointermove",v),i.domElement.removeEventListener("pointerup",O),i._domElementKeyEvents!==null&&(i._domElementKeyEvents.removeEventListener("keydown",At),i._domElementKeyEvents=null)};let i=this,s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},r=s.NONE,a=1e-6,o=new Ar,l=new Ar,c=1,h=new C,u=new ot,d=new ot,p=new ot,g=new ot,_=new ot,m=new ot,f=new ot,M=new ot,x=new ot,w=new C,P=new ot,A=!1,E=[],F={},y=!1;function T(R){return R!==null?2*Math.PI/60*i.autoRotateSpeed*R:2*Math.PI/60/60*i.autoRotateSpeed}function D(R){let it=Math.abs(R*.01);return Math.pow(.95,i.zoomSpeed*it)}function V(R){l.theta-=R}function Q(R){l.phi-=R}let I=function(){let R=new C;return function(yt,mt){R.setFromMatrixColumn(mt,0),R.multiplyScalar(-yt),h.add(R)}}(),N=function(){let R=new C;return function(yt,mt){i.screenSpacePanning===!0?R.setFromMatrixColumn(mt,1):(R.setFromMatrixColumn(mt,0),R.crossVectors(i.object.up,R)),R.multiplyScalar(yt),h.add(R)}}(),G=function(){let R=new C;return function(yt,mt){let j=i.domElement;if(i.object.isPerspectiveCamera){let L=i.object.position;R.copy(L).sub(i.target);let st=R.length();st*=Math.tan(i.object.fov/2*Math.PI/180),I(2*yt*st/j.clientHeight,i.object.matrix),N(2*mt*st/j.clientHeight,i.object.matrix)}else i.object.isOrthographicCamera?(I(yt*(i.object.right-i.object.left)/i.object.zoom/j.clientWidth,i.object.matrix),N(mt*(i.object.top-i.object.bottom)/i.object.zoom/j.clientHeight,i.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),i.enablePan=!1)}}();function Y(R){i.object.isPerspectiveCamera||i.object.isOrthographicCamera?c/=R:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),i.enableZoom=!1)}function q(R){i.object.isPerspectiveCamera||i.object.isOrthographicCamera?c*=R:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),i.enableZoom=!1)}function X(R,it){if(!i.zoomToCursor)return;A=!0;let yt=i.domElement.getBoundingClientRect(),mt=R-yt.left,j=it-yt.top,L=yt.width,st=yt.height;P.x=mt/L*2-1,P.y=-(j/st)*2+1,w.set(P.x,P.y,1).unproject(i.object).sub(i.object.position).normalize()}function Z(R){return Math.max(i.minDistance,Math.min(i.maxDistance,R))}function nt(R){u.set(R.clientX,R.clientY)}function dt(R){X(R.clientX,R.clientX),f.set(R.clientX,R.clientY)}function W(R){g.set(R.clientX,R.clientY)}function $(R){d.set(R.clientX,R.clientY),p.subVectors(d,u).multiplyScalar(i.rotateSpeed);let it=i.domElement;V(2*Math.PI*p.x/it.clientHeight),Q(2*Math.PI*p.y/it.clientHeight),u.copy(d),i.update()}function ut(R){M.set(R.clientX,R.clientY),x.subVectors(M,f),x.y>0?Y(D(x.y)):x.y<0&&q(D(x.y)),f.copy(M),i.update()}function Mt(R){_.set(R.clientX,R.clientY),m.subVectors(_,g).multiplyScalar(i.panSpeed),G(m.x,m.y),g.copy(_),i.update()}function vt(R){X(R.clientX,R.clientY),R.deltaY<0?q(D(R.deltaY)):R.deltaY>0&&Y(D(R.deltaY)),i.update()}function Ut(R){let it=!1;switch(R.code){case i.keys.UP:R.ctrlKey||R.metaKey||R.shiftKey?Q(2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):G(0,i.keyPanSpeed),it=!0;break;case i.keys.BOTTOM:R.ctrlKey||R.metaKey||R.shiftKey?Q(-2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):G(0,-i.keyPanSpeed),it=!0;break;case i.keys.LEFT:R.ctrlKey||R.metaKey||R.shiftKey?V(2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):G(i.keyPanSpeed,0),it=!0;break;case i.keys.RIGHT:R.ctrlKey||R.metaKey||R.shiftKey?V(-2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):G(-i.keyPanSpeed,0),it=!0;break}it&&(R.preventDefault(),i.update())}function Nt(R){if(E.length===1)u.set(R.pageX,R.pageY);else{let it=ft(R),yt=.5*(R.pageX+it.x),mt=.5*(R.pageY+it.y);u.set(yt,mt)}}function Rt(R){if(E.length===1)g.set(R.pageX,R.pageY);else{let it=ft(R),yt=.5*(R.pageX+it.x),mt=.5*(R.pageY+it.y);g.set(yt,mt)}}function qt(R){let it=ft(R),yt=R.pageX-it.x,mt=R.pageY-it.y,j=Math.sqrt(yt*yt+mt*mt);f.set(0,j)}function B(R){i.enableZoom&&qt(R),i.enablePan&&Rt(R)}function Le(R){i.enableZoom&&qt(R),i.enableRotate&&Nt(R)}function wt(R){if(E.length==1)d.set(R.pageX,R.pageY);else{let yt=ft(R),mt=.5*(R.pageX+yt.x),j=.5*(R.pageY+yt.y);d.set(mt,j)}p.subVectors(d,u).multiplyScalar(i.rotateSpeed);let it=i.domElement;V(2*Math.PI*p.x/it.clientHeight),Q(2*Math.PI*p.y/it.clientHeight),u.copy(d)}function Lt(R){if(E.length===1)_.set(R.pageX,R.pageY);else{let it=ft(R),yt=.5*(R.pageX+it.x),mt=.5*(R.pageY+it.y);_.set(yt,mt)}m.subVectors(_,g).multiplyScalar(i.panSpeed),G(m.x,m.y),g.copy(_)}function _t(R){let it=ft(R),yt=R.pageX-it.x,mt=R.pageY-it.y,j=Math.sqrt(yt*yt+mt*mt);M.set(0,j),x.set(0,Math.pow(M.y/f.y,i.zoomSpeed)),Y(x.y),f.copy(M);let L=(R.pageX+it.x)*.5,st=(R.pageY+it.y)*.5;X(L,st)}function oe(R){i.enableZoom&&_t(R),i.enablePan&&Lt(R)}function Ot(R){i.enableZoom&&_t(R),i.enableRotate&&wt(R)}function S(R){i.enabled!==!1&&(E.length===0&&(i.domElement.setPointerCapture(R.pointerId),i.domElement.addEventListener("pointermove",v),i.domElement.addEventListener("pointerup",O)),kt(R),R.pointerType==="touch"?Bt(R):tt(R))}function v(R){i.enabled!==!1&&(R.pointerType==="touch"?J(R):K(R))}function O(R){It(R),E.length===0&&(i.domElement.releasePointerCapture(R.pointerId),i.domElement.removeEventListener("pointermove",v),i.domElement.removeEventListener("pointerup",O)),i.dispatchEvent(Cd),r=s.NONE}function tt(R){let it;switch(R.button){case 0:it=i.mouseButtons.LEFT;break;case 1:it=i.mouseButtons.MIDDLE;break;case 2:it=i.mouseButtons.RIGHT;break;default:it=-1}switch(it){case ki.DOLLY:if(i.enableZoom===!1)return;dt(R),r=s.DOLLY;break;case ki.ROTATE:if(R.ctrlKey||R.metaKey||R.shiftKey){if(i.enablePan===!1)return;W(R),r=s.PAN}else{if(i.enableRotate===!1)return;nt(R),r=s.ROTATE}break;case ki.PAN:if(R.ctrlKey||R.metaKey||R.shiftKey){if(i.enableRotate===!1)return;nt(R),r=s.ROTATE}else{if(i.enablePan===!1)return;W(R),r=s.PAN}break;default:r=s.NONE}r!==s.NONE&&i.dispatchEvent(Pc)}function K(R){switch(r){case s.ROTATE:if(i.enableRotate===!1)return;$(R);break;case s.DOLLY:if(i.enableZoom===!1)return;ut(R);break;case s.PAN:if(i.enablePan===!1)return;Mt(R);break}}function et(R){i.enabled===!1||i.enableZoom===!1||r!==s.NONE||(R.preventDefault(),i.dispatchEvent(Pc),vt(xt(R)),i.dispatchEvent(Cd))}function xt(R){let it=R.deltaMode,yt={clientX:R.clientX,clientY:R.clientY,deltaY:R.deltaY};switch(it){case 1:yt.deltaY*=16;break;case 2:yt.deltaY*=100;break}return R.ctrlKey&&!y&&(yt.deltaY*=10),yt}function ct(R){R.key==="Control"&&(y=!0,document.addEventListener("keyup",gt,{passive:!0,capture:!0}))}function gt(R){R.key==="Control"&&(y=!1,document.removeEventListener("keyup",gt,{passive:!0,capture:!0}))}function At(R){i.enabled===!1||i.enablePan===!1||Ut(R)}function Bt(R){switch(St(R),E.length){case 1:switch(i.touches.ONE){case Vi.ROTATE:if(i.enableRotate===!1)return;Nt(R),r=s.TOUCH_ROTATE;break;case Vi.PAN:if(i.enablePan===!1)return;Rt(R),r=s.TOUCH_PAN;break;default:r=s.NONE}break;case 2:switch(i.touches.TWO){case Vi.DOLLY_PAN:if(i.enableZoom===!1&&i.enablePan===!1)return;B(R),r=s.TOUCH_DOLLY_PAN;break;case Vi.DOLLY_ROTATE:if(i.enableZoom===!1&&i.enableRotate===!1)return;Le(R),r=s.TOUCH_DOLLY_ROTATE;break;default:r=s.NONE}break;default:r=s.NONE}r!==s.NONE&&i.dispatchEvent(Pc)}function J(R){switch(St(R),r){case s.TOUCH_ROTATE:if(i.enableRotate===!1)return;wt(R),i.update();break;case s.TOUCH_PAN:if(i.enablePan===!1)return;Lt(R),i.update();break;case s.TOUCH_DOLLY_PAN:if(i.enableZoom===!1&&i.enablePan===!1)return;oe(R),i.update();break;case s.TOUCH_DOLLY_ROTATE:if(i.enableZoom===!1&&i.enableRotate===!1)return;Ot(R),i.update();break;default:r=s.NONE}}function Qt(R){i.enabled!==!1&&R.preventDefault()}function kt(R){E.push(R.pointerId)}function It(R){delete F[R.pointerId];for(let it=0;it<E.length;it++)if(E[it]==R.pointerId){E.splice(it,1);return}}function St(R){let it=F[R.pointerId];it===void 0&&(it=new ot,F[R.pointerId]=it),it.set(R.pageX,R.pageY)}function ft(R){let it=R.pointerId===E[0]?E[1]:E[0];return F[it]}i.domElement.addEventListener("contextmenu",Qt),i.domElement.addEventListener("pointerdown",S),i.domElement.addEventListener("pointercancel",O),i.domElement.addEventListener("wheel",et,{passive:!1}),document.addEventListener("keydown",ct,{passive:!0,capture:!0}),this.update()}};var ua={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};var ln=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},Rv=new vr(-1,1,1,-1,0,1),Lc=class extends he{constructor(){super(),this.setAttribute("position",new Zt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Zt([0,2,0,0,2,0],2))}},Cv=new Lc,vi=class{constructor(t){this._mesh=new ae(Cv,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,Rv)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}};var da=class extends ln{constructor(t,e){super(),this.textureID=e!==void 0?e:"tDiffuse",t instanceof re?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=xi.clone(t.uniforms),this.material=new re({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this.fsQuad=new vi(this.material)}render(t,e,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this.fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}};var Cr=class extends ln{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,i){let s=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),t.setRenderTarget(i),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}},fa=class extends ln{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}};var pa=class{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){let i=t.getSize(new ot);this._width=i.width,this._height=i.height,e=new De(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:on}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new da(ua),this.copyPass.material.blending=Bn,this.clock=new ia}swapBuffers(){let t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){let e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());let e=this.renderer.getRenderTarget(),i=!1;for(let s=0,r=this.passes.length;s<r;s++){let a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,t,i),a.needsSwap){if(i){let o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}Cr!==void 0&&(a instanceof Cr?i=!0:a instanceof fa&&(i=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){let e=this.renderer.getSize(new ot);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;let i=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(i,s),this.renderTarget2.setSize(i,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(i,s)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var ma=class extends ln{constructor(t,e,i=null,s=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=i,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new at}render(t,e,i){let s=t.autoClear;t.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor)),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),t.autoClear=s}};var Ld={name:"LuminosityHighPassShader",shaderID:"luminosityHighPass",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new at(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			vec3 luma = vec3( 0.299, 0.587, 0.114 );

			float v = dot( texel.xyz, luma );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};var Hs=class n extends ln{constructor(t,e,i,s){super(),this.strength=e!==void 0?e:1,this.radius=i,this.threshold=s,this.resolution=t!==void 0?new ot(t.x,t.y):new ot(256,256),this.clearColor=new at(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new De(r,a,{type:on}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){let d=new De(r,a,{type:on});d.texture.name="UnrealBloomPass.h"+u,d.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(d);let p=new De(r,a,{type:on});p.texture.name="UnrealBloomPass.v"+u,p.texture.generateMipmaps=!1,this.renderTargetsVertical.push(p),r=Math.round(r/2),a=Math.round(a/2)}let o=Ld;this.highPassUniforms=xi.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new re({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let l=[3,5,7,9,11];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(l[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new ot(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new C(1,1,1),new C(1,1,1),new C(1,1,1),new C(1,1,1),new C(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;let h=ua;this.copyUniforms=xi.clone(h.uniforms),this.blendMaterial=new re({uniforms:this.copyUniforms,vertexShader:h.vertexShader,fragmentShader:h.fragmentShader,blending:rn,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new at,this.oldClearAlpha=1,this.basic=new Ze,this.fsQuad=new vi(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(t,e){let i=Math.round(t/2),s=Math.round(e/2);this.renderTargetBright.setSize(i,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(i,s),this.renderTargetsVertical[r].setSize(i,s),this.separableBlurMaterials[r].uniforms.invSize.value=new ot(1/i,1/s),i=Math.round(i/2),s=Math.round(s/2)}render(t,e,i,s,r){t.getClearColor(this._oldClearColor),this.oldClearAlpha=t.getClearAlpha();let a=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),r&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=i.texture,t.setRenderTarget(null),t.clear(),this.fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this.fsQuad.render(t);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this.fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=n.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[l]),t.clear(),this.fsQuad.render(t),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=n.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[l]),t.clear(),this.fsQuad.render(t),o=this.renderTargetsVertical[l];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this.fsQuad.render(t),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(i),this.fsQuad.render(t)),t.setClearColor(this._oldClearColor,this.oldClearAlpha),t.autoClear=a}getSeperableBlurMaterial(t){let e=[];for(let i=0;i<t;i++)e.push(.39894*Math.exp(-.5*i*i/(t*t))/t);return new re({defines:{KERNEL_RADIUS:t},uniforms:{colorTexture:{value:null},invSize:{value:new ot(.5,.5)},direction:{value:new ot(.5,.5)},gaussianCoefficients:{value:e}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(t){return new re({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}};Hs.BlurDirectionX=new ot(1,0);Hs.BlurDirectionY=new ot(0,1);var Id={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
	
		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = OptimizedCineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};var ga=class extends ln{constructor(){super();let t=Id;this.uniforms=xi.clone(t.uniforms),this.material=new na({name:t.name,uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader}),this.fsQuad=new vi(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},ne.getTransfer(this._outputColorSpace)===se&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===vc?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===yc?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Mc?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Rr?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===bc&&(this.material.defines.AGX_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}};var Gi=class extends Xe{constructor(t=document.createElement("div")){super(),this.isCSS2DObject=!0,this.element=t,this.element.style.position="absolute",this.element.style.userSelect="none",this.element.setAttribute("draggable",!1),this.center=new ot(.5,.5),this.addEventListener("removed",function(){this.traverse(function(e){e.element instanceof Element&&e.element.parentNode!==null&&e.element.parentNode.removeChild(e.element)})})}copy(t,e){return super.copy(t,e),this.element=t.element.cloneNode(!0),this.center=t.center,this}},ks=new C,Dd=new ie,Ud=new ie,Nd=new C,Fd=new C,_a=class{constructor(t={}){let e=this,i,s,r,a,o={objects:new WeakMap},l=t.element!==void 0?t.element:document.createElement("div");l.style.overflow="hidden",this.domElement=l,this.getSize=function(){return{width:i,height:s}},this.render=function(p,g){p.matrixWorldAutoUpdate===!0&&p.updateMatrixWorld(),g.parent===null&&g.matrixWorldAutoUpdate===!0&&g.updateMatrixWorld(),Dd.copy(g.matrixWorldInverse),Ud.multiplyMatrices(g.projectionMatrix,Dd),c(p,p,g),d(p)},this.setSize=function(p,g){i=p,s=g,r=i/2,a=s/2,l.style.width=p+"px",l.style.height=g+"px"};function c(p,g,_){if(p.isCSS2DObject){ks.setFromMatrixPosition(p.matrixWorld),ks.applyMatrix4(Ud);let m=p.visible===!0&&ks.z>=-1&&ks.z<=1&&p.layers.test(_.layers)===!0;if(p.element.style.display=m===!0?"":"none",m===!0){p.onBeforeRender(e,g,_);let M=p.element;M.style.transform="translate("+-100*p.center.x+"%,"+-100*p.center.y+"%)translate("+(ks.x*r+r)+"px,"+(-ks.y*a+a)+"px)",M.parentNode!==l&&l.appendChild(M),p.onAfterRender(e,g,_)}let f={distanceToCameraSquared:h(_,p)};o.objects.set(p,f)}for(let m=0,f=p.children.length;m<f;m++)c(p.children[m],g,_)}function h(p,g){return Nd.setFromMatrixPosition(p.matrixWorld),Fd.setFromMatrixPosition(g.matrixWorld),Nd.distanceToSquared(Fd)}function u(p){let g=[];return p.traverse(function(_){_.isCSS2DObject&&g.push(_)}),g}function d(p){let g=u(p).sort(function(m,f){if(m.renderOrder!==f.renderOrder)return f.renderOrder-m.renderOrder;let M=o.objects.get(m).distanceToCameraSquared,x=o.objects.get(f).distanceToCameraSquared;return M-x}),_=g.length;for(let m=0,f=g.length;m<f;m++)g[m].element.style.zIndex=_-m}}};function Pv(n,t,e,i,s){let r=n.length,a=new Array(r);if(!r)return a;let o=0;for(let _ of n)o+=_;let l=i*s/o,c=n.map(_=>_*l),h=0,u=t,d=e,p=i,g=s;for(;h<r;){let _=Math.max(1e-9,Math.min(p,g)),m=h,f=0,M=1/0;for(;m<r;){let x=f+c[m],w=Math.max(_*_*c[h]/(x*x),x*x/(_*_*c[m]));if(w>M)break;M=w,f=x,m++}if(p>=g){let x=f/Math.max(1e-9,g),w=d;for(let P=h;P<m;P++){let A=c[P]/x;a[P]=[u,w,x,A],w+=A}u+=x,p-=x}else{let x=f/Math.max(1e-9,p),w=u;for(let P=h;P<m;P++){let A=c[P]/x;a[P]=[w,d,A,x],w+=A}d+=x,g-=x}h=m}return a}var Vs=.13,xa=.7;function Lv(n){return 1+.55*Math.log2(1+n)}function Od(n,t){let e=n.length,i=[],s=(g,_,m)=>{let f={id:i.length,name:g,parent:_,depth:m,dirs:[],files:[],kids:new Map,w:0,rect:null,path:_&&_.path?_.path+"/"+g:g};return i.push(f),f},r=s("",null,0),a=new Int32Array(e);for(let g=0;g<e;g++){let _=n[g].split("/"),m=r;for(let f=0;f<_.length-1;f++){let M=m.kids.get(_[f]);M||(M=s(_[f],m,m.depth+1),m.kids.set(_[f],M),m.dirs.push(M)),m=M}m.files.push(g),a[g]=m.id}let o=new Float32Array(e);for(let g=0;g<e;g++)o[g]=Lv(t[g]);let l=g=>{let _=0;for(let m of g.dirs)_+=l(m);for(let m of g.files)_+=o[m];return g.w=_*1.07+.8,g.w},c=l(r),h=Math.max(2.6,.27*Math.sqrt(c)),u=new Float32Array(e*4),d=(g,_,m,f,M)=>{g.rect=[_,m,f,M];let x=Math.min(f,M),w=g.depth===0?Math.min(.45,.05*x):Math.min(.2,.075*x),P=_+w,A=m+w,E=Math.max(.001,f-2*w),F=Math.max(.001,M-2*w),y=[];for(let D of g.dirs)y.push({v:D.w,dir:D});for(let D of g.files)y.push({v:o[D],file:D});y.sort((D,V)=>V.v-D.v);let T=Pv(y.map(D=>D.v),P,A,E,F);y.forEach((D,V)=>{let[Q,I,N,G]=T[V];if(D.dir){d(D.dir,Q,I,N,G);return}let Y=Math.min(.13,.17*Math.min(N,G)),q=D.file*4;u[q]=Q+N/2,u[q+1]=I+G/2,u[q+2]=Math.max(.02,N-2*Y),u[q+3]=Math.max(.02,G-2*Y)})};d(r,-h/2,-h/2,h,h);let p=0;for(let g of i)p=Math.max(p,g.depth);return{L:h,dirs:i,fileDir:a,fileRect:u,maxDepth:p}}function va(n){return n<=0?0:Math.min(12,.16+.085*Math.sqrt(n))}function Bd(n){let t=new Map;for(let c of n)t.has(c.org)||t.set(c.org,[]),t.get(c.org).push(c);let e=[],i={name:"elsewhere",items:[]};for(let[c,h]of t){let u=h.reduce((d,p)=>d+p.weight,0);h.length>=2||u>=100?e.push({name:c,items:h,w:u}):i.items.push(...h)}e.sort((c,h)=>h.w-c.w),i.items.length&&e.push({...i,w:i.items.reduce((c,h)=>c+h.weight,0)});let s=e.map(c=>Math.max(.42,c.items.reduce((h,u)=>h+u.R,0))),r=s.reduce((c,h)=>c+h,0),a=-Math.PI/2-s[0]/r*Math.PI,o=[],l=new Map;for(let c=0;c<e.length;c++){let h=e[c],u=s[c]/r*Math.PI*2;h.a0=a,h.a1=a+u,h.mid=a+u/2,a+=u,h.items.sort((p,g)=>g.weight-p.weight||g.R-p.R);let d=0;for(let p of h.items){let g=!1;for(let _=11+p.R;!g&&_<2e3;_+=.5){let m=Math.min(u/2-.01,Math.asin(Math.min(1,p.R/_))*.55),f=h.a0+m,M=h.a1-m;if(M<f)continue;let x=Math.max(2,Math.ceil((M-f)*_/1.2)),w=[];for(let P=0;P<=x;P++)w.push(f+(M-f)*P/x);w.sort((P,A)=>Math.abs(P-h.mid)-Math.abs(A-h.mid));for(let P of w){let A=Math.cos(P)*_,E=Math.sin(P)*_,F=!0;for(let y of o){let T=y.x-A,D=y.z-E,V=y.R+p.R+2.2;if(T*T+D*D<V*V){F=!1;break}}if(F){o.push({x:A,z:E,R:p.R}),l.set(p.key,{x:A,z:E}),d=Math.max(d,_+p.R),g=!0;break}}}}h.outer=d}return{pos:l,sectors:e}}var zd=`
attribute float aGlow;
varying vec3 vN;
varying vec3 vW;
varying vec3 vCol;
varying float vGlow;
varying vec3 vLocal;
varying vec3 vScale;
void main() {
  mat4 im = instanceMatrix;
  vec4 w = modelMatrix * im * vec4(position, 1.0);
  vW = w.xyz;
  vN = normalize(mat3(modelMatrix) * (mat3(im) * normal));
  #ifdef USE_INSTANCING_COLOR
    vCol = instanceColor;
  #else
    vCol = vec3(1.0);
  #endif
  vGlow = aGlow;
  vLocal = position;
  vScale = vec3(length(im[0].xyz), length(im[1].xyz), length(im[2].xyz));
  gl_Position = projectionMatrix * viewMatrix * w;
}`,Hd=`
uniform vec3 uSky;
uniform vec3 uGround;
uniform vec3 uKeyDir;
uniform vec3 uKeyCol;
uniform float uSat;
uniform float uBright;
uniform vec3 uFog;
uniform float uFogDen;
uniform float uEdge;
uniform vec3 uEdgeTint;
uniform float uAO;
uniform float uRim;
uniform vec3 uRimCol;
varying vec3 vN;
varying vec3 vW;
varying vec3 vCol;
varying float vGlow;
varying vec3 vLocal;
varying vec3 vScale;
float mid3(vec3 v) { return v.x + v.y + v.z - min(v.x, min(v.y, v.z)) - max(v.x, max(v.y, v.z)); }
void main() {
  vec3 n = normalize(vN);
  vec3 base = vCol;
  float l = dot(base, vec3(0.2126, 0.7152, 0.0722));
  base = mix(vec3(l), base, uSat) * uBright;
  vec3 amb = mix(uGround, uSky, 0.5 + 0.5 * n.y);
  float dif = max(dot(n, uKeyDir), 0.0);
  vec3 col = base * (amb + uKeyCol * dif);
  float hw = vLocal.y * vScale.y;
  col *= mix(1.0 - uAO, 1.0, smoothstep(0.0, 0.8, hw));
  vec3 dd = vec3((0.5 - abs(vLocal.x)) * vScale.x, min(vLocal.y, 1.0 - vLocal.y) * vScale.y, (0.5 - abs(vLocal.z)) * vScale.z);
  float e = mid3(dd);
  float fw = max(fwidth(e), 1e-5);
  float dist = length(vW - cameraPosition);
  float line = (1.0 - smoothstep(fw * 0.5, fw * 1.5, e)) * (1.0 - smoothstep(90.0, 340.0, dist));
  col = mix(col, col * 1.4 + uEdgeTint, line * uEdge);
  col += uRimCol * uRim * line;
  col += (vCol * 1.3 + vec3(0.55)) * vGlow * 2.4;
  float f = 1.0 - exp(-pow(uFogDen * dist, 2.0));
  col = mix(col, uFog, f);
  gl_FragColor = vec4(col, 1.0);
}`,kd=`
attribute vec3 aCenter;
attribute float aU;
uniform float uWidth;
uniform float uPx;
uniform float uPxK;
varying float vU;
varying vec3 vW;
void main() {
  // never thinner than uPx screen pixels, so connections stay legible from far away
  float d = length(cameraPosition - aCenter);
  float bw = max(uWidth, d * uPxK * uPx * 0.5);
  vec3 p = aCenter + (position - aCenter) * bw;
  vU = aU;
  vec4 w = modelMatrix * vec4(p, 1.0);
  vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,Vd=`
uniform vec3 uColor;
uniform float uAlpha;
uniform float uTime;
uniform float uFlow;
uniform float uGrow;
uniform float uFogDen;
varying float vU;
varying vec3 vW;
void main() {
  if (vU > uGrow) discard;
  float flow = 0.5 + 0.5 * sin((vU * 9.0 - uTime * 0.9) * 6.2831853);
  flow = pow(flow, 3.0);
  float ends = smoothstep(0.0, 0.16, vU);
  float tip = 1.0 - smoothstep(uGrow - 0.02, uGrow, vU) * step(uGrow, 0.999);
  float a = uAlpha * ends * (0.75 + uFlow * flow * 0.7) * tip;
  float dist = length(vW - cameraPosition);
  a *= exp(-pow(uFogDen * dist * 0.7, 2.0));
  a *= 0.6 + 0.4 * smoothstep(0.0, 0.35, vU);
  gl_FragColor = vec4(uColor, a);
}`,ya=`
attribute float aSize;
attribute float aAlpha;
attribute vec3 aColor;
uniform float uScale;
varying float vA;
varying vec3 vC;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = clamp(aSize * uScale / max(0.1, -mv.z), 0.0, 220.0);
  vA = aAlpha;
  vC = aColor;
  gl_Position = projectionMatrix * mv;
}`,Ma=`
varying float vA;
varying vec3 vC;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float r2 = dot(c, c) * 4.0;
  float a = (exp(-r2 * 5.0) + 0.35 * exp(-r2 * 40.0)) * vA;
  if (a < 0.004) discard;
  gl_FragColor = vec4(vC, a);
}`,Gd=`
attribute float aSize;
attribute float aPhase;
uniform float uTime;
uniform float uNight;
varying float vA;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize;
  vA = (0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * (0.6 + aPhase) + aPhase * 40.0))) * (0.55 + 0.45 * uNight);
  gl_Position = projectionMatrix * mv;
}`,Wd=`
varying float vA;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float a = smoothstep(0.5, 0.0, length(c)) * vA;
  gl_FragColor = vec4(vec3(0.75, 0.82, 1.0), a);
}`,Xd=`
varying vec3 vW;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,qd=`
uniform vec3 uCol;
uniform float uFade;
varying vec3 vW;
void main() {
  float r = length(vW.xz);
  float a = atan(vW.z, vW.x);
  float ring = abs(fract(r / 20.0 - 0.5) - 0.5) * 20.0;
  float lr = 1.0 - smoothstep(0.0, fwidth(r) * 1.4, ring);
  float seg = 3.14159265 / 12.0;
  float ang = abs(fract(a / seg - 0.5) - 0.5) * seg * r;
  float la = (1.0 - smoothstep(0.0, fwidth(ang) * 1.4 + 1e-4, ang)) * smoothstep(14.0, 34.0, r);
  float fade = 1.0 - smoothstep(uFade * 0.45, uFade, r);
  float alpha = max(lr * 0.16, la * 0.07) * fade;
  if (alpha < 0.003) discard;
  gl_FragColor = vec4(uCol, alpha);
}`,Yd=`
varying vec3 vDir;
void main() {
  vDir = normalize(position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,$d=`
uniform vec3 uTop;
uniform vec3 uHorizon;
uniform vec3 uBottom;
varying vec3 vDir;
void main() {
  float y = vDir.y;
  vec3 c = y > 0.0 ? mix(uHorizon, uTop, pow(smoothstep(0.0, 0.85, y), 0.7)) : mix(uHorizon, uBottom, smoothstep(0.0, 0.35, -y));
  gl_FragColor = vec4(c, 1.0);
}`;var Zd=[{id:"claude",label:"Claude",color:"#d97757",author:["^claude\\[bot\\] <","\\+claude\\[bot\\]@users\\.noreply\\.github\\.com>","<noreply@anthropic\\.com>"],coauthor:["claude\\[bot\\]","<noreply@anthropic\\.com>","^claude\\b[^<]*<[^>]*@anthropic\\.com>"],message:["generated with \\[?claude code"],login:["^claude\\[bot\\]$"],branch:["^claude/"]},{id:"copilot",label:"Copilot",color:"#a78bfa",author:["^copilot-swe-agent\\[bot\\] <","^copilot <","\\+copilot(-swe-agent\\[bot\\])?@users\\.noreply\\.github\\.com>"],coauthor:["^copilot\\b","copilot-swe-agent\\[bot\\]","\\+copilot@users\\.noreply\\.github\\.com>","<copilot@github\\.com>"],login:["^copilot$","^copilot-swe-agent\\[bot\\]$"],branch:["^copilot/"]},{id:"cursor",label:"Cursor",color:"#e2e8f0",author:["<cursoragent@cursor\\.com>","^cursor\\[bot\\] <","\\+cursor\\[bot\\]@users\\.noreply\\.github\\.com>"],coauthor:["<cursoragent@cursor\\.com>","cursor\\[bot\\]"],login:["^cursor\\[bot\\]$","^cursoragent$"],branch:["^cursor/"]},{id:"codex",label:"Codex",color:"#10a37f",author:["chatgpt-codex-connector\\[bot\\]","<codex@openai\\.com>"],coauthor:["chatgpt-codex-connector\\[bot\\]","<codex@openai\\.com>","^(openai )?codex\\b[^<]*<[^>]*@openai\\.com>"],login:["^chatgpt-codex-connector\\[bot\\]$"],branch:["^codex/"]},{id:"devin",label:"Devin",color:"#2dd4bf",author:["devin-ai-integration\\[bot\\]"],coauthor:["devin-ai-integration\\[bot\\]"],message:["app\\.devin\\.ai/sessions/"],login:["^devin-ai-integration\\[bot\\]$"],branch:["^devin/"]},{id:"jules",label:"Jules",color:"#e879f9",author:["google-labs-jules\\[bot\\]"],coauthor:["google-labs-jules\\[bot\\]"],message:["jules\\.google\\.com/task/"],login:["^google-labs-jules\\[bot\\]$"]},{id:"gemini",label:"Gemini",color:"#4f8ef7",author:["gemini-code-assist\\[bot\\]","gemini-cli\\[bot\\]","^gemini-cli <"],coauthor:["gemini-code-assist\\[bot\\]","gemini-cli","^gemini\\b[^<]*<[^>]*@google\\.com>"],message:["generated with \\[?gemini cli"],login:["^gemini-code-assist\\[bot\\]$","^gemini-cli(\\[bot\\])?$"]},{id:"aider",label:"Aider",color:"#a3e635",author:["\\(aider\\) <"],coauthor:["@aider\\.chat>"],message:["^aider: "]},{id:"amp",label:"Amp",color:"#f43f5e",author:["<amp@ampcode\\.com>"],coauthor:["<amp@ampcode\\.com>"],message:["(^|\\n)amp-thread(-id)?:","ampcode\\.com/threads/"]},{id:"openhands",label:"OpenHands",color:"#fde047",author:["<openhands@all-hands\\.dev>","openhands-ai\\[bot\\]","^openhands-agent <"],coauthor:["<openhands@all-hands\\.dev>","openhands-ai\\[bot\\]"],login:["^openhands-agent$","^openhands-ai\\[bot\\]$"],branch:["^openhands-fix-issue-"]},{id:"replit",label:"Replit Agent",color:"#f59e0b",message:["(^|\\n)replit-commit-author: (agent|assistant)\\b"]},{id:"lovable",label:"Lovable",color:"#f472b6",author:["gpt-engineer-app\\[bot\\]","lovable-dev\\[bot\\]"],coauthor:["gpt-engineer-app\\[bot\\]","lovable-dev\\[bot\\]"],login:["^(gpt-engineer-app|lovable-dev)\\[bot\\]$"]},{id:"v0",label:"v0",color:"#fecdd3",author:["^v0\\[bot\\] <","[+<]v0\\[bot\\]@"],coauthor:["^v0\\[bot\\] <","[+<]v0\\[bot\\]@"],login:["^v0\\[bot\\]$"]},{id:"junie",label:"Junie",color:"#4ade80",author:["jetbrains-junie\\[bot\\]","<junie@jetbrains\\.com>"],coauthor:["jetbrains-junie\\[bot\\]","<junie@jetbrains\\.com>"],login:["^jetbrains-junie\\[bot\\]$"]},{id:"sweep",label:"Sweep",color:"#7dd3fc",author:["sweep-ai\\[bot\\]"],coauthor:["sweep-ai\\[bot\\]"],login:["^sweep-ai\\[bot\\]$"],branch:["^sweep/"]},{id:"factory",label:"Factory",color:"#fed7aa",author:["factory-droid\\[bot\\]"],coauthor:["factory-droid\\[bot\\]"],login:["^factory-droid\\[bot\\]$"]},{id:"coderabbit",label:"CodeRabbit",color:"#ff7a1a",author:["coderabbitai\\[bot\\]"],coauthor:["coderabbitai\\[bot\\]"],login:["^coderabbitai\\[bot\\]$"],branch:["^coderabbitai/"]}];var ht=n=>document.getElementById(n),Pe=JSON.parse(ht("lapse-data").textContent),jc=Pe.epoch,Qc=Pe.tz||{offset:0,label:"UTC"},bi=Pe.user&&Pe.user.login||"you",Si=!Pe.kind||Pe.kind==="user",jd=Si?"your ":"",Ye=Array.isArray(Pe.who)&&Pe.who.length?Pe.who:["human"],gf=Object.fromEntries(Zd.map(n=>[n.id,n])),_f=n=>!n||n==="human"?"#5fd3f3":n==="bot"?"#ffb454":gf[n]?.color||"#c58bff",xf=n=>!n||n==="human"?Si?bi:"people":n==="bot"?"bots":gf[n]?.label||n,ss=Ye.map(_f),th=Ye.map(xf),Ws=ss.map(n=>new at(n)),_e=Pe.t_end,eh=10*1440,Ca=15,nh=["#3987e5","#d95926","#199e70","#c98500","#d55181","#008300","#9085e9","#e66767","#7d7b75"],Qd=["#161d2b","#1c2537","#232e44","#2a3751","#31405e","#38496b","#3f5278"],es=[{k:"1h",v:60,label:"1 hr/s"},{k:"6h",v:360,label:"6 hr/s"},{k:"1d",v:1440,label:"1 day/s"},{k:"3d",v:4320,label:"3 days/s"},{k:"1w",v:10080,label:"1 wk/s"},{k:"2w",v:20160,label:"2 wk/s"}],Ic=[{max:3,key:"hot",label:"hot"},{max:14,key:"active",label:"active"},{max:45,key:"cooling",label:"cooling"},{max:90,key:"dormant",label:"dormant"},{max:1/0,key:"abandoned",label:"abandoned"}],pe=(n,t,e)=>Math.min(e,Math.max(t,n)),Nv=(n,t,e)=>{let i=pe((e-n)/(t-n),0,1);return i*i*(3-2*i)},vf=n=>n<.5?4*n*n*n:1-Math.pow(-2*n+2,3)/2,Ys=n=>1-Math.pow(1-n,3),Ee=n=>Math.round(n).toLocaleString("en-US"),ih=n=>n>=1e6?(n/1e6).toFixed(2)+"M":n>=1e4?(n/1e3).toFixed(1)+"K":Ee(n);function kr(n,t){let e=0,i=n.length;for(;e<i;){let s=e+i>>1;n[s]<=t?e=s+1:i=s}return e}function zc(n,t){let e=0,i=n.length;for(;e<i;){let s=e+i>>1;n[s]<t?e=s+1:i=s}return e}var Hc=new Intl.DateTimeFormat("en-GB",{timeZone:"UTC",weekday:"short",day:"numeric",month:"short",year:"numeric"}),tf=new Intl.DateTimeFormat("en-GB",{timeZone:"UTC",hour:"2-digit",minute:"2-digit",hour12:!1}),sh=new Intl.DateTimeFormat("en-GB",{timeZone:"UTC",day:"numeric",month:"short",year:"numeric"}),ef=new Intl.DateTimeFormat("en-GB",{timeZone:"UTC",month:"short"}),Ks=n=>new Date((jc+n*60+Qc.offset*60)*1e3),yf=n=>(n/1e3-Qc.offset*60-jc)/60,Xt=Pe.repos.map((n,t)=>{let e=n.p.length,i=new Float32Array(e);for(let o=0;o<e;o++){let l=n.e[o],c=0;for(let h=1;h<l.length;h+=2)l[h]>c&&(c=l[h]);i[o]=c}let[s,r]=n.n.split("/"),a=Od(n.p,i);return{ri:t,name:n.n,owner:s,short:r,fork:n.fork,fp:n.fp,paths:n.p,lang:n.l,ev:n.e,mine:n.m,nF:e,maxSize:i,lay:a}}),$e=0,fn=0;for(let n of Xt)n.f0=$e,$e+=n.nF,n.d0=fn,fn+=n.lay.dirs.length;var js=new Uint16Array($e),Fa=new Int32Array($e),Fv=new Uint8Array($e),rh=new Int32Array(fn),oh=new Uint16Array(fn);for(let n of Xt){for(let t=0;t<n.nF;t++)js[n.f0+t]=n.ri,Fa[n.f0+t]=n.d0+n.lay.fileDir[t],Fv[n.f0+t]=n.lang[t];for(let t of n.lay.dirs)rh[n.d0+t.id]=t.parent?n.d0+t.parent.id:-1,oh[n.d0+t.id]=n.ri}var Hn=0;for(let n of Xt)for(let t of n.ev)Hn+=t.length/2;var ah=new Float64Array(Hn),lh=new Int32Array(Hn),ch=new Float32Array(Hn);{let n=new Float64Array(Hn),t=new Int32Array(Hn),e=new Float32Array(Hn),i=0;for(let r of Xt)r.ev.forEach((a,o)=>{for(let l=0;l<a.length;l+=2)n[i]=a[l],t[i]=r.f0+o,e[i]=a[l+1],i++});Array.from({length:Hn},(r,a)=>a).sort((r,a)=>n[r]-n[a]||r-a).forEach((r,a)=>{ah[a]=n[r],lh[a]=t[r],ch[a]=e[r]})}var Un=[];for(let n of Xt)for(let t of n.mine)Un.push({t:t[0],r:n.ri,n:t[1],files:Int32Array.from(t[2],e=>e+n.f0),w:t[3]||0});Un.sort((n,t)=>n.t-t.t);var ns=Float64Array.from(Un,n=>n.t),kc=Un.length;for(let n of Xt){let t=n.mine.slice().sort((e,i)=>e[0]-i[0]);n.cT=Float64Array.from(t,e=>e[0]),n.cW=Uint8Array.from(t,e=>e[3]||0)}var Vc=Un.some(n=>n.w),Ov=Math.max(...Xt.map(n=>n.mine.length));for(let n of Xt){let t=new Set;for(let e of n.ev)for(let i=0;i<e.length;i+=2)t.add(e[i]);n.evTimes=Float64Array.from([...t].sort((e,i)=>e-i))}var Vr=Math.ceil(_e/1440)+1,Gr=new Uint16Array(Vr),Gc=new Uint16Array(Vr*Ye.length);for(let n of Un)if(n.t>=0){let t=Math.floor(n.t/1440);Gr[t]++,Gc[t*Ye.length+n.w]++}var{pos:Bv,sectors:zv}=Bd(Xt.map(n=>({key:n.ri,org:n.owner,R:n.lay.L*.7071+.8,weight:n.mine.length}))),ii=30;for(let n of Xt){let t=Bv.get(n.ri);n.x=t.x,n.z=t.z;let e=0;for(let i=0;i<n.nF;i++)e=Math.max(e,va(n.maxSize[i])+n.lay.dirs[n.lay.fileDir[i]].depth*Vs);n.maxH=e,n.portY=Math.max(4,Math.min(16,e+3.2)),ii=Math.max(ii,Math.hypot(n.x,n.z)+n.lay.L*.7)}var Qe=ht("stage"),ue=new yr({antialias:!1,powerPreference:"high-performance"}),Oa="high";ue.setPixelRatio(Math.min(window.devicePixelRatio||1,2));ue.setSize(Qe.clientWidth,Qe.clientHeight);ue.toneMapping=Rr;ue.toneMappingExposure=1.05;ue.outputColorSpace=ye;Qe.appendChild(ue.domElement);var Yr=new _a;Yr.setSize(Qe.clientWidth,Qe.clientHeight);Yr.domElement.className="labels";Qe.appendChild(Yr.domElement);var Ue=new Zo,le=new We(42,Qe.clientWidth/Qe.clientHeight,.3,6e3);{le.updateProjectionMatrix();let n=new C(0,.62,1.42).normalize(),t=new C(0,5,0),e=new C,i=[];for(let r of Xt){let a=r.lay.L/2;for(let[o,l]of[[-a,-a],[a,-a],[-a,a],[a,a]])i.push([r.x+o,0,r.z+l],[r.x+o,r.maxH,r.z+l])}let s=ii*1.2;for(;s<ii*5&&(le.position.copy(n).multiplyScalar(s).add(t),le.lookAt(t),le.updateMatrixWorld(),!i.every(([r,a,o])=>(e.set(r,a,o).project(le),Math.abs(e.x)<=.68&&e.y>=-.62&&e.y<=.9)));s*=1.04);}var ee=new ha(le,ue.domElement);ee.target.set(0,5,0);ee.enableDamping=!0;ee.dampingFactor=.07;ee.screenSpacePanning=!0;ee.minDistance=4;ee.maxDistance=ii*5;ee.maxPolarAngle=Math.PI*.495;ee.autoRotate=!0;ee.autoRotateSpeed=.55;var Pa={pos:le.position.clone(),target:ee.target.clone()},Wc=new ot;ue.getDrawingBufferSize(Wc);var Hv=new De(Wc.x,Wc.y,{type:on,samples:4}),$s=new pa(ue,Hv);$s.addPass(new ma(Ue,le));var Mf=new Hs(new ot(Qe.clientWidth,Qe.clientHeight),.6,.42,1);$s.addPass(Mf);$s.addPass(new ga);var qi={uSky:{value:new at(.32,.38,.52)},uGround:{value:new at(.06,.06,.08)},uKeyDir:{value:new C(.45,.8,.35).normalize()},uKeyCol:{value:new at(.85,.82,.78)},uFog:{value:new at(.02,.03,.06)},uFogDen:{value:.9/(ii*4.2)}},hh={value:0},bf={value:.001},wa=new ae(new Er(4e3,32,16),new re({side:Be,depthWrite:!1,vertexShader:Yd,fragmentShader:$d,uniforms:{uTop:{value:new at(.01,.018,.045)},uHorizon:{value:new at(.03,.045,.09)},uBottom:{value:new at(.004,.006,.012)}}}));Ue.add(wa);var Sf={value:.5};{let t=new Float32Array(7800),e=new Float32Array(2600),i=new Float32Array(2600);for(let r=0;r<2600;r++){let a=Math.random()*2-1,o=Math.random()*Math.PI*2,l=Math.abs(a)*.92+.04,c=Math.sqrt(1-l*l),h=2600+Math.random()*900;t[r*3]=Math.cos(o)*c*h,t[r*3+1]=l*h,t[r*3+2]=Math.sin(o)*c*h,e[r]=1+Math.pow(Math.random(),6)*3.2,i[r]=Math.random()}let s=new he;s.setAttribute("position",new te(t,3)),s.setAttribute("aSize",new te(e,1)),s.setAttribute("aPhase",new te(i,1)),Ue.add(new Bi(s,new re({transparent:!0,depthWrite:!1,blending:rn,uniforms:{uTime:hh,uNight:Sf},vertexShader:Gd,fragmentShader:Wd})))}var uh=new ae(new xr(ii*6,ii*6),new re({transparent:!0,depthWrite:!1,vertexShader:Xd,fragmentShader:qd,uniforms:{uCol:{value:new at(.25,.55,.8)},uFade:{value:ii*1.9}}}));uh.rotation.x=-Math.PI/2;uh.position.y=-xa-1.2;Ue.add(uh);var Mn=new Cn;Mn.position.set(0,Ca,0);Ue.add(Mn);var Mi=new Cn;Mn.add(Mi);var kv="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z";function nf(n,t,e,i,s){n.save(),n.translate(t-i/2,e-i/2),n.scale(i/16,i/16),n.fillStyle=s,n.fill(new Path2D(kv)),n.restore()}var Yi=4,Vv=[];{let n=new Ze({color:new at(1.1,1.1,1.1)}),t=new Ze({color:16777215});Vv.push(n,t);let e=new Image,i=l=>{let h=document.createElement("canvas");h.width=h.height=1024;let u=h.getContext("2d");u.fillStyle="#0b1220",u.fillRect(0,0,1024,1024),l?(u.imageSmoothingEnabled=e.naturalWidth>=256,u.imageSmoothingQuality="high",u.drawImage(e,0,0,1024,1024)):(u.fillStyle="#1d2b45",u.fillRect(0,0,1024,1024),u.fillStyle="#cfe0ff",u.font="600 520px system-ui, sans-serif",u.textAlign="center",u.textBaseline="middle",u.fillText(bi.slice(0,1).toUpperCase(),1024/2,1024/2+20));let d=1024*.73,p=1024*.73,g=1024*.125;u.beginPath(),u.arc(d,p,g+12,0,Math.PI*2),u.fillStyle="#0b1220",u.fill(),u.beginPath(),u.arc(d,p,g,0,Math.PI*2),u.fillStyle="#f4f6fa",u.fill(),nf(u,d,p,g*1.55,"#0b1220");let _=new br(h);_.colorSpace=ye,_.anisotropy=8,n.map=_,n.needsUpdate=!0;let m=document.createElement("canvas");m.width=m.height=512;let f=m.getContext("2d");f.fillStyle="#0d1424",f.fillRect(0,0,512,512),nf(f,256,236,250,"#e8eef8"),f.fillStyle="#9fb3cf",f.font="600 44px system-ui, sans-serif",f.textAlign="center",f.fillText(bi,256,430);let M=new br(m);M.colorSpace=ye,t.map=M,t.needsUpdate=!0};e.onload=()=>i(!0),e.onerror=()=>i(!1);let s=ht("avatar-src").getAttribute("src");s&&s.startsWith("data:")?e.src=s:i(!1);let r=new ae(new Sr(Yi,96),n);r.position.z=.14;let a=new ae(new Sr(Yi,96),t);a.position.z=-.14,a.rotation.y=Math.PI;let o=new ae(new jo(Yi,Yi,.28,96,1,!0),new Ze({color:new at(.05,.07,.11)}));o.rotation.x=Math.PI/2,Mi.add(r,a,o)}var Ef=new Ze({color:new at(.5,1.7,2.4)}),Gv=new ae(new wr(Yi+.08,.1,20,200),Ef);Mi.add(Gv);var wf=[];for(let[n,t,e]of[[5.6,.55,.22],[6.6,-.35,-.15],[7.7,1.2,.09]]){let i=new ae(new wr(n,.022,8,256),new Ze({color:new at(.35,.9,1.3),transparent:!0,opacity:.45,blending:rn,depthWrite:!1})),s=new Cn;s.rotation.x=Math.PI/2+t,s.add(i),Mn.add(s),wf.push({m:i,holder:s,spd:e})}var La=(()=>{let t=new Float32Array(1260),e=new Float32Array(420),i=new Float32Array(420),s=new Float32Array(420*3);for(let o=0;o<420;o++){let l=Math.random()*Math.PI*2,c=4.9+Math.random()*3.6,h=(Math.random()-.5)*1.6*Math.random();t[o*3]=Math.cos(l)*c,t[o*3+1]=h,t[o*3+2]=Math.sin(l)*c,e[o]=.1+Math.random()*.16,i[o]=.12+Math.random()*.35,s[o*3]=.6,s[o*3+1]=1.3,s[o*3+2]=1.9}let r=new he;r.setAttribute("position",new te(t,3)),r.setAttribute("aSize",new te(e,1)),r.setAttribute("aAlpha",new te(i,1)),r.setAttribute("aColor",new te(s,3));let a=new Bi(r,new re({transparent:!0,depthWrite:!1,blending:rn,uniforms:{uScale:{value:600}},vertexShader:ya,fragmentShader:Ma}));return Mn.add(a),a})(),Wv=(()=>{let n=new he;n.setAttribute("position",new te(new Float32Array([0,0,0]),3)),n.setAttribute("aSize",new te(new Float32Array([10]),1)),n.setAttribute("aAlpha",new te(new Float32Array([.1]),1)),n.setAttribute("aColor",new te(new Float32Array([.12,.42,.7]),3));let t=new Bi(n,new re({transparent:!0,depthWrite:!1,blending:rn,uniforms:{uScale:La.material.uniforms.uScale},vertexShader:ya,fragmentShader:Ma}));return t.renderOrder=-1,Mn.add(t),t})();{let n=document.createElement("div");n.className="me-label",n.textContent=bi;let t=new Gi(n);t.position.set(0,-Yi-1.4,0),Mn.add(t)}var dh=new Oi(1,1,1);dh.translate(0,.5,0);var Dc=n=>new re({vertexShader:zd,fragmentShader:Hd,uniforms:{...qi,uSat:{value:1},uBright:{value:1},uEdge:{value:.5},uEdgeTint:{value:new at(.015,.02,.03)},uAO:{value:.42},uRim:{value:0},uRimCol:{value:new at(.25,.95,1.5)},...n}}),Uc=n=>{let t=dh.clone(),e=new Ds(new Float32Array(Math.max(1,n)),1);return e.setUsage(_i),t.setAttribute("aGlow",e),t},Xs=new ie().compose(new C(0,-5e3,0),new an,new C(1e-5,1e-5,1e-5)),Nc=new at,Tf=[],Xv=[];for(let n of Xt){let t=new Cn;t.position.set(n.x,0,n.z),Ue.add(t),n.group=t;let e=n.lay.L,i=new Pn(new C(0,n.maxH/2,0),e*.75+n.maxH+2);n.matBase=Dc({uEdge:{value:.75},uAO:{value:0},uEdgeTint:{value:new at(.03,.05,.08)}}),n.base=new Us(Uc(1),n.matBase,1),n.base.setColorAt(0,Nc.set("#0e1522")),n.base.setMatrixAt(0,Xs),n.base.boundingSphere=i,n.base.userData={kind:"base",r:n},t.add(n.base);let s=n.lay.dirs.length-1;if(n.matPlat=Dc({uEdge:{value:.6},uAO:{value:.12},uEdgeTint:{value:new at(.04,.06,.09)}}),s>0){n.plat=new Us(Uc(s),n.matPlat,s);for(let E=0;E<s;E++){let F=n.lay.dirs[E+1];n.plat.setColorAt(E,Nc.set(Qd[Math.min(Qd.length-1,F.depth-1)])),n.plat.setMatrixAt(E,Xs)}n.plat.instanceMatrix.setUsage(_i),n.plat.boundingSphere=i,t.add(n.plat)}n.matBuild=Dc({}),n.build=new Us(Uc(n.nF),n.matBuild,n.nF);for(let E=0;E<n.nF;E++)n.build.setColorAt(E,Nc.set(nh[n.lang[E]])),n.build.setMatrixAt(E,Xs);n.build.instanceMatrix.setUsage(_i),n.build.boundingSphere=i,n.build.userData={kind:"build",r:n},t.add(n.build),Tf.push(n.build,n.base);let r=new C(0,Ca,0),a=new C(n.x,n.portY,n.z),o=Math.hypot(n.x,n.z),l=new C(n.x*.5,Math.max(Ca,n.portY)+3+o*.1,n.z*.5),c=new Fs(r,l,a),h=80,u=6,d=new ea(c,h,1,u,!1),p=d.attributes.position.count,g=new Float32Array(p*3),_=new Float32Array(p),m=new C;for(let E=0;E<=h;E++){c.getPointAt(E/h,m);for(let F=0;F<=u;F++){let y=E*(u+1)+F;g[y*3]=m.x,g[y*3+1]=m.y,g[y*3+2]=m.z,_[y]=E/h}}d.setAttribute("aCenter",new te(g,3)),d.setAttribute("aU",new te(_,1)),n.beamMat=new re({transparent:!0,depthWrite:!1,blending:rn,vertexShader:kd,fragmentShader:Vd,uniforms:{uColor:{value:new at(.3,.92,1.45)},uAlpha:{value:0},uTime:hh,uFlow:{value:0},uGrow:{value:0},uWidth:{value:.1},uPx:{value:1},uPxK:bf,uFogDen:qi.uFogDen}}),Xv.push(n.beamMat),n.beam=new ae(d,n.beamMat),n.beam.frustumCulled=!1,n.beam.visible=!1,Ue.add(n.beam),n.port=new ae(new Er(.32,20,14),new Ze({color:new at(.6,1.6,2.2)})),n.port.position.set(n.x,n.portY,n.z),n.port.visible=!1,Ue.add(n.port);let f=new he().setFromPoints([new C(n.x,n.portY,n.z),new C(n.x,0,n.z)]);n.tether=new Mr(f,new Ns({color:new at(.4,.9,1.3),transparent:!0,opacity:0,blending:rn,depthWrite:!1})),n.tether.visible=!1,Ue.add(n.tether);let M=c.getSpacedPoints(90);for(let E=1;E<=12;E++)M.push(new C(n.x,n.portY*(1-E/12)+.3*(E/12),n.z));n.path=new Float32Array(M.length*3),n.pathCum=new Float32Array(M.length),M.forEach((E,F)=>{n.path.set([E.x,E.y,E.z],F*3),F&&(n.pathCum[F]=n.pathCum[F-1]+E.distanceTo(M[F-1]))});let x=document.createElement("div");x.className="repo-label";let w=document.createElement("span");w.className="nm",w.textContent=n.short;let P=document.createElement("span");P.className="ow",P.textContent=n.owner;let A=document.createElement("span");A.className="ct",A.textContent="0",x.append(P,w,A),x.addEventListener("click",()=>Nn(n.ri)),n.labelEl=x,n.labelCt=A,n.label=new Gi(x),n.label.position.set(n.x,n.portY+1.4,n.z),Ue.add(n.label),Object.assign(n,{whoCum:new Uint32Array(Ye.length),cum:0,heat:0,act:0,last:-1/0,alive:0,lines:0,baseV:0,baseFrom:0,baseTo:0,baseT0:0,flash:0,beamGrow:0,beamBorn:!1,dirty:!1,platDirty:!1,glowDirty:!1,platGlowDirty:!1})}for(let n of zv){let t=document.createElement("div");t.className="sector-label",t.textContent=n.name;let e=new Gi(t),i=n.outer+6;e.position.set(Math.cos(n.mid)*i,-.5,Math.sin(n.mid)*i),Ue.add(e)}var Vn=new Float32Array($e),$i=new Float32Array($e),Zi=new Float32Array($e),fh=new Float64Array($e),ph=new Float32Array($e),Fr=new Uint8Array($e),Lr=[],Af=new Float64Array($e).fill(-1e9),Rf=new Float32Array($e),Xc=new Uint8Array($e),Ir=[],un=new Int32Array(fn),Ji=new Float32Array(fn),Ki=new Float32Array(fn),mh=new Float64Array(fn),gh=new Float32Array(fn),Or=new Uint8Array(fn),Dr=[],Cf=new Float64Array(fn).fill(-1e9),qc=new Uint8Array(fn),Ur=[],Jt=0;function qv(n){if(!Fr[n])return Zi[n];let t=pe((Jt-fh[n])/ph[n],0,1);return $i[n]+(Zi[n]-$i[n])*Ys(t)}function Pf(n,t,e){if(!(t===Zi[n]&&!Fr[n])){if(e<=0){$i[n]=Zi[n]=t,Lf(n,t);return}$i[n]=qv(n),Zi[n]=t,fh[n]=Jt,ph[n]=e,Fr[n]||(Fr[n]=1,Lr.push(n))}}var FM=new Float32Array(16);function Lf(n,t){let e=Xt[js[n]],i=n-e.f0,s=e.build.instanceMatrix.array,r=i*16;if(t<=.001){Xs.toArray(s,r),e.dirty=!0;return}let a=e.lay.fileRect,o=e.lay.dirs[e.lay.fileDir[i]],l=pe(t/.35,.35,1);s[r]=a[i*4+2]*l,s[r+1]=0,s[r+2]=0,s[r+3]=0,s[r+4]=0,s[r+5]=t,s[r+6]=0,s[r+7]=0,s[r+8]=0,s[r+9]=0,s[r+10]=a[i*4+3]*l,s[r+11]=0,s[r+12]=a[i*4],s[r+13]=o.depth*Vs,s[r+14]=a[i*4+1],s[r+15]=1,e.dirty=!0}function Yv(n){if(!Or[n])return Ki[n];let t=pe((Jt-mh[n])/gh[n],0,1);return Ji[n]+(Ki[n]-Ji[n])*Ys(t)}function If(n,t,e){if(!(t===Ki[n]&&!Or[n])){if(e<=0){Ji[n]=Ki[n]=t,Df(n,t);return}Ji[n]=Yv(n),Ki[n]=t,mh[n]=Jt,gh[n]=e,Or[n]||(Or[n]=1,Dr.push(n))}}function Df(n,t){let e=Xt[oh[n]],i=n-e.d0;if(i===0){$v(e,t);return}let s=e.plat.instanceMatrix.array,r=(i-1)*16;if(t<=.002){Xs.toArray(s,r),e.platDirty=!0;return}let a=e.lay.dirs[i],[o,l,c,h]=a.rect,u=.92+.08*t;s.fill(0,r,r+16),s[r]=c*u,s[r+5]=Vs*t,s[r+10]=h*u,s[r+12]=o+c/2,s[r+13]=(a.depth-1)*Vs,s[r+14]=l+h/2,s[r+15]=1,e.platDirty=!0}function $v(n,t){let e=n.base.instanceMatrix.array;if(t<=.002){Xs.toArray(e,0),n.base.instanceMatrix.needsUpdate=!0,n.baseV=0;return}let i=n.lay.L+.7;e.fill(0,0,16),e[0]=i*(.85+.15*t),e[5]=xa*t,e[10]=i*(.85+.15*t),e[13]=-xa*t,e[15]=1,n.base.instanceMatrix.needsUpdate=!0,n.baseV=t}function Zv(n,t){Af[n]=Jt,Rf[n]=t,Xc[n]||(Xc[n]=1,Ir.push(n))}function Jv(n){Cf[n]=Jt,qc[n]||(qc[n]=1,Ur.push(n))}var Kt=0,ei=0,bn=0,Ia=0,Da=0,is=new Uint32Array(Ye.length),He=!0,Wr=!1,ji=3,Qi=es[3].v,Yc=0,Xr=0,Nr=0,$c=-1,Br=null;function Uf(n){for(;Nr<n&&Nr<Vr;)Xr=Math.max(Xr,Gr[Nr]),Nr++}function Kv(n,t,e){if(t===e)return;let i=e?1:-1,s=Xt[js[n]];s.alive+=i,Ia+=i;for(let r=Fa[n];r>=0;r=rh[r]){let a=un[r];un[r]+=i,a>0!=un[r]>0&&If(r,un[r]>0?1:0,e?.6:.5)}}function jv(n,t){let e=lh[n],i=ch[n],s=Vn[e];Vn[e]=i;let r=Xt[js[e]];r.lines+=i-s,Da+=i-s,Kv(e,s>0,i>0),Pf(e,va(i),t?s>0&&i>0?.55:.75:.3)}function Qv(n,t){let e=Un[n],i=Xt[e.r];i.cum++,i.whoCum[e.w]++,is[e.w]++,i.heat+=Math.exp(-(Kt-e.t)/eh),i.last=e.t,i.beamBorn||(i.beamBorn=!0,t?(i.beamGrow=0,er(`connected \u2192 ${i.name}`,"new")):i.beamGrow=1),t&&Bf(i,e.files,1,Ws[e.w],e.w===0)}function Ba(n){if(n=pe(n,0,_e),n<Kt){Gn(n);return}let t=Math.exp(-(n-Yc)/eh);for(let i of Xt)i.heat*=t;Yc=n;let e=Kt;for(Kt=n;ei<Hn&&ah[ei]<=n;)jv(ei++,!0);for(;bn<kc&&ns[bn]<=n;)Qv(bn++,!0);Math.floor(e/1440)!==Math.floor(n/1440)&&ty(e,n)}function Gn(n,t=.35){n=pe(n,0,_e),Kt=n,Yc=n,Vn.fill(0),un.fill(0),Ia=0,Da=0;for(let e of Xt)e.alive=0,e.lines=0;for(ei=0;ei<Hn&&ah[ei]<=n;)Vn[lh[ei]]=ch[ei],ei++;for(let e=0;e<$e;e++){let i=Vn[e];if(i>0){let s=Xt[js[e]];s.alive++,s.lines+=i,Ia++,Da+=i;for(let r=Fa[e];r>=0;r=rh[r])un[r]++}Pf(e,va(i),t)}for(let e=0;e<fn;e++)If(e,un[e]>0?1:0,t);bn=kr(ns,n),is.fill(0);for(let e=0;e<bn;e++)is[Un[e].w]++;for(let e of Xt){let i=kr(e.cT,n);e.cum=i,e.heat=0,e.whoCum.fill(0);for(let s=0;s<i;s++)e.whoCum[e.cW[s]]++;for(let s=0;s<i;s++)e.heat+=Math.exp(-(n-e.cT[s])/eh);e.last=i?e.cT[i-1]:-1/0,e.beamBorn=i>0,e.beamGrow=i>0?1:0,e.quietAnnounced=i>0&&n-e.last>90*1440}Xr=0,Nr=0,Uf(Math.floor(n/1440)),$c=Math.floor(n/1440),vn.length=0}function ty(n,t){for(let e of Xt)e.cum>=5&&!e.quietAnnounced&&t-e.last>90*1440&&(e.quietAnnounced=!0,er(`went quiet (90 days) \u2192 ${e.name}`,"quiet")),t-e.last<=90*1440&&(e.quietAnnounced=!1)}var tn=!1,$r=320,ts=9,Qs=new he,Ta=new Float32Array($r*ts*3),Nf=new Float32Array($r*ts),Aa=new Float32Array($r*ts),Xi=new Float32Array($r*ts*3);Qs.setAttribute("position",new te(Ta,3).setUsage(_i));Qs.setAttribute("aSize",new te(Nf,1).setUsage(_i));Qs.setAttribute("aAlpha",new te(Aa,1).setUsage(_i));Qs.setAttribute("aColor",new te(Xi,3).setUsage(_i));var Ff={value:600},Of=new Bi(Qs,new re({transparent:!0,depthWrite:!1,blending:rn,uniforms:{uScale:Ff},vertexShader:ya,fragmentShader:Ma}));Of.frustumCulled=!1;Ue.add(Of);var vn=[];function Bf(n,t,e,i=Ws[0],s=!0,r=!1){for(let o=vn.length-1;o>=Math.max(0,vn.length-12);o--){let l=vn[o];if(l.r===n&&l.col===i&&Jt-l.t0<.08){l.files.push(t),l.n+=e;return}}if(vn.length>=$r){Hf({r:n,files:[t],n:e,col:i,human:s,live:r});return}let a=r?1.5:pe(1.25-Math.log10(Qi/60)*.32,.55,1.2);vn.push({r:n,files:[t],n:e,t0:Jt,dur:a,col:i,human:s,live:r}),yi=1}var ba=new C;function ey(n,t,e){let i=n.pathCum,s=i[i.length-1]*t,r=0,a=i.length-1;for(;r<a-1;){let h=r+a>>1;i[h]<=s?r=h:a=h}let o=i[a]-i[r]||1,l=pe((s-i[r])/o,0,1),c=n.path;return e.set(c[r*3]+(c[a*3]-c[r*3])*l,c[r*3+1]+(c[a*3+1]-c[r*3+1])*l,c[r*3+2]+(c[a*3+2]-c[r*3+2])*l),e}function ny(){let n=0;for(let t=0;t<vn.length;t++){let e=vn[t];if((Jt-e.t0)/e.dur>=1){Hf(e);continue}vn[n++]=e}vn.length=n,Aa.fill(0);for(let t=0;t<vn.length;t++){let e=vn[t],i=vf(pe((Jt-e.t0)/e.dur,0,1)),s=Math.min(1.8,1+Math.log2(e.n)*.25)*(e.live?1.5:1),r=tn||e.live?e.col:null,a=tn&&e.human&&!e.live?.5:1;for(let o=0;o<ts;o++){let l=i-o*.016,c=t*ts+o;if(l<0){Aa[c]=0;continue}ey(e.r,l,ba),Ta[c*3]=ba.x,Ta[c*3+1]=ba.y,Ta[c*3+2]=ba.z;let h=1-o/ts;if(Nf[c]=(o===0?1.15:.75*h)*s,Aa[c]=(o===0?1:.55*h*h)*a,r){let u=o===0?3.4:2.6,d=o===0?.5:0;Xi[c*3]=r.r*u+d,Xi[c*3+1]=r.g*u+d,Xi[c*3+2]=r.b*u+d}else Xi[c*3]=1.4+1.2*(o===0),Xi[c*3+1]=2.2+.8*(o===0),Xi[c*3+2]=2.8}}for(let t of["position","aSize","aAlpha","aColor"])Qs.attributes[t].needsUpdate=!0}var Ua=[],zf=new ta(.94,1,96);zf.rotateX(-Math.PI/2);for(let n=0;n<40;n++){let t=new ae(zf,new Ze({color:new at(.5,1.4,2),transparent:!0,opacity:0,blending:rn,depthWrite:!1}));t.visible=!1,Ue.add(t),Ua.push({m:t,t0:-1e9,r:null})}var iy=0,sy=new at(.5,1.4,2);function Hf(n){let t=n.r;for(let i of n.files)for(let s=0;s<i.length;s++){let r=i[s];Vn[r]>0&&(Zv(r,1),Jv(Fa[r]))}t.flash=Math.min(1.6,t.flash+.6+.1*n.n);let e=Ua[iy++%Ua.length];e.t0=Jt,e.r=t,e.m.visible=!0,(tn||n.live)&&n.col?e.m.material.color.copy(n.col).multiplyScalar(2.2):e.m.material.color.copy(sy),e.m.position.set(t.x,.06,t.z),t.labelEl.classList.remove("bump"),t.labelEl.offsetWidth,t.labelEl.classList.add("bump")}function ry(){for(let n of Ua){if(!n.m.visible)continue;let t=(Jt-n.t0)/.95;if(t>=1){n.m.visible=!1;continue}let e=n.r.lay.L*.72+1;n.m.scale.setScalar(e*(.25+.85*Ys(t))),n.m.material.opacity=.85*(1-t)*(1-t)}}var je=-1,dn=-1,yi=0;function kf(){let n=0;for(let t=0;t<Lr.length;t++){let e=Lr[t],i=pe((Jt-fh[e])/ph[e],0,1);Lf(e,$i[e]+(Zi[e]-$i[e])*Ys(i)),i>=1?(Fr[e]=0,$i[e]=Zi[e]):Lr[n++]=e}Lr.length=n,n=0;for(let t=0;t<Dr.length;t++){let e=Dr[t],i=pe((Jt-mh[e])/gh[e],0,1);Df(e,Ji[e]+(Ki[e]-Ji[e])*Ys(i)),i>=1?(Or[e]=0,Ji[e]=Ki[e]):Dr[n++]=e}Dr.length=n,n=0;for(let t=0;t<Ir.length;t++){let e=Ir[t],i=Xt[js[e]],s=Rf[e]*Math.exp(-(Jt-Af[e])/.5);i.build.geometry.attributes.aGlow.array[e-i.f0]=s>.01?s:0,i.glowDirty=!0,s>.01?Ir[n++]=e:Xc[e]=0}Ir.length=n,n=0;for(let t=0;t<Ur.length;t++){let e=Ur[t],i=Xt[oh[e]],s=e-i.d0,r=.5*Math.exp(-(Jt-Cf[e])/.6);s>0&&(i.plat.geometry.attributes.aGlow.array[s-1]=r>.01?r:0,i.platGlowDirty=!0),r>.01?Ur[n++]=e:qc[e]=0}Ur.length=n;for(let t of Xt)t.dirty&&(t.build.instanceMatrix.needsUpdate=!0,t.dirty=!1),t.platDirty&&(t.plat.instanceMatrix.needsUpdate=!0,t.platDirty=!1),t.glowDirty&&(t.build.geometry.attributes.aGlow.needsUpdate=!0,t.glowDirty=!1),t.platGlowDirty&&(t.plat.geometry.attributes.aGlow.needsUpdate=!0,t.platGlowDirty=!1)}function za(n){if(!n.cum)return{key:"none",label:"not yet",days:1/0};let t=(Kt-n.last)/1440;for(let e of Ic)if(t<=e.max)return{...e,days:t};return{...Ic[Ic.length-1],days:t}}var Fc=new at,Pr=new at;function oy(n,t){if(t.copy(Ws[0]),!n.cum)return t;let e=0;Pr.setRGB(0,0,0);for(let i=1;i<Ye.length;i++){let s=n.whoCum[i];s&&(e+=s,Pr.r+=Ws[i].r*s,Pr.g+=Ws[i].g*s,Pr.b+=Ws[i].b*s)}return e&&t.lerp(Pr.multiplyScalar(1/e),Math.sqrt(e/n.cum)),t}var ay=new at(.3,.92,1.45);function ly(n){for(let t of Xt){let e=1-Math.exp(-t.heat/1.4);t.act+=(e-t.act)*(1-Math.exp(-n*6));let i=t.act,s=je>=0&&je!==t.ri?.32:1,r=t.cum>0,a=r?.3+.7*pe(i*1.6,0,1):.22,o=(r?.62+.38*pe(i*1.4,0,1):.5)*s;for(let l of[t.matBuild,t.matPlat,t.matBase])l.uniforms.uSat.value=a,l.uniforms.uBright.value=o;if(t.flash*=Math.exp(-n*2.6),t.matBase.uniforms.uRim.value=(r?.08+.55*i:0)*s+t.flash*.9,t.beamBorn){t.beamGrow<1&&(t.beamGrow=Math.min(1,t.beamGrow+n/1.1));let l=Math.log1p(t.cum)/Math.log1p(Ov),h=(Kt-t.last)/1440>90?.035:.07;t.beam.visible=!0,t.beamMat.uniforms.uGrow.value=Ys(t.beamGrow),t.beamMat.uniforms.uWidth.value=(.03+.15*l)*(.3+.7*i)+t.flash*.03,t.beamMat.uniforms.uAlpha.value=(h+.72*i+t.flash*.25)*s,t.beamMat.uniforms.uFlow.value=i,t.beamMat.uniforms.uPx.value=(.9+3.4*i*(.4+.6*l)+t.flash*1.5)*(s<1?.7:1),t.port.visible=t.beamGrow>=1,t.port.scale.setScalar(.55+.6*i+t.flash*.5),tn?(oy(t,Fc),t.beamMat.uniforms.uColor.value.copy(Fc).multiplyScalar(1.7),t.port.material.color.copy(Fc).multiplyScalar(.7+1.6*i)):t.port.material.color.setRGB(.25+.5*i,.5+1.3*i,.7+1.7*i),t.tether.visible=!0,t.tether.material.opacity=(.05+.4*i)*s}else t.beam.visible=!1,t.port.visible=!1,t.tether.visible=!1}}var si=!0,qe=new C;function cy(){let n=[];for(let r of Xt){if(!(si&&r.baseV>.05&&(r.cum>0||r.ri===je||r.ri===dn))){r.label.visible=!1;continue}let o=(r.ri===je?1e3:0)+(r.ri===dn?500:0)+r.act*4+Math.log1p(r.cum);n.push([o,r])}n.sort((r,a)=>a[0]-r[0]);let t=Qe.clientWidth,e=Qe.clientHeight,i=[];{qe.copy(Mn.position).project(le);let r=(qe.x*.5+.5)*t,a=(-qe.y*.5+.5)*e;qe.copy(Mn.position).y+=Yi,qe.project(le);let o=Math.abs((-qe.y*.5+.5)*e-a)*1.1;qe.z<1&&i.push([r-o,a-o,r+o,a+o])}let s=i.length;for(let[,r]of n){qe.copy(r.label.position).project(le);let a=(qe.x*.5+.5)*t,o=(-qe.y*.5+.5)*e,l=(r.short.length+r.owner.length)*6.3+44,h=[a-l/2,o-22,a+l/2,o],u=r.ri===je||r.ri===dn,d=qe.z<1&&i.length-s<16;if(d&&!u){for(let _ of i)if(h[0]<_[2]&&h[2]>_[0]&&h[1]<_[3]&&h[3]>_[1]){d=!1;break}}if(r.label.visible=d||u,!r.label.visible)continue;i.push(h);let p=String(r.cum);r.labelCt.textContent!==p&&(r.labelCt.textContent=p);let g=je>=0&&je!==r.ri&&dn!==r.ri?.35:.55+.45*pe(r.act*1.5,0,1);r.labelEl.style.opacity=g.toFixed(2),r.labelEl.dataset.status=za(r).key}}var hy=new at(.44,.46,.52),uy=new at(.25,.27,.34),dy=new at(.1,.09,.08),fy=new at(.035,.045,.07),py=new at(1,.97,.93),my=new at(.58,.6,.7),gy=new at(.018,.035,.085),_y=new at(.003,.006,.016),xy=new at(.06,.085,.15),vy=new at(.014,.02,.042),yy=.5;function My(){let n=(Kt%1440+1440)%1440/60,t=Math.cos((n-13)/24*Math.PI*2),e=Nv(.25,-.35,t),i=pe(1-Math.log(Math.max(60,Qi)/60)/Math.log(30),0,1),s=.62+(e-.62)*i;yy=s,Sf.value=s,qi.uSky.value.lerpColors(hy,uy,s),qi.uGround.value.lerpColors(dy,fy,s),qi.uKeyCol.value.lerpColors(py,my,s),wa.material.uniforms.uTop.value.lerpColors(gy,_y,s),wa.material.uniforms.uHorizon.value.lerpColors(xy,vy,s),qi.uFog.value.copy(wa.material.uniforms.uHorizon.value);let r=n/24*Math.PI*2*i+.9;qi.uKeyDir.value.set(Math.cos(r)*.55,.78-.25*s,Math.sin(r)*.55).normalize()}var Et={date:ht("clock-date"),time:ht("clock-time"),phase:ht("clock-phase"),speed:ht("speed-label"),total:ht("c-total"),today:ht("c-today"),hour:ht("c-hour"),active:ht("c-active"),conn:ht("c-conn"),files:ht("c-files"),lines:ht("c-lines"),ticker:ht("ticker"),tl:ht("timeline"),board:ht("board"),focus:ht("focus"),tip:ht("tip"),toasts:ht("toasts"),play:ht("btn-play"),orbit:ht("btn-orbit"),labels:ht("btn-labels"),loading:ht("loading")};{document.title=Pe.title||`${bi} \xB7 commit city`,ht("kicker-title").textContent=`${bi} \xB7 commit city`,ht("clock-tz").textContent=Qc.label;let n=Pe.totals||{},t=[];n.contributions!=null&&t.push(`GitHub shows ${Ee(n.contributions)} contributions since ${n.window_start}; it also counts PRs, issues, reviews and private activity. Buildings show default-branch commits.`);let e=Array.isArray(n.too_big)?n.too_big:[],i=e.length?`Not drawn, too big for the hosted builder: ${e.map(o=>`${o.repo} (${Ee(o.commits)} commits)`).join(", ")}.`:"",s=(n.omitted_repos||0)-e.length,r=(n.omitted_commits||0)-e.reduce((o,l)=>o+l.commits,0);if(s>0&&t.push(`${s} ${e.length?"more ":""}${s===1?"repo":"repos"} (${Ee(r)} commits) not drawn: the very largest are skipped, and only the busiest are shown.`),!Si)for(let[o,l]of[["#f-commits + label","commits"],[".side-head span","repos \xB7 commits so far"],[".tick-labels span:nth-child(2)","commits per hour"]]){let c=document.querySelector(o);c&&(c.textContent=l)}let a=ht("contrib-note");a.replaceChildren(...i?[Object.assign(document.createElement("b"),{textContent:i})]:[],t.join(" ")),a.hidden=!i&&!t.length}var Vf=[];es.forEach((n,t)=>{let e=document.createElement("button");e.className="seg",e.textContent=n.k,e.title=n.label,e.addEventListener("click",()=>zr(t)),ht("speeds").appendChild(e),Vf.push(e)});function zr(n){ji=pe(n,0,es.length-1),Vf.forEach((t,e)=>t.classList.toggle("on",e===ji)),Et.speed.textContent=es[ji].label}function tr(n){He=n,n&&Kt>=_e-1&&Gn(0,.3),Et.play.textContent=He?"\u275A\u275A":"\u25B6",Et.play.setAttribute("aria-label",He?"Pause":"Play")}{let n=ht("legend");Pe.langs.forEach((t,e)=>{let i=document.createElement("span");i.className="chip";let s=document.createElement("i");s.style.background=nh[e],i.append(s,document.createTextNode(t)),n.appendChild(i)})}var by=Xt.map(n=>{let t=document.createElement("button");t.className="row";let e=document.createElement("i");e.className="dot";let i=document.createElement("span");i.className="rn";let s=document.createElement("small");s.textContent=n.owner+"/",i.append(s,document.createTextNode(n.short));let r=document.createElement("span");r.className="rc";let a=document.createElement("span");a.className="bar";let o=document.createElement("span");return a.appendChild(o),t.append(e,i,r,a),t.addEventListener("click",()=>Nn(n.ri===je?-1:n.ri)),t.addEventListener("mouseenter",()=>{dn=n.ri}),t.addEventListener("mouseleave",()=>{dn===n.ri&&(dn=-1)}),Et.board.appendChild(t),{b:t,dot:e,n:r,fill:o,r:n}});function Gf(){let n=[...by].sort((e,i)=>i.r.cum-e.r.cum||i.r.act-e.r.act),t=Math.max(1,n[0].r.cum);n.forEach((e,i)=>{let s=e.r,r=i<16&&s.cum>0;if(e.b.hidden=!r,!r)return;e.b.style.order=i,e.n.textContent=Ee(s.cum),e.fill.style.width=(100*s.cum/t).toFixed(1)+"%",e.fill.style.background=tn?Sy(s.whoCum,s.cum):"";let a=za(s);e.dot.dataset.status=a.key,e.b.classList.toggle("sel",s.ri===je),e.b.title=`${s.name}: ${a.label}${isFinite(a.days)?` (${Math.floor(a.days)} days since the last commit)`:""}`})}function Sy(n,t){if(!t)return"";let e=[],i=0;for(let s=0;s<Ye.length;s++){if(!n[s])continue;let r=i+100*n[s]/t;e.push(`${ss[s]} ${i.toFixed(1)}% ${r.toFixed(1)}%`),i=r}return`linear-gradient(90deg, ${e.join(", ")})`}function _h(n){let t=n.reduce((i,s)=>i+s,0),e=[];for(let i=0;i<Ye.length;i++)(n[i]||i===0)&&e.push({w:i,n:n[i],p:t?n[i]/t:0});return e.sort((i,s)=>i.w===0?-1:s.w===0?1:s.n-i.n),{tot:t,rows:e}}function Wf(n,t){let e=t.filter(i=>i.n);n.children.length!==e.length&&n.replaceChildren(...e.map(()=>document.createElement("span"))),e.forEach((i,s)=>{let r=n.children[s];r.style.flexGrow=i.n,r.style.background=ss[i.w],r.title=`${th[i.w]}: ${(100*i.p).toFixed(1)}%`})}var Zs=n=>n>0&&n<.01?"<1%":`${Math.round(n*100)}%`;function Xf(){if(!tn)return;let{tot:n,rows:t}=_h(is);Wf(ht("who-split"),t);let e=n?1-is[0]/n:0;Ke(ht("who-pct"),n?`${Zs(e)} not ${Si?"you":"people"}`:"");let i=t.slice(0,6),s=ht("who-list");s.children.length!==i.length&&s.replaceChildren(...i.map(()=>{let r=document.createElement("li");return r.append(document.createElement("i"),Object.assign(document.createElement("span"),{className:"nm"}),Object.assign(document.createElement("span"),{className:"n"}),Object.assign(document.createElement("span"),{className:"p"})),r})),i.forEach((r,a)=>{let[o,l,c,h]=s.children[a].children;o.style.background=ss[r.w],Ke(l,th[r.w]),Ke(c,Ee(r.n)),Ke(h,Zs(r.p))})}function Ha(n,t){if(tn=n,document.body.classList.toggle("lens",n),ht("btn-lens").classList.toggle("on",n),ht("whobox").hidden=!n,kn=null,!n)for(let e of Xt)e.beamMat.uniforms.uColor.value.copy(ay);if(Xf(),Gf(),n&&!t){let e=new Uint32Array(Ye.length);for(let r of Un)e[r.w]++;let i=Ye.indexOf("bot"),s=e.reduce((r,a,o)=>r+(o&&o!==i?a:0),0);er(Vc?`agent lens: ${Zs(i>0?e[i]/kc:0)} bots \xB7 ${Zs(s/kc)} AI agents over the whole window`:"agent lens: no bot or agent signatures here, every commit reads as human","lens")}}function Ey(n){let t=new Float64Array(9);for(let e=0;e<n.nF;e++){let i=Vn[n.f0+e];i>0&&(t[n.lang[e]]+=i)}return t}function wy(n){let t=[];for(let i of n.lay.dirs)i.depth===1&&un[n.d0+i.id]>0&&t.push([i.name,un[n.d0+i.id]]);let e=0;for(let i=0;i<n.nF;i++)n.lay.fileDir[i]===0&&Vn[n.f0+i]>0&&e++;return e&&t.push(["(root files)",e]),t.sort((i,s)=>s[1]-i[1])}function Ty(n){let t=0,e=0;for(let i of n.lay.dirs)i.depth>0&&un[n.d0+i.id]>0&&(t++,e=Math.max(e,i.depth));return{dirs:t,depth:e}}var Je={name:ht("f-name"),owner:ht("f-owner"),status:ht("f-status"),commits:ht("f-commits"),files:ht("f-files"),dirs:ht("f-dirs"),depth:ht("f-depth"),lines:ht("f-lines"),last:ht("f-last"),mix:ht("f-mix"),tops:ht("f-tops"),share:ht("f-share"),fp:ht("f-fp")},qf=[];for(let n=0;n<10;n++){let t=document.createElement("div");t.className="dir-label";let e=new Gi(t);e.visible=!1,Ue.add(e),qf.push({o:e,e:t})}function Ay(){let n=je>=0?Xt[je]:null,t=[];if(n&&si)for(let e of n.lay.dirs)e.depth===1&&un[n.d0+e.id]>0&&t.push(e);t.sort((e,i)=>un[n.d0+i.id]-un[n.d0+e.id]),qf.forEach((e,i)=>{let s=t[i];if(!s){e.o.visible=!1;return}let[r,a,o,l]=s.rect;e.o.position.set(n.x+r+o/2,Vs+.2,n.z+a+l/2);let c=s.name+"/";e.e.textContent!==c&&(e.e.textContent=c),e.o.visible=!0})}function Zc(){if(Ay(),je<0){Et.focus.hidden=!0;return}let n=Xt[je];Et.focus.hidden=!1,Je.name.textContent=n.short,Je.owner.textContent=n.owner+(n.fork?" \xB7 fork":"");let t=za(n);Je.status.textContent=t.label,Je.status.dataset.status=t.key,Je.commits.textContent=Ee(n.cum),Je.share.textContent=bn?(100*n.cum/bn).toFixed(1)+(Si?"% of yours":"% of all"):"",Je.files.textContent=Ee(n.alive);let e=Ty(n);if(Je.dirs.textContent=Ee(e.dirs),Je.depth.textContent=e.depth,Je.lines.textContent=ih(n.lines),Je.fp.textContent=Ee(kr(n.evTimes,Kt)),Je.last.textContent=n.cum?`${sh.format(Ks(n.last))} \xB7 ${t.days<1?"today":Math.floor(t.days)+" d ago"}`:Si?"no commits from you yet":"no commits yet",ht("f-whobox").hidden=!Vc||!n.cum,Vc&&n.cum){let{rows:o}=_h(n.whoCum);Wf(ht("f-who"),o),Ke(ht("f-who-n"),`${Ee(n.cum)} commits`);let l=o.filter(u=>u.n).slice(0,4),c=l.map(u=>`${u.w}:${Zs(u.p)}`).join(","),h=ht("f-who-l");h.dataset.k!==c&&(h.dataset.k=c,h.replaceChildren(...l.map(u=>{let d=document.createElement("span"),p=document.createElement("i");return p.style.background=ss[u.w],d.append(p,`${th[u.w]} ${Zs(u.p)}`),d})))}let i=Ey(n),s=i.reduce((o,l)=>o+l,0)||1;Je.mix.replaceChildren(...[...i].map((o,l)=>{let c=document.createElement("span");return c.style.width=100*o/s+"%",c.style.background=nh[l],c.title=`${Pe.langs[l]}: ${(100*o/s).toFixed(1)}% of lines`,c}).filter(o=>parseFloat(o.style.width)>.15));let r=wy(n).slice(0,7),a=r.length?r[0][1]:1;Je.tops.replaceChildren(...r.map(([o,l])=>{let c=document.createElement("li"),h=document.createElement("span");h.className="dn",h.textContent=o==="(root files)"?o:o+"/";let u=document.createElement("span");u.className="dv",u.textContent=Ee(l);let d=document.createElement("i");return d.style.width=100*l/a+"%",c.append(h,u,d),c}))}var sf="";function Ry(){let n=Ks(Kt),t=Hc.format(n)+tf.format(n);if(t!==sf){sf=t,Et.date.textContent=Hc.format(n),Et.time.textContent=tf.format(n);let l=(Kt%1440+1440)%1440/60;Et.phase.textContent=l<5||l>=22?"late night":l<12?"morning":l<17?"afternoon":"evening"}let e=Math.floor(Kt/1440)*1440,i=Math.floor(Kt/60)*60,s=bn-zc(ns,e);Ke(Et.total,Ee(bn)),Ke(Et.today,Ee(s)),Ke(Et.hour,Ee(bn-zc(ns,i)));let r=0,a=0;for(let l of Xt)l.cum&&a++,l.cum&&Kt-l.last<=7*1440&&r++;Ke(Et.active,r),Ke(Et.conn,a),Ke(Et.files,Ee(Ia)),Ke(Et.lines,ih(Da));let o=Math.floor(Kt/1440);Uf(o),He&&s>Xr&&s>=15&&$c!==o&&($c=o,er(`record day: passed the old best of ${Xr} commits`,"record"))}function Ke(n,t){let e=String(t);n.textContent!==e&&(n.textContent=e)}function er(n,t,e){let i=document.createElement("div");i.className="toast "+(t||"");let s=document.createElement("small");for(s.textContent=e||sh.format(Ks(Kt)),i.append(s,document.createTextNode(n)),Et.toasts.prepend(i);Et.toasts.children.length>4;)Et.toasts.lastChild.remove();setTimeout(()=>i.classList.add("out"),3200),setTimeout(()=>i.remove(),3800)}var Wi=Et.ticker.getContext("2d");function Cy(){let n=Et.ticker.clientWidth,t=Et.ticker.clientHeight,e=Math.min(2,window.devicePixelRatio||1);if(!n||!t)return;Et.ticker.width!==Math.round(n*e)&&(Et.ticker.width=Math.round(n*e),Et.ticker.height=Math.round(t*e)),Wi.setTransform(e,0,0,e,0,0),Wi.clearRect(0,0,n,t);let i=Math.floor(Kt/60)*60,s=[],r=4;for(let o=47;o>=0;o--){let l=i-o*60,c=Math.min(l+60,Kt+1e-6),h=kr(ns,c)-zc(ns,l);s.push(h),r=Math.max(r,h)}let a=n/48;for(let o=0;o<48;o++){let l=s[o],c=l?Math.max(2,(t-4)*Math.sqrt(l/r)):1,h=(Math.floor((i-(47-o)*60)/60)%24+24)%24;Wi.fillStyle=o===47?"#9be7ff":l?"#4f9fdc":"rgba(150,170,200,0.18)";let u=o*a+.5,d=Math.max(1,a-1.5);c>3?Py(Wi,u,t-c,d,c,Math.min(2,d/2)):Wi.fillRect(u,t-c,d,c),h===0&&o>0&&(Wi.fillStyle="rgba(200,215,235,0.35)",Wi.fillRect(u-1,0,1,t))}}function Py(n,t,e,i,s,r){n.beginPath(),n.moveTo(t,e+s),n.lineTo(t,e+r),n.quadraticCurveTo(t,e,t+r,e),n.lineTo(t+i-r,e),n.quadraticCurveTo(t+i,e,t+i,e+r),n.lineTo(t+i,e+s),n.closePath(),n.fill()}var cn=Et.tl.getContext("2d"),kn=null,qs=-1,Dn=10;function Ly(){let n=Et.tl.clientWidth,t=Et.tl.clientHeight,e=Math.min(2,window.devicePixelRatio||1);Et.tl.width=Math.round(n*e),Et.tl.height=Math.round(t*e),kn=document.createElement("canvas"),kn.width=Et.tl.width,kn.height=Et.tl.height;let i=kn.getContext("2d");i.setTransform(e,0,0,e,0,0);let s=n-Dn*2,r=t-16,a=Math.max(...Gr);i.fillStyle="rgba(160,180,210,0.12)",i.fillRect(Dn,r,s,1);for(let d=0;d<Vr;d++){let p=Gr[d];if(!p)continue;let g=Dn+d*1440/_e*s,_=Math.max(1.5,(r-4)*Math.sqrt(p/a)),m=Math.max(1,s/Vr-.4);if(i.fillStyle="rgba(120,170,230,0.55)",i.fillRect(g,r-_,m,_),tn&&Gc[d*Ye.length]<p){let f=r-_;for(let M=1;M<Ye.length;M++){let x=Gc[d*Ye.length+M];if(!x)continue;let w=_*x/p;i.fillStyle=ss[M],i.fillRect(g,f,m,w),f+=w}}}i.font="10px system-ui, sans-serif",i.textBaseline="top";let o=Ks(0),l=!0,c=-1e9,h=Math.ceil(_e/1440/28)+2,u=Math.max(1,Math.ceil(h/18));for(let d=0;d<h;d++){let p=new Date(Date.UTC(o.getUTCFullYear(),o.getUTCMonth()+d,1)),g=yf(p.getTime());if((o.getUTCMonth()+d)%u||g<0||g>_e)continue;let _=Dn+g/_e*s,m=ef.format(p);if(_-c<(m==="Jan"||l?40:28))continue;c=_,i.fillStyle="rgba(160,180,210,0.28)",i.fillRect(_,r-2,1,6),i.fillStyle="rgba(190,205,225,0.75)";let f=ef.format(p);i.fillText(f==="Jan"||l?`${f} ${String(p.getUTCFullYear()).slice(2)}`:f,_+3,r+3),l=!1}}function Iy(){let n=Et.tl.clientWidth,t=Et.tl.clientHeight,e=Math.min(2,window.devicePixelRatio||1);if(!n||!t)return;(!kn||kn.width!==Math.round(n*e)||kn.height!==Math.round(t*e))&&Ly(),cn.setTransform(1,0,0,1,0,0),cn.clearRect(0,0,Et.tl.width,Et.tl.height),cn.drawImage(kn,0,0),cn.setTransform(e,0,0,e,0,0);let i=n-Dn*2,s=t-16,r=Dn+Kt/_e*i;if(cn.fillStyle="rgba(95,211,243,0.10)",cn.fillRect(Dn,0,r-Dn,s),cn.fillStyle="#9be7ff",cn.fillRect(r-1,0,2,s+4),cn.beginPath(),cn.arc(r,4,4,0,Math.PI*2),cn.fill(),qs>=0){let a=Dn+qs/_e*i;cn.fillStyle="rgba(255,255,255,0.35)",cn.fillRect(a,0,1,s)}}function Yf(n){let t=Et.tl.getBoundingClientRect();return pe((n-t.left-Dn)/(t.width-Dn*2)*_e,0,_e)}var $f=!1;Et.tl.addEventListener("pointerdown",n=>{Wr=!0,$f=He,He=!1;try{Et.tl.setPointerCapture(n.pointerId)}catch{}Br=Yf(n.clientX)});Et.tl.addEventListener("pointermove",n=>{qs=Yf(n.clientX);let t=Math.floor(qs/1440);Jc(n.clientX,n.clientY-14,[sh.format(Ks(t*1440+720)),`${Gr[t]||0} commits that day`],!0),Wr&&(Br=qs)});Et.tl.addEventListener("pointerup",()=>{Wr&&(Wr=!1,tr($f))});Et.tl.addEventListener("pointerleave",()=>{qs=-1,qr()});function Jc(n,t,e,i){let s=Et.tip;s.replaceChildren(...e.map((o,l)=>{let c=document.createElement(l===0?"b":"div");return c.textContent=o,c})),s.hidden=!1;let r=s.offsetWidth,a=s.offsetHeight;s.style.left=pe(n+14,8,window.innerWidth-r-8)+"px",s.style.top=pe(i?t-a-6:t+16,8,window.innerHeight-a-8)+"px"}function qr(){Et.tip.hidden=!0}var rf=new sa,of=new ot,Hr=null,af=0,Ra=null,ni=new Jo(new Qo(dh),new Ns({color:new at(1.6,1.9,2.2),transparent:!0,opacity:.9}));ni.visible=!1;Ue.add(ni);ue.domElement.addEventListener("pointermove",n=>{Hr=n});ue.domElement.addEventListener("pointerleave",()=>{Hr=null,qr(),ni.visible=!1,dn>=0&&(dn=-1)});ue.domElement.addEventListener("pointerdown",n=>{Ra=[n.clientX,n.clientY]});ue.domElement.addEventListener("pointerup",n=>{if(!Ra||Math.hypot(n.clientX-Ra[0],n.clientY-Ra[1])>5)return;let t=xh(n);t&&Nn(t.r.ri)});ue.domElement.addEventListener("dblclick",n=>{xh(n)||Nn(-1)});function xh(n){let t=ue.domElement.getBoundingClientRect();of.set((n.clientX-t.left)/t.width*2-1,-((n.clientY-t.top)/t.height)*2+1),le.updateMatrixWorld(),Ue.updateMatrixWorld(),rf.setFromCamera(of,le);let e=rf.intersectObjects(Tf,!1);for(let i of e){let{kind:s,r}=i.object.userData;if(s==="build"){let a=i.instanceId,o=r.f0+a;if(Vn[o]<=0)continue;return{kind:s,r,k:a,i:o}}if(s==="base"&&r.baseV>.05)return{kind:s,r}}return null}var lf=new ie;function Dy(){if(!Hr||Jt-af<.06)return;let n=Hr;if(Hr=null,af=Jt,n.buttons){qr();return}let t=xh(n);if(!t){qr(),ni.visible=!1,dn=-1,ue.domElement.style.cursor="";return}dn=t.r.ri,ue.domElement.style.cursor="pointer";let e=t.r;if(t.kind==="build"){let i=t.i,s=t.k,r=0,a=kr(ns,Kt);for(let o=0;o<a;o++)Un[o].r===e.ri&&Un[o].files.includes(i)&&r++;Jc(n.clientX,n.clientY,[e.paths[s],`${e.name}`,`${Ee(Vn[i])} lines \xB7 ${Pe.langs[e.lang[s]]}`,r?`touched by ${r} of ${jd}commits so far`:`not touched by ${jd}commits yet`]),e.build.getMatrixAt(s,lf),ni.matrix.copy(e.group.matrixWorld).multiply(lf),ni.matrixAutoUpdate=!1,ni.visible=!0}else{ni.visible=!1;let i=za(e);Jc(n.clientX,n.clientY,[e.name,`${Ee(e.cum)} ${Si?"of your ":""}commits \xB7 ${i.label}`,`${Ee(e.alive)} files \xB7 ${ih(e.lines)} lines`,"click to inspect"])}}var hn=null;function cf(n,t,e=1.2){hn={t0:Jt,dur:e,p0:le.position.clone(),p1:n.clone(),q0:ee.target.clone(),q1:t.clone()}}function Nn(n){if(je=n,document.body.classList.toggle("focused",n>=0),n<0){cf(Pa.pos,Pa.target),Zc();return}let t=Xt[n],e=new C(t.x,Math.min(3,t.maxH*.3),t.z),i=pe(t.lay.L*1.55+t.maxH*1.2,12,95),s=new C(t.x,0,t.z).normalize();isFinite(s.x)||s.set(0,0,1);let r=e.clone().addScaledVector(s,i*.82).add(new C(0,i*.62,0));ee.autoRotate=!1,nr(),cf(r,e),Zc()}function Uy(){if(!hn)return;let n=pe((Jt-hn.t0)/hn.dur,0,1),t=vf(n);le.position.lerpVectors(hn.p0,hn.p1,t),ee.target.lerpVectors(hn.q0,hn.q1,t),n>=1&&(hn=null)}ee.addEventListener("start",()=>{hn=null,ee.autoRotate&&(ee.autoRotate=!1,nr())});function nr(){Et.orbit.classList.toggle("on",ee.autoRotate)}Et.play.addEventListener("click",()=>tr(!He));ht("btn-back").addEventListener("click",()=>Gn(Kt-1440,.3));ht("btn-fwd").addEventListener("click",()=>{let n=He;He=!1,Ba(Math.min(_e,Kt+1440)),He=n});Et.orbit.addEventListener("click",()=>{ee.autoRotate=!ee.autoRotate,nr()});Et.labels.addEventListener("click",()=>{si=!si,Et.labels.classList.toggle("on",si)});ht("btn-home").addEventListener("click",()=>Nn(-1));ht("btn-hud").addEventListener("click",()=>document.body.classList.toggle("bare"));ht("f-close").addEventListener("click",()=>Nn(-1));ht("btn-quality").addEventListener("click",()=>vh(Oa==="high"?"low":"high"));ht("btn-lens").addEventListener("click",()=>Ha(!tn));ht("btn-rec").addEventListener("click",()=>Va());ht("rec-stop").addEventListener("click",()=>Ga());window.addEventListener("keydown",n=>{if(n.target.closest&&n.target.closest("input, textarea")||n.metaKey||n.ctrlKey||n.altKey)return;let t=n.key;if(fe){t==="Escape"&&Ga();return}if(t===" ")n.preventDefault(),tr(!He);else if(t==="ArrowRight"){n.preventDefault();let e=n.shiftKey?60:1440,i=He;He=!1,Ba(Math.min(_e,Kt+e)),He=i}else t==="ArrowLeft"?(n.preventDefault(),Gn(Kt-(n.shiftKey?60:1440),.3)):t==="ArrowUp"||t==="+"||t==="="?zr(ji+1):t==="ArrowDown"||t==="-"?zr(ji-1):t>="1"&&t<="6"?zr(+t-1):t==="Home"?Gn(0,.3):t==="End"?Gn(_e,.3):t==="Escape"?Nn(-1):t==="o"||t==="O"?(ee.autoRotate=!ee.autoRotate,nr()):t==="l"||t==="L"?(si=!si,Et.labels.classList.toggle("on",si)):t==="h"||t==="H"?document.body.classList.toggle("bare"):(t==="f"||t==="F")&&dn>=0?Nn(dn):t==="a"||t==="A"?Ha(!tn):(t==="r"||t==="R")&&Va()});function vh(n){Oa=n,ue.setPixelRatio(n==="high"?Math.min(window.devicePixelRatio||1,2):1),Mf.enabled=n==="high",ht("btn-quality").classList.toggle("on",n==="high"),ka()}function ka(){let n=Qe.clientWidth,t=Qe.clientHeight;le.aspect=n/t,le.updateProjectionMatrix(),ue.setSize(n,t),$s.setPixelRatio(ue.getPixelRatio()),$s.setSize(n,t),Yr.setSize(n,t);let e=t*ue.getPixelRatio()*.5/Math.tan(aa.degToRad(le.fov/2));Ff.value=e,bf.value=1/e,La.material.uniforms.uScale.value=e,kn=null}window.addEventListener("resize",ka);var hf={"16:9":[1280,720],"9:16":[720,1280],"1:1":[1080,1080]},fe=null,yh=null,Sa={fmt:"16:9",secs:20},Ny=String(window.CC&&window.CC.target||bi).replace(/[^\w.-]+/g,"-"),Js=window.CC&&window.CC.target||bi;function Mh(){if(typeof MediaRecorder>"u"||!HTMLCanvasElement.prototype.captureStream)return null;for(let n of["video/mp4;codecs=avc1.42E01F","video/mp4;codecs=avc1","video/mp4","video/webm;codecs=vp9","video/webm;codecs=vp8","video/webm"])try{if(MediaRecorder.isTypeSupported(n))return n}catch{}return null}function uf(n,t,e){return`<div class="segs" data-k="${n}">${t.map(([i,s])=>`<button class="seg${String(i)===String(e)?" on":""}" data-v="${i}">${s}</button>`).join("")}</div>`}function Va(n){let t=ht("recpanel");if(!(n??t.hidden)){t.hidden=!0;return}let i=Mh();t.innerHTML=`<h3>Record a clip<button id="rec-x" aria-label="Close">\xD7</button></h3>
    <p>The whole window replays from the first day to the last while the camera orbits. It renders in your browser; nothing is uploaded.</p>
    ${i?`<div class="lbl">Shape</div>${uf("fmt",[["16:9","16:9 wide"],["9:16","9:16 tall"],["1:1","1:1 square"]],Sa.fmt)}
    <div class="lbl">Length</div>${uf("secs",[[10,"10 s"],[20,"20 s"],[30,"30 s"]],Sa.secs)}
    <button class="go" id="rec-go">\u25CF Start recording</button>
    <p style="margin:10px 0 0">${/mp4/.test(i)?"Saves as MP4":"Saves as WebM"}${tn?", with the agent lens on":""}. Esc stops early and keeps what was recorded.</p>`:"<p>This browser cannot record video from a page. A current Chrome, Edge, Firefox or Safari can.</p>"}`,t.hidden=!1,t.querySelectorAll(".segs").forEach(r=>r.addEventListener("click",a=>{let o=a.target.closest("button");o&&(Sa[r.dataset.k]=r.dataset.k==="secs"?+o.dataset.v:o.dataset.v,r.querySelectorAll("button").forEach(l=>l.classList.toggle("on",l===o)))})),ht("rec-x").onclick=()=>t.hidden=!0;let s=ht("rec-go");s&&(s.onclick=()=>Zf(Sa).then(Fy,r=>{Jf(),er(`recording failed: ${r.message||r}`,"quiet")}))}function Zf({fmt:n="16:9",secs:t=20}={}){let e=Mh();if(!e)return Promise.reject(new Error("this browser cannot record video"));if(fe)return Promise.reject(new Error("already recording"));let[i,s]=hf[n]||hf["16:9"],r=Math.min((window.innerWidth-32)/i,(window.innerHeight-84)/s),a=Math.max(120,Math.floor(i*r)),o=Math.max(120,Math.floor(s*r));document.body.style.setProperty("--rec-w",`${a}px`),document.body.style.setProperty("--rec-h",`${o}px`),document.body.classList.add("rec"),ht("recpanel").hidden=!0,qr(),ni.visible=!1,ue.setPixelRatio(Math.min(3,i/a)),ka();let l=document.createElement("canvas");l.width=i,l.height=s;let c=l.getContext("2d"),h=l.captureStream(30),u=new MediaRecorder(h,{mimeType:e,videoBitsPerSecond:Math.round(i*s*30*.24)}),d=[];return Nn(-1),hn=null,le.position.copy(Pa.pos),ee.target.copy(Pa.target),ee.autoRotate=!0,ee.autoRotateSpeed=1.1,nr(),Gn(0,0),yh=Qi=_e/t,tr(!0),new Promise((p,g)=>{fe={W:i,H:s,cw:a,ch:o,g:c,mr:u,t0:Jt,end:0,mime:e,fmt:n},u.ondataavailable=_=>{_.data&&_.data.size&&d.push(_.data)},u.onerror=_=>g(_.error||new Error("the recorder stopped")),u.onstop=()=>{let _=new Blob(d,{type:e.split(";")[0]}),m={blob:_,mime:e,fmt:n,W:i,H:s};Jf(),_.size?p(m):g(new Error("the clip came out empty"))},u.start(500),Kf()})}function Ga(){fe&&fe.mr.state!=="inactive"&&fe.mr.stop()}function Jf(){!fe&&!document.body.classList.contains("rec")||(fe=null,yh=null,document.body.classList.remove("rec"),ee.autoRotateSpeed=.55,vh(Oa))}function Fy({blob:n,mime:t,fmt:e,W:i,H:s}){let r=URL.createObjectURL(n),a=/mp4/.test(t)?"mp4":"webm",o=`commit-city-${Ny}-${e.replace(":","x")}.${a}`,l=typeof File<"u"?new File([n],o,{type:n.type}):null,c=!!(l&&navigator.canShare&&navigator.canShare({files:[l]})),h=ht("recpanel");h.innerHTML=`<h3>Your clip<button id="rec-x" aria-label="Close">\xD7</button></h3>
    <video src="${r}" autoplay muted loop playsinline controls></video>
    <div class="rec-actions"><a class="pri" href="${r}" download="${o}">Download .${a}</a>${c?'<button id="rec-share">Share\u2026</button>':""}<button id="rec-again">Record again</button></div>
    <p>${(n.size/1e6).toFixed(1)} MB \xB7 ${i}\xD7${s}${a==="webm"?" \xB7 WebM. Some sites only take MP4; Safari and recent Chrome record MP4 directly.":""}</p>`,h.hidden=!1,ht("rec-x").onclick=()=>{h.hidden=!0,URL.revokeObjectURL(r)},ht("rec-again").onclick=()=>{URL.revokeObjectURL(r),Va(!0)};let u=ht("rec-share");u&&(u.onclick=()=>navigator.share({files:[l],title:`${Js} on commit.city`,text:`${Js} on GitHub, as a city`}).catch(()=>{}))}function Oy(n,t,e,i,s,r){n.beginPath(),n.roundRect?n.roundRect(t,e,i,s,r):n.rect(t,e,i,s)}function Kf(){let{g:n,W:t,H:e,cw:i}=fe,s=t/i,r=Math.min(t,e)/720;n.drawImage(ue.domElement,0,0,t,e),n.textBaseline="middle";for(let d of Xt){if(!d.label.visible||(qe.copy(d.label.position).project(le),qe.z>1))continue;let p=(qe.x*.5+.5)*t,g=(-qe.y*.5+.5)*e;n.globalAlpha=+(d.labelEl.style.opacity||1);let _=`600 ${11.5*s}px system-ui, sans-serif`,m=`${10*s}px system-ui, sans-serif`;n.font=m;let f=n.measureText(d.owner).width;n.font=_;let M=n.measureText(d.short).width,x=n.measureText(String(d.cum)).width,w=5*s,P=f+M+x+w*2+15*s,A=20*s;Oy(n,p-P/2,g-A/2,P,A,A/2),n.fillStyle="rgba(6,10,18,0.7)",n.fill(),n.strokeStyle="rgba(255,255,255,0.12)",n.lineWidth=s,n.stroke();let E=p-P/2+7*s;n.font=m,n.fillStyle="#7f8ca2",n.fillText(d.owner,E,g),E+=f+w,n.font=_,n.fillStyle="#e8eef7",n.fillText(d.short,E,g),E+=M+w,n.fillStyle=tn?d.whoCum[0]===d.cum?"#5fd3f3":"#c58bff":"#5fd3f3",n.fillText(String(d.cum),E,g)}n.globalAlpha=1;let a=n.createLinearGradient(0,0,0,190*r);a.addColorStop(0,"rgba(4,6,12,0.82)"),a.addColorStop(1,"rgba(4,6,12,0)"),n.fillStyle=a,n.fillRect(0,0,t,190*r),a=n.createLinearGradient(0,e-110*r,0,e),a.addColorStop(0,"rgba(4,6,12,0)"),a.addColorStop(1,"rgba(4,6,12,0.85)"),n.fillStyle=a,n.fillRect(0,e-110*r,t,110*r);let o=32*r;if(n.textBaseline="alphabetic",n.textAlign="left",n.font=`600 ${15*r}px system-ui, sans-serif`,n.fillStyle="#5fd3f3",n.fillText("commit.city",o,o+12*r),n.font=`700 ${34*r}px system-ui, sans-serif`,n.fillStyle="#f2f6fb",n.fillText(Js,o,o+52*r,t*.6),n.font=`500 ${17*r}px system-ui, sans-serif`,n.fillStyle="#b4c0d3",n.fillText(Hc.format(Ks(Kt)),o,o+80*r),n.textAlign="right",n.font=`750 ${44*r}px system-ui, sans-serif`,n.fillStyle="#f2f6fb",n.fillText(Ee(bn),t-o,o+40*r),n.font=`500 ${14*r}px system-ui, sans-serif`,n.fillStyle="#7f8ca2",n.fillText(Si?"commits":"commits landed",t-o,o+62*r),tn&&bn){let d=200*r,p=t-o-d,g=o+76*r,_=p;for(let m of _h(is).rows){if(!m.n)continue;let f=d*m.p;n.fillStyle=ss[m.w],n.fillRect(_,g,Math.max(1,f-1),6*r),_+=f}}n.textAlign="left";let l=o,c=t-o*2,h=e-26*r;n.fillStyle="rgba(255,255,255,0.14)",n.fillRect(l,h,c,4*r),n.fillStyle="#5fd3f3",n.shadowColor="#5fd3f3",n.shadowBlur=10*r,n.fillRect(l,h,c*pe(Kt/_e,0,1),4*r),n.shadowBlur=0,n.font=`500 ${14*r}px ui-monospace, SFMono-Regular, Menlo, monospace`,n.fillStyle="#b4c0d3",n.fillText(`commit.city/${Js}`,l,h-12*r),Kt>=_e-1e-6&&!fe.end&&(fe.end=Jt),fe.end&&Jt-fe.end>1.6&&Ga();let u=Math.floor(Jt-fe.t0);Ke(ht("rec-time"),`REC ${Math.floor(u/60)}:${String(u%60).padStart(2,"0")}`)}var yn={on:!1,seen:new Set,since:Date.parse(Pe.generated||"")/1e3||Date.now()/1e3,n:0,timer:0,queue:[]},df=new Map,By=n=>{let t=df.get(n);return t||df.set(n,t=new at(_f(n))),t},zy=new Map(Xt.map(n=>[n.name.toLowerCase(),n])),Hy={push:"pushed to",pr:"opened a pull request in",merge:"merged a pull request in",review:"reviewed in",issue:"opened an issue in",comment:"commented in",release:"released",create:"created a branch in",delete:"deleted a branch in",star:"starred",fork:"forked"};async function ff(){if(document.hidden||fe)return;let n=Pe.kind==="org"?"&kind=org":"";try{let t=await fetch(`/api/pulse?t=${encodeURIComponent(Js)}${n}`);if(!t.ok)return;let{events:e}=await t.json();for(let i of e||[]){if(yn.seen.has(i.id)||(yn.seen.add(i.id),i.t<=yn.since))continue;let s=zy.get(String(i.repo).toLowerCase());s&&yn.queue.push({e:i,r:s})}}catch{}}function ky(){let n=yn.queue.shift();if(!n)return;let{e:t,r:e}=n;yn.n++,Bf(e,[],1,By(t.who),!t.who,!0);let i=t.who&&t.who!=="bot"?` (${xf(t.who)})`:"";er(`${t.actor}${i} ${Hy[t.type]||"touched"} ${e.name}`,"live",`${Math.max(1,Math.round((Date.now()/1e3-t.t)/60))} min ago`),Ke(ht("live-n"),`${yn.n} since built`)}function Vy(){yn.on||!window.CC||!/^https?:/.test(location.protocol)||(yn.on=!0,ht("livebadge").hidden=!1,ff(),yn.timer=setInterval(ff,6e4),setInterval(ky,1400))}function Gy(){let n=new URLSearchParams(location.hash.slice(1)),t={};if(n.has("t")){let e=n.get("t");if(e==="end")t.t=_e;else{let i=new Date(e.length<=10?e+"T12:00:00Z":e+":00Z");isNaN(i)||(t.t=yf(i.getTime()))}}if(n.has("speed")){let e=es.findIndex(i=>i.k===n.get("speed"));e>=0&&(t.speed=e)}if(n.has("play")&&(t.play=n.get("play")!=="0"),n.has("focus")&&(t.focus=Xt.findIndex(e=>e.name.toLowerCase()===n.get("focus").toLowerCase())),n.has("hud")&&(t.hud=n.get("hud")!=="0"),n.has("orbit")&&(t.orbit=n.get("orbit")!=="0"),n.has("cam")){let e=n.get("cam").split(",").map(Number);e.length===6&&e.every(isFinite)&&(t.cam=e)}return n.has("lens")&&(t.lens=!["0","off",""].includes(n.get("lens"))),t.embed=n.get("embed")==="1",t}var Kc=performance.now(),pf=0,mf=0,Ea=0,Oc=0,Bc=0;function jf(n){requestAnimationFrame(jf),Na(n)}function Na(n,t=!1){let e=pe((n-Kc)/1e3,0,.1);Kc=n,Jt=n/1e3,hh.value=Jt;let i=yh??es[ji].v;Qi+=(i-Qi)*(1-Math.exp(-e*3.5)),Br!==null&&(Gn(Br,.2),Br=null),He&&!Wr&&(Ba(Kt+Qi*e),Kt>=_e&&tr(!1)),kf(),ny(),ry(),ly(e),yi*=Math.exp(-e*5),Mn.position.y=Ca+Math.sin(Jt*1.1)*.35;let r=Math.atan2(le.position.x-Mn.position.x,le.position.z-Mn.position.z)-Mi.rotation.y;r=Math.atan2(Math.sin(r),Math.cos(r)),Mi.rotation.y+=r*(1-Math.exp(-e*2.5)),Mi.rotation.z=Math.sin(Jt*.7)*.05,Mi.rotation.x=Math.sin(Jt*.9)*.04,Mi.scale.setScalar(1+yi*.05),Ef.color.setRGB(.5+yi*1.6,1.6+yi*1.8,2.2+yi*1.6);for(let a of wf)a.m.rotation.z+=a.spd*e*(1+yi*3);La.rotation.y+=e*(.08+yi*.6),Wv.material.uniforms.uScale.value=La.material.uniforms.uScale.value,My(),Uy(),ee.update(e),Dy();try{Ry(),Jt-pf>.12&&(pf=Jt,cy(),Cy()),Jt-mf>.3&&(mf=Jt,Gf(),Zc(),Xf()),Iy()}catch(a){Na.warned||(Na.warned=!0,console.error(a))}if(!t&&($s.render(),Yr.render(Ue,le),fe&&Kf(),!yn.on&&Kt>=_e-1e-6&&Vy(),Ea+=e,Oc++,Ea>2)){let a=Oc/Ea;Ea=0,Oc=0,Oa==="high"&&a<28&&!fe?(Bc++,Bc>=2&&vh("low")):Bc=0}}var ze=Gy();zr(ze.speed??3);Qi=es[ji].v;ka();Gn(ze.t??0,0);kf();ze.hud===!1&&document.body.classList.add("bare");ze.orbit===!1&&(ee.autoRotate=!1);nr();Et.labels.classList.toggle("on",si);ze.cam&&(le.position.set(ze.cam[0],ze.cam[1],ze.cam[2]),ee.target.set(ze.cam[3],ze.cam[4],ze.cam[5]));ze.focus>=0&&(Nn(ze.focus),hn&&(hn.dur=.001));ze.lens&&Ha(!0,!0);if(ze.embed){ee.enableZoom=!1,ue.domElement.addEventListener("pointerdown",()=>{ee.enableZoom=!0},{once:!0});let n=ht("embed-link");n&&(n.href=`${location.origin}${location.pathname}${location.search}`,n.textContent=`commit.city/${Js} \u2197`)}tr(ze.play??!0);Et.loading.classList.add("done");setTimeout(()=>Et.loading.remove(),900);requestAnimationFrame(jf);function Wy(n,t=!1){let e=Math.max(performance.now(),Kc);for(let i=0;i<Math.max(1,Math.round(n*60));i++)e+=1e3/60,Na(e,!t)}window.__lapse={step:Wy,R:Xt,seek:Gn,advance:Ba,get T(){return Kt},get playing(){return He},focusRepo:Nn,camera:le,controls:ee,T_END:_e,EPOCH:jc,get lens(){return tn},setLens:Ha,WHO:Ye,whoSoFar:is,record:Zf,stopRecord:Ga,recMime:Mh,toggleRecPanel:Va,get recording(){return!!fe},LIVE:yn,get recInfo(){return fe?{end:fe.end,state:fe.mr.state,T:Kt}:null},get recCanvas(){return fe?fe.g.canvas:null}};/(^|&)selftest=1/.test(location.hash.slice(1))&&Promise.resolve().then(()=>(Kd(),Jd)).then(n=>n.run(window.__lapse));})();
/*! Bundled license information:

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2023 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
