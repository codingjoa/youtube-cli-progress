# youtube-cli-progress

[ytdl-core](https://www.npmjs.com/package/ytdl-core)를 활용한 유튜브 다운로더

## progress bar 미사용

```bash
#!/bin/bash
node . https://www.youtube.com/watch?v=3K3MMtoG8rY
```

## progress bar 사용

```bash
#!/bin/bash
PROGRESS=true node . https://www.youtube.com/watch?v=3K3MMtoG8rY
```
