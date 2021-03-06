<?php

include 'DatabaseInfo.php';

$con = new mysqli($servername, $sqlusername, $sqlpassword, $database);

$con = mysqli_connect($servername, $sqlusername, $sqlpassword, $database);

if($con->connect_errno) {
	die("Failed to connect to MYSQL: ($mysql->connect_errno) $mysqli->connect_error");
}

$sql = "INSERT INTO committeemapping (subjectName, memberId, idTitle) VALUES (? , ?, ?)";

$stmt = $con->prepare($sql);
if(!$stmt) {
	die("Could not prepare statement $con->error");
}
if(!$stmt->bind_param("sis", $_POST["subject"], $_POST["id"], $_POST["title"])) {
	die("Could not bind parameters $stmt->error");
}
$rc = $stmt->execute();
if(false === $rc) {
	die("Could not execute statement $stmt->error");
}

$stmt->close();
$con->close();

echo json_encode("success");

?>
