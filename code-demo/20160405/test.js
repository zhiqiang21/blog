$(function(){
    $('.body-div').on('click','.btn',btnClick);
    $('.body-div').on('click','.layer',hideLayer);


    function btnClick(){
        // $('.layer').show();
        alert('我是按钮')
    }


    function hideLayer(){
        // $('.layer').hide();
        alert('我是弹层')
    }
});

/**
 * @file nishi
 * @date 2018/03/23
 * @author houzhiqiang@sogou-inc.com
 */

