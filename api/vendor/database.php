<?php 
class Database{

	public static $pdo;

	public static function init($host, $dbname, $user, $password) {
		$connection = "mysql:host=$host;dbname=$dbname;charset=utf8";
		self::$pdo = new PDO($connection, $user, $password);
		self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		self::$pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
	}

}