<?php

include 'DatabaseInfo.php';

$mysqli = new mysqli($servername, $sqlusername, $sqlpassword, $database);

if($mysqli->connect_errno) {
	die("Failed to connect to MYSQL: ($mysqli->connect_errno) $mysqli->connect_error");
}

$sql = "SELECT idObjects, name, subject FROM objects NATURAL JOIN types WHERE type = 'Certificate'";

$result = $mysqli->query($sql);

$certficates = array();

if($result->num_rows > 0) {
	while($row = $result->fetch_assoc()) {
		$certficates[$row["idObjects"]] = new stdClass();
		$certficates[$row["idObjects"]]->name = $row["name"];
		$certficates[$row["idObjects"]]->subject = $row["subject"];
	}
}

$mysqli->close();

$certficates = json_encode($certficates);
echo $certficates;

?>