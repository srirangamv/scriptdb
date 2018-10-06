let agg = {
    count: function () { return this.length; },
    sum: function (col) { return this.reduce((s, a) => s + a[col], 0); },
    avg: function (col) { return this.sum(col) / this.count(); },
    max: function (col) { return this.reduce((s, a) => s = s < a[col] ? a[col] : s, (this[0]||0)[col]); },
    min: function (col) { return this.reduce((s, a) => s = s > a[col] ? a[col] : s, (this[0]||0)[col]); }
};
let qry = {
    select: function (cols) { return this.map(r => { let p = {}; cols.map(c => p[c] = r[c]); return p; }); },
    where: function (query) { let f = new Function('c', `return ${query};`); let res = this.filter(r => f(r)); Object.assign(res, qry, agg); return res; },
    jointo: function ({ r, f }) {
        let s = []; this.map(l => { r.forEach(rr => { if (f(l, rr)){ let n = Object.assign({}, l, rr); s.push(n); }}); }); Object.assign(s, qry, agg); return s;
    },
    on: function (qry) { let f = new Function('l', 'r', `return ${qry};`); return { "r": [...this], "f": f }; },
    groupby: function (cols) {
        let g = new Map();
        this.map(e => { let kols = cols.map(r => e[r]); let key = kols.join("__"); g.set(key, g.get(key) || []); b = g.get(key); b.push(e); });
        let res = []; for (let [k, v] of g) { let p = {}; k.split("__").map((c, n) => p[`key${n + 1}`] = c); p["rows"] = v; Object.assign(p["rows"], qry, agg); res.push(p); } Object.assign(res, qry, agg); return res;
    },
    orderby: function (cols) {
        let rows = [...this];
        let f = cols.map((e, n, ar) => { let s = ar[n]; let c = e.replace(" asc", "").replace(" desc", ""); let d = s.replace(" asc", "").replace(" desc", ""); s = n > 0 ? ` && a["${d}"]===b["${d}"]` : ""; return new Function('a', 'b', `return ${e.indexOf("desc") > 0 ? `a["${c}"]<b["${c}"]` : `a["${c}"]>b["${c}"]`}${s}`); }); for (let i of f) rows.sort(i); return rows;
    }
};
let dml = {
    insert: function (row) { row["__id"] = Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36); this.push(row); },
    delete: function (row) { let i = this.findIndex(r => r["__id"] === row["__id"]); this.splice(i, 1); },
    update: function (row) { let i = this.findIndex(r => r["__id"] === row["__id"]); this[i] = Object.assign(this[i], row); }
};
let db = {
    create: function (name, cols) { this[name] = []; Object.assign(this[name], dml, qry, agg); },
    drop: function (name) { delete this[name]; }
};