<?php

include 'DatabaseInfo.php';

$mysqli = new mysqli($servername, $sqlusername, $sqlpassword, $database);

if($mysqli->connect_errno) {
	die("Failed to connect to MYSQL: ($mysqli->connect_errno) $mysqli->connect_error");
}

$sql = "SELECT idObjects, name, subject FROM objects NATURAL JOIN types WHERE type = 'Minor'";

$result = $mysqli->query($sql);

$minors = array();

if($result->num_rows > 0) {
	while($row = $result->fetch_assoc()) {
		$minors[$row["idObjects"]] = new stdClass();
		$minors[$row["idObjects"]]->name = $row["name"];
		$minors[$row["idObjects"]]->subject = $row["subject"];
	}
}

$mysqli->close();

$minors = json_encode($minors);
echo $minors;

?>