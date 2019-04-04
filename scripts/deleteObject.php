<?php
	
include 'DatabaseInfo.php';

$mysqli = new mysqli($servername, $sqlusername, $sqlpassword, $database);

if($mysqli->connect_errno) {
	die("Failed to connect to MYSQL: ($mysqli->connect_errno) $mysqli->connect_error");
}

$idObject = $_POST["idObject"];

$sqlDelete = "DELETE FROM objects WHERE idObjects = ?";
$stmtDelete = $mysqli->prepare($sqlDelete);
if(!$stmtDelete) {
	die("Could not prepare statement $mysqli->error");
}

if(!$stmtDelete->bind_param("i", $idObject)) {
	die("Could not bind parameters $stmtTypeId->error");
}

$rc = $stmtDelete->execute();

$stmtDelete->close();
$mysqli->close();

?>