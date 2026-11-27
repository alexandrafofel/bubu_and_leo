# T13: cuts each generated batch (raw/<hero><n>.mp3) into one clip per line (clips/<hero>/NN_key.mp3).
# A cut can only be made inside a real silence. Which silences are line boundaries is chosen so that every clip
# lasts about as long as its text should (number of syllables), with a bonus for longer silences.
import subprocess, re, sys, json, os, math
import catalog as c
VOW = re.compile(r'[aeiouăâîy]+', re.I)
def weight(t): return max(1.0, len(VOW.findall(t))) + 0.6 * len(re.findall(r'[.!?,]', t))
def probe(path):
    r = subprocess.run(['ffmpeg','-hide_banner','-i',path,'-af','silencedetect=n=-38dB:d=0.12','-f','null','-'],capture_output=True,text=True).stderr
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
os.makedirs('clips', exist_ok=True); rep = {}
for hero, L in (('boon', c.BOON), ('killer', c.KILLER)):
    os.makedirs(f'clips/{hero}', exist_ok=True)
    for b in range(4):
        part = L[b*11:(b+1)*11]; p = f'raw/{hero}{b}.mp3'; dur, gaps = probe(p)
        segs, a = choose(dur, gaps, [x[1] for x in part])
        # one gain per batch: its loudest part reaches -4 dB (an mp3 can overshoot a little when it is decoded)
        vd = subprocess.run(['ffmpeg','-hide_banner','-i',p,'-af','volumedetect','-f','null','-'],capture_output=True,text=True).stderr
        mx = float(re.search(r'max_volume: ([-\d.]+) dB', vd).group(1)); gain = -4.0 - mx
        for k, ((s, e), line) in enumerate(zip(segs, part)):
            s = max(0, s - 0.04); e = min(dur, e + 0.06); idx = b*11 + k
            out = f'clips/{hero}/{idx:02d}_{line[0]}.mp3'
            subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss',f'{s:.3f}','-to',f'{e:.3f}','-i',p,'-af',
                f'volume={gain:.2f}dB,afade=t=in:d=0.01,afade=t=out:st={max(0,e-s-0.05):.3f}:d=0.05','-ac','1','-ar','24000','-c:a','libmp3lame','-b:a','56k',out],check=True)
            rep[out] = dict(text=line[1], dur=round(e-s,2), expect=round(a*weight(line[1]),2))
json.dump(rep, open('split-report.json','w'), ensure_ascii=False, indent=1)
bad = [(k, v) for k, v in rep.items() if not (0.25 <= v['dur'] <= 3.2) or v['dur'] > 2.2*v['expect']+0.3 or v['dur'] < 0.4*v['expect']]
print(len(rep), 'clips;', len(bad), 'doubtful')
for k, v in bad: print(' ', k, v)
