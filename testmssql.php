
<?php


header("Access-Control-Allow-Origin:*");

header("Content-Type: text/plain");

$myServer = "62.149.153.28";
$myUser = "MSSql187380";
$myPass = "u4uc43436l";
$myDB = "MSSql187380";


$serverName = $myServer; //serverName\instanceName

// Since UID and PWD are not specified in the $connectionInfo array,
// The connection will be attempted using Windows Authentication.
$connectionInfo = array( "Database"=>$myDB, "UID"=>$myUser, "PWD"=>$myPass);
$conn = sqlsrv_connect( $serverName, $connectionInfo);

if( $conn ) {
     echo "Connection established";
}else{
     echo "Connection could not be established";
     die( print_r( sqlsrv_errors(), true));
}


?>