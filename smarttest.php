<?php

$filename="boiler_status.txt";
$filename2="Status.json";

$content=$_GET['boiler'];
//$status=file_get_contents("php://input");

file_put_contents($filename, $content);
//file_put_contents($filename2, $status);
/*
if($_POST){
    $json_str = $_POST['status'];//file_get_contents('php://input');
    file_put_contents($filename2, json_decode($json_str));
}
*/
echo $content;

?>