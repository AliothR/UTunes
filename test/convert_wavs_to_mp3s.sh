#!/bin/bash
for FILE in *.wav;
do
ffmpeg "${FILE%.*}.mp3" -i "$FILE" -codec:a libmp3lame -qscale:a 1;
done
