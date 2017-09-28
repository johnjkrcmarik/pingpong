"use strict"
var pong = angular.module('pong', []);

angular.module('pong').controller('MainController', mainController);

function mainController($scope, $http) {
    $scope.standings = [];
	$scope.addingGameResult = false; 
	$scope.newGameResult = null; 

    // when landing on the page, get standings
    $http.get('/standings')
        .success(function(data) {
            $scope.standings = data;
            console.log(JSON.stringify(data));
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
		
	// process a game result
    $scope.addGameResult = function(result) {
        $http.get('/game/' + JSON.stringify(result))
            .success(function(data) {
                $scope.standings = data;
                console.log(JSON.stringify(data));
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // reset to demo data
    $scope.resetToDemoData = function() {
        $http.get('/reset')
            .success(function(data) {
                $scope.standings = data;
                console.log(JSON.stringify(data));
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
	
	// clear standings
    $scope.clearStandings = function() {
        $http.post('/clear')
            .success(function(data) {
                $scope.standings = [];
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
	
	// add new player
    $scope.addPlayer = function(player) {
        $http.get('/game/' + player)
            .success(function(data) {
                $scope.standings = data;
                console.log(JSON.stringify(data));
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
	
	// check if adding match for display 
	$scope.isAddingGameResult = function() {
		return $scope.addingGameResult;
	}
	
	// show add match in display 
	$scope.showAddingGameResult = function() {
		$scope.newGameResult = {};
		$scope.addingGameResult = true;
	}
	
	// hide add match in display 
	$scope.hideAddingGameResult = function() {
		$scope.newGameResult = null;
		for(var item in $scope.standings) {
			delete $scope.standings[item].isWinner;
			delete $scope.standings[item].isLoser;
		}	
		$scope.addingGameResult = false;
	}
	
	// check if valid game result
	$scope.isGameResultOK = function() {
		if($scope.newGameResult == null) {
			return false;
		}
		if(!$scope.newGameResult.winner || !$scope.newGameResult.loser) {
			return false;
		}
		return true;
	}
	
	// select game winner
	$scope.selectGameWinner = function(winner) {
		var winnerFound = false;
		for(var item in $scope.standings) {
			if(winner.id == $scope.standings[item].id) {
				if(!$scope.standings[item].isLoser) {
					$scope.standings[item].isWinner = true;
					winnerFound = true; 
					if(!$scope.newGameResult) {
						$scope.newGameResult = {};
					}
					$scope.newGameResult.winner = winner.id;
				}
			} 
		}
		if(winnerFound) {
			for(var item in $scope.standings) {
				if(winner.id != $scope.standings[item].id) {
					delete $scope.standings[item].isWinner;
				} 
			}			
		}
		console.log("Winner is "+JSON.stringify(winner));
	}
	
	// select game loser
	$scope.selectGameLoser = function(loser) {
		var loserFound = false;
		for(var item in $scope.standings) {
			if(loser.id == $scope.standings[item].id) {
				if(!$scope.standings[item].isWinner) {
					$scope.standings[item].isLoser = true;
					loserFound = true; 
					if(!$scope.newGameResult) {
						$scope.newGameResult = {};
					}
					$scope.newGameResult.loser = loser.id;
				}
			} 
		}
		if(loserFound) {
			for(var item in $scope.standings) {
				if(loser.id != $scope.standings[item].id) {
					delete $scope.standings[item].isLoser;
				} 
			}			
		}
		console.log("Loser is "+JSON.stringify(loser));
	}
	
	// get winner column display text
	$scope.getWinnerSelectionText = function() {
		if($scope.newGameResult && $scope.newGameResult.winner) {
			for(var item in $scope.standings) {
				if($scope.standings[item].id == $scope.newGameResult.winner) {
					return $scope.standings[item].name;
				}
			}
		} 
		return "Click to select";
	}
	
	// get loser column display text
	$scope.getLoserSelectionText = function() {
		if($scope.newGameResult && $scope.newGameResult.loser) {
			for(var item in $scope.standings) {
				if($scope.standings[item].id == $scope.newGameResult.loser) {
					return $scope.standings[item].name;
				}
			}
		} 
		return "Click to select";
	}
	
	// call api to add game 
	$scope.addNewGameResult = function() {
		if($scope.newGameResult == null) {
			return false;
		}
		if(!$scope.newGameResult.winner || !$scope.newGameResult.loser) {
			return false;
		}
		$scope.addGameResult($scope.newGameResult);
		for(var item in $scope.standings) {
			delete $scope.standings[item].isWinner;
			delete $scope.standings[item].isLoser;
		}	
		$scope.addingGameResult = false;
	
	}
}
