import { useState } from 'react'
import { useCars, setCars, resetCars } from './store.js'
import { FILTERS } from './data.js'

// Identifiants de démonstration (non sécurisés : tout est côté navigateur)
const ADMIN = { email: 'admin@drivenow.ma', pass: 'admin123' }
const EMPTY = { n: '', c: 'Berline', p: '', b: 'Automatique', f: 'Diesel', s: 5, imgs: [] }

function compress(file) {
  return new Promise((res) => {
    const r = new FileReader()
    r.onload = () => {
      const im = new Image()
      im.onload = () => {
        const k = Math.min(1, 800 / im.width)
        const c = document.createElement('canvas')
        c.width = im.width * k
        c.height = im.height * k
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height)
        res(c.toDataURL('image/jpeg', 0.7))
      }
      im.src = r.result
    }
    r.readAsDataURL(file)
  })
}

export default function Admin() {
  const cars = useCars()
  const [auth, setAuth] = useState(sessionStorage.getItem('dn_admin') === '1')
  const [login, setLogin] = useState({ email: '', pass: '' })
  const [err, setErr] = useState('')
  const [f, setF] = useState(EMPTY)
  const [editId, setEditId] = useState(null)

  const logo = (
    <a className="logo" href="#/">DriveNow <small style={{ color: 'var(--mut)', fontWeight: 400 }}>Admin</small></a>
  )

  if (!auth) {
    return (
      <div className="co" style={{ maxWidth: 420, paddingTop: 80 }}>
        <div className="box">
          {logo}
          <h4>Connexion administrateur</h4>
          <label className="f">Email<input value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} /></label>
          <label className="f">Mot de passe<input type="password" value={login.pass} onChange={(e) => setLogin({ ...login, pass: e.target.value })} /></label>
          {err && <small style={{ color: '#ff6b6b' }}>{err}</small>}
          <button className="btn" onClick={() => {
            if (login.email === ADMIN.email && login.pass === ADMIN.pass) {
              sessionStorage.setItem('dn_admin', '1'); setAuth(true)
            } else setErr('Email ou mot de passe incorrect.')
          }}>Se connecter</button>
          <small style={{ color: 'var(--mut)' }}>Démo : admin@drivenow.ma / admin123</small>
        </div>
      </div>
    )
  }

  const set = (k, v) => setF({ ...f, [k]: v })
  const addPhotos = async (e) => {
    const out = await Promise.all([...e.target.files].map(compress))
    setF({ ...f, imgs: [...f.imgs, ...out].slice(0, 4) })
    e.target.value = ''
  }
  const save = () => {
    if (!f.n.trim() || !(Number(f.p) > 0)) return alert('Indique le nom et un prix par jour valide.')
    const car = { ...f, p: Number(f.p), s: Number(f.s), col: f.col || '#1a1d24', id: editId || 'c' + Date.now() }
    const list = editId ? cars.map((c) => (c.id === editId ? car : c)) : [...cars, car]
    if (setCars(list)) { setF(EMPTY); setEditId(null) }
  }
  const remove = (c) => {
    if (confirm('Supprimer « ' + c.n + ' » ?')) setCars(cars.filter((x) => x.id !== c.id))
  }

  return (
    <>
      <nav>
        {logo}
        <div className="links"><a href="#/vehicules">Voir le site</a></div>
        <div className="r"><button className="btn o" onClick={() => { sessionStorage.removeItem('dn_admin'); setAuth(false) }}>Déconnexion</button></div>
      </nav>
      <div className="adm">
        <div className="box">
          <h4>{editId ? 'Modifier la voiture' : 'Ajouter une voiture'}</h4>
          <label className="f">Nom<input value={f.n} placeholder="Ex : Peugeot 208" onChange={(e) => set('n', e.target.value)} /></label>
          <div className="dates">
            <label className="f">Catégorie
              <select value={f.c} onChange={(e) => set('c', e.target.value)}>{FILTERS.slice(1).map((x) => <option key={x}>{x}</option>)}</select>
            </label>
            <label className="f">Prix par jour (€)<input type="number" min="1" value={f.p} onChange={(e) => set('p', e.target.value)} /></label>
            <label className="f">Boîte
              <select value={f.b} onChange={(e) => set('b', e.target.value)}><option>Automatique</option><option>Manuelle</option></select>
            </label>
            <label className="f">Carburant
              <select value={f.f} onChange={(e) => set('f', e.target.value)}><option>Diesel</option><option>Essence</option><option>Hybride</option><option>Électrique</option></select>
            </label>
            <label className="f">Places<input type="number" min="1" max="9" value={f.s} onChange={(e) => set('s', e.target.value)} /></label>
          </div>
          <label className="f">Photos (4 maximum, la première est la photo principale)
            <input type="file" accept="image/*" multiple onChange={addPhotos} />
          </label>
          <div className="ph">
            {f.imgs.map((src, i) => (
              <div key={i}><img src={src} alt="" /><button onClick={() => setF({ ...f, imgs: f.imgs.filter((_, j) => j !== i) })}>×</button></div>
            ))}
          </div>
          <div className="row">
            <button className="btn" onClick={save}>{editId ? 'Enregistrer' : 'Ajouter la voiture'}</button>
            {editId && <button className="btn o" onClick={() => { setF(EMPTY); setEditId(null) }}>Annuler</button>}
          </div>
        </div>
        <div className="box">
          <div className="row"><h4>Voitures ({cars.length})</h4>
            <button className="btn o" onClick={() => confirm('Revenir aux voitures de départ ?') && resetCars()}>Réinitialiser</button>
          </div>
          {cars.map((c) => (
            <div className="ar" key={c.id}>
              {c.imgs && c.imgs[0] ? <img src={c.imgs[0]} alt="" /> : <span className="nop">Pas de photo</span>}
              <div><b>{c.n}</b><br /><small style={{ color: 'var(--mut)' }}>{c.c} · {c.p}€/jour</small></div>
              <button className="btn o" onClick={() => { setF({ ...EMPTY, ...c }); setEditId(c.id); window.scrollTo(0, 0) }}>Modifier</button>
              <button className="btn o" onClick={() => remove(c)}>Supprimer</button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
