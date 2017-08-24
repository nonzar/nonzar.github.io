var gulp = require("gulp");
var base64 = require("gulp-base64");
var cleanCss = require("gulp-clean-css");
gulp.task("css", function () {
    gulp.src("src/styles/index.css").pipe(base64({
        maxImageSize: 8 * 1024
    })).pipe(cleanCss()).pipe(gulp.dest("src/styles/"));
});
gulp.task("auto", function () {
    gulp.watch("src/styles/index.css", ["css"]);
});
gulp.task("default", ["css", "auto"]);