<?php
	require 'pdfForm.php';

	$data = array();
	$courseCounter = 1;
	
	foreach($_POST as $key => $value) {
		$data[$key] = $value;
		
	} 
	
	$pdf = new pdfForm("admission_to_candidacy.pdf", $data);
	
	$pdf->download();
?>
