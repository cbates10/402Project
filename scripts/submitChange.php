<?php
    /* Database connection start */
	include 'DatabaseInfo.php';

    $mysqli = new mysqli($servername, $sqlusername, $sqlpassword, $database);
    if($mysqli->connect_errno) {
        die("Failed to connect to MYSQL: ($mysqli->connect_errno) $mysqli->connect_error");
    }

    $dataObj = $_POST['dataObj'];
    $dataObjID = $_POST['idObject'];
    $var = 'variable';
    $fix = 'fixed';
    //Simple test to see how saving work
    foreach($dataObj["modifyData"] as $modifyData){
        $sql = "UPDATE hoursbylevel SET hours = ? ,type = ? WHERE idObjects = ? AND hourLevel = ? AND cap = ? ";
        $stmt = $mysqli->prepare($sql);
        if($modifyData["fixed"] == true){
            $stmt->bind_param("dsiss",$modifyData["val"],$fix,$dataObjID,$modifyData["hour"],$modifyData["cap"]);
        }else{
            $stmt->bind_param("dsiss",$modifyData["val"],$var,$dataObjID,$modifyData["hour"],$modifyData["cap"]);
        }
        $stmt->execute();
    }
    /*
    $stmt->close();
    foreach($dataObj["addData"] as $addData){
        $sql = "INSERT INTO hoursbylevel (idObjects,hours,type,cap,hourlevel) VALUE (?,?,?,?,?)";
        $stmt = $mysqli->prepare($sql);
        if($modifyData["fixed"] == true){
            $stmt->bind_param("idsss",$dataObjID,$modifyData["val"],$fix,$modifyData["cap"],$modifyData["hour"]);
        }else{
            $stmt->bind_param("idsss",$dataObjID,$modifyData["val"],$var,$modifyData["cap"],$modifyData["hour"]);
        }
        $stmt->execute();
    }
    */
    $stmt->close();
    mysqli_close($mysqli);
?>