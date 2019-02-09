<?php

$filename="Status.json";
$post = file_get_contents("php://input");
file_put_contents($filename, $post);
echo $post;
?>