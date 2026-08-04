import type {
  Media,
  Recommendation,
  Result as ResultType,
} from '@/payload-types'

type ResultProps = {
  result: ResultType
}

export function Result({ result }: ResultProps) {
  const recommendations =
    result.recommendations?.filter(
      (recommendation): recommendation is Recommendation =>
        typeof recommendation === 'object',
    ) ?? []

  const pdfFile =
    result.pdfResource?.file &&
    typeof result.pdfResource.file === 'object'
      ? (result.pdfResource.file as Media)
      : null

  const externalResources = result.externalResources ?? []

  return (
    <section>
      <h1>{result.title}</h1>

      {result.description && <p>{result.description}</p>}

      {recommendations.length > 0 && (
        <div>
          <h2>Recommandations</h2>

          {recommendations.map((recommendation) => (
            <article key={recommendation.id}>
              <h3>{recommendation.title}</h3>

              {recommendation.description && (
                <p>{recommendation.description}</p>
              )}

              {recommendation.website && (
                <a
                  href={recommendation.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  Consulter le site
                </a>
              )}

              {recommendation.partners &&
                recommendation.partners.length > 0 && (
                  <div>
                    <h4>Partenaires</h4>

                    {recommendation.partners.map((partner, index) => {
                      const logo =
                        partner.logo &&
                        typeof partner.logo === 'object'
                          ? (partner.logo as Media)
                          : null

                      return (
                        <div
                          key={
                            partner.id ??
                            `${partner.name}-${index}`
                          }
                        >
                          {logo?.url && (
                            <img
                              src={logo.url}
                              alt={partner.name}
                              width={120}
                              height={60}
                            />
                          )}

                          {partner.website ? (
                            <a
                              href={partner.website}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {partner.name}
                            </a>
                          ) : (
                            <span>{partner.name}</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
            </article>
          ))}
        </div>
      )}

      {pdfFile?.url && (
        <div>
          {result.pdfResource?.label && (
            <h2>{result.pdfResource.label}</h2>
          )}

          <a
            href={pdfFile.url}
            target="_blank"
            rel="noreferrer"
          >
            {result.pdfResource?.buttonText ||
              'Télécharger le PDF'}
          </a>
        </div>
      )}

      {externalResources.length > 0 && (
        <div>
          <h2>Ressources externes</h2>

          {result.externalResourcesIntro && (
            <p>{result.externalResourcesIntro}</p>
          )}

          {externalResources.map((resource, index) => (
            <article
              key={
                resource.id ??
                `${resource.title}-${index}`
              }
            >
              <h3>{resource.title}</h3>

              {resource.description && (
                <p>{resource.description}</p>
              )}

              <a
                href={resource.url}
                target="_blank"
                rel="noreferrer"
              >
                Consulter la ressource
              </a>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}