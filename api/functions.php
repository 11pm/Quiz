<?php 
function is_get($val){
	return isset($_GET[$val]);
}
function get($val){
	return $_GET[$val];
}