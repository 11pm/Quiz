<?php 
include 'init.php';

class Router{
	private $_uri = array();
	private $_method = array();
 
	public function add($uri, $method = null){
		$this->_uri[] = '/' . trim($uri, '/');

		if($method != null){
			$this->_method = $method;
		}

	}

	public function submit(){
		$_uri = is_get('uri') ? '/' . get('uri') : '/'; 

		foreach($this->uri as $key => $value){
			
			if(preg_match("/#^$value$#/", $uri)){
				
				$useMethod = $this->_method[$key];
				new $useMethod();
			}
		}
	}
}