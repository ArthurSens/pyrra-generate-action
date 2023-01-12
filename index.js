const core = require('@actions/core')
const simpletGit = require('simple-git')
const shell = require('shelljs')
const fs = require('fs');



const git = simpletGit.default()

run()


async function run() {
    try {
        const configFiles = core.getInput('configFiles');
        const outputFolder = core.getInput('outputFolder');
        const genericRules = core.getInput('genericRules');

        if (!fs.existsSync(outputFolder)) {
            fs.mkdirSync(outputFolder);
        }

        await buildPyrra()
        const { stderr, code } = shell.exec(`/tmp/pyrra/pyrra generate --config-files="${configFiles}" --prometheus-folder="${outputFolder}" --generic-rules="${genericRules}"`)
        if (code != 0) {
            core.setFailed(stderr)
        }

    } catch (error) {
        core.setFailed(error.message);
    }
}

async function buildPyrra() {
    const repo = 'https://github.com/pyrra-dev/pyrra';
    const clonePath = '/tmp/pyrra';

    try {
        console.log("Cloning Pyrra repository")
        await git.clone(repo, clonePath)
        console.log('Cloning succesful');
        console.log("Building binary")
        shell.cd(clonePath)
        const { code } = shell.exec('make ui/node_modules ui/build build', { silent: true })
        if (code == 0) {
            console.log('Build succesful');
        }
    } catch (err) {
        console.log(err)
    }
} 