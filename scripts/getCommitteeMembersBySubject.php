<?php

include 'DatabaseInfo.php';

$con = new mysqli($servername, $sqlusername, $sqlpassword, $database);

$con = mysqli_connect($servername, $sqlusername, $sqlpassword, $database);

if($con->connect_errno) {
	die("Failed to connect to MYSQL: ($mysql->connect_errno) $mysqli->connect_error");
}

$sql = "SELECT subjectName FROM committeemergemapping WHERE committeeName = ?";

$stmtMerged = $con->prepare($sql);
if(!$stmtMerged) {
	die("Could not prepare statement $con->error");
}
if(!$stmtMerged->bind_param("s", $_POST["committeeName"])) {
	die("Could not bind parameters $stmtMerged->error");
}
$rc = $stmtMerged->execute();
if(false === $rc) {
	die("Could not execute statement $stmtMerged->error");
}

$mergedCommittees = array();
array_push($mergedCommittees, $_POST["committeeName"]);

$stmtMerged->bind_result($committeeName);

while($stmtMerged->fetch()) {
	array_push($mergedCommittees, $committeeName);
}

$stmtMerged->close();

$sql = "SELECT memberId, memberFirstName, memberLastName, titleName, idTitle FROM graduatecommittee NATURAL JOIN committeemapping NATURAL JOIN committeetitles WHERE subjectName = ?";

$stmtCommitteeMembers = $con->prepare($sql);
if(!$stmtCommitteeMembers) {
	die("Could not prepare statement $con->error");
}
$members = array();

foreach($mergedCommittees as $committeeName) {
	if(!$stmtCommitteeMembers->bind_param("s", $committeeName)) {
		die("Could not bind parameters $stmtCommitteeMembers->error");
	}
	$rc = $stmtCommitteeMembers->execute();
	if(false === $rc) {
		die("Could not execute statement $stmtCommitteeMembers->error");
	}
	$stmtCommitteeMembers->bind_result($memberId, $firstName, $lastName, $title, $titleId);

	while($stmtCommitteeMembers->fetch()) {
		$memberInformation = new stdClass();
		$memberInformation->id = $memberId;
		$memberInformation->firstName = $firstName;
		$memberInformation->lastName = $lastName;
		$memberInformation->title = $title;
		$memberInformation->titleId = $titleId;
		$memberInformation->committee = $committeeName;
		array_push($members, $memberInformation);
	}
	$stmtCommitteeMembers->free_result();
}

$stmtCommitteeMembers->close();
$con->close();

echo json_encode($members);

?>
