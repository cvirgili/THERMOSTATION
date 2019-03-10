<?php

	header("Access-Control-Allow-Origin:*");

	header("Content-Type: text/plain");

	// $filename="Status.json";

	// $myfile = fopen($filename, "r") or die("Unable to open file!");

	// echo fread($myfile,filesize($filename));

	// fclose($myfile);
	$servername = "localhost";
	$username = "chnlwysx_wp656";
	$password = "m@tr966280";
	$dbname = "chnlwysx_wp656";
	
	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname);
	// Check connection
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	} 
	
	$sql = "SELECT STATUS FROM thermostation WHERE ID=0";
	
	$result = $conn->query($sql);

if ($result->num_rows > 0) {
	while($row = $result->fetch_assoc()) {
		echo $row["STATUS"];
	}
	} else {
		echo "Error updating record: " . $conn->error;
	}
	
	$conn->close();

?>