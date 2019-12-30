<?php

	header("Access-Control-Allow-Origin:*");

	header("Content-Type: text/plain");

	include 'db-settings.php';
	
	//$table=$_GET["table"];
	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname,$port);
	// Check connection
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	} 
	
	$sql = "SELECT * FROM THERMOSTATION WHERE ID=0";
	
	$result = $conn->query($sql);

if ($result->num_rows > 0) {
	while($row = $result->fetch_assoc()) {
		//echo $row[$table];
		echo "{\"status\":".$row["STATUS"].",\"scheduler\":".$row["SCHEDULER"]."}";
	}
	} else {
		echo "Error: " . $conn->error;
	}
	
	$conn->close();

?>