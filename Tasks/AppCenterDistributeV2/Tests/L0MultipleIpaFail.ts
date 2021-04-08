
import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');

let taskPath = path.join(__dirname, '..', 'appcenterdistribute.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.setInput('serverEndpoint', 'MyTestEndpoint');
tmr.setInput('appSlug', 'testuser/testapp');
tmr.setInput('app', '/test/path/to/*.ipa');
tmr.setInput('releaseNotesSelection', 'releaseNotesInput');
tmr.setInput('releaseNotesInput', 'my release notes');

// provide answers for task mock
let a: ma.TaskLibAnswers = <ma.TaskLibAnswers>{
    "checkPath" : {
        "/test/path/to/one.ipa": true,
        "/test/path/to/two.ipa": true
    },
    "findMatch" : {
        "/test/path/to/*.ipa": [
            "/test/path/to/one.ipa",
            "/test/path/to/two.ipa"
        ]
    }
};
tmr.setAnswers(a);

tmr.registerMock('./utils.js', {
    resolveSinglePath: function(s, b1, b2) {
       throw new Error("Matched multiple files"); 
    },
    checkAndFixFilePath: function(p, name) {
        return p;
    }
});

tmr.run();

