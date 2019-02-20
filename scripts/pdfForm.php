<?php

/**
* The following class was derived from the PDFtk tutorial found on sitepoint at the following
* url: https://www.sitepoint.com/filling-pdf-forms-pdftk-php/
*/
class pdfForm {
	
	private $pdfurl;
	
	private $data;
	
	private $output;
	
	public function __construct($pdfurl, $data) {
		$this->pdfurl = $pdfurl;
		$this->data   = $data;
	}
	
	private function tmpfile() {
		return tempnam(sys_get_temp_dir(), gethostname());
	}
	
	/**
    * Generate FDF file
    * @param array $data
    * @return string
    */
    public function makeFdf($data) {
        $fdf = '%FDF-1.2
		%âãÏÓ
        1 0 obj<</FDF<< /Fields[';
        foreach ($data as $key => $value) {
            $fdf .= '<</T(' . $key . ')/V(' . $value . ')>>';
        }
        $fdf .= "] >> >>
        endobj
        trailer
        <</Root 1 0 R>>
        %%EOF";
        $fdf_file = $this->tmpfile();
        file_put_contents($fdf_file, $fdf);
        return $fdf_file;
    }

	private function generate() {
		$fdf = $this->makeFdf($this->data);
		$this->output = $this->tmpfile();
		exec("pdftk $this->pdfurl fill_form $fdf output $this->output");
		
		unlink($fdf);
	}
	
	public function download() {
		if(!$this->output) {
			$this->generate();
		}
		
		$filepath = $this->output;
		
		// Write the http header information and send the pdf file contents
		if(file_exists($filepath)) {
			header("Content-Description: File Transfer");
			header("Content-Type: application/pdf");
			header("Content-Disposition: attachment; filename=" + uniqid(gethostname()) + ".pdf");
			header("Expires: 0");
			header("Cache-Control: must-revalidate");
			header("Pragma: public");
			header("Content-Length: " + filesize($filepath));
			readfile($filepath);
			exit;
		}
	}
	
}

?>
