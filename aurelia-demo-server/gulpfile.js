
const del = require('del');
const gulp = require('gulp');
const sourcemap = require('gulp-sourcemaps');
const gls = require('gulp-live-server');

const transpiler = require('gulp-typescript');
const tsconfig = transpiler.createProject('tsconfig.json');

var liveserver = null;

gulp.task('clean', async() => {
    await del(["./dist/**/*"]);
});

gulp.task('copy-lib', () => {
    return gulp.src([
        "./node_modules/**/*"
        ])
        .pipe(gulp.dest("./dist/node_modules/"));
});

gulp.task("build", () => {
    return gulp.src([
        "./src/*.ts"
    ])
    .pipe(sourcemap.init({ loadMaps: true }))
    .pipe(tsconfig()).js
    .pipe(sourcemap.write("./", {includeContent: false, sourceRoot: '../src'}))
    .pipe(gulp.dest("./dist/"));
});

gulp.task("restart", () => {
    if (liveserver != null) {
        //console.log("stopping");
        liveserver.stop();
        liveserver.start();
        console.log("restarted");
    }
});

gulp.task("start", () => {
    if (liveserver == null) {
        liveserver = gls('./dist/api.js');
        liveserver.start();
        console.log("started");
    }
    
    gulp.watch(["./src/*.ts"], gulp.series("build", "restart"));
});

gulp.task("build-and-watch", gulp.series(
            'clean',
             'copy-lib',
             'build',
             'start')
);

gulp.task('default', gulp.series('build-and-watch'));
