function init(){String.prototype.format||(String.prototype.format=function(){var a=arguments;return this.replace(/{(\d+)}/g,function(b,c){return"undefined"!=typeof a[c]?a[c]:b})}),function(){function b(){document.getElementById("goBack").style.visibility="";var a=document.getElementById("logo");a.parentNode.removeChild(a),o.removeEventListener("click",i),q.removeEventListener("click",k);var b=document.getElementById("menu");b.parentNode.removeChild(b)}function d(){return new a("flexParent","renderArea","digitalClock","date")}function h(a,b,c){function d(){c?null==f?f=setInterval(function(){a.g(b)},15):(clearInterval(f),f=null):a.h(b)}function e(a){"Enter"==a.key&&d(),"r"==a.key&&location.reload()}var f=null;document.body.addEventListener("click",d,!0),document.body.addEventListener("keypress",e)}function i(){b();var a=d();h(new c(!1),a,!0)}function j(){b();var a=d();h(new c(!0),a,!0)}function k(){b();var a=d();a.i(),h(new e,a,!0)}function l(){b();var a=[{name:"Friends",color:"#FF0000"},{name:"Family",color:"#00FF00"},{name:"Pets",color:"#BBFF00"},{name:"Music",color:"#FF0000"},{name:"Dreams",color:"#00FF00"},{name:"School",color:"#BBFF00"},{name:"Hobbies",color:"#FF0000"},{name:"Food",color:"#00FF00"},{name:"Movies",color:"#BBFF00"},{name:"Books",color:"#FF0000"},{name:"Traveling",color:"#00FF00"},{name:"Shopping",color:"#BBFF00"},{name:"Birthdays",color:"#00FF00"},{name:"English",color:"#FF0000"},{name:"Jokes",color:"#BBFF00"},{name:"Education",color:"#FF0000"},{name:"Sports",color:"#00FF00"},{name:"Cars",color:"#BBFF00"}];h(new f,new g("flexParent","renderArea",a),!1)}function m(){b();var a=[{name:"Family",color:"#FF0000"},{name:"Friends",color:"#00FF00"},{name:"Food",color:"#BBFF00"},{name:"Hobbies",color:"#FF0000"},{name:"Dreams",color:"#00FF00"},{name:"Home",color:"#BBFF00"}];h(new f,new g("flexParent","renderArea",a),!1)}function n(){b();for(var a=[],c=0;c<45;++c){var d=(c+23)%45+1+"",e={name:d};c%3==0?e.color="#DDDDDD":c%3==1?e.color="#00FFFF":e.color="#FFFF00",a.push(e)}h(new f,new g("flexParent","renderArea",a),!1)}var o,p,q,r,s,t;o=document.getElementById("gameClock"),p=document.getElementById("gameClockFives"),q=document.getElementById("gameDate"),r=document.getElementById("gameWheel18"),s=document.getElementById("gameWheel6"),t=document.getElementById("gameWheel45"),o.addEventListener("click",i),p.addEventListener("click",j),q.addEventListener("click",k),r.addEventListener("click",l),s.addEventListener("click",m),t.addEventListener("click",n)}()}function a(a,b,c,d){function e(a,b){return a*(2*Math.PI)/b}function f(a){return a<10?"0"+a:""+a}var g,h=this,i=0,j=0,k=document.getElementById(a),l=document.getElementById(b),m=document.getElementById(c),n=!1;this.j=function(a,b){a%=12,a=e(a+b/60,12)+Math.PI,b=e(b,60)+Math.PI;var c=l.getContext("2d");c.beginPath(),c.fillStyle="#000000",c.fillRect(0,0,2*g,2*g),c.fill(),c.lineWidth=.05*g,c.fillStyle="#f5f5f5",c.arc(g,g,.95*g,0,2*Math.PI),c.fill(),c.strokeStyle="#444444",c.arc(g,g,.95*g,0,2*Math.PI),c.stroke(),c.beginPath(),c.lineWidth=.03*g,c.fillStyle="#444444";var d=Math.floor(.15*g);for(p=0;p<12;p++){var f=g+Math.round(.8*g*Math.cos(30*p*Math.PI/180)),h=g+Math.round(.8*g*Math.sin(30*p*Math.PI/180)),i=g+Math.round(.9*g*Math.cos(30*p*Math.PI/180)),j=g+Math.round(.9*g*Math.sin(30*p*Math.PI/180)),k=g+Math.round(.7*g*Math.cos(30*p*Math.PI/180))-d/4,m=g+Math.round(.7*g*Math.sin(30*p*Math.PI/180))+d/4;c.moveTo(f,h),c.lineTo(i,j),c.stroke(),c.font="{0}px Arial".format(d);var n=(p+3)%12;0==n&&(n=12),c.fillText(n,k,m),c.stroke()}c.beginPath(),c.strokeStyle="#444444",c.lineWidth=.06*g,c.moveTo(g,g),c.lineTo(g-.3*g*Math.sin(a),g+.3*g*Math.cos(a)),c.stroke(),c.beginPath(),c.strokeStyle="#444444",c.lineWidth=.04*g,c.moveTo(g,g),c.lineTo(g-.5*g*Math.sin(b),g+.5*g*Math.cos(b)),c.stroke(),c.beginPath(),c.fillStyle="#000000",c.lineWidth=0,c.arc(g,g,.05*g,0,2*Math.PI),c.fill()},this.setTime=function(a,b){i=a,j=b;var c;c=a>12?"PM":"AM";var d=a%12;0==d&&(d=12),m.innerHTML="{0}:{1} {2}".format(f(d),f(b),c),n&&h.j(i,j)},this.k=function(){g=Math.min(k.offsetHeight/4,k.offsetWidth/4),n&&(l.width=2*g,l.height=2*g,h.j(i,j)),h.setTime(i,j)},this.l=function(){n=!0,l.style.display="inline-block",h.k()},this.i=function(){m.className="smallerText"},h.l(),document.body.onresize=h.k;var o=new Array(7);o[0]="Sun",o[1]="Mon",o[2]="Tue",o[3]="Wed",o[4]="Thu",o[5]="Fri",o[6]="Sat";var q=document.getElementById(d);this.setDate=function(a){q.innerHTML="{3}, {0}/{1}/{2}".format(a.getDate(),a.getMonth()+1,a.getFullYear(),o[a.getDay()])}}function b(a,b){return Math.floor(Math.random()*(b-a))+a}function c(a){var c=0,d=0;this.g=function(e){d+=a?5*b(0,12):b(10,60),d>=60&&(d%=60,c++,c>24&&(c%=24)),e.setTime(c,d)}}function d(a){var c=new Date(1950,1,1).getTime(),d=new Date(2020,1,1).getTime();document.getElementById("date").innerHTML="&nbsp;",this.g=function(a){a.setDate(new Date(b(c,d)))}}function e(a){var b=new d,e=new c(!0);this.g=function(a){b.g(a),e.g(a)}}function f(){var a=0,c=null,d=null,e=this,f=0,g=function(g){function i(){f+=a}function j(){g.m(f),f=0}c=setInterval(i,15),d=setInterval(j,50),a=20,e.h=function(){},setTimeout(h,b(1e3,1700))},h=function(b){function f(){a-=1,0==a&&(clearInterval(c),clearInterval(d),clearInterval(h),e.h=g)}var h=setInterval(f,500)};e.h=g}function g(a,b,c){function d(a,b){return a*(2*Math.PI)/b}var e;e=c.length>30;var f,g=this,h=0,i=document.getElementById(a),j=document.getElementById(b);x=0,this.o=function(a){hour=d(a,360)+Math.PI;var b=j.getContext("2d");b.beginPath(),b.fillStyle="#000000",b.fillRect(0,0,2*f,2*f),b.fill(),b.lineWidth=.05*f,b.beginPath(),b.fillStyle="#f5f5f5",b.arc(f,f,.95*f,0,2*Math.PI),b.fill(),b.beginPath(),b.strokeStyle="#444444",b.arc(f,f,.95*f,0,2*Math.PI),b.stroke(),b.textAlign="center",b.textBaseline="middle";var g;g=e?Math.floor(.08*f):Math.floor(.08*f);var h=2*Math.PI/c.length;for(p=0;p<c.length;p++){var i=h*p,k=h*(p+1);b.beginPath(),b.fillStyle=c[p].color,b.arc(f,f,.95*f,i,k),b.lineTo(f,f),b.fill()}for(b.fillStyle="#000000",b.strokeStyle="#FFFFFF",b.lineWidth=.02*g,p=0;p<c.length;p++){var l,m,i=h*p,k=h*(p+1);e?(m=.3,l=.8):(m=0,l=.8);var n=f-l*f*Math.sin(i+m*h),o=f+l*f*Math.cos(i+m*h);b.beginPath(),b.font="{0}px Arial".format(g),b.fillText(c[p].name,n,o),b.strokeText(c[p].name,n,o)}b.beginPath(),b.strokeStyle="#444444",b.lineWidth=.05*f,b.moveTo(f,f),b.lineTo(f-.6*f*Math.sin(hour),f+.6*f*Math.cos(hour)),b.stroke(),b.beginPath(),b.fillStyle="#000000",b.lineWidth=0,b.arc(f,f,.05*f,0,2*Math.PI),b.fill()},this.m=function(a){h+=a,g.o(h)},this.k=function(){f=i.offsetHeight/2.3,j.width=2*f,j.height=2*f,g.o(h)},j.style.display="inline-block",this.k(),document.body.onresize=g.k}
