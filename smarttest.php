<?php

$filename="boiler_status.txt";
$filename2="Status.json";

$content=$_GET['boiler'];
//$status=file_get_contents("php://input");

file_put_contents($filename, $content);
$jsonString = file_get_contents($filename2);
$data = json_decode($jsonString, true);
$data['remoterelay'] = (int)$content;
file_put_contents($filename2, json_encode($data));

echo $content;

?>