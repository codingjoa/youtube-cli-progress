const fs = require('fs');
const ytdl = require('ytdl-core');

// tty에 Progress를 그려주는 라이브러리
const cliProgress = process.env.PROGRESS === 'true' && require('cli-progress');
function YtdlProgress(cliProgress) {
  this.progress = new cliProgress.SingleBar();
  this.progress.start(1, 0);
}
YtdlProgress.prototype.update = function update(startBytes, totalBytes) {
  this.progress.setTotal(totalBytes);
  this.progress.update(startBytes);
};
YtdlProgress.prototype.stop = function stop() {
  this.progress.stop();
}

const a = process.argv[2];
const ex = typeof a === 'string' && a.replace(/^(.{1,})(.{11})$/, '$2');
ex && getReadYtdlStream(ex);

function getReadYtdlStream(path) {
  const stream = ytdl(path, {
    qaulity: 'highestaudio',
    filter: 'audioonly' // format => format.container === 'mp4'
  });
  // progress-bar 모듈을 활성화한 경우에만 사용 (환경변수 PROGRESS=true)
  const progress = cliProgress && new YtdlProgress(cliProgress);
  progress && stream.on('progress', (c, s, e) => progress.update(s, e));
  stream.on('info', () => {
    setImmediate(getWriteStream, path, stream, progress);
  }) // ytdl stream 은 info와 progress 이벤트만 외부에 노출된다.
}
function processYtdlStream(ytdlStream, fileStream) {
  ytdlStream.pipe(fileStream);
}
function getWriteStream(path, ytdlStream, progress) {
  const filename = `${path}.m4a`;
  const stream = fs.createWriteStream(filename);
  stream.on('ready', () => setImmediate(processYtdlStream, ytdlStream, stream));
  stream.on('error', err => {
    ytdlStream.destroy();
    progress && progress.stop();
    console.error(err);
  });
  stream.on('finish', () => {
    progress && progress.stop();
    console.log(`${filename} download finish.`);
  });
  stream.on('close', () => console.log(`${filename} closed.`))
}
