// var stat = 0;

function CheckRemote() {
    //http://www.virgili.netsons.org/read_boiler_status.php
    $.get('/checkremote', function(data) {
        $('.title').css({
            'color': (data.status == '1' ? 'red' : '#bdecff')
        });
        setTimeout(CheckRemote, 1000);
    }).fail(console.log);
}