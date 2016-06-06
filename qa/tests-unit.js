var fortune = require('../lib/fortune.js');
var expect = require('chai').expect;

suite('Fortune cookies tests', function() {
	test('fortune cookies bullshit', function() {
		expect(typeof fortune.getFortune() === 'string');
	});	
});