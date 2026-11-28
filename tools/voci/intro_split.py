# Cuts the recorded start-card lines (intro-raw/<hero>_<lang><n>.mp3) into one clip per line
# (intro-clips/<lang>/<chapter>_<i>.mp3), the same way split.py cuts the word clips (silences + expected length).
# Batches: Killer = one file per language (k_ro.mp3, k_en.mp3); Boon = two (b_ro1/2, b_en1/2, 11 lines each).
# T13: cuts each generated batch (raw/<hero><n>.mp3) into one clip per line (clips/<hero>/NN_key.mp3).
# A cut can only be made inside a real silence. Which silences are line boundaries is chosen so that every clip
# lasts about as long as its text should (number of syllables), with a bonus for longer silences.
import subprocess, re, sys, json, os, math
import intro as I
VOW = re.compile(r'[aeiouăâîy]+', re.I)
def weight(t): return max(1.0, len(VOW.findall(t))) + 0.6 * len(re.findall(r'[.!?,]', t))
def probe(path):
    r = subprocess.run(['ffmpeg','-hide_banner','-i',path,'-af','silencedetect=n=-40dB:d=0.3','-f','null','-'],capture_output=True,text=True).stderr
    m = re.search(r'Duration: (\d+):(\d+):([\d.]+)', r); dur = int(m.group(1))*3600 + int(m.group(2))*60 + float(m.group(3))
    st = [float(x) for x in re.findall(r'silence_start: ([\d.-]+)', r)]; en = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', r)]
    if len(st) > len(en): en.append(dur)
    return dur, list(zip(st, en))
def choose(dur, gaps, texts):
    n = len(texts); w = [weight(t) for t in texts]
    first = gaps[0][1] if gaps and gaps[0][0] <= 0.15 else 0.0
    last = gaps[-1][0] if gaps and gaps[-1][1] >= dur - 0.05 else dur
    g = [x for x in gaps if x[0] > 0.15 and x[1] < dur - 0.05]
    a = (last - first - sum(max(0, x[1]-x[0]) for x in g) * 0.5) / sum(w)
    m = len(g); INF = 1e9
    def seg(i, j):      # speech from after gap i (-1 = start) to before gap j (m = end)
        s = first if i < 0 else g[i][1]; e = last if j >= m else g[j][0]; return s, e
    best = [[INF]*m for _ in range(n)]; prev = [[-1]*m for _ in range(n)]
    for j in range(m):
        s, e = seg(-1, j); L = e - s
        if L > 0.1: best[0][j] = (math.log(L/(a*w[0])))**2 - 0.6*(g[j][1]-g[j][0])
    for k in range(1, n-1):
        for j in range(k, m):
            for i in range(k-1, j):
                if best[k-1][i] >= INF: continue
                s, e = seg(i, j); L = e - s
                if L <= 0.1: continue
                v = best[k-1][i] + (math.log(L/(a*w[k])))**2 - 0.6*(g[j][1]-g[j][0])
                if v < best[k][j]: best[k][j] = v; prev[k][j] = i
    bj, bv = -1, INF
    for j in range(n-2, m):
        s, e = seg(j, m); L = e - s
        if L <= 0.1 or best[n-2][j] >= INF: continue
        v = best[n-2][j] + (math.log(L/(a*w[n-1])))**2
        if v < bv: bv, bj = v, j
    cuts = []; j = bj
    for k in range(n-2, -1, -1): cuts.append(j); j = prev[k][j]
    cuts = cuts[::-1]
    segs = []; i = -1
    for j in cuts + [m]:
        segs.append(seg(i, j)); i = j
    return segs, a

os.makedirs('intro-clips/ro', exist_ok=True); os.makedirs('intro-clips/en', exist_ok=True); rep = {}
for lang in ('ro', 'en'):
    for who, files in (('k', ['k_' + lang]), ('b', ['b_%s1' % lang, 'b_%s2' % lang])):
        L = I.lines(lang, who); per = -(-len(L) // len(files))
        for fi, f in enumerate(files):
            part = L[fi * per:(fi + 1) * per]; path = 'intro-raw/%s.mp3' % f
            dur, gaps = probe(path); segs, a = choose(dur, gaps, [t for _, _, t in part])
            for (key, i, t), (s, e) in zip(part, segs):
                s = max(0, s - 0.06); e = min(dur, e + 0.12); out = 'intro-clips/%s/%s_%d.mp3' % (lang, key, i)
                subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', path, '-ss', '%.3f' % s, '-to', '%.3f' % e, '-ac', '1', '-ar', '24000', '-b:a', '40k', out], check=True)
                rep[out] = [round(s, 2), round(e, 2), t]
json.dump(rep, open('intro-split-report.json', 'w'), ensure_ascii=False, indent=1)
print(len(rep), 'clips')
