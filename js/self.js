/**
 * Created by lenovo on 2016/9/18.
 */

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
window.onload=function (){
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
        var oLa=getByClass(getId('practice'),'la')[0];
        alert(oLa.length);
        var oList=getByClass(getId('practice'),'list')[0];
        oLa.onclick=function(){

            move(oList,{left:0});
        };
    })();

    var oLa=getByClass(getId('practice'),'la')[0];
    alert(oLa.length);
    var oList=getByClass(getId('practice'),'list')[0];
    oLa.onclick=function(){

        alert(1);
    };




};


























