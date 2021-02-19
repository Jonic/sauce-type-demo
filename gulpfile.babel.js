import { dest, parallel, series, src, task, watch } from 'gulp'

import autoprefixer from 'autoprefixer'
import browserify from 'browserify'
import buffer from 'vinyl-buffer'
import cssnano from 'cssnano'
import debug from 'gulp-debug'
import minify from 'gulp-minify'
import pkg from './package.json'
import postcss from 'gulp-postcss'
import prepend from 'gulp-prepend'
import rename from 'gulp-rename'
import sass from 'gulp-dart-sass'
import source from 'vinyl-source-stream'
import sourcemaps from 'gulp-sourcemaps'

const { name, version, homepage, author } = pkg
const year = new Date().getFullYear()

const banner = (filename) => `/**
* ${name} ${version}
* ${homepage}
*
* ${filename}
* Copyright ${year}, ${author}
*/\n`

const compileSass = () => {
  console.log('- Compile sauce.scss')

  return src('src/sauce.scss')
    .pipe(sourcemaps.init())
    .pipe(
      sass().on('error', (error) => console.log(error))
    )
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(prepend(banner('sauce.min.css')))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('assets/css'))
    .pipe(debug())
}

const watchSass = () => {
  return watch('./src/**/*.scss').on('change', compileSass)
}

task('build', series(compileSass))
task('default', series(compileSass, parallel(watchSass)))
