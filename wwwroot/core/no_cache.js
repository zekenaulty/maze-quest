let scripts = document.querySelectorAll('script');
let links = document.querySelectorAll('link');

const v = new Date().getTime();

scripts.forEach((s) => {
    if (s.src.indexOf('no_cache.js') < 0) {
        if (s.src.indexOf('?') > -1) {
            s.src += `&no_cache=${v}`;
        } else {
            s.src += `?no_cache=${v}`;
        }
    }
});

links.forEach((s) => {
    if (s.src.indexOf('?') > -1) {
        s.href += `&no_cache=${v}`;
    } else {
        s.href += `?no_cache=${v}`;
    }
});