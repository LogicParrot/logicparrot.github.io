function D(a){return document.getElementById(a)}function E(a){return document.createElement(a)}function init(){N=D("buttonArea"),I=D("buttonList"),O=D("wordArea"),P=D("wordList"),L=D("goBack"),Q["buttonArea"]="inv",Q["wordArea"]="scroll";for(var a=1;a<=20;++a){var b=E("button");b.appendChild(document.createTextNode(a+"")),b.onclick=function(a){return function(){H(a)}}(a),b.classList.add("numberButton"),a%5==1&&(b.style.clear="left"),I.appendChild(b)}L.onclick=F}function F(){M(O,N,function(){P.innerHTML=""})}function G(a){P.appendChild(a),M(N,O)}function M(a,b,c){a.classList.add(Q[a.id]),setTimeout(function(){a.classList.add("hid"),b.classList.remove("hid"),void 0!=c&&c(),setTimeout(function(){b.classList.remove(Q[b.id])},20)},500)}function H(a){for(var b=document.createDocumentFragment(),c=1;c<=a;++c){if(word=randomWord(),null==word){if(1==c){G(document.createTextNode("You finished all words!"));break}word="... No more words left!"}else word=c+": "+word;var d=E("div");d.appendChild(document.createTextNode(word)),b.appendChild(d)}G(b)}var N,I,O,P,L,Q={};
