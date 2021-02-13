import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: 'Integrate your data',
    link: 'read/api',
    imageUrl: 'img/api.svg',
    description: (
      <>
        Integrate your application with the Intellischool Data Platform using
        our GraphQL or SIF (RESTful) APIs.
      </>
    ),
  },
  {
    title: 'Understand our platform',
    link: 'read/data-platform',
    imageUrl: 'img/data-platform.svg',
    description: (
      <>
        Learn more about the architecture of the Intellischool Data Platform and
        our distributed data model.
      </>
    ),
  },
  {
    title: 'Implement LTI',
    link: 'read/lti',
    imageUrl: 'img/lti.svg',
    description: (
      <>
        Integrate Intellischool products into your LTI-compatible system with
        LTI Launch and LTI Services.
      </>
    ),
  },
];

function Feature({imageUrl, title, description, link}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3><Link to={useBaseUrl(link)}>{title}</Link></h3>
      <p>{description}</p>
      <div className="text--center">
        <Link
          className={clsx(
            'button button--outline button--secondary'
          )}
          to={useBaseUrl(link)}>
          Get started
        </Link>
      </div>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
