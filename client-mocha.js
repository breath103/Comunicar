'use strict';

module.exports = function(grunt) {
	// These plugins provide necessary tasks.
	grunt.initConfig({
		'watch' : {
  		 	scripts: {
    			files: ["public/**/*.js","public/**/*.html"],
    			tasks: ["mocha"],
   			 	options: {
      			}
  		  	}
		},
		'mocha': {
		    test: {
		        // Test files
		        options: {
		            // mocha options
		            mocha: {
		                ignoreLeaks: false
		            },
		            // URLs passed through as options
		            urls:['http://127.0.0.1:' + 7777 + '/test/test.html'],
					run:true
				}
		    }
		}
	});
	// For this to work, you need to have run `npm install grunt-simple-mocha`
	grunt.loadNpmTasks('grunt-mocha');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', 'watch');
};