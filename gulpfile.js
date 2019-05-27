var gulp         =  require('gulp');
var sass         =  require('gulp-sass');
var sourcemaps   =  require('gulp-sourcemaps');
var watch        =  require('gulp-watch');
var autoprefixer =  require('gulp-autoprefixer');
var cleanCss	 =  require('gulp-clean-css');
var del	 		 =  require('del');
var pug 		 =  require('gulp-pug');
var browserSync  =	require('browser-sync').create();
var uglify       =  require('gulp-uglify');
var imagemin 	 =  require('gulp-imagemin');

//удаляем папку dist
function clean(){
	return del(['dist/*'])
}
//компилируем pug и перемещаем в dist
/*function pug_comp(){
	return gulp.src('./src/*.pug')
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest('./dist'))
		.on('end', browserSync.reload);
}*/
function html(){
	return gulp.src('./src/*.html')
		.pipe(gulp.dest('./dist'))
		.on('end', browserSync.reload);
}
function js(){
	return gulp.src('./src/js/*')
		.pipe(uglify())
		.pipe(gulp.dest('./dist/js'))
		.pipe(browserSync.reload({
			stream: true
		}));
}
//перемещаем шрифты в dist
function fonts(){
	return gulp.src('./src/fonts/**/*')
		.pipe(gulp.dest('./dist/fonts'))
}
//перемещаем картинки в dist
function img(){
	return gulp.src('./src/img/*')
		.pipe(imagemin())
		.pipe(gulp.dest('./dist/img/'))
}

//компиляция файлов sass/scss и перемещаем в dist
function scss(){
	return gulp.src('./src/scss/main.scss')
		.pipe(sourcemaps.init())
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./dist/css'))
		.pipe(browserSync.reload({
			stream: true
		}));
}
//разварачиваем свой сервер
function server(){
	browserSync.init({
		server: {
			baseDir: './dist'
		},
		notify: false
	});
}
//следим за изменениями файлов в браузере
function watch_file(){
	/*gulp.watch('./src/*.pug', pug_comp);*/
	gulp.watch('./src/*.html', html);
	gulp.watch('./src/scss/*.scss', scss);
	gulp.watch('./src/js/*.js', js);	
}
//сборка всего
gulp.task('dev', gulp.series(clean,
	gulp.parallel(html, scss, js, fonts, img),
	gulp.parallel(watch_file, server)
	));



