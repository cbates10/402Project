<?php

include 'DatabaseInfo.php';

$con = new mysqli($servername, $sqlusername, $sqlpassword, $database);

$con = mysqli_connect($servername, $sqlusername, $sqlpassword, $database);

if($con->connect_errno) {
	die("Failed to connect to MYSQL: ($mysql->connect_errno) $mysqli->connect_error");
}

// Remove the catalogs from the object 
if(isset($_POST["removedCatalogs"])) {
	$sql = "DELETE objectcatalogs FROM objectcatalogs NATURAL JOIN catalognames WHERE idObjects = ? and catalogName = ?";

	$stmt = $con->prepare($sql);
	if(!$stmt) {
		die("Could not prepare statement $con->error");
	}
	foreach($_POST["removedCatalogs"] as $catalogName) {
		if(!$stmt->bind_param("is", $_POST["objectId"], $catalogName)) {
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

// Insert the catalogs 
if(isset($_POST["addedCatalogs"])) {
	$sql = "INSERT INTO objectcatalogs (idObjects, idCatalog) SELECT ?, idCatalog FROM catalognames WHERE catalogName = ?";

	$stmt = $con->prepare($sql);
	if(!$stmt) {
		die("Could not prepare statement $con->error");
	}
	foreach($_POST["addedCatalogs"] as $catalogName) {
		if(!$stmt->bind_param("is", $_POST["objectId"], $catalogName)) {
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
