exports.getFortune = function() {
	var idx = Math.floor(Math.random()*fortuneCookies.length);
	return fortuneCookies[idx];	
};

var fortuneCookies = [
	"blab blablablb blablab bla",
	"fuck the state",
	"whack the faggot"
];

