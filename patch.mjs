import {readFile, writeFile} from 'fs/promises'

import BZip2 from './dist/tools/bzip2.js'
import unbzip2 from './dist/tools/unbzip2.js'
import base32768 from './dist/tools/base32768.js'

const name = 'digest_wasm'
const base = './dist/lib'

const input = await readFile(`${base}/${name}.js`, 'utf8')

const code = input
    .replace(/async function __wbg_load[\s\S]*?(?=function __wbg_get_imports)/, '')
    .replace(/async function __wbg_init[\s\S]*/, '')
    .replace(/ *__wbg_init.__wbindgen_wasm_module = module;[\n\r]*/, '')

let data = await readFile(`${base}/${name}_bg.wasm`, 'binary');

let compressed = new Uint8Array(BZip2.toBzip(data));

let decode = unbzip2.decode(compressed);

console.assert(data === decode, "unbzip2.decode( BZip2.toBzip(data) ) != data")

let decodeU8 = new Uint8Array(data.length);
decodeU8 = unbzip2.decodeU8(compressed, decodeU8);
console.assert(data === Buffer.from(decodeU8).toString('binary'), "unbzip2.decodeU8( BZip2.toBzip(data) ) != data")

data === decode && data === Buffer.from(decodeU8).toString('binary') && console.log("compressed ratio:", parseFloat(compressed.length / data.length).toFixed(2))

//region __unbzip2__

const __unbzip2__ = `var unbzip2={decode:function(r){return unbzip2.simple(unbzip2.array(r))},decodeU8:function(r,e){var o=unbzip2.array(r),i=unbzip2.header(o),n=0;do{n=unbzip2.decompress(o,i,0,e)}while(-1!=n);return e},array:function(r){var e=0,o=0,i=[0,1,3,7,15,31,63,127,255];return function(n){for(var a=0;n>0;){var t=8-e;n>=t?(a<<=t,a|=i[t]&r[o++],e=0,n-=t):(a<<=n,a|=(r[o]&i[n]<<8-n-e)>>8-n-e,e+=n,n=0)}return a}},simple:function(r){var e=unbzip2.header(r),o="",i="";do{o+=i,i=unbzip2.decompress(r,e)}while(-1!=i);return o},header:function(r){if(4348520!=r(24))throw"No magic number found";var e=r(8)-48;if(e<1||e>9)throw"Not a BZIP archive";return e},decompress:function(r,e,o,i){for(var n=1e5*e,a="",t=0;t<6;t++)a+=r(8).toString(16);if("177245385090"==a)return-1;if("314159265359"!=a)throw"eek not valid bzip data";if(r(32),r(1))throw"unsupported obsolete version";var f=r(24);if(f>n)throw"Initial position larger than buffer size";var u=r(16),w=new Uint8Array(256),s=0;for(t=0;t<16;t++)if(u&1<<15-t){var m=r(16);for(d=0;d<16;d++)m&1<<15-d&&(w[s++]=16*t+d)}var h=r(3);if(h<2||h>6)throw"another error";var p=r(15);if(0==p)throw"meh";var v=[];for(t=0;t<h;t++)v[t]=t;var b=new Uint8Array(32768);for(t=0;t<p;t++){for(var d=0;r(1);d++)if(d>=h)throw"whoops another error";var y=v[d];v.splice(d,1),v.splice(0,0,y),b[t]=y}var c=s+2,l=[];for(d=0;d<h;d++){var z,g,U,A=new Uint8Array(258),k=new Uint8Array(21);u=r(5);for(t=0;t<c;t++){for(;;){if(u<1||u>20)throw"I gave up a while ago on writing error messages";if(!r(1))break;r(1)?u--:u++}A[t]=u}z=g=A[0];for(t=1;t<c;t++)A[t]>g?g=A[t]:A[t]<z&&(z=A[t]);(U=l[d]={}).permute=new Uint32Array(258),U.limit=new Uint32Array(21),U.base=new Uint32Array(21),U.minLen=z,U.maxLen=g;var I=U.base.subarray(1),L=U.limit.subarray(1),x=0;for(t=z;t<=g;t++)for(u=0;u<c;u++)A[u]==t&&(U.permute[x++]=u);for(t=z;t<=g;t++)k[t]=L[t]=0;for(t=0;t<c;t++)k[A[t]]++;for(x=u=0,t=z;t<g;t++)x+=k[t],L[t]=x-1,x<<=1,I[t+1]=x-(u+=k[t]);L[g]=x+k[g]-1,I[z]=0}var B,C,N,S=new Uint32Array(256);for(t=0;t<256;t++)v[t]=t;B=C=c=N=0;for(var j=new Uint32Array(n);;){if(!c--){if(c=49,N>=p)throw"meow i'm a kitty, that's an error";I=(U=l[b[N++]]).base.subarray(1),L=U.limit.subarray(1)}for(d=r(t=U.minLen);;){if(t>U.maxLen)throw"rawr i'm a dinosaur";if(d<=L[t])break;t++,d=d<<1|r(1)}if((d-=I[t])<0||d>=258)throw"moo i'm a cow";var E=U.permute[d];if(0!=E&&1!=E){if(B){if(B=0,C+u>=n)throw"Boom.";for(S[y=w[v[0]]]+=u;u--;)j[C++]=y}if(E>s)break;if(C>=n)throw"I can't think of anything. Error";y=v[t=E-1],v.splice(t,1),v.splice(0,0,y),S[y=w[y]]++,j[C++]=y}else B||(B=1,u=0),u+=0==E?B:2*B,B<<=1}if(f<0||f>=C)throw"I'm a monkey and I'm throwing something at someone, namely you";for(d=0,t=0;t<256;t++)m=d+S[t],S[t]=d,d=m;for(t=0;t<C;t++)j[S[y=255&j[t]]]|=t<<8,S[y]++;var P=0,Z=0,q=0;C&&(Z=255&(P=j[f]),P>>=8,q=-1),C=C;var D,F,G,H=0,J="";for(o||(o=1/0);C;){if(C--,F=Z,Z=255&(P=j[P]),P>>=8,3==q++?(D=Z,G=F,Z=-1):(D=1,G=Z),i){for(;D--;)if(i[H++]=G,!--o)return J}else for(;D--;)if(J+=String.fromCharCode(G),!--o)return J;Z!=F&&(q=0)}return J}};`;


const esm = `${code}
const __toBinary = (function () {
    /* __unbzip2__ */

    var table = new Uint8Array(128);
    for (var i = 0; i < 64; i++) {
        table[i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i * 4 - 205] = i;
    }
    
    function _base64(data) {
        var n = data.length;
        var bytes = new Uint8Array((n - (data[n - 1] === "=") - (data[n - 2] === "=")) * 3 / 4 | 0);
        var i = 0, j = 0;
        while (i < n) {
            var c0 = table[data.charCodeAt(i++)], c1 = table[data.charCodeAt(i++)];
            var c2 = table[data.charCodeAt(i++)], c3 = table[data.charCodeAt(i++)];
            bytes[j++] = c0 << 2 | c1 >> 4;
            bytes[j++] = c1 << 4 | c2 >> 2;
            bytes[j++] = c2 << 6 | c3;
        }
        return bytes;
    }
    
    return function (info) {
        if (!info) { return new Uint8Array(0) }
        var decodeF = _base64;
        decodeF = info[0] === 'base32768' ? base32768.decode : decodeF;
        var bytes = decodeF(info[2]);
        var out = new Uint8Array(info[1]);
        return unbzip2.decodeU8(bytes, out);
    };
})();

const bytes = __toBinary(/* __bininfo__ */);

initSync(bytes)`

const __bininfo__ = `['base64', ${data.length}, "${Buffer.from(compressed).toString('base64')}"]`;

//endregion

await writeFile(`${base}/../${name}.mjs`,
    esm.replace('/* __unbzip2__ */', __unbzip2__)
        .replace('/* __bininfo__ */', __bininfo__)
)

//region __module__ & __compile__

let defs = {};
let cjs = esm.replace(/export\s+(class|function|const)\s+(\w+)/g, (match, typ, name) => {
    defs[name] = typ;
    return typ + ' ' + name;
});

const __module__ = `
if (typeof window === "object") { ${Object.keys(defs).map(v => 'window.' + v + ' = ' + v).join('; ')}}
if (typeof module !== "undefined") { module.exports = { ${Object.keys(defs).join(', ')} }; }`;

const __compile__ = `
    if (typeof window === "object" && typeof window.document === "object") {
        WebAssembly.compile(module).then(function (mod) {
            WebAssembly.instantiate(mod, imports).then(function (inst){
                __wbg_finalize_init(inst, mod);
            });
        });
        return
    }
`;

cjs = cjs.replace(`if (!(module instanceof WebAssembly.Module)) {`, `${__compile__}
    if (!(module instanceof WebAssembly.Module) ) {`);

//endregion

await writeFile(
    `${base}/../${name}.js`,
    (cjs + __module__).replace('/* __unbzip2__ */', __unbzip2__)
        .replace('/* __bininfo__ */', __bininfo__)
)

await writeFile(
    `${base}/../${name}_u16.data.js`,
    `\ufeffvar ${name}_u16 = ['base32768', ${data.length}, "${base32768.encode(compressed)}"];`,
    'utf16le'
)

await writeFile(
    `${base}/../${name}_u16.js`,
    cjs.replace('/* __unbzip2__ */', '')
        .replace('/* __bininfo__ */', `${name}_u16`)
)

console.log("Patch Done!")