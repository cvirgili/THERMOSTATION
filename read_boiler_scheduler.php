<?php

	header("Access-Control-Allow-Origin:*");

	header("Content-Type: text/plain");

	include 'db-settings.php';
	
	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname, $port);
	// Check connection
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	} 
	
	$sql = "SELECT * FROM THERMOSTATION WHERE ID=0";
	
	$result = $conn->query($sql);

if ($result->num_rows > 0) {
	while($row = $result->fetch_assoc()) {
		echo $row["SCHEDULER"];
	}
	} else {
		echo "Error updating record: " . $conn->error;
	}
	
	$conn->close();

?>