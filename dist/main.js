!function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="/dist",r(r.s=0)}([function(e,t,r){"use strict";const n=document.querySelector(".dropdown-menu"),o=document.querySelector(".pagination"),s=document.querySelector(".page-previous"),a=document.querySelector(".page-next");let i={},l=[];const c=e=>{sessionStorage.setItem("currentPage",e);const t=document.querySelectorAll(".card-class");t.forEach(e=>e.style.display="none"),l[e].forEach((e,r)=>{const n=t[r];n.querySelector(".card-img-top").src=e.photo,n.querySelector(".card-title").textContent=e.name,n.querySelector(".card-text").innerHTML=`\n\t\t\t<b>Actor:</b> ${e.actors}</br>\n\t\t\t<b>Species:</b> ${e.species}</br>\n\t\t\t<b>Gender:</b> ${e.gender}</br>\n\t\t\t<b>Days of life:</b> ${e.birthDay?e.birthDay:"xxxx"}-${e.deathDay?e.deathDay:"xxxx"}</br>\n\t\t\t<b>Status:</b> ${e.status}</br>\n\t\t`,n.style.display="inline-block"}),(()=>{const e=document.querySelectorAll(".page-digital");if(o.style.display="",l.length<=1)o.style.display="none";else for(let t=1;t<=7;t++)e[t-1].style.display=t>l.length?"none":"inline"})()},u=e=>{l=[[]];i.forEach(t=>{let r;if(e&&"All movies"!==e){if(!t.movies||-1===t.movies.indexOf(e))return;r=t}else r=t;(e=>{l[l.length-1].length<8||l.push([]),l[l.length-1].push(e)})(r)}),c(0)};fetch("./dbHeroes.json").then(e=>{if(200!==e.status)throw new Error("invalid server response status");return e.json()}).then(e=>{i=e,u(),(()=>{const e=[];return i.forEach(t=>{t.movies&&t.movies.forEach(t=>{-1===e.indexOf(t)&&e.push(t)})}),e.sort()})().forEach(e=>n.insertAdjacentHTML("beforeend",`<a class="dropdown-item" href="#">${e}</a>`)),n.addEventListener("click",e=>{const t=e.target;t.classList.contains("dropdown-item")&&u(t.textContent)}),o.addEventListener("click",e=>{e.preventDefault();const t=e.target;if(t.disabled)return;let r;try{if(r=+sessionStorage.getItem("currentPage"),!r)throw new Error("undefined current page id")}catch(e){r=0}if(t.closest(".page-previous")&&r>0&&(r--,c(r),sessionStorage.setItem("currentPage",r)),t.closest(".page-next")&&r<l.length-1&&(r++,c(r),sessionStorage.setItem("currentPage",r)),t.closest(".page-digital")&&t.classList.contains("page-link")){let e=+t.textContent-1;e<l.length&&(c(e),r=e,sessionStorage.setItem("currentPage",r))}r===l.length-1?a.classList.add("disabled"):a.classList.remove("disabled"),r<=0?s.classList.add("disabled"):s.classList.remove("disabled")})}).catch(e=>console.error(e))}]);