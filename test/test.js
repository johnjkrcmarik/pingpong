var request = require('request');

describe("Ping Pong page Loaded", function() {
	
	describe("Ping Pong page Loaded", function() {

		var url = "http://localhost:8080/";

		it("returns status 200", function() {
			request(url, function(error, response, body) {
				console.log("Response status code: "+response.statusCode);
				expect(response.statusCode).to.equal(200);
				done();
			});
		});
		
		it("has the title Balls of Fury", function() {
			request(url, function(error, response, body) {
				expect(wrapper.find('#pageTitle')).to.have.text('Balls of Fury');
				done();
			});
		});
		
		it("has a standings table", function() {
			request(url, function(error, response, body) {
				expect(wrapper.find('table')).to.exist();
				done();
			});
		});
		
		it("has a Add Game Result Button", function() {
			request(url, function(error, response, body) {
				expect(wrapper.find('#gameResultButton')).to.have.text('Add Game Result');
				done();
			});
		});
		
		it("has a Load Demo Standings Button", function() {
			request(url, function(error, response, body) {
				expect(wrapper.find('#loadDemoStandings')).to.have.text('Load Demo Standings');
				done();
			});
		});
		
	});
});

