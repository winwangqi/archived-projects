window.onload = function () {

    function getMsg() {
        $.ajax({
            url: '/data',
            type: 'GET',
            cache: false,
            success: function (msg) {
                App.info = msg;
            }
        });
    }

    Vue.use(VueMaterial);

    var App = new Vue({
        el: '#app',
        data: {
            info: {}
        }
    });

    getMsg();

    setInterval(getMsg, 1000);
};