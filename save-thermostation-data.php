<?php

$filename="Status.json";
$post = file_get_contents("php://input");
echo $post;
file_put_contents($filename, $post);
?>