<?php
header("Access-Control-Allow-Origin:*");
header("Content-Type: text/plain");


//$post = file_get_contents("php://input");
$post = $_GET["status"];


include "db-settings.php";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname,$port);
// Check connection
if ($conn->connect_error) {
    echo "connection ERROR";
    die("Connection failed: " . $conn->connect_error);
} 
//$sql = "UPDATE THERMOSTATION SET STATUS='$post' WHERE ID=0";
$sql="UPDATE `$dbname`.`THERMOSTATION` SET `STATUS` = '$post' WHERE `THERMOSTATION`.`ID` = 0;";

if ($conn->query($sql) === TRUE) {
    //echo "Record updated successfully";
    echo $post;
} else {
    echo "Error updating record: " . $conn->error;
}

$conn->close();


?>