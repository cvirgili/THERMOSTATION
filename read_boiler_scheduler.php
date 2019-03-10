<?php

	header("Access-Control-Allow-Origin:*");

	header("Content-Type: text/plain");

	// $filename="Status.json";

	// $myfile = fopen($filename, "r") or die("Unable to open file!");

	// echo fread($myfile,filesize($filename));

	// fclose($myfile);

	echo $GLOBALS["scheduler"];

?>