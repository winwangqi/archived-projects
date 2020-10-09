$(function () {
    /* 滚动一定距离顶部固定 */
    $(window).on("scroll", function () {
        if ($(window).width() < 640) {
            if ($(this).scrollTop() >= $("header").height()) {
                var $mobileTxt = $(".banner .mobile-txt");
                $mobileTxt.css({position: "fixed", top: 0, width: "100%"});
                $(".banner img").css({paddingTop: $mobileTxt.height()});
            } else {
                $(".banner .mobile-txt").css("position", "static");
                $(".banner img").css({paddingTop: 0});
            }
        }
    });

    $(window).on("resize", function () {
        // 设备屏幕小于640px
        if ($(window).width() > 640) {
            $(".banner img").css({paddingTop: 0});
        }
    });

    (function () {
        var index = 0;

        /* 切换电机 */
        var deskImg = ["images/chassis-motor-dual.jpg", "images/chassis-motor-p90d.jpg", "images/chassis-motor-single.jpg"],
            mobileImg = ["images/chassis-motor-dual-vertical.jpg", "images/chassis-motor-p90d-vertical.jpg", "images/chassis-motor-single-vertical.jpg"],
            mobileTxt = ["双电机", "P 90 D", "单电机"];

        // 桌面版电机切换
        $(".desk-engine li").on("click", function () {
            index = $(this).index();
            $(this).addClass("active").siblings().removeClass("active");
            $(".desk-engine img").attr("src", deskImg[index]);
        });

        // 移动版电机切换
        $(".mobile-engine li").on("click", function () {
            index = $(this).index();
            $(this).addClass("active").siblings().removeClass("active");
            $(".mobile-engine img").attr("src", mobileImg[index]);
            $(".mobile-engine p").html(mobileTxt[index]);
        });
        // 点击箭头切换图片
        $(".mobile-engine .left-arrow").on("click", function () {
            index = (--index) % 3;
            $(".mobile-engine li").eq(index).trigger("click");
        });
        $(".mobile-engine .right-arrow").on("click", function () {
            index = (++index) % 3;
            $(".mobile-engine li").eq(index).trigger("click");
        });
    })();
});