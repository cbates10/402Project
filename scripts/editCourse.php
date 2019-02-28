
<?php
    /* Database connection start */
	include 'DatabaseInfo.php';
    
    $mysqli = new mysqli($servername, $sqlusername, $sqlpassword, $database);
    if($mysqli->connect_errno) {
        die("Failed to connect to MYSQL: ($mysqli->connect_errno) $mysqli->connect_error");
    }
    
    $sql = "";
    $type = "";
    
    switch($_POST["field"]) {
        case "courseNumber" :
            $sql = "UPDATE courses SET courseNumber = ? WHERE idCourses = ?";
            $type = "i";
            break;
        case "coursePrefix" :
            $sql = "UPDATE courses SET coursePrefix = ? WHERE idCourses = ?";
            $type = "s";
            break;
        case "courseName" :
            $sql = "UPDATE courses SET courseName = ? WHERE idCourses = ?";
            $type = "s";
            break;
        case "courseHoursLow" :
            $sql = "UPDATE courses SET courseHoursLow = ? WHERE idCourses = ?";
            $type = "i";
            break;
		case "courseHoursHigh" :
            $sql = "UPDATE courses SET courseHoursHigh = ? WHERE idCourses = ?";
            $type = "i";
            break;
    }
    
	echo $_POST["field"];
	
    $stmt = $mysqli->prepare($sql);
    if(!$stmt) {
        die("Could not prepare statement $mysqli->error");
    }
    
    if(!$stmt->bind_param($type."i" , $_POST["val"], $_POST["idCourses"])) {
        die("Could not bind parameters $mysqli->error");
    }
    $rc = $stmt->execute();
    if(false === $rc) {
        die("Could not execute statement $stmt->error");
    }
    
    $stmt->close();
    $mysqli->close();
    
	// send data as json format */
    //$msg = array('status' => !$error, 'msg' => 'Sucessfully updated database');
    //echo json_encode($msg);
    
?>
	

