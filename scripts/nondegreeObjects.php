<?php

include 'DatabaseInfo.php';

$mysqli = new mysqli($servername, $sqlusername, $sqlpassword, $database);

if($mysqli->connect_errno) {
	die("Failed to connect to MYSQL: ($mysqli->connect_errno) $mysqli->connect_error");
}

$sql = "SELECT * FROM objects NATURAL JOIN types WHERE type = 'Form' OR type = 'Certificate' or type = 'minor' ORDER BY subject";

$result = $mysqli->query($sql);

$degrees = array();

if($result->num_rows > 0) {
	while($row = $result->fetch_assoc()) {
		$subject = $row["subject"];
		if(!isset($degrees[$row["type"]])) {
			$degrees[$row["type"]] = new stdClass();
		}
		if(!isset($degrees[$row["type"]]->$subject)) {
			$degrees[$row["type"]]->$subject = array();
		}
		$degrees[$row["type"]]->$subject[$row["name"]] = $row["idObjects"];
	}
}

$mysqli->close();

$degrees = json_encode($degrees);
echo $degrees;

?>
