function GithubCalendar(t,e,i){var y,n,a,w,o,l,d,r,s,k,c,p,g,x,_,h,u,m,b,f,v,z,B,I,E,T,C,M,L,S;document.getElementById("github_container")&&(y=(t,e)=>{if("string"==typeof e){for(var i=document.createElement("div"),n=(i.innerHTML=e,document.createDocumentFragment());i.firstChild;)n.appendChild(i.firstChild);t.appendChild(n)}else t.appendChild(e)},n=document.getElementById("github_container"),document.getElementById("github_loading"),a=i,w=e,s=["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],k=[],g=p=c="",_=[],h=[],u=[],b=m=x=0,f=[],v=[],z=()=>{if(document.getElementById("gitcanvas")){var t,r=document.getElementById("git_tooltip_container"),e=window.devicePixelRatio||1,s="",c="",p="",i=document.getElementById("gitcanvas"),n=(i.style.width="100%",i.style.height="",document.getElementById("gitmessage"),i.getContext("2d")),a=(width=i.width=document.getElementById("gitcalendarcanvasbox").offsetWidth,height=i.height=8.64*i.width/git_data.length,m=i,b=n,1<(e=e)&&(f=m.width,v=m.height,m.width=f*e,m.height=v*e,m.style.width="100%",m.style.height=v+"px",b.scale(e,e)),height/9),g=.8*a,o={x:.02*width,y:.025*width};for(t in git_data){for(var l in weekdata=git_data[t]){var d={date:"",count:"",x:0,y:0};_.push(d),n.fillStyle=C(w,weekdata[l].count),o.y=Math.round(100*o.y)/100,d.date=weekdata[l].date,d.count=weekdata[l].count,d.x=o.x,d.y=o.y,n.fillRect(o.x,o.y,g,g),o.y=o.y+a}o.y=.025*width,o.x=o.x+a}if(700<document.body.clientWidth){n.font="600  Arial",n.fillStyle="#aaa",n.fillText("日",0,1.9*a),n.fillText("二",0,3.9*a),n.fillText("四",0,5.9*a),n.fillText("六",0,7.9*a);var x,h=i.width/24;for(x in k)n.fillText(k[x],h,.7*a),h+=i.width/12}i.onmousemove=function(t){document.querySelector(".gitmessage")&&(r.innerHTML=""),u(i,t)},r.onmousemove=function(t){document.querySelector(".gitmessage")&&(r.innerHTML="")};var u=(t,e)=>{var i,n=t.getBoundingClientRect(),a=e.clientX-n.left*(t.width/n.width),o=e.clientY-n.top*(t.height/n.height);for(i of _){var l=a-i.x,d=o-i.y;0<l&&l<g&&0<d&&d<g&&(c=i.date,p=i.count,s=e.clientX-100,html=M(s,e.clientY-60,c,p),y(r,html))}}}var m,b,f,v},B=()=>{p=(0===b?(I(52),I(51),I(50),I(49),I(48),m+=d[6].count,d[6]):(I(52),I(51),I(50),I(49),(()=>{for(var t=b-1;t<f.length;t++)m+=f[t].count})(),f[b-1])).date},I=t=>{for(var e of git_data[t])m+=e.count},E=()=>{for(var t of h)x+=t.count},T=t=>{(6===b?(g=h[0].date,E):(lastweek=t.contributions[51],g=lastweek[b+1].date,E(),()=>{for(var t=b;t<u.length;t++)x+=u[t].count}))()},fetch(t).then(t=>t.json()).then(t=>{document.getElementById("github_loading")&&document.getElementById("github_loading").remove(),git_data=t.contributions,o=t.total,f=git_data[48],d=git_data[47],l=t.contributions[0],h=t.contributions[52],u=t.contributions[51],b=h.length-1,c=h[b].date,l=l[0].date,r=+c.substring(5,7),v=s.splice(r,12-r),k=v.concat(s),T(t),B();t=L(k,git_data,a,w,o,m,x,l,c,g,p);y(n,t),z()}).catch(function(t){console.log(t)}),window.onresize=function(){z()},window.onscroll=function(){document.querySelector(".gitmessage")&&(git_tooltip_container.innerHTML="")},C=(t,e)=>0===e?(parseInt(e/2),t[0]):e<2?t[1]:e<20?t[parseInt(e/2)]:t[9],M=(t,e,i,n)=>{var a="";return a+='<div class="gitmessage" style="top:'+e+"px;left:"+t+'px;position: fixed;z-index:9999"><div class="angle-wrapper" style="display:block;"><span>'+i+"&nbsp;</span><span>"+n+" 次上传</span></div></div>"},L=(t,e,i,n,a,o,l,d,r,s,c)=>{var p,g="";return p="",g+('<div class="position-relative"><div class="border py-2 graph-before-activity-overview"><div class="js-gitcalendar-graph mx-md-2 mx-3 d-flex flex-column flex-items-end flex-xl-items-center overflow-hidden pt-1 is-graph-loading graph-canvas gitcalendar-graph height-full text-center"><div id="gitcalendarcanvasbox"> <canvas id="gitcanvas" style="animation: none;"></canvas></div></div>'+(p+='<div id="git_tooltip_container"></div><div class="contrib-footer clearfix mt-1 mx-3 px-3 pb-1"><div class="float-left text-gray">数据来源 <a href="https://github.com/'+i+'" target="blank">@'+i+'</a></div><div class="contrib-legend text-gray">Less <ul class="legend"><li style="background-color:'+n[0]+'"></li><li style="background-color:'+n[2]+'"></li><li style="background-color:'+n[4]+'"></li><li style="background-color:'+n[6]+'"></li><li style="background-color:'+n[8]+'"></li></ul>More </div></div>')+"</div></div>")+('<div style="display:flex;width:100%"><div class="contrib-column contrib-column-first table-column"><span class="text-muted">过去一年提交</span><span class="contrib-number">'+a+'</span><span class="text-muted">'+d+"&nbsp;-&nbsp;"+r+'</span></div><div class="contrib-column table-column"><span class="text-muted">最近一月提交</span><span class="contrib-number">'+o+'</span><span class="text-muted">'+c+"&nbsp;-&nbsp;"+r+'</span></div><div class="contrib-column table-column"><span class="text-muted">最近一周提交</span><span class="contrib-number">'+l+'</span><span class="text-muted">'+s+"&nbsp;-&nbsp;"+r+"</span></div></div>"+S())},S=()=>style='<style>#github_container{text-align:center;margin:0 auto;width:100%;display:flex;display:-webkit-flex;justify-content:center;align-items:center;flex-wrap:wrap;}.gitcalendar-graph text.wday,.gitcalendar-graph text.month{font-size:10px;fill:#aaa;}.contrib-legend{text-align:right;padding:0 14px 10px 0;display:inline-block;float:right;}.contrib-legend .legend{display:inline-block;list-style:none;margin:0 5px;position:relative;bottom:-1px;padding:0;}.contrib-legend .legend li{display:inline-block;width:10px;height:10px;}.text-small{font-size:12px;color:#767676;}.gitcalendar-graph{padding:15px 0 0;text-align:center;}.contrib-column{text-align:center;border-top:1px dashed #818181;font-size:11px;}.contrib-column-first{border-left:0;}.table-column{padding:10px;display:table-cell;flex:1;vertical-align:top;}.contrib-number{font-weight:300;line-height:1.3em;font-size:24px;display:block;}.gitcalendar img.spinner{width:70px;margin-top:50px;min-height:70px;}.monospace{text-align:center;color:#000;font-family:monospace;}.monospace a{color:#1D75AB;text-decoration:none;}.contrib-footer{font-size:11px;padding:0 10px 12px;text-align:left;width:100%;box-sizing:border-box;height:26px;}.left.text-muted{float:left;margin-left:9px;color:#767676;}.left.text-muted a{color:#4078c0;text-decoration:none;}.left.text-muted a:hover,.monospace a:hover{text-decoration:underline;}h2.f4.text-normal.mb-3{display:none;}.float-left.text-gray{float:left;}#user-activity-overview{display:none;}.day-tooltip{white-space:nowrap;position:absolute;z-index:99999;padding:10px;font-size:12px;color:#959da5;text-align:center;background:rgba(0,0,0,.85);border-radius:3px;display:none;pointer-events:none;}.day-tooltip strong{color:#dfe2e5;}.day-tooltip.is-visible{display:block;}.day-tooltip:after{position:absolute;bottom:-10px;left:50%;width:5px;height:5px;box-sizing:border-box;margin:0 0 0 -5px;content:" ";border:5px solid transparent;border-top-color:rgba(0,0,0,.85)}.position-relative{width:100%;}@media screen and (max-width:650px){.contrib-column{display:none}}.angle-wrapper{z-index:9999;display:inline;width:200px;height:40px;position:relative;padding:5px 0;background:rgba(0,0,0,0.8);border-radius:8px;text-align:center;color:white;}.angle-box{position:fixed;padding:10px}.angle-wrapper span{padding-bottom:1em;}.angle-wrapper:before{content:"";width:0;height:0;border:10px solid transparent;border-top-color:rgba(0,0,0,0.8);position:absolute;left:47.5%;top:100%;}</style>')}