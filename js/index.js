function getStyle(obj,name){
    return (obj.currentStyle||getComputedStyle(obj,false))[name];
}
function move(obj,json,options){
    options=options||{};
    options.duration=options.durations||700;
    options.easing=options.easing||'ease-out';
    var start={};
    var dis={};
    for(var name in json){
        start[name]=parseFloat(getStyle(obj,name));
        dis[name]=json[name]-start[name];
    }
    var count=Math.floor(options.duration/30);
    var n=0;

    clearInterval(obj.timer);
    obj.timer=setInterval(function (){
        n++;

        for(var name in json){
            switch(options.easing){
                case 'linear':
                    var cur=start[name]+dis[name]*n/count;
                    break;
                case 'ease-in':
                    var a=n/count;
                    var cur=start[name]+dis[name]*Math.pow(a,3);
                    break;
                case 'ease-out':
                    var a=1-n/count;
                    var cur=start[name]+dis[name]*(1-Math.pow(a,3));
                    break;
            }

            if(name=='opacity'){
                obj.style.opacity=cur;
                obj.style.filter='alpha(opacity:'+cur*100+')';
            }else{
                obj.style[name]=cur+'px';
            }
        }

        if(n==count){
            clearInterval(obj.timer);
            options.complete&&options.complete();
        }
    },30);
}

function getId(id){
    return document.getElementById(id);
}
function rnd(n,m){
    return parseInt(Math.random()*(m-n))+n;
}
function getByClass(obj,sClass){
    if(obj.getElementsByClassName){
        return obj.getElementsByClassName(sClass);
    }
    var arr=[];
    var aEle=obj.getElementsByTagName('*');
    var re=new RegExp('\\b'+sClass+'\\b');
    for(var i=0;i<aEle.length;i++){
        if(aEle[i].className.search(re)!=-1){
            arr.push(aEle[i]);
        }
    }
    return arr;
}
/*穿墙*/
function getDir(obj,ev){
    var x=obj.getBoundingClientRect().left+obj.offsetWidth/2-ev.clientX;
    var y=obj.getBoundingClientRect().top+obj.offsetHeight/2-ev.clientY;
    return Math.round((Math.atan2(y,x)*180/Math.PI+180)/90)%4;
}
function through(obj){
    obj.onmouseenter=function (ev){
        var oLi=obj.children[1];
        var oEvent=ev||event;
        var dir=getDir(obj,oEvent);
        switch(dir){
            case 0:
                oLi.style.left='100px';
                oLi.style.top=0;
                break;
            case 1:
                oLi.style.left=0;
                oLi.style.top='140px';
                break;
            case 2:
                oLi.style.left='-100px';
                oLi.style.top=0;
                break;
            case 3:
                oLi.style.left=0;
                oLi.style.top='-140px';
                break;
        }
        move(oLi,{left:0,top:0})
    };
    obj.onmouseleave=function (ev){
        var oLi=obj.children[1];
        var oEvent=ev||event;
        var dir=getDir(obj,oEvent);
        switch(dir){
            case 0:
                move(oLi,{top:0,left:100});
                break;
            case 1:
                move(oLi,{top:140,left:0});
                break;
            case 2:
                move(oLi,{top:0,left:-100});
                break;
            case 3:
                move(oLi,{top:-140,left:0});
                break;
        }
    };
}




window.onload=function(){
    /*穿墙*/
    (function(){
        var aLi=getByClass(getId('practice'),'list')[0].getElementsByTagName('li');
        for(var i=0; i<aLi.length; i++){
            through(aLi[i]);
        }
    })();

    (function(){
        var aLi=getByClass(getId('practice'),'list')[0].getElementsByTagName('li');
        for(var i=0;i<aLi.length;i++){
            aLi[i].onmousemove=function(){
                this.children[1].style.display='none';
                /*.list:active img{ transform: rotateX(82deg); transform-origin: center bottom 0; transition: 0.4s;}*/
                this.children[0].style.transform='rotateX(82deg)';
                this.children[0].style.transformOrigin='center bottom 0';
                this.children[0].style.transition='1s all ease';


            };
            aLi[i].onmouseout=function(){
                this.children[1].style.display='block';
                /*.list:active img{ transform: rotateX(82deg); transform-origin: center bottom 0; transition: 0.4s;}*/
                this.children[0].style.transform='rotateX(0deg)';
                this.children[0].style.transformOrigin='center center 0';
                this.children[0].style.transition='1s all ease';

            };
        }
    })();

    /*分页选项卡*/
    (function(){
        var aUl=getByClass(getId('practice'),'list')[0].getElementsByTagName('ul');
        var aA=getByClass(getId('practice'),'list')[0].getElementsByTagName('a');
        var oPrev=getByClass(getId('practice'),'prev')[0];
        var oNext=getByClass(getId('practice'),'next')[0];
        var iNow=0;
        oPrev.onclick=function(){
            iNow--;
            if(iNow<0){
                iNow=0;
            }
            tab();
        };
        oNext.onclick=function(){
            iNow++;
            if(iNow>3){
                iNow=2;
            }
            tab();
        };

        for(var i=0;i<3;i++){
            (function(index){
                aA[i+1].onclick=function(){
                    tab();
                    iNow=index;
                };
            })(i);
        }

        function tab(){
            for(var i=0;i<3;i++){
                aUl[i].className='';
                aA[i+1].className='';
            }
            aUl[iNow].className='on';
            aA[iNow+1].className='active';
        }
    })();



    (function(){
        var oPra=getId('practice');
        oPra.onmouseover=function(){
            move(oPra,{left:-300});
        };
        oPra.onmouseout=function(){
            move(oPra,{left:-815});
        };
    })();

    /*3d旋转拖拽*/
    (function(){
        var oBox=document.getElementById('drag'),
            speedX=0,//在y轴上旋转的速度
            speedY=0,//在x轴上旋转的速度
            lastX=0,
            lastY=0,
            timer=null,
            N=11,
            y=0,//在x轴上旋转的角度
            x=0,//在y轴上旋转的角度
            ready=false;
        for(var i=0; i<N; i++){
            var oLi=document.createElement('li');
            oLi.style.backgroundImage='url(img2/'+(i+1)+'.jpg)';
            oLi.style.transition='1s all linear '+(N-i)*200+'ms';
            (function(oLi,i){
                setTimeout(function(){
                    oLi.style.transform='perspective(1200px) rotateY('+360/N*i+'deg) translateZ(250px)';
                }, 0)
            })(oLi,i)

            oBox.appendChild(oLi);
        }
        var aLi=oBox.children;
        //监听牌发完
        aLi[0].addEventListener('transitionend',function(){
            //1. 透明度
            //2. 干掉transition
            for(var i=0; i<aLi.length; i++){
                aLi[i].style.transition='none';
                aLi[i].style.opacity=Math.abs(Math.abs((360/N*i+x/6)%360)-180)/180;
            }
            //3. 用户是否可以拖拽
            ready=true;
        },false);

        //左右拖拽
        document.onmousedown=function(ev){
            if(!ready)return;
            clearInterval(timer);
            var disX=ev.clientX-x;
            var disY=ev.clientY-y;
            document.onmousemove=function(ev){
                //求速度
                speedX=ev.clientX-lastX;
                speedY=ev.clientY-lastY;

                lastX=ev.clientX;
                lastY=ev.clientY;

                y=ev.clientY-disY;
                x=ev.clientX-disX;
                for(var i=0; i<aLi.length; i++){
                    aLi[i].style.transform='perspective(2000px) rotateY('+(360/N*i+x/6)+'deg) translateZ(250px)';
                    aLi[i].style.opacity=Math.abs(Math.abs((360/N*i+x/6)%360)-180)/180;
                }
                oBox.style.transform='perspective(800px) rotateX('+(-y/6-15)+'deg)';
            };
            document.onmouseup=function(){
                timer=setInterval(function(){
                    speedX*=0.95;
                    speedY*=0.95;
                    x+=speedX;
                    y+=speedY;
                    for(var i=0; i<aLi.length; i++){
                        aLi[i].style.transform='perspective(2000px) rotateY('+(360/N*i+x/6)+'deg) translateZ(250px)';
                        aLi[i].style.opacity=Math.abs(Math.abs((360/N*i+x/6)%360)-180)/180;
                    }
                    oBox.style.transform='perspective(800px) rotateX('+(-y/6-15)+'deg)';

                    if(Math.abs(speedX)<1 && Math.abs(speedY)<1){
                        clearInterval(timer);
                    }
                }, 16);
                document.onmouseup=null;
                document.onmousemove=null;
            };
            return false;
        };
    })();


    (function(){
        var oBox=getId('con');
        var aCon=getByClass(getId('about'),'con');
        var aLi=getByClass(getId('about'),'intro')[0].getElementsByTagName('li');
        for(var i=0;i<aLi.length;i++){
            (function(index){
                aLi[i].onclick=function(){
                    for(var i=0;i<aLi.length;i++){
                        aCon[i].className='con';
                        move(aCon[i],{opacity:0});
                    }
                    move(aCon[index],{opacity:1});
                };
            })(i);
        }







        //var oSpan=getByClass(getId('about'),'nav')[0].getElementsByTagName('span')[0];
       /* var C=7;
        var R=4;
        var W=oBox.offsetWidth;
        var H=oBox.offsetHeight;
        var w=W/C;
        var h=H/R;
        var ready=true;
        var inow=0;
        for(var c=0; c<C; c++){
            for(var r=0; r<R; r++){
                var oSpan=document.createElement('span');
                oSpan.style.width=w+'px';
                oSpan.style.height=h+'px';

                oSpan.style.top=r*h+'px';
                oSpan.style.left=c*w+'px';

                oSpan.style.backgroundPosition=-c*w+'px '+(-r*h)+'px';

                oBox.appendChild(oSpan);
            }
        }

        var aSpan=oBox.children;
        for(var i=0;i<aLi.length;i++){
            aLi[i].onclick=function(){
                if(!ready)return;
                ready=false;
                inow++;
                //oBox.style.backgroundColor='pink';
                for(var i=0; i<aSpan.length; i++){
                    aSpan[i].style.transition='1s all linear';
                    var x=aSpan[i].offsetLeft-W/2+w/2;
                    var y=aSpan[i].offsetTop-H/2+h/2;
                    aSpan[i].style.opacity=0;
                    aSpan[i].style.transform='scale(1.4) translate('+x+'px,'+y+'px) rotateX('+rnd(-180,180)+'deg) rotateY('+rnd(-180,180)+'deg)';


                }
            };
        }
        aSpan[0].addEventListener('transitionend',function(){
            for(var i=0; i<aSpan.length; i++){
                aSpan[i].style.transition='none';
                aSpan[i].style.opacity=1;
                //aSpan[i].style.backgroundColor='pink';
                aSpan[i].style.transform='scale(1) translate(0px,0px) rotateX(0deg) rotateY(0deg)';
            }
            ready=true;
        },false)*/
    })();



};