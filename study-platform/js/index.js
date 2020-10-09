/**
 * Created by wq on 2016/5/20.
 */
window.onload = function () {
    /*--------------- 变量初始化-----------------*/
    var banner_box = document.getElementById("banner_box");
    var banner = document.getElementById("banner");
    var banner_link = banner.getElementsByTagName("a")[0];
    var banner_pic = document.getElementById("banner_pic");
    var aBanner_btns = document.getElementById("banner_btns");
    var aBanner_btn = aBanner_btns.getElementsByTagName("div");
    var aBanner_pic_src = ["images/banner00.jpg","images/banner01.jpg","images/banner02.jpg","images/banner03.jpg","images/banner04.jpg","images/banner05.jpg"];
    var banner_box_bgc = ["#ffd664","#1184c7","#fed325","#1c2135","#05445F","#0297BB"];
    var banner_link_lib = ["#","#","#","#","#","#"];
    var count = -1,flag;
    /*--------------- banner图片轮播-----------------*/
    autoChange();
    flag = setInterval(autoChange,5000);
    /*-----函数定义-----*/
    function autoChange(){
        count++;
        banner_change(count%(aBanner_btn.length));
    }
    function banner_change(num){
        /*-----------初始化图片，背景和按钮的显示------------*/
        banner_pic.src = aBanner_pic_src[num];
        aBanner_btn[num].className = "banner_btn_active";
        banner_box.style.backgroundColor = banner_box_bgc[num];
        /*--------------按钮颜色的变化----------------*/
        for(var i = 0; i < aBanner_btn.length; i++){
            aBanner_btn[i].className = "banner_btn";
        }
        aBanner_btn[num].className = "banner_btn_active";

        for( i = 0; i < aBanner_btn.length; i++){
            aBanner_btn[i].index = i;
            aBanner_btn[i].onmouseover = function () {
                for(var j = 0; j < aBanner_btn.length; j++){
                    aBanner_btn[j].className = "banner_btn";
                }
                aBanner_btn[this.index].className = "banner_btn_active";
                banner_pic.src = aBanner_pic_src[this.index];
                banner_box.style.backgroundColor = banner_box_bgc[this.index];
                count = this.index;
                /*------停止计时-----*/
                clearInterval(flag);
            };
            aBanner_btn[i].onmouseout = function () {
                flag = setInterval(autoChange,5000);
            }
        }
    }
    /*--------------------hover弹框---------------------*/
    var allLesson_info = document.getElementById("allLesson_info");
    var allLesson_list_con = getByClass(allLesson_info,"allLesson_list_con");
    var allLesson_info_detail = getByClass(allLesson_info,"hid");
    function popup() {
        for(var i = 0; i< allLesson_list_con.length; i++){
            allLesson_list_con[i].index = i;
            allLesson_list_con[i].onmouseover = function () {
                for(j = 0; j < allLesson_list_con.length; j++){
                    allLesson_list_con[j].className = "allLesson_list_con";
                    allLesson_info_detail[j].className = "hid";
                }
                allLesson_list_con[this.index].className = "allLesson_list_con_hover";
                allLesson_info_detail[this.index].className = "allLesson_info_detail";
            };
            allLesson_list_con[i].onmouseout = function () {
                for(j = 0; j < allLesson_list_con.length; j++){
                    allLesson_list_con[j].className = "allLesson_list_con";
                    allLesson_info_detail[j].className = "hid";
                }
            };
        }
    }
    popup();
    /*-----------------------div滚动-----------------------------*/
    var banner_bottom = document.getElementById("banner_bottom");
    var banner_bottom_right = document.getElementById("banner_bottom_right");
    var item_container = document.getElementById("item_container");
    var oLast = document.getElementById("banner_bottom_Lbtn");
    var oNext = document.getElementById("banner_bottom_Rbtn");
    var scrollFlag1, scrollFlag2 = 0, scrollFlag3, num = 1;         //scrollFlag1控制记录图片滚动定时     scrollFlag2，scrollFlag3防止多次点击左右按钮出现加速现象
    
    /*==============================修改日期：2016.5.30====div滚动=============================*/
    banner_bottom.onmouseover = function () {
        oLast.className = "banner_bottom_btn";
        oNext.className = "banner_bottom_btn";
    };
    banner_bottom.onmouseout = function () {
        oLast.className = "hid";
        oNext.className = "hid";
    };
    oLast.onclick = function () {
        clearTimeout(scrollFlag3);
        if(scrollFlag2 == 0){
            clearInterval(scrollFlag1);
            num = -1;
            scrollFlag1 = setInterval(picScroll,20);
        }
        scrollFlag2++;
    };
    oNext.onclick = function () {
        clearTimeout(scrollFlag3);
        if(scrollFlag2 == 0){
            clearInterval(scrollFlag1);
            num = 1;
            if(banner_bottom_right.scrollLeft >= 980){
                num = 0;
            }
            scrollFlag1 = setInterval(picScroll,20);
        }
        scrollFlag2++;
    };
    scrollFlag3 = setTimeout(function () {
        scrollFlag1 = setInterval(picScroll,20);
    },3000);
    function picScroll() {
        banner_bottom_right.scrollLeft += num;
        if(banner_bottom_right.scrollLeft % 245 == 0){
            if(banner_bottom_right.scrollLeft == 0){
                num = 1;
            }else if(banner_bottom_right.scrollLeft == 980){
                num = -1;
            }
            clearInterval(scrollFlag1);
            scrollFlag3 = setTimeout(function () {
                scrollFlag1 = setInterval(picScroll,20);
            },3000);
        }
        scrollFlag2 = 0;
    }
    /*----------------------限时秒杀倒计时------------------------*/
    var daojishi = document.getElementById("time_up_container").getElementsByTagName("p")[0];
    function func_daojishi() {
        var nowTime = new Date();
        var deadLine = new Date(2016,5,20,15,15,30);
        var chaZhi = (deadLine - nowTime) / 1000;
        var daoJiTian = Math.floor(chaZhi / 86400);
        var daoJiShi = Math.floor(chaZhi % 86400 / 3600);
        var daoJiFen = Math.floor(chaZhi % 86400 % 3600 / 60);
        var daoJiMiao = Math.floor(chaZhi % 60);
        if(daoJiTian <= 0 && daoJiShi <= 0 && daoJiFen <= 0 && daoJiMiao <= 0){
            daojishi.innerHTML = "本场秒杀已结束！"
        }else {
            daojishi.innerHTML = jialing(daoJiTian) +" 天 " + jialing(daoJiShi) + " 时 " + jialing(daoJiFen) + " 分 " + jialing(daoJiMiao) + " 秒";
        }
    }
    function jialing(para) {
        return (para < 10) ? ( "0" + para) : ( "" + para);
    }
    func_daojishi();
    setInterval(func_daojishi,1000);

    /*--------------------------文字伸出-------------------------*/
    var flag2,flag3,myTop;
    var higher_lesson = document.getElementById("higher_lesson");
    var higher_lesson_txt = document.getElementById("higher_lesson_txt");
    higher_lesson.onmouseover = function () {
        clearInterval(flag3);
        flag2 = setInterval(disTxt,1);
    };
    higher_lesson.onmouseout = function () {
        clearInterval(flag2);
        flag3 = setInterval(hidTxt,6);
    };
    function disTxt(){
        if(parseInt(getComputedStyle(higher_lesson_txt).top) < 0){
            myTop = parseInt(getComputedStyle(higher_lesson_txt).top);
            myTop++;
        }else{
            clearInterval(flag2);
        }
        higher_lesson_txt.style.top = myTop + "px";
    }
    function hidTxt(){
        if(parseInt(getComputedStyle(higher_lesson_txt).top) > -180){
            myTop = parseInt(getComputedStyle(higher_lesson_txt).top);
            myTop--;
        }else{
            clearInterval(flag3);
        }
        higher_lesson_txt.style.top = myTop + "px";
    }
    /*-------------getElementsByClassName-----------*/
    function getByClass(oParent,sClass){
        var aEle = oParent.getElementsByTagName('*');      //获取父级元素下的所有元素
        var aResult = new Array();
        for(var i =0; i<aEle.length; i++){
            if(aEle[i].className == sClass){
                aResult.push(aEle[i]);
            }
        }
        return aResult;
    }
};

