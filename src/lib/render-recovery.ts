/**
 * Самолечение предпросмотра: если страница стала пустой из-за устаревших модулей
 * после горячей загрузки кода (ошибки вида «undefined is not an object»,
 * «Cannot read properties of undefined», «Hydration failed»), один раз
 * перезагружаем страницу вместо пустого экрана.
 *
 * Ограничения: не больше 3 перезагрузок и не чаще одного раза в 3 секунды;
 * счётчик сбрасывается, когда страница отработала 10 секунд без сбоя.
 */
export const RECOVERY_MAX_RELOADS = 3;
export const RECOVERY_MIN_INTERVAL_MS = 3000;
export const RECOVERY_HEALTHY_MS = 10000;
export const RECOVERY_STORAGE_KEY = "va54:render-recovery";

const STALE_PATTERN =
  "No factory registered for module|Hydration failed|is not an object|Cannot read properties of undefined|Minified React error #4[12][0-9]";

/** Инлайновый скрипт для <head>: ставится до загрузки бандла, чтобы поймать сбой при гидрации. */
export const RENDER_RECOVERY = `(function(){
var K=${JSON.stringify(RECOVERY_STORAGE_KEY)};
var MAX=${RECOVERY_MAX_RELOADS},MIN=${RECOVERY_MIN_INTERVAL_MS},HEALTHY=${RECOVERY_HEALTHY_MS};
function read(){try{return JSON.parse(sessionStorage.getItem(K)||"")||{n:0,t:0}}catch(e){return {n:0,t:0}}}
function write(v){try{sessionStorage.setItem(K,JSON.stringify(v))}catch(e){}}
function clear(){try{sessionStorage.removeItem(K)}catch(e){}}
function blank(){return document.body.innerText.trim().length<40}
function stale(m){return new RegExp(${JSON.stringify(STALE_PATTERN)}).test(m||"")}
function recover(m){
if(!stale(m))return;
setTimeout(function(){
if(!blank())return;
var s=read();
if(s.n>=MAX||Date.now()-s.t<MIN)return;
write({n:s.n+1,t:Date.now()});
location.reload();
},300);
}
window.addEventListener("error",function(e){recover((e&&(e.message||(e.error&&e.error.message)))||"")});
window.addEventListener("unhandledrejection",function(e){var r=e&&e.reason;recover(typeof r==="string"?r:(r&&r.message)||"")});
setTimeout(clear,HEALTHY);
})();`;
