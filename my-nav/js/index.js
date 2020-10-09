/**
 * Created by wangqi on 2016/7/30.
 */

/* common B */
function getById(str){
    return document.getElementById(str);
}
/* common E */

/* 输出所有内容 B */
(function(){
    var box_ct = getById('box-ct').innerHTML;
    getById('all-ct').innerHTML = '';
    for(var secK in data){      // data 中的 key
        var sec = data[secK];   // sec 为 data 中 key 的 value
        var ct = sec.content;   // ct 为 sec 中 key 的
        var itms = [];
        for(var ctK in ct){
            var itm = ct[ctK];
            var _new_itm = box_ct
                    .replace('{{itm-href}}',itm.href)
                    .replace('{{itm-img}}',itm.img)
                    .replace('{{itm-alt}}',itm.desc)
                    .replace('{{itm-desc}}',itm.desc);
            itms.push(_new_itm);
        }
        var box_tit = '<h3 class="box-tit" id="box-tit">'
                        + sec.title +
                        '</h3>';
        var new_box_ct = '<div class="box-ct" id="box-ct">'
                            + itms.join('') +
                            '</div>';
        var sec_ct = '<section class="bx clearfix '
                        + sec.name + '" id="sec-ct">' + box_tit + new_box_ct +
                        '</section>';
        getById('all-ct').innerHTML += sec_ct;
    }

})();
/* 输出所有内容 E */

/* item:hover-style B 此函数需在内容输出函数之后 */
(function(){
    var ct_itms = document.getElementsByClassName("ct-itm");
    for(var i = 0; i < ct_itms.length; i++){
        ct_itms[i].onmouseover = function(){
            this.getElementsByTagName("img")[0].className = "hover";   // 鼠标hover_itm，图片放大
            this.getElementsByTagName("p")[0].className = "hover";  // 鼠标hover_itm，文字变红
            this.getElementsByClassName("img-wrap")[0].className = "img-wrap hover";  // 鼠标hover_itm，img-wrap 加边框
        };
        ct_itms[i].onmouseout = function(){
            this.getElementsByTagName("img")[0].className = "";
            this.getElementsByTagName("p")[0].className = "";
            this.getElementsByClassName("img-wrap")[0].className = "img-wrap";
        };
    }
})();
/* item:hover-style E */