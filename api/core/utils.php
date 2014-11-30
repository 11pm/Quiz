<?php 

function dd($stuff){
	echo '<pre>', print_r($stuff), '</pre>';
	die();
}

//convert to json
function JSON($object){
	return json_encode($object);
}

//cast array to object
function OBJECT($object){
	return (object)$object;
}

//get post variables with ease
function POST(){
	$postdata = file_get_contents("php://input");
	return json_decode($postdata);
}

//returns true if sub in string
function contains($string, $search){
	return strrpos($string, $search) !== false;
}