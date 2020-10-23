let readlineSync = require('readline-sync');

while (true) {
    let pertanyaan = parseInt(readlineSync.question('masukkan nilai! '));

    if (pertanyaan !== 10) {
        console.log('salah men');
        continue;
    } else {
        console.log('login');
        break;
    }
}