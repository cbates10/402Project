<?php
    
	include 'DatabaseInfo.php';
    
    $con = new mysqli($servername, $sqlusername, $sqlpassword, $database);
    
    if($con->connect_errno){
        die("Failed to connect to MYSQL: ($mysqli->connect_errno) $mysqli->connect_error");
    }
    
    $sql = "INSERT INTO courses (coursePrefix, courseNumber, courseHoursLow, courseHoursHigh, courseName) VALUES (?,?,?,?,?);";
    
    $stmt = $con->prepare($sql);
    if(!$stmt){
        die("Could not bind parameters $mysqli->error");
    }
    $stmt->bind_param("siiis", $_POST['coursePrefix'], $_POST['courseNumber'], $_POST['courseHoursLow'], $_POST['courseHoursHigh'], $_POST['courseName']);
    
	$rc = $stmt->execute();
    
	if(false === $rc) {
		die("Failure to execute statement $stmt->error");
	}
	
	echo "Course Added Successfully";
	
    $stmt->close();
    $con->close();
    
?>

    
