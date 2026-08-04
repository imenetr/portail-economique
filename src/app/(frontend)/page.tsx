import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import styles from './home.module.css'

export const metadata: Metadata = {
  title: 'Accueil',
  description:
    'Un portail pour orienter les entreprises et porteurs de projets vers les services et financements France–Tunisie.',
}

export default function HomePage() {
  return (
    <main className={styles.home}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          L&rsquo;équipe économique France en Tunisie accompagne tous vos
          projets
        </h1>

        <p className={styles.heroDescription}>
          Un portail simple pour orienter entreprises et porteurs de projets
          vers les dispositifs et financements répondant à vos besoins.
        </p>

        <Link href="/questionnaire" className={styles.cta}>
          <span>Laissez-vous guider</span>
          <span aria-hidden>→</span>
        </Link>

        <Image
          src="/Eco-portal-logo.svg"
          alt="Logo Eco Portal"
          width={400}
          height={200}
          className={styles.heroLogo}
          priority
        />
      </section>

      <section className={styles.section}>
        <div className={styles.features}>
          <article className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.featureRow}>
                <span className={styles.icon} aria-hidden>
                  ⚡
                </span>

                <div>
                  <h2 className={styles.featureTitle}>Rapide et guidé</h2>
                  <p className={styles.featureText}>
                    Un chemin simple en moins de deux minutes pour cibler vos
                    besoins et vous orienter.
                  </p>
                </div>
              </div>
            </div>
          </article>

          <article className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.featureRow}>
                <span className={styles.icon} aria-hidden>
                  ✓
                </span>

                <div>
                  <h2 className={styles.featureTitle}>Pertinent</h2>
                  <p className={styles.featureText}>
                    Des recommandations adaptées aux entreprises et porteurs de
                    projets, issues d&rsquo;acteurs reconnus.
                  </p>
                </div>
              </div>
            </div>
          </article>

          <article className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.featureRow}>
                <span className={styles.icon} aria-hidden>
                  +
                </span>

                <div>
                  <h2 className={styles.featureTitle}>Mise en relation</h2>
                  <p className={styles.featureText}>
                    Un accès direct aux services et dispositifs pour passer
                    rapidement à l&rsquo;action.
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className={styles.infoSection}>
        <p className={styles.infoLeft}>
          L&rsquo;Ambassade de France en Tunisie comprend plusieurs services à
          vocation économique qui accompagnent les entreprises et les pouvoirs
          publics : le Service économique régional, Business France,
          l&rsquo;Agence française de développement, Proparco et Expertise
          France.
        </p>

        <p className={styles.infoRight}>
          Le Comité Tunisie des Conseillers du commerce extérieur de la France,
          la Chambre de commerce et d&rsquo;industrie tuniso-française et les
          opérateurs privés référencés complètent ce dispositif.
        </p>
      </section>

      <section className={styles.section}>
        <div className={styles.figures}>
          <article className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.figureValue}>+20</div>
              <p className={styles.figureLabel}>
                Partenaires et dispositifs
              </p>
            </div>
          </article>

          <article className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.figureValue}>4</div>
              <p className={styles.figureLabel}>
                Étapes de parcours guidé
              </p>
            </div>
          </article>

          <article className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.figureValue}>2 min.</div>
              <p className={styles.figureLabel}>
                Pour obtenir vos recommandations
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className={styles.finalSection}>
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <p className={styles.finalText}>
              Découvrez les acteurs, les solutions et les financements adaptés
              à votre projet grâce à un parcours entièrement guidé.
            </p>
          </div>
        </div>

        <Link href="/questionnaire" className={styles.cta}>
          <span>Laissez-vous guider</span>
          <span aria-hidden>→</span>
        </Link>
      </section>
    </main>
  )
}