import Hero from "@/components/Hero";
import Tiles from "@/components/Tiles";

/**
 * Server component. Everything a crawler needs to understand the page —
 * headline, positioning, the four claims, the descriptive paragraph — is
 * plain server-rendered HTML. The interactive panel is a client component,
 * but Next still pre-renders its markup, so nothing meaningful depends on
 * JavaScript running.
 */
export default function Page() {
  return (
    <>
      <nav className="nav">
        <div className="wrap nav-in">
          <div className="mark">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="logo" src="/kemist-logo-horizontal-green.svg"
                 alt="Kemist" width={285} height={60} />
          </div>
          <div className="nav-note">Early access</div>
        </div>
      </nav>

      <header className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="eyebrow"><i /> Launching soon</span>
            <h1>Billing that keeps up with the queue.</h1>
            <p className="lede">
              Offline-first billing and inventory for retail pharmacies. Three
              letters finds the pack, the batch and the rack — and the backup
              runs while you sleep.
            </p>
          </div>
          <Hero />
        </div>
      </header>

      <section className="tiles">
        <Tiles />
      </section>

      <section className="attrs">
        <div className="wrap attr-grid">
          <div className="attr">
            <span className="mk" />
            <h2>Ultrafast</h2>
            <p>Matches land before you finish the word. Nothing between the keystroke and the bill.</p>
          </div>
          <div className="attr">
            <span className="mk" />
            <h2>Flexible</h2>
            <p>Backup schedules, terminals, racks and roles — set to the way your shop already runs.</p>
          </div>
          <div className="attr">
            <span className="mk" />
            <h2>Modern</h2>
            <p>Built for this decade&apos;s hardware, and for staff who have never read a manual.</p>
          </div>
          <div className="attr">
            <span className="mk" />
            <h2>Reliable</h2>
            <p>Right batch, right price, right register — and yesterday back in a few clicks.</p>
          </div>
        </div>
      </section>

      <section className="close">
        <div className="wrap">
          <p>
            Your data stays in your shop.{" "}
            <span>Backed up on your schedule. Restored in a few clicks.</span>
          </p>
          <p className="fine">
            Kemist is retail pharmacy software for Indian medical shops — fast
            billing, batch-wise inventory with pack, rack and expiry, GST and drug
            registers, and automatic encrypted backups you can restore yourself —
            built to run offline on ordinary shop hardware, on one counter or
            across a group of shops.
          </p>
        </div>
      </section>

      <footer>
        <div className="wrap foot-in">
          <div>© {new Date().getFullYear()} Kemist</div>
          <div><a href="mailto:admin@kemist.in">admin@kemist.in</a></div>
        </div>
      </footer>
    </>
  );
}
