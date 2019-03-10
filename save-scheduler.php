<?php
header("Access-Control-Allow-Origin:*");
header("Content-Type: text/plain");


$post = file_get_contents("php://input");


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

$sql = "UPDATE thermostation SET SCHEDULER='$post' WHERE ID=0";

if ($conn->query($sql) === TRUE) {
    //echo "Record updated successfully";
    echo $post;
} else {
    echo "Error updating record: " . $conn->error;
}

$conn->close();


?>