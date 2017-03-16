'use strict';
var gulp = require('gulp');
var browserSync = require('browser-sync');

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: './'
        },
        // external 指定すると、実行時のアクセスURLがIPアドレス指定側で開くことができる
        open: 'external',
    });

    // 指定フォルダ以下のファイルを監視
    gulp.watch(['./**/*.html', './**/*.css', './**/*.scss', './**/*.js'], function() {
        // ファイルに変更があれば同期しているブラウザをリロード
        browserSync.reload();
    });
});

gulp.task('default', ['browser-sync']);
