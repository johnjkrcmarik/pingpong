"use strict"
angular.module('pong').directive("standings", function() {
   return {
       restrict: 'AECM',
       template: '<div>'+
					'<div class="jumbotron">'+
						'<h1 id="pageTitle">"Balls of Fury!"</h1>'+      
						'<p>This is a simple demonstration Ping Pong League Standings site using characters from the movie Balls of Fury.</p>'+
					'</div>'+
					'<table ng-show="!isAddingGameResult()" class="table table-striped table-bordered">'+
						'<thead>'+
							'<tr>'+
								'<th>Team</th>'+
								'<th>Wins</th>'+
								'<th>Losses</th>'+
							'</tr>'+
						'</thead>'+
						'<tbody>'+
							'<tr ng-repeat="item in standings">'+
								'<td>{{item.name}}</td>'+
								'<td>{{item.wins}}</td>'+
								'<td>{{item.losses}}</td>'+
							'</tr>'+
						'</tbody>'+
					'</table>'+
				'</div>',
       scope: false
   
   }
}); 

angular.module('pong').directive("buttons", function() {
   return {
       restrict: 'AECM',
       template: '<div ng-show="!isAddingGameResult()">'+
                    '<div class="btn-group btn-group-lg btn-group-justified">'+
						'<a id="gameResultButton" href="#" class="btn btn-primary" style="margin: 10px" ng-click="showAddingGameResult()">Add Game Result</a>'+
						'<a id="loadDemoStandings" href="#" class="btn btn-primary" style="margin: 10px" ng-click="resetToDemoData()">Load Demo Standings</a>'+
					'</div>'+
                 '</div>',
       scope: false
   }
}); 

angular.module('pong').directive("results", function() {
   return {
       restrict: 'AECM',
       template: '<div ng-show="isAddingGameResult()">'+
					'<table class="table table-bordered">'+
						'<thead>'+
							'<tr>'+
								'<th>Winner <small style="padding-left: 20px;font-style: italic">{{getWinnerSelectionText()}}</small></th>'+
								'<th>Loser <small style="padding-left: 20px;font-style: italic">{{getLoserSelectionText()}}</small></th>'+
							'</tr>'+
						'</thead>'+
						'<tbody>'+
							'<tr ng-repeat="item in standings">'+
								'<td ng-style="item.isWinner && {\'background-color\': \'lightblue\'} || item.isLoser && {\'background-color\': \'lightgray\'}" '+
									'ng-click="selectGameWinner(item)">{{item.name}}</td>'+
								'<td ng-style="item.isLoser && {\'background-color\': \'#FFA07A\'} || item.isWinner && {\'background-color\': \'lightgray\'}" '+
									'ng-click="selectGameLoser(item)">{{item.name}}</td>'+
							'</tr>'+
						'</tbody>'+
					'</table>'+
					'<div class="btn-group btn-group-lg btn-group-justified">'+
						'<a id="saveThisGameResult" href="#" ng-show="isGameResultOK()" class="btn btn-primary" style="padding: 10px" ng-click="addNewGameResult()">Save This Game Result</a>'+
						'<a id="cancelNewGameResult" href="#" class="btn btn-primary" style="padding: 10px" ng-click="hideAddingGameResult()">Cancel</a>'+
					'</div>'+
                 '</div>',
       scope: false
   }
}); 
