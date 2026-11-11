/* "Bản nhạc của Hương" — tương tác
   1. Bộ tổng hợp âm thanh dùng chung (Web Audio, không cần file)
   2. Cái tên biết hát (trang chủ)
   3. Danh sách tiết mục: mỗi bài một cao độ khi rê chuột
   4. Đàn piano ở chân trang                                        */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 0. Menu con "Dự án" ---------- */
  const sub = $('.has-sub'), subBtn = $('.sub-btn');
  if (sub && subBtn) {
    const setOpen = on => { sub.classList.toggle('open', on); subBtn.setAttribute('aria-expanded', on); };
    subBtn.addEventListener('click', e => { e.stopPropagation(); setOpen(!sub.classList.contains('open')); });
    document.addEventListener('click', e => { if (!sub.contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { setOpen(false); } });
  }

  /* ---------- 1. Âm thanh ---------- */
  const SEMI = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 };
  const hz = note => {
    const m = /^([A-G]#?)(\d)$/.exec(note);
    return 440 * Math.pow(2, ((+m[2] + 1) * 12 + SEMI[m[1]] - 69) / 12);
  };
  let ctx = null, out = null, unlocked = false;
  const audio = () => {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      out = ctx.createGain(); out.gain.value = .3;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3400;
      out.connect(lp).connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  };
  /* trình duyệt chỉ cho phát tiếng sau lần bấm/chạm đầu tiên */
  const unlock = () => { unlocked = true; audio(); };
  addEventListener('pointerdown', unlock, { once: true, capture: true });
  addEventListener('keydown', unlock, { once: true, capture: true });

  /* timbre: 'piano' (phím đàn) hoặc 'voice' (giọng ngân, có rung) */
  const play = (note, { timbre = 'piano', at = 0, len = 1.6 } = {}) => {
    const ac = audio(); if (!ac) return;
    const f = hz(note), t = ac.currentTime + at;
    const env = ac.createGain();
    env.connect(out);
    env.gain.setValueAtTime(.0001, t);
    if (timbre === 'voice') {
      env.gain.exponentialRampToValueAtTime(.9, t + .06);
      env.gain.setValueAtTime(.9, t + len * .55);
      env.gain.exponentialRampToValueAtTime(.0001, t + len);
      const vib = ac.createOscillator(), vibAmt = ac.createGain();
      vib.frequency.value = 5.4; vibAmt.gain.value = f * .006;
      vib.connect(vibAmt);
      [[1, 'sine', .7], [2, 'sine', .18], [3, 'triangle', .07]].forEach(([h, type, g]) => {
        const o = ac.createOscillator(), og = ac.createGain();
        o.type = type; o.frequency.value = f * h; og.gain.value = g;
        vibAmt.connect(o.frequency);
        o.connect(og).connect(env); o.start(t); o.stop(t + len + .05);
      });
      vib.start(t); vib.stop(t + len + .05);
    } else {
      env.gain.exponentialRampToValueAtTime(1, t + .01);
      env.gain.exponentialRampToValueAtTime(.32, t + .25);
      env.gain.exponentialRampToValueAtTime(.0001, t + len);
      [[1, 'triangle', .6], [2, 'sine', .24], [3, 'sine', .08], [4, 'sine', .04]].forEach(([h, type, g]) => {
        const o = ac.createOscillator(), og = ac.createGain();
        o.type = type; o.frequency.value = f * h; o.detune.value = (Math.random() - .5) * 4; og.gain.value = g;
        o.connect(og).connect(env); o.start(t); o.stop(t + len + .05);
      });
    }
  };

  /* ---------- 2. Cái tên biết hát ---------- */
  const singing = $('#singing');
  if (singing) {
    /* thang ngũ cung Đô trưởng; mỗi chữ cái một bậc → vẽ thành đường giai điệu */
    const SCALE = ['C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5', 'E5', 'G5', 'A5'];
    const MELODY = [3, 4, 5, 4, 3, 2, 4, 5, 7, 6, 5, 4, 3, 5, 4, 5, 6, 5];
    const letters = $$('.ltr', singing);
    letters.forEach((el, i) => {
      const deg = MELODY[i % MELODY.length];
      el.dataset.note = SCALE[deg];
      el.style.setProperty('--lift', ((4.5 - deg) * 0.035).toFixed(3) + 'em');  // nốt cao nằm cao hơn
      el.style.setProperty('--d', i);
    });
    const flash = (el, ms = 380) => { el.classList.add('on'); setTimeout(() => el.classList.remove('on'), ms); };
    const sound = (el, opts) => { if (unlocked) play(el.dataset.note, opts); };

    letters.forEach(el => {
      el.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { sound(el, { timbre: 'voice', len: .7 }); flash(el); } });
      el.addEventListener('pointerdown', () => { unlock(); play(el.dataset.note, { timbre: 'voice', len: .8 }); flash(el); });
    });

    /* nút "Nghe tên mình": hát cả tên, chữ sáng lần lượt theo nhịp */
    const btn = $('#singBtn');
    let timers = [];
    const stop = () => { timers.forEach(clearTimeout); timers = []; letters.forEach(l => l.classList.remove('on')); btn.setAttribute('aria-pressed', 'false'); };
    btn && btn.addEventListener('click', () => {
      unlock();
      if (btn.getAttribute('aria-pressed') === 'true') return stop();
      btn.setAttribute('aria-pressed', 'true');
      const beat = .26;
      let t = 0;
      letters.forEach((el, i) => {
        const prev = el.previousElementSibling;
        const isRest = i > 0 && (!prev || prev.classList.contains('rest'));   // nghỉ giữa các tiếng
        if (isRest) t += beat;
        const last = i === letters.length - 1;
        play(el.dataset.note, { timbre: 'voice', at: t, len: last ? 1.4 : beat * 1.9 });
        timers.push(setTimeout(() => flash(el, last ? 1100 : beat * 1000 * 1.4), t * 1000));
        t += last ? 0 : beat;
      });
      timers.push(setTimeout(stop, (t + 1.4) * 1000));
    });
  }

  /* ---------- 3. Danh sách tiết mục ---------- */
  const SET_NOTES = ['C5', 'D5', 'E5', 'G5', 'A5', 'C6'];
  $$('.set[data-pitch]').forEach(a => {
    a.addEventListener('pointerenter', e => {
      if (e.pointerType === 'mouse' && unlocked) play(SET_NOTES[+a.dataset.pitch % 6], { len: .9 });
    });
  });

  /* ---------- 4. Đàn piano ---------- */
  const piano = $('#piano');
  if (piano) {
    const press = k => { if (!k) return; play(k.dataset.note); k.classList.add('down'); };
    const release = k => k && k.classList.remove('down');
    const releaseAll = () => $$('.k.down', piano).forEach(release);
    piano.addEventListener('pointerdown', e => {
      const k = e.target.closest('.k'); if (!k) return;
      e.preventDefault(); unlock(); press(k);
      piano.setPointerCapture?.(e.pointerId);
    });
    /* kéo ngón qua phím (cả chuột lẫn cảm ứng) */
    piano.addEventListener('pointermove', e => {
      if (!e.buttons && e.pointerType === 'mouse') return;
      if (!$('.k.down', piano)) return;
      const k = document.elementFromPoint(e.clientX, e.clientY)?.closest('.k');
      if (k && piano.contains(k) && !k.classList.contains('down')) { releaseAll(); press(k); }
    });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => piano.addEventListener(ev, releaseAll));
    piano.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.k')) { e.preventDefault(); press(e.target); } });
    piano.addEventListener('keyup', e => e.target.matches('.k') && release(e.target));

    const byKey = {};
    $$('.k', piano).forEach(k => { if (k.dataset.kb) byKey[k.dataset.kb] = k; });
    addEventListener('keydown', e => {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey || /^(input|textarea|select)$/i.test(e.target.tagName)) return;
      const k = byKey[e.key.toLowerCase()];
      if (k) { e.preventDefault(); press(k); }
    });
    addEventListener('keyup', e => release(byKey[(e.key || '').toLowerCase()]));
  }

  if (reduce) $$('.ltr').forEach(l => l.style.removeProperty('--d'));
})();
