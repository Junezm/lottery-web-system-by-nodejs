// 构造9*16的table
function createTable(rowCount,cellCount)
{
    var table=$("<table style='padding-top:70px;position:fixed;left:132px'>");
    table.appendTo($("#createtable"));
    for(var i=0;i<rowCount;i++)
    {
        var tr=$("<tr class=tr-"+i+"></tr>");
        tr.appendTo(table);
        for(var j=0;j<cellCount;j++)
        {
            var td=$("<td class='left-"+j+" top-"+i+" num-"+(15*(i+1)-14+j)+"' style='left:"+14*(-j)+"px;top:"+15*(-i)+"px'><span class='choose-point'></span></td>");
            td.appendTo(tr);
        }
    }
    $("#createtable").append("</table>");
}
createTable(10,15);
// 替换中间遮挡logo的部分
var deletePart=[67,68,69,82,83,84,97,98,99,112,113,114,127,128,129,143];
function replaceTd(){
    for(k=0;k<deletePart.length;k++){
        var deleteName=$(".num-"+deletePart[k]).text();
        var deleteLeft=$(".num-"+deletePart[k]).css('left');
        var deleteTop=$(".num-"+deletePart[k]).css('top');
        $(".num-"+deletePart[k]).wrap('<div class="delete-part" style="left:'+deleteLeft+';top:'+deleteTop+'"><span class="choose-point">'+deleteName+'</span></div>');
        $(".num-"+deletePart[k]).remove();
    }
}
replaceTd();
// 重新遍历td赋值
var nameData;
function reValue(){
    var allTd=$('td');
    for(var i=0;i<allTd.length;i++){
        $(allTd[i]).attr('data-id',nameData[i].id);
        $(allTd[i]).find('span').html(nameData[i].name)
    }
}
//将已经中奖的人拉黑
function pushDie(){
    var nameTd=$('td');
    for(var j=0;j<nameTd.length;j++){
        if(nameData[j].choice){
            var winPriceName=$(nameTd[j]).text();
            var winPriceLeft=$(nameTd[j]).css('left');
            var winPriceTop=$(nameTd[j]).css('top');
            $(nameTd[j]).wrap('<td class="win-price choose-point-'+j+'" style="left:'+winPriceLeft+';top:'+winPriceTop+'"><span class="choose-point ">'+winPriceName+'</span></td>')
            $(nameTd[j]).remove()
        }
    }
}
//拉取所有成员名单
$.ajax( {
    type:'GET',
    url:'../marquee/s-members',
    success:function(res) {
        if(res.retCode == 0 ){
            nameData=res.members;
            reValue();
            pushDie()
        }else{
            console.log(res.retCode)
        }
    },
    error : function() {
    }
});
