<?php
header("Access-Control-Allow-Origin:*");
header("Content-Type: text/plain");
$filename="Status.json";
$post = file_get_contents("php://input");
$_SERVER["boiler-status"]=$post;
echo $post;
file_put_contents($filename, $post);
?>