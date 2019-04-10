<?php

include 'DatabaseInfo.php';

$con = new mysqli($servername, $sqlusername, $sqlpassword, $database);

$con = mysqli_connect($servername, $sqlusername, $sqlpassword, $database);

if($con->connect_errno) {
	die("Failed to connect to MYSQL: ($mysql->connect_errno) $mysqli->connect_error");
}

if(isset($_POST["removedHours"])) {
	// Remove the catalogs from the object 
	$sql = "DELETE FROM hoursbylevel WHERE idObjects = ? AND hourLevel = ? AND cap = ?";

	$stmt = $con->prepare($sql);
	if(!$stmt) {
		die("Could not prepare statement $con->error");
	}
	foreach($_POST["removedHours"] as $hourInfo) {
		if(!$stmt->bind_param("iss", $_POST["objectId"], $hourInfo["hour"], $hourInfo["cap"])) {
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

if(isset($_POST["addedHours"])) {
	// Insert the catalogs 
	$sql = "INSERT INTO hoursbylevel (idObjects, hours, type, cap, hourLevel) VALUES (?, ?, ?, ?, ?)";

	$stmt = $con->prepare($sql);
	if(!$stmt) {
		die("Could not prepare statement $con->error");
	}
	foreach($_POST["addedHours"] as $hourInfo) {
		if(!$stmt->bind_param("idsss", $_POST["objectId"], $hourInfo["val"], $hourInfo["type"], $hourInfo["cap"], $hourInfo["hour"])) {
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

if(isset($_POST["modifiedHours"])) {
	// Update the modified course overrides
	$sql = "UPDATE hoursbylevel SET hours = ?, type = ? WHERE idObjects = ? AND cap = ? AND hourLevel = ?";

	$stmt = $con->prepare($sql);
	if(!$stmt) {
		die("Could not prepare statement $con->error");
	}
	foreach($_POST["modifiedHours"] as $hourInfo) {
		if(!$stmt->bind_param("dsiss", $hourInfo["val"], $hourInfo["type"], $_POST["objectId"], $hourInfo["cap"], $hourInfo["hour"])) {
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
