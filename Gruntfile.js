
module.exports = function(grunt) {
	var port = grunt.option('port') || 3000;
	//load plugins
	[
		'grunt-cafe-mocha',
		'grunt-contrib-jshint',
		'grunt-exec',
		'grunt-link-checker'
	].forEach(function(task) {
		grunt.loadNpmTasks(task);	
	});
	// configure plugins
	grunt.initConfig({
		cafemocha: {
			all: { src: 'qa/tests-*.js', options: { ui: 'tdd',timeout: 7000}}
		}, 
		jshint: {
			app: ['nep.js', 'public/js/**/*.js', 'lib/**/*.js'],
			qa: ['Gruntfile.js', 'public/qa/**/*.js', 'qa/**/*.js']
		},
		exec: {
			linkchecker: {
				cmd: 'linkchecker http://localhost:'+port
			}

		}, 
		linkChecker: {
			options: {
				maxConcurrency: 20
			}, 
			dev: {
				site: 'localhost',
				options: {
      				initialPort: port
      			}
      		}
      	}
	});

	// register tasks
	grunt.registerTask('default', ['cafemocha', 'jshint', 'exec', 'linkChecker']);
};