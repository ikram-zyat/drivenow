import { useState, useEffect } from 'react'
import { CATS, FILTERS } from './data.js'
import { useCars, useCatImgs } from './store.js'
import Admin from './Admin.jsx'

function Car({ color, glow = '#cfe0ff' }) {
  return (
    <svg viewBox="0 0 400 160">
      <ellipse cx="205" cy="140" rx="180" ry="9" fill="#000" opacity=".35" />
      <path d="M28 112Q36 82 100 74L150 46Q205 34 262 46L312 74Q372 82 378 112L378 128H28Z" fill={color} stroke="#ffffff22" />
      <path d="M112 74L153 54Q205 46 250 54L292 74Z" fill="#0d1a33" stroke="#ffffff22" />
      <circle cx="110" cy="128" r="23" fill="#07090e" /><circle cx="110" cy="128" r="11" fill="#7f8896" />
      <circle cx="300" cy="128" r="23" fill="#07090e" /><circle cx="300" cy="128" r="11" fill="#7f8896" />
      <rect x="352" y="96" width="24" height="7" rx="3" fill={glow} />
    </svg>
  )
}

const Pic = ({ v, i = 0, glow }) =>
  v.imgs && v.imgs[i] ? <img src={v.imgs[i]} alt={v.n} /> : <Car color={v.col} glow={glow} />

const Logo = () => (
  <a className="logo" href="#/">
    <svg viewBox="0 0 40 20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 15V11l4-5h16l6 5h6v4" /><circle cx="11" cy="15" r="3" /><circle cx="29" cy="15" r="3" />
    </svg>
    DriveNow
  </a>
)

function Nav({ active }) {
  const links = [['Accueil', '#/'], ['Véhicules', '#/vehicules'], ['À propos', '#/'], ['Avis', '#/'], ['Contact', '#/']]
  return (
    <nav>
      <Logo />
      <div className="links">
        {links.map((l, i) => <a key={i} href={l[1]} className={active === i ? 'on' : ''}>{l[0]}</a>)}
      </div>
      <div className="r"><button className="btn o">Se connecter</button><button className="btn">S’inscrire</button></div>
    </nav>
  )
}

function VehicleCard({ v }) {
  return (
    <div className="v">
      <span className="tag">{v.c}</span><span className="h">♡</span>
      <Pic v={v} />
      <h3>{v.n}</h3><small>Ou similaire</small>
      <div className="sp"><span>👤 {v.s}</span><span>⚙ {v.b}</span><span>⛽ {v.f}</span></div>
      <div className="row">
        <div className="pr">{v.p}€<small>/jour</small></div>
        <a className="btn" href={`#/vehicule/${v.id}`}>Réserver</a>
      </div>
    </div>
  )
}

function Home() {
  const catImgs = useCatImgs()
  return (
    <>
      <Nav active={0} />
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}img/banner.jpg)` }} />
        <div className="t">
          <div className="eye">LOCATION DE VOITURES PREMIUM</div>
          <h1>Votre liberté<br /><b>sur quatre roues</b></h1>
          <p>Louez la voiture qui correspond à vos envies et partez à la découverte de nouveaux horizons, en toute simplicité.</p>
          <div className="feat">
            <div><i>✓</i>Véhicules récents<br />et bien entretenus</div>
            <div><i>⚡</i>Réservation rapide<br />et sécurisée</div>
            <div><i>☎</i>Assistance 24/7<br />partout dans le monde</div>
          </div>
        </div>
        <div className="search">
          <label>Lieu de prise en charge
            <select><option>Casablanca</option><option>Rabat</option><option>Marrakech</option></select>
          </label>
          <label>Date de début<input type="date" defaultValue="2025-05-12" /></label>
          <label>Date de fin<input type="date" defaultValue="2025-05-16" /></label>
          <a className="btn" href="#/vehicules">🔍 Rechercher</a>
        </div>
      </section>
      <section className="sec">
        <div className="row">
          <h2>Nos catégories</h2>
          <a href="#/vehicules" style={{ color: 'var(--acc)', fontSize: 12 }}>Voir toutes les catégories →</a>
        </div>
        <p className="sub">Choisissez la catégorie qui correspond à vos besoins</p>
        <div className="cats">
          {CATS.map((c) => (
            <a key={c[0]} className="cat" href="#/vehicules">
              {catImgs[c[0]] ? <img src={catImgs[c[0]]} alt={c[0]} /> : <Car color={c[2]} />}<b>{c[0]}</b><small>À partir de {c[1]}€/jour</small>
            </a>
          ))}
        </div>
      </section>
    </>
  )
}

function Sidebar({ active }) {
  const items = [['Accueil', '#/'], ['Véhicules', '#/vehicules'], ['Réservations', '#/reserver'], ['Mon compte', '#/vehicules'], ['Assistance', '#/vehicules']]
  return (
    <aside>
      <Logo /><br />
      {items.map((x, i) => <a key={i} href={x[1]} className={i === active ? 'on' : ''}>{x[0]}</a>)}
      <div className="promo"><b>Voyagez plus loin avec DriveNow</b>Des milliers de destinations vous attendent !</div>
    </aside>
  )
}

function List() {
  const [filter, setFilter] = useState('Tous')
  const [sort, setSort] = useState('')
  const [q, setQ] = useState('')
  const CARS = useCars()
  let list = CARS.filter((v) => (filter === 'Tous' || v.c === filter) && v.n.toLowerCase().includes(q.toLowerCase()))
  if (sort === 'a') list = [...list].sort((a, b) => a.p - b.p)
  if (sort === 'd') list = [...list].sort((a, b) => b.p - a.p)
  return (
    <div className="app">
      <Sidebar active={1} />
      <main>
        <div className="top">
          <input placeholder="Rechercher un véhicule, une marque…" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="user"><div className="av"></div><div>Ahmed Benali<small>Client</small></div></div>
        </div>
        <h2 style={{ fontSize: 24 }}>Tous nos véhicules</h2>
        <p style={{ color: 'var(--acc)', fontSize: 12 }}>Trouvez la voiture parfaite pour votre prochaine aventure</p>
        <div className="chips">
          {FILTERS.map((f) => <span key={f} className={'chip ' + (filter === f ? 'on' : '')} onClick={() => setFilter(f)}>{f}</span>)}
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Plus populaires</option><option value="a">Prix croissant</option><option value="d">Prix décroissant</option>
          </select>
        </div>
        <div className="grid">{list.map((v) => <VehicleCard key={v.id} v={v} />)}</div>
      </main>
    </div>
  )
}

function Detail({ id }) {
  const CARS = useCars()
  const [sel, setSel] = useState(0)
  const v = CARS.find((c) => c.id === id) || CARS[0]
  const imgs = v.imgs && v.imgs.length ? v.imgs : [0, 1, 2, 3, 4, 5]
  return (
    <>
      <Nav active={1} />
      <div style={{ padding: '18px 4vw 0' }}><a className="back" href="#/vehicules">← Retour aux résultats</a></div>
      <div className="det">
        <div>
          <div className="big"><Pic v={v} i={sel} glow="#9fd0ff" /></div>
          <div className="th">{imgs.map((_, i) => <div key={i} onClick={() => setSel(i)} style={{ borderColor: sel === i ? 'var(--acc)' : 'var(--line)' }}><Pic v={v} i={i} /></div>)}</div>
        </div>
        <div>
          <h2 style={{ fontSize: 26 }}>{v.n}</h2>
          <small style={{ color: 'var(--mut)' }}>Ou similaire</small>
          <div style={{ color: '#f5b301', margin: '6px 0' }}>★★★★★ <span style={{ color: 'var(--mut)', fontSize: 12 }}>4,8 · {v.c}</span></div>
          <div className="specs">
            <span>👤 {v.s} places</span><span>⚙ {v.b}</span><span>⛽ {v.f}</span>
            <span>❄ Climatisation</span><span>📍 GPS</span><span>ᛒ Bluetooth</span>
          </div>
          <div className="pr" style={{ fontSize: 30 }}>{v.p}€<small>/jour</small>{' '}
            <small style={{ color: 'var(--acc)', border: '1px solid var(--line)', borderRadius: 12, padding: '2px 10px' }}>Économisez jusqu’à 15%</small>
          </div>
          <div className="dates">
            <label className="f">Date de début<input type="date" defaultValue="2025-05-12" /></label>
            <label className="f">Date de fin<input type="date" defaultValue="2025-05-16" /></label>
          </div>
          <a className="btn" style={{ display: 'block', textAlign: 'center', padding: 13 }} href="#/reserver">Réserver maintenant</a>
        </div>
      </div>
      <div className="tabs"><span className="on">Description</span><span>Équipements</span><span>Conditions de location</span><span>Avis</span></div>
      <p className="desc">La {v.n} allie élégance, performance et technologie de pointe. Parfaite pour les voyages d’affaires comme pour les escapades en famille, elle offre un confort exceptionnel et une conduite dynamique.</p>
    </>
  )
}

function Checkout() {
  const [step, setStep] = useState(1)
  const [pay, setPay] = useState(0)
  const names = ['Informations', 'Paiement', 'Confirmation']
  const methods = [['Carte bancaire', 'Visa, Mastercard, etc.'], ['PayPal', 'Paiement sécurisé'], ['Virement bancaire', '1-3 jours']]
  return (
    <>
      <Nav active={1} />
      <div className="co">
        <h2 style={{ fontSize: 22 }}>Finaliser la réservation</h2>
        <div className="steps">
          {names.map((t, i) => (
            <span key={t} style={{ display: 'contents' }}>
              {i > 0 && <hr />}
              <span className={step >= i + 1 ? 'on' : ''}><i>{i + 1}</i>{t}</span>
            </span>
          ))}
        </div>
        {step === 1 && (
          <div className="cols">
            <div className="box">
              <h4>Détails du véhicule</h4>
              <div className="row" style={{ justifyContent: 'flex-start', gap: 14 }}>
                <div style={{ width: 110 }}><Car color="#1a1d24" /></div>
                <div><b>BMW Série 3</b><br /><small style={{ color: 'var(--mut)' }}>5 places · Automatique · Diesel</small></div>
              </div>
              <div className="f">Dates de location<input value="12/05/2025 – 16/05/2025 (4 jours)" readOnly /></div>
              <div className="f">Lieu de prise en charge<input value="Aéroport Mohammed V, Casablanca" readOnly /></div>
            </div>
            <div className="box">
              <h4>Informations personnelles</h4>
              <label className="f">Nom complet<input defaultValue="Ahmed Benali" /></label>
              <label className="f">Email<input defaultValue="ahmed.benali@example.com" /></label>
              <label className="f">Téléphone<input defaultValue="+212 6 12 34 56 78" /></label>
              <label><input type="checkbox" defaultChecked /> J’accepte les <a style={{ color: 'var(--acc)' }}>conditions générales de location</a></label>
              <button className="btn" style={{ alignSelf: 'flex-end' }} onClick={() => setStep(2)}>Continuer →</button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="box">
            <h4>Choisissez votre méthode de paiement</h4>
            <div className="pay">
              {methods.map((m, i) => (
                <div key={m[0]} className={pay === i ? 'on' : ''} onClick={() => setPay(i)}>{m[0]}<br /><small>{m[1]}</small></div>
              ))}
            </div>
            <div className="row"><span>Total : <b>180€</b> (4 jours)</span><button className="btn" onClick={() => setStep(3)}>Payer →</button></div>
          </div>
        )}
        {step === 3 && (
          <div className="box ok">
            <div style={{ fontSize: 42, color: 'var(--acc)' }}>✓</div>
            <h2>Réservation confirmée</h2>
            <p style={{ color: 'var(--mut)' }}>BMW Série 3 · 12/05/2025 – 16/05/2025<br />Un email de confirmation vous a été envoyé.</p>
            <a className="btn" style={{ alignSelf: 'center' }} href="#/vehicules">Voir les véhicules</a>
          </div>
        )}
      </div>
    </>
  )
}

export default function App() {
  const [hash, setHash] = useState(location.hash || '#/')
  useEffect(() => {
    const on = () => { setHash(location.hash || '#/'); window.scrollTo(0, 0) }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  let page = <Home />, p = 0
  if (hash.startsWith('#/vehicule/')) { page = <Detail key={hash} id={hash.split('/')[2]} />; p = 1 }
  else if (hash === '#/vehicules') { page = <List />; p = 1 }
  else if (hash === '#/reserver') { page = <Checkout key={hash} />; p = 2 }
  if (hash === '#/admin') return <Admin />
  const bn = [['Accueil', '#/'], ['Véhicules', '#/vehicules'], ['Réservations', '#/reserver'], ['Compte', '#/vehicules']]
  return (
    <>
      {page}
      <div className="bn">{bn.map((x, i) => <a key={i} href={x[1]} className={i === p ? 'on' : ''}>{x[0]}</a>)}</div>
    </>
  )
}