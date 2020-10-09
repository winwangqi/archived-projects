/**
 * Created by wq on 2016/6/2.
 */
/*---------------------------------getElementsByClassName--------------------------------*/
function getElementsByClassName(node, classname) {
    // if(node.getElementsByClassName){
    //     return node.getElementsByClassName(classname);
    // }else{
        var results = [];
        var elems = node.getElementsByTagName("*");
        for (var i = 0; i < elems.length; i++){
            if(elems[i].className.indexOf(classname) != -1){
                results[results.length] = elems[i];
            }
        }
        return results;
    // }
}
/*----------------------------------------初始化------------------------------------------*/
var oUser = document.getElementById("user");
var oPassword = document.getElementById("password");
var oConfirm = document.getElementById("confirm");
var oTel = document.getElementById("tel");
var oMail = document.getElementById("mail");
var aHintInfo = getElementsByClassName(document.getElementsByTagName("form")[0],"hid");
var aError = getElementsByClassName(document.getElementsByTagName("form")[0],"error");
var aSection = document.getElementsByTagName("section");

aError[0].className = "hid";
aError[1].className = "hid";
aError[2].className = "hid";
/*----------------------------------END---初始化---END------------------------------------*/
/*---------------------focus&blur-----------------------*/
function foucsFunc(obj, num) {
    obj.onfocus = function () {
        obj.placeholder = "";
        aHintInfo[num].className = "hintInfo";
        if(aError[num].className == "error"){
            aHintInfo[num].className = "hid";
        }
    }
}
function blurFunc(obj, num, str) {
    obj.onblur = function () {
        obj.placeholder = str;
        aHintInfo[num].className = "hid";
    }
}
foucsFunc(oUser,0);
blurFunc(oUser,0,"您的账户名和登录名");

foucsFunc(oPassword,1);
blurFunc(oPassword,1,"建议至少使用两种字符组合");

foucsFunc(oConfirm,2);
blurFunc(oConfirm,2,"请再次输入密码");

foucsFunc(oTel,3);
blurFunc(oTel,3,"建议使用常用手机");

foucsFunc(oMail,4);
blurFunc(oMail,4,"建议使用常用邮箱");
/*---------------END---focus&blur---END-----------------*/

/*-------------------输入字符验证---------------------*/
function strCheck(obj, length, num, infoStr) {
    obj.onblur = function () {
        var str = obj.value;
        if((str.length < length && str.length > 0) || str.length > 20){
            aHintInfo[num].className = "hid";
            aSection[num].style.border = "1px red solid";
            aError[num].className = "error";

        }else{
            aHintInfo[num].className = "hid";
            aSection[num].style.border = "1px gainsboro solid";
            aError[num].className = "hid";
            if(str.length == 0){
                obj.placeholder = infoStr;
            }
        }
    };
}
strCheck(oUser, 4, 0, "您的账户名和登录名");
strCheck(oPassword, 6, 1, "建议至少使用两种字符组合");
/*-------------END---输入字符验证---END---------------*/

/*------------------密码验证-------------------*/
oConfirm.onchange = function () {
    var str1 = oPassword.value;
    var str2 = oConfirm.value;
    if(str1 != str2){
        aHintInfo[2].className = "hid";
        aSection[2].style.border = "1px red solid";
        aError[2].className = "error";
    }else{
        aHintInfo[2].className = "hid";
        aSection[2].style.border = "1px gainsboro solid";
        aError[2].className = "hid";
    }
};
/*--------------END--密码验证--END----------------*/










