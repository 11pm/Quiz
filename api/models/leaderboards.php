<?php 
class Leaderboards{

	public static function all(){
		$sql = "SELECT * FROM leaderboards";
		
		return Aid::query($sql, true); 
	}

	public static function create($data){
		$data = OBJECT($data);
		$sql = "INSERT INTO leaderboards (username, score) VALUES (?, ?)";
		
		/*$response = Aid::query($sql, false, [
			$data->username,
			$data->score*100
		]);*/

		return true;

	}

}