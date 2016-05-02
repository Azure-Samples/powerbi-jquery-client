var gulp = require('gulp')
    , ts = require('gulp-typescript')
    ;
    
gulp.task('compile', function () {
    return gulp.src('src/**/*.ts')
        .pipe(ts())
        .pipe(gulp.dest('src'));
});
