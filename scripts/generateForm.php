<?php
	require 'pdfForm.php';

	$data = array();
	
	foreach($_POST as $key => $value) {
		if($key != "FormName") {
			$data[$key] = $value;
		}
	} 
	
	$pdf = new pdfForm('../"' . $_POST["FormName"] . '.pdf"', $data);
	
	$pdf->download();
?>
