var gulp = require('gulp'),
    os = require('os'),
    fs = require('fs-extra'),
    unzip = require('gulp-unzip'),
    remoteSrc = require('gulp-remote-src');

function removeResource() {
    var files = [
        './mobile_ios_lib/MaplatView/Maplat.bundle',
        './mobile_ios_sample/mobile_ios_sample/maps',
        './mobile_ios_sample/mobile_ios_sample/tiles',
        './mobile_ios_sample_swift/mobile_ios_sample_swift/maps',
        './mobile_ios_sample_swift/mobile_ios_sample_swift/tiles'
    ];
    for (var i=0; i<files.length; i++) {
        var file = files[i];
        try {
            fs.removeSync(file);
        } catch (e) {
        }
    }
}

function copyResource() {
    ['dist', 'parts', 'mobile.html'].forEach(function(res1) {
        ['core', 'mobile_gw'].forEach(function(mod) {
            var check = 'node_modules/maplat_' + mod + '/' + res1;
            if (!fs.existsSync(check)) return;
            if (fs.statSync(check).isDirectory()) {
                fs.readdirSync(check).forEach(function(res) {
                    fs.copySync(check + '/' + res, './mobile_ios_lib/MaplatView/Maplat.bundle/' + res1 + '/' + res);
                });
            } else {
                fs.copySync(check, './mobile_ios_lib/MaplatView/Maplat.bundle/' + res1);
            }
        });
    });
}

function copyAssets() {
    remoteSrc(['assets.zip'], {
        base: 'http://code4history.github.io/MaplatMobileGw/'
    }).pipe(unzip())
        .pipe(gulp.dest('.'))
        .on('end', function() {
            ['', '_swift'].forEach(function(folder_end) {
                fs.readdirSync('./assets').forEach(function(res) {
                    fs.copySync('./assets/' + res, './mobile_ios_sample' + folder_end + '/mobile_ios_sample' + folder_end + '/' + res);
                });
            });
            fs.removeSync('./assets');
        });
}

gulp.task('assets_copy', function() {
    removeResource();
    copyResource();
    copyAssets();
    return Promise.resolve();
});





