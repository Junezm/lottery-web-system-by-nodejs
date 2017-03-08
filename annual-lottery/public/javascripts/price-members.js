//记录空格奇偶，判断开始暂停; 取随机数定时器;抽奖轮数
var blankKey=0,timer;
//随机取值
function getRandomArr() {
    $.get("../marquee/s-generate-choices", function (resp) {

        var allTd=$('td');
        for(var i=0;i<allTd.length;i++){
            $(allTd[i]).removeClass('choose');
        }
        console.log(resp.choices.length);
        resp.choices.forEach(function (choice) {
            $('td[data-id="'+choice+'"]').addClass('choose');
        });
    });
}

// 将已经中奖的人员删除
var deleteWinPricePeople=function(){
    var winPrice=$('.choose');
    var price_arr = new Array();
    $("#mask").css("height",$(document).height());
    $("#mask").css("width",$(document).width());
    $("#mask").fadeIn(1500);
    for (var i = 0; i < winPrice.length; i++) {
        //console.log(winPrice[i])
        var winPriceName = $(winPrice[i]).text();
        var winPriceId   = $(winPrice[i]).attr('data-id');
        var winPriceLeft = $(winPrice[i]).css('left');
        var winPriceTop  = $(winPrice[i]).css('top');
        var tdTop    = $(winPrice[i]).offset().top;
        var tdLeft   = $(winPrice[i]).offset().left;
        price_arr[i] = winPriceId;
        $(winPrice[i]).wrap('<td class="win-price choose-point-' + i + '" style="left:' + winPriceLeft + ';top:' + winPriceTop + '" data-id="'+winPriceId+'"><span class="choose-point ">' + winPriceName + '</span></td>');
        $("body").append('<div class="back-price" style="left:' + tdLeft + 'px;top:' + tdTop + 'px"><span class=" ">' + winPriceName + '</span></div>')
        $(winPrice[i]).remove();
        $('.back-price').animate({fontSize: "21px"}, 1000);
        //console.log(winPriceName)
    }
    console.log('中奖人员：'+price_arr.join(',')+"共有"+price_arr.length+"");
//  保存获奖名单
    $.ajax({
        type: 'POST',
        url: '../marquee/s-dump-choices',
        data: {"members": price_arr.join(',')},
        success: function (res) {
            if (res.retCode == 0) {
                console.log('保存成功');
            } else {
                console.log(res.retCode)
            }
        },
        error: function () {
        }
    });
};
$(document).keydown(function(e){
    if(e.keyCode==32){
        var supernatant=$("#mask")[0];
        if ($(supernatant).css("display")=='block') {
            console.log("阻止空格事件");
            e.stopPropagation();//当前抽中奖后,阻止空格事件，继续抽奖
        }else{
            if(blankKey%2==0){
                timer= setInterval(function(){getRandomArr()},100);
                blankKey++;
                console.log("开始抽奖")
            }else if(blankKey%2==1){
                console.log(blankKey);
                clearInterval(timer);
                console.log("结束抽奖");
                setTimeout(function(){deleteWinPricePeople();},500);
                blankKey++;
            }
        }
    }
    else if (e.keyCode==13){ //回车键的键值为13
        $('#mask').fadeOut(1000);
        $('.back-price span').animate({fontSize:"14px"},1000,function(){
            $('.back-price').remove();
            $('.price-img').remove();
        });
        $('.win-price').css({
            "color":"white",
            "background-image":"url(images/33.png)"
        });
    }
});
