<?php
/*
@name: Aid
@role: ORM to help with database actions
@author: 11pm
*/

class Aid extends Database{

	//Variables
	private static $query;

	//View
	public static function view($name){

		return self::query("SELECT * FROM $name");

	}

	//Stored Procedure
	public static function SP($procedure, $read, $params){

		$paramString = "";

		//if it has parameters, create a binding string
		//kinda works like string join
		if(count($params)){

			for ($i=0; $i < count($params); $i++) { 

				//if last item in array
				$last = $i+1 == count($params);
				//add always
				$paramString .= "?";

				if(!$last){
					//add always but the end
					$paramString .= ", ";
				}
			}

		}

		//if the query has parameters, excute with them
		if(strlen($paramString) > 0 && count($params)){
			return self::query("CALL $procedure($paramString)", $read, $params);
		}
		//no parameters
		else{
			return self::query("CALL $procedure()", $read);
		}

	}

	public static function query($sql, $read = true, $params = []){

		self::$query = self::$pdo->prepare($sql);
		
		self::$query->execute($params);

		//only get results if read = true
		if($read){
			return self::$query->fetchAll(PDO::FETCH_OBJ);
		} 
		
	}

	public static function lastInsertID(){
		return self::query("SELECT LAST_INSERT_ID()");
	}

}