import { printErrors, checkEslint } from 'se-actions-lib'

checkEslint({})
    .then(errors => {
        const code = printErrors(errors);
        if (code !== 0) {
            process.exit(code);
        }
    }).catch(error => {
        console.error(error);
    });