let agg = {
    count: function () { return this.length; },
    sum: function (col) { return this.reduce((s, a) => s + a[col], 0); },
    avg: function (col) { return this.sum(col) / this.count(); },
    max: function (col) { return this.reduce((s, a) => s = s < a[col] ? a[col] : s, this[0][col]); },
    min: function (col) { return this.reduce((s, a) => s = s > a[col] ? a[col] : s, this[0][col]); }
};
let qry = {
    select: function (cols) { return this.map(r => { let p = {}; cols.map(c => p[c] = r[c]); return p; }); },
    where: function (qry) { let f = new Function('c', `return ${qry};`); let res = this.filter(r => f(r)); res.__proto__.__proto__ = qry; return res; },
    join: function (r, f) { let s = []; this.map(l => { r.array.forEach(r => { if (f(l, r)) s.push(Object.assign(l, r)); }); }); s.__proto__.__proto__ = qry; return s; },
    on: function (qry) { let f = new Function('l', 'r', `return ${qry};`); return { "right": this, "join": f }; },
    groupby: function (cols) {
        let g = [];
        this.map(e => { let kols = cols.map(r => e[r]); let key = kols.join("__"); g[key] = g[key] || []; g[key].push(e); });
        let res = []; for (let k in g) { let p = {}; k.split("__").map((c, n) => p[`key${n + 1}`] = c); p["rows"] = g[k]; res.push(p); } res.__proto__.__proto__ = qry; return res;
    },
    orderby: function (cols) {
        let f = cols.map((e, n, ar) => { let s = ar[n]; let c = e.replace(" asc", "").replace(" desc", ""); let d = s.replace(" asc", "").replace(" desc", ""); s = n > 0 ? ` && a["${d}"]===b["${d}"]` : ""; return new Function('a', 'b', `return ${e.indexOf("desc") > 0 ? `a["${c}"]>b["${c}"]` : `a["${c}"]<b["${c}"]`}${s}`); }); for (let i in f) this.sort(f[i]); return this;
    }
};
qry.__proto__ = agg;
let dml = {
    insert: function (row) { row["__id"] = Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36); this.push(row); },
    delete: function (row) { let i = this.findIndex(r => r["__id"] === row["__id"]); this.splice(i, 1); },
    update: function (row) { let i = this.findIndex(r => r["__id"] === row["__id"]); this[i] = Object.assign(this[i], row); }
};
dml.__proto__ = qry;
let db = {
    create: function (name, cols) { this[name] = []; this[name].__proto__.__proto__ = dml; },
    drop: function (name) { delete this[name]; }
};