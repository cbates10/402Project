<?php

include 'DatabaseInfo.php';

$con = new mysqli($servername, $sqlusername, $sqlpassword, $database);

$con = mysqli_connect($servername, $sqlusername, $sqlpassword, $database);

if($con->connect_errno) {
	die("Failed to connect to MYSQL: ($mysql->connect_errno) $mysqli->connect_error");
}

if(isset($_POST["removedIds"])) {
	// Remove the catalogs from the object 
	$sql = "DELETE FROM objectmapping WHERE idObjectDegree = ? AND idObjects = ?";

	$stmt = $con->prepare($sql);
	if(!$stmt) {
		die("Could not prepare statement $con->error");
	}
	foreach($_POST["removedIds"] as $objectId) {
		if(!$stmt->bind_param("ii", $_POST["objectId"], $objectId)) {
			die("Could not bind parameters $stmt->error");
		}
		$rc = $stmt->execute();
		if(false === $rc) {
			die("Could not execute statement $stmt->error");
		}
		$stmt->free_result();
	}

	$stmt->close();
}

if(isset($_POST["addedIds"])) {
	// Remove the catalogs from the object 
	$sql = "INSERT INTO objectmapping (idObjectDegree, idObjects) VALUES (?, ?)";

	$stmt = $con->prepare($sql);
	if(!$stmt) {
		die("Could not prepare statement $con->error");
	}
	foreach($_POST["addedIds"] as $objectId) {
		if(!$stmt->bind_param("ii", $_POST["objectId"], $objectId)) {
			die("Could not bind parameters $stmt->error");
		}
		$rc = $stmt->execute();
		if(false === $rc) {
			die("Could not execute statement $stmt->error");
		}
		$stmt->free_result();
	}

	$stmt->close();
}
$con->close();

echo json_encode("success");

?>
