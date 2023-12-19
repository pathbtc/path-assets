/*! For license information please see 186.696c5bd2.chunk.js.LICENSE.txt */
"use strict";(self.webpackChunkemit_assets=self.webpackChunkemit_assets||[]).push([[186],{51186:(e,t,n)=>{n.r(t),n.d(t,{startInputShims:()=>p});var o=n(51811);const r=new WeakMap,i=function(e,t,n){let o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0;r.has(e)!==n&&(n?a(e,t,o):l(e,t))},s=e=>e===e.getRootNode().activeElement,a=(e,t,n)=>{const o=t.parentNode,i=t.cloneNode(!1);i.classList.add("cloned-input"),i.tabIndex=-1,o.appendChild(i),r.set(e,i);const s="rtl"===e.ownerDocument.dir?9999:-9999;e.style.pointerEvents="none",t.style.transform=`translate3d(${s}px,${n}px,0) scale(0)`},l=(e,t)=>{const n=r.get(e);n&&(r.delete(e),n.remove()),e.style.pointerEvents="",t.style.transform=""},d="input, textarea, [no-blur], [contenteditable]",c=(e,t,n,o)=>{const r=e.top,i=e.bottom,s=t.top,a=s+15,l=.75*Math.min(t.bottom,o-n)-i,d=a-r,c=Math.round(l<0?-l:d>0?-d:0),u=Math.min(c,r-s),m=Math.abs(u)/.3;return{scrollAmount:u,scrollDuration:Math.min(400,Math.max(150,m)),scrollPadding:n,inputSafeY:4-(r-a)}},u=async(e,t,n,r,s)=>{if(!n&&!r)return;const a=((e,t,n)=>{const o=e.closest("ion-item,[ion-item]")||e;return c(o.getBoundingClientRect(),t.getBoundingClientRect(),n,e.ownerDocument.defaultView.innerHeight)})(e,n||r,s);if(n&&Math.abs(a.scrollAmount)<4)t.focus();else if(i(e,t,!0,a.inputSafeY),t.focus(),(0,o.r)((()=>e.click())),"undefined"!==typeof window){let o;const r=async()=>{void 0!==o&&clearTimeout(o),window.removeEventListener("ionKeyboardDidShow",s),window.removeEventListener("ionKeyboardDidShow",r),n&&await n.scrollByPoint(0,a.scrollAmount,a.scrollDuration),i(e,t,!1,a.inputSafeY),t.focus()},s=()=>{window.removeEventListener("ionKeyboardDidShow",s),window.addEventListener("ionKeyboardDidShow",r)};if(n){const e=await n.getScrollElement(),i=e.scrollHeight-e.clientHeight;if(a.scrollAmount>i-e.scrollTop)return"password"===t.type?(a.scrollAmount+=50,window.addEventListener("ionKeyboardDidShow",s)):window.addEventListener("ionKeyboardDidShow",r),void(o=setTimeout(r,1e3))}r()}},m=(e,t,n)=>{if(t&&n){const o=t.x-n.x,r=t.y-n.y;return o*o+r*r>e*e}return!1},f=(e,t)=>{var n,o;if("INPUT"!==e.tagName)return;if(e.parentElement&&"ION-INPUT"===e.parentElement.tagName)return;if("ION-SEARCHBAR"===(null===(o=null===(n=e.parentElement)||void 0===n?void 0:n.parentElement)||void 0===o?void 0:o.tagName))return;const r=e.closest("ion-content");if(null===r)return;const i=r.$ionPaddingTimer;i&&clearTimeout(i),t>0?r.style.setProperty("--keyboard-offset",`${t}px`):r.$ionPaddingTimer=setTimeout((()=>{r.style.setProperty("--keyboard-offset","0px")}),120)},p=e=>{const t=document,n=e.getNumber("keyboardHeight",290),r=e.getBoolean("scrollAssist",!0),a=e.getBoolean("hideCaretOnScroll",!0),l=e.getBoolean("inputBlurring",!0),c=e.getBoolean("scrollPadding",!0),p=Array.from(t.querySelectorAll("ion-input, ion-textarea")),v=new WeakMap,h=new WeakMap,w=async e=>{await new Promise((t=>(0,o.c)(e,t)));const t=e.shadowRoot||e,l=t.querySelector("input")||t.querySelector("textarea"),d=e.closest("ion-content"),c=d?null:e.closest("ion-footer");if(l){if(d&&a&&!v.has(e)){const t=((e,t,n)=>{if(!n||!t)return()=>{};const r=n=>{s(t)&&i(e,t,n)},a=()=>i(e,t,!1),l=()=>r(!0),d=()=>r(!1);return(0,o.a)(n,"ionScrollStart",l),(0,o.a)(n,"ionScrollEnd",d),t.addEventListener("blur",a),()=>{(0,o.b)(n,"ionScrollStart",l),(0,o.b)(n,"ionScrollEnd",d),t.addEventListener("ionBlur",a)}})(e,l,d);v.set(e,t)}if((d||c)&&r&&!h.has(e)){const t=((e,t,n,r,i)=>{let a;const l=e=>{a=(0,o.p)(e)},d=l=>{if(!a)return;const d=(0,o.p)(l);m(6,a,d)||s(t)||(l.stopPropagation(),u(e,t,n,r,i))};return e.addEventListener("touchstart",l,!0),e.addEventListener("touchend",d,!0),()=>{e.removeEventListener("touchstart",l,!0),e.removeEventListener("touchend",d,!0)}})(e,l,d,c,n);h.set(e,t)}}};l&&(()=>{let e=!0,t=!1;const n=document,r=()=>{t=!0},i=()=>{e=!0},s=o=>{if(t)return void(t=!1);const r=n.activeElement;if(!r)return;if(r.matches(d))return;const i=o.target;i!==r&&(i.matches(d)||i.closest(d)||(e=!1,setTimeout((()=>{e||r.blur()}),50)))};(0,o.a)(n,"ionScrollStart",r),n.addEventListener("focusin",i,!0),n.addEventListener("touchend",s,!1)})(),c&&(e=>{const t=document,n=t=>{f(t.target,e)},o=e=>{f(e.target,0)};t.addEventListener("focusin",n),t.addEventListener("focusout",o)})(n);for(const o of p)w(o);t.addEventListener("ionInputDidLoad",(e=>{w(e.detail)})),t.addEventListener("ionInputDidUnload",(e=>{(e=>{if(a){const t=v.get(e);t&&t(),v.delete(e)}if(r){const t=h.get(e);t&&t(),h.delete(e)}})(e.detail)}))}}}]);
//# sourceMappingURL=186.696c5bd2.chunk.js.map