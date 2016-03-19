$(function() {

    setInterval(moveDiv, 2000);
    // moveDiv()

    function moveDiv() {
        $('.test').animate({
            left: '200px'
        }, 5000, alertLog);
    }

    function alertLog() {
        alert('tip');
    }
    // $()
});
