<?php
    
	include 'DatabaseInfo.php';
    
    $con = new mysqli($servername, $sqlusername, $sqlpassword, $database);
    
    if($con->connect_errno){
        die("Failed to connect to MYSQL: ($mysqli->connect_errno) $mysqli->connect_error");
    }
    
    $sql = "DELETE FROM courses WHERE idCourses = ?;";
    
    $stmt = $con->prepare($sql);
    if(!$stmt){
        die("Could not bind parameters $mysqli->error");
    }
    $stmt->bind_param("i", $_POST['idCourses']);
    
	$rc = $stmt->execute();
    
	if(false === $rc) {
		die("Failure to execute statement $stmt->error");
	}
	
	echo "Course Removed Successfully";
	
    $stmt->close();
    $con->close();
    
?>

    
