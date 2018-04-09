#!/bin/bash
for FILE in wavs/*.wav;
do
NEW_FILE=${FILE#wavs/}
NEW_FILE="mp3s/${NEW_FILE%.wav}.mp3"
echo $NEW_FILE
ffmpeg "$NEW_FILE" -i "$FILE" -codec:a libmp3lame -qscale:a 1;
done
