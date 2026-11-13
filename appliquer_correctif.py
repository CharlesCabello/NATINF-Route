from pathlib import Path
import re, sys
p=Path(sys.argv[1] if len(sys.argv)>1 else "index.html")
if not p.is_file():
    raise SystemExit("Placez ce script à côté du fichier index.html de TACTIK V5.5.")
s=p.read_text(encoding="utf-8")
if "TACTIK V5.6 — vacation compacte" in s:
    raise SystemExit("Correctif déjà appliqué.")
start=s.index("function vacRender(){")
end=s.index("function vacHistoryRender()", start)
s=s[:start]+'''function vacRender(){
 const v=vacToday();
 const now=new Date();
 const today=vacLocalDate();
 const time=String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
 const active=!!v && v.day===today && (v.from<=v.to ? time>=v.from && time<v.to : time>=v.from || time<v.to);
 return `<section class="vac-card vac-compact"><div class="vac-compact-head"><span class="vac-indicator ${active?'is-active':''}" aria-hidden="true"></span><strong>${active?'Vacation en cours':v?'Vacation du jour':'Aucune vacation aujourd’hui'}</strong><button class="vac-compact-edit" ${v?`data-vac-edit="${v.id}"`:'data-vac-new="1"'}>${v?'Modifier':'Ajouter'}</button></div>${v?`<div class="vac-compact-line">${profile==='g'?'Gendarmerie nationale':'Police nationale'} · ${escapeHtml(v.unit)}</div><div class="vac-compact-line">${vacDateLabel(v.day)} · ${escapeHtml(v.from)} – ${escapeHtml(v.to)} · ${vacHours(vacMinutes(v))} prévues</div>`:`<div class="vac-compact-line">Aucun horaire théorique enregistré.</div>`}${vacError?`<p class="mc-error">${escapeHtml(vacError)}</p>`:''}</section>`;
}
'''+s[end:]
css="""
/* TACTIK V5.6 — vacation compacte */
.vac-times{grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;gap:16px!important}
.vac-times label{min-width:0!important;overflow:hidden;font-size:11px!important}
.vac-times input[type="time"]{font-size:12px!important;line-height:1.2!important;letter-spacing:-.5px!important;padding:8px 2px!important;min-width:0!important;max-width:100%!important;appearance:auto}
.vac-times input[type="time"]::-webkit-datetime-edit{font-size:12px!important;letter-spacing:-.5px!important;padding:0!important}
.vac-times input[type="time"]::-webkit-date-and-time-value{min-width:0!important;text-align:center!important}
.vac-compact{padding:12px 14px!important;margin-bottom:12px!important}
.vac-compact-head{display:flex;align-items:center;gap:8px;font-size:13px}
.vac-compact-head strong{flex:1}
.vac-indicator{width:8px;height:8px;border-radius:50%;background:#a6b1c0;flex:none}
.vac-indicator.is-active{background:#22ae62;box-shadow:0 0 0 3px #22ae6220;animation:vac-pulse 2.6s ease-in-out infinite}
@keyframes vac-pulse{0%,100%{opacity:1}50%{opacity:.3}}
@media(prefers-reduced-motion:reduce){.vac-indicator.is-active{animation:none}}
.vac-compact-line{font-size:11px;line-height:1.5;color:#65758a;margin-top:3px;overflow-wrap:anywhere}
.vac-compact-edit{border:0;background:transparent;color:#1c63a0;font-size:11px;font-weight:700;padding:5px;cursor:pointer}
body.theme-dark .vac-compact-line{color:#a9b9ce}
"""
s=s.replace("</style>",css+"</style>",1)
s=s.replace("V5.5","V5.6")
p.write_text(s,encoding="utf-8")
print("TACTIK V5.6 : index.html modifié. Les données locales ne sont pas touchées.")
