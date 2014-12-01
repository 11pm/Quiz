<?php 
class Leaderboards{

	public static function all($data){
		$data = OBJECT($data);

		$sql = "SELECT * FROM leaderboards WHERE category = ?";
		
		return Aid::query($sql, true, [$data->category]); 
	}

	public static function create($data){
		$data = OBJECT($data);
		return "Ayy lmao";
		//if the record exists in db
		$exists = Aid::query("SELECT * FROM leaderboards WHERE category = ? AND username = ?", true, [
			$data->category,
			$data->username
		]);

		return count($exists);
		$sql = "INSERT INTO leaderboards (username, score, category) VALUES (?, ?, ?)";
		
		$response = Aid::query($sql, false, [
			$data->username,
			$data->score*100,
			$data->category
		]);

		

	}

}