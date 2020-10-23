const readlineSync = require('readline-sync');
while (true) {
    var pilihan = ['luas persegi panjang', 'volume balok', 'konversi IDR ke USD'];
    console.log(pilihan.map((t, i) => `${i + 1}. ${t} `).join('\n'));
    let index = readlineSync.questionInt('mau pilih yang mana? ');


    switch (index) {
        case 1:
            let panjang = readlineSync.question('masukkan nilai panjang! ');
            let lebar = readlineSync.question('masukkan nilai lebar! ');
            luasPersegiPanjang(panjang, lebar);
            break;

        case 2:
            let p = readlineSync.question('masukkan nilai panjang! ');
            let l = readlineSync.question('masukkan nilai lebar! ');
            let t = readlineSync.question('masukkan nilai tinggi ');
            volumeBalok(p, l, t);
            break;

        case 3:
            let value = readlineSync.question('masukkan nilai mata uangnya! ');
            IDRtoUSD(value);
            break;


        default:
            process.exit(1);

    }


    function luasPersegiPanjang(p, l) {
        return console.log(`p x l = ${p ? p : 0} x ${l ? l : 0} = ${(p * l).toLocaleString()}`);

    }


    function volumeBalok(p, l, t) {
        return console.log(`p x l x t = ${p ? p : 0} x ${l ? l : 0} x ${t ? t : 0} = ${(p * l * t).toLocaleString()}`);
    }

    function IDRtoUSD(value) {
        return console.log('$' + (value / 14000).toFixed(5));
    }
}