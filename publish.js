
const shell = require('shelljs');
let ver = shell.exec('npm version patch --no-git-tag-version')
shell.exec('git add *')
shell.exec('git commit -m "' + ver.stdout + '"')
shell.exec('git push')
