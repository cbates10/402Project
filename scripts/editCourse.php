
<?php
    /* Database connection start */
    $servername = "216.96.149.200";
    $database = "formscentral";
    $username = "Casey3724";
    $password = "Imbroglio3724";
    
    $mysqli = new mysqli($servername, $username, $password, $database);
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
        case "courseHours" :
            $sql = "UPDATE courses SET courseHours = ? WHERE idCourses = ?";
            $type = "i";
            break;
    }
    
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
    $msg = array('status' => !$error, 'msg' => 'Sucessfully updated database');
    echo json_encode($msg);
    
?>
	

