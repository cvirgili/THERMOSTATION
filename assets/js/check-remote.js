// var stat = 0;

function CheckRemote() {
    //http://www.virgili.netsons.org/read_boiler_status.php
    $.get('/checkremote', function(data) {
        $('.title').css({
            'color': (data.status == '1' ? 'red' : '#bdecff')
        });
        // if (data.status != stat) {
        //     $.get('HTTP://192.168.0.10/gpio/' + data.status, function(res) {
        //         console.log("remote", res);
        //     });
        //     stat = data.status;
        // }
        setTimeout(CheckRemote, 1000);
    });
}