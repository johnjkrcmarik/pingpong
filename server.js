"use strict"
;(function() {
	var express = require('express');
	var path = require('path');
	
	var app = express();
	app.use(express.static(__dirname + '/public'));  

	// sqlite db  ======================================
	
	var sqlite3 = require('sqlite3').verbose();
	//var db = new sqlite3.Database('/db', ); (':memory:');
	var db = new sqlite3.Database('./db/pong.db', (err) => {
		if (err) {
			console.error(err.message);
		}
		console.log('Connected to the pong database.');
	});

	db.serialize(function() {
	/*  db.run("CREATE TABLE standings (rowid integer PRIMARY KEY AUTOINCREMENT NOT NULL, team text NOT NULL, wins INTEGER NOT NULL, losses INTEGER NOT NULL)");
	   
		var stmt = db.prepare("INSERT INTO standings (team, wins, losses) VALUES (?, ?, ?)");

		stmt.run("Knicks", 10, 10);
		stmt.run("Lakers", 12, 8);
		stmt.run("Pistons", 7, 13);
		stmt.run("Jazz", 15, 5);
		stmt.run("Celtics", 8, 12);
		stmt.run("Sonics", 5, 15);
		stmt.run("Bulls", 13, 7);
		stmt.run("Rockets", 7, 13);
		stmt.run("Cavaliers", 9, 11);
		stmt.run("Heat", 10, 10);
		stmt.run("Hawks", 11, 9);
		stmt.finalize(); */

		db.each("SELECT rowid AS id, team, wins, losses FROM standings", function(err, row) {
			console.log(row.id + ": " + row.team + ' ' + row.wins + ' wins and ' + row.losses + ' losses.');
		});
	});

	db.close();
	
	// rest end points  ======================================

	app.get('/game/:result', function(req, res) {
		
		console.log(req.params);
		var result = JSON.parse(req.params.result);
		console.log('result: '+JSON.stringify(result));
		var winner = result.winner;
		var loser = result.loser;
		var db = new sqlite3.Database('./db/pong.db', (err) => {
		  if (err) {
			console.error(err.message);
		  }
		  console.log('Connected to the pong database.');
		});
		
		db.exec('UPDATE standings SET wins = wins + 1 WHERE rowid = ' + winner); 
		db.exec('UPDATE standings SET losses = losses + 1 WHERE rowid = ' + loser); 
		db.close();
		
		var rows = [];
		db = new sqlite3.Database('./db/pong.db', (err) => {
		  if (err) {
			console.error(err.message);
		  }
		  console.log('Connected to the pong database.');
		});
		db.each("SELECT rowid AS id, team, wins, losses FROM standings ORDER BY wins DESC", function(err, row) {
			rows.push({
				"id": row.id,
				"name": row.team,
				"wins": row.wins,
				"losses": row.losses
			});
		}, function(){
			console.log('Rows: '+JSON.stringify(rows));
			res.json(rows); // return updated standings
		});
		db.close();
	});

	app.get('/standings', function(req, res) {

		var rows = [];
		var db = new sqlite3.Database('./db/pong.db', (err) => {
		  if (err) {
			console.error(err.message);
		  }
		  console.log('Connected to the pong database.');
		});

		db.each("SELECT rowid AS id, team, wins, losses FROM standings ORDER BY wins DESC", function(err, row) {
			rows.push({
				"id": row.id,
				"name": row.team,
				"wins": row.wins,
				"losses": row.losses
			});
		}, function(){
			console.log('Rows: '+JSON.stringify(rows));
			res.json(rows); // return standings
		});
		db.close();
	});

	app.get('/reset', function(req, res) {
		
		var db = new sqlite3.Database('./db/pong.db', (err) => {
		  if (err) {
			console.error(err.message);
		  }
		  console.log('Connected to the pong database.');
		});
		
		db.exec('DELETE FROM standings');
		db.exec('DELETE FROM sqlite_sequence WHERE name = \'standings\'');
		db.close();
		
		db = new sqlite3.Database('./db/pong.db', (err) => {
		  if (err) {
			console.error(err.message);
		  }
		  console.log('Connected to the pong database.');
		});
		var stmt = db.prepare("INSERT INTO standings (team, wins, losses) VALUES (?, ?, ?)");

		stmt.run("Randy Daytona", 10, 10);
		stmt.run("Feng", 12, 8);
		stmt.run("Agent Ernie Rodriguez", 7, 13);
		stmt.run("Maggie Wong", 15, 5);
		stmt.run("Mahogany", 8, 12);
		stmt.run("Karl Wolfschtagg", 5, 15);
		stmt.run("Gary", 13, 7);
		stmt.run("Eddie", 7, 13);
		stmt.run("Freddy Fingers Wilson", 9, 11);
		stmt.run("The Hammer", 10, 10);
		stmt.run("Rick the Birdmaster", 11, 9);
		stmt.finalize();
		db.close();
		
		setTimeout(function() {
			var rows = [];
			db = new sqlite3.Database('./db/pong.db', (err) => {
			  if (err) {
				console.error(err.message);
			  }
			  console.log('Connected to the pong database.');
			});
			db.each("SELECT rowid AS id, team, wins, losses FROM standings ORDER BY wins DESC", function(err, row) {
				rows.push({
					"id": row.id,
					"name": row.team,
					"wins": row.wins,
					"losses": row.losses
				});
			}, function(){
				console.log('Rows: '+JSON.stringify(rows));
				res.json(rows); // return demo standings
			});
			
			db.close();
		}, 500);
		
	});
	
	app.get('/clear', function(req, res) {
		
		var rows = [];
		var db = new sqlite3.Database('./db/pong.db', (err) => {
		  if (err) {
			console.error(err.message);
		  }
		  console.log('Connected to the pong database.');
		});
		
		db.exec('UPDATE standings SET wins = 0');
		db.exec('UPDATE standings SET losses = 0');
		db.each("SELECT rowid AS id, team, wins, losses FROM standings ORDER BY wins DESC", function(err, row) {
			rows.push({
				"id": row.id,
				"name": row.team,
				"wins": row.wins,
				"losses": row.losses
			});
		}, function(){
			console.log('Rows: '+JSON.stringify(rows));
			res.json(rows); // return cleared standings
		});
		
		db.close();
	
	});
	
	app.get('/add/:player', function(req, res) {
		
		console.log(req.params);
		var player = req.params.player;
		console.log('player: '+player);

		var db = new sqlite3.Database('./db/pong.db', (err) => {
		  if (err) {
			console.error(err.message);
		  }
		  console.log('Connected to the pong database.');
		});
		
		db.exec("INSERT INTO standings (team, wins, losses) VALUES ('" + player + "', 0, 0)");
		db.close();
		
		var rows = [];
		db = new sqlite3.Database('./db/pong.db', (err) => {
		  if (err) {
			console.error(err.message);
		  }
		  console.log('Connected to the pong database.');
		});
		db.each("SELECT rowid AS id, team, wins, losses FROM standings ORDER BY wins DESC", function(err, row) {
			rows.push({
				"id": row.id,
				"name": row.team,
				"wins": row.wins,
				"losses": row.losses
			});
		}, function(){
			console.log('Rows: '+JSON.stringify(rows));
			res.json(rows); // return updated standings
		});
		db.close();
	});
	
	app.get('/delete/:player', function(req, res) {
		
		console.log(req.params);
		var player = req.params.player;
		console.log('player: '+player);

		var db = new sqlite3.Database('./db/pong.db', (err) => {
		  if (err) {
			console.error(err.message);
		  }
		  console.log('Connected to the pong database.');
		});
		
		db.exec("DELETE FROM standings WHERE rowid = " + player);
		db.close();
		
		var rows = [];
		db = new sqlite3.Database('./db/pong.db', (err) => {
		  if (err) {
			console.error(err.message);
		  }
		  console.log('Connected to the pong database.');
		});
		db.each("SELECT rowid AS id, team, wins, losses FROM standings ORDER BY wins DESC", function(err, row) {
			rows.push({
				"id": row.id,
				"name": row.team,
				"wins": row.wins,
				"losses": row.losses
			});
		}, function(){
			console.log('Rows: '+JSON.stringify(rows));
			res.json(rows); // return updated standings
		});
		db.close();
	});
	
	app.get('/empty', function(req, res) {
		
		var db = new sqlite3.Database('./db/pong.db', (err) => {
		  if (err) {
			console.error(err.message);
		  }
		  console.log('Connected to the pong database.');
		});
		
		db.exec('DELETE FROM standings');
		db.exec('DELETE FROM sqlite_sequence WHERE name = \'standings\'');
		db.close();
		
		res.json("success"); // empty standings
		
	});

	// listen (start app with node server.js) ======================================
	
	app.set('port', (process.env.PORT || 8080));
	app.use(express.static(__dirname + '/pong'));

    app.get('*', function(req, res) {
        //res.sendFile('./public/index.html'); // load the pong SPA
		res.sendFile(path.resolve('public/index.html'));
    });

	app.listen(app.get('port'), function() {
	  console.log("Node app is running at localhost:" + app.get('port'));
	})
})();
