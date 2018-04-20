import numpy as np
from scipy.io import wavfile

std_f = 440
f_array = np.arange(31)
f_array[0] = 0
f_array[1] = 10
for i in range(2, 31):
    f_array[i] = f_array[i - 1] + np.ceil((f_array[i] - 1) / 5) * 10
f_array[1:] = 1000 / f_array[1:]
f_array[0] = 200
sr = 44100
dur = 1
base = np.arange(sr * dur)
filt = np.ones(sr * dur)
fact = 10
for i in range(len(filt) // fact):
    filt[i] = fact * i / len(filt)
    filt[len(filt) - 1 - i] = filt[i]
data = np.sin(2 * np.pi * std_f / sr * base) * filt
#data = np.sin(2 * np.pi * std_f / sr * base)
fn = 'wavs/stdA.wav'
wavfile.write(fn, sr, data)
print(fn + ' created. ')
for i in range(len(f_array)):
    for j in (-1, 1):
        f = std_f * np.power(2, j * f_array[i] / 1200)
        data = np.sin(2 * np.pi * f / sr * base) * filt
        fn = 'wavs/lv' + str(i) + ('_l' if j == -1 else '_h') + '.wav'
        wavfile.write(fn, sr, data)
        print(fn + ' created. ')
