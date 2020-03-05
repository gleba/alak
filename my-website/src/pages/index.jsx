import React, { useCallback, useEffect, useState } from 'react'
import classnames from 'classnames'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import useBaseUrl from '@docusaurus/useBaseUrl'
import styles from './styles.module.css'
import { AtomRepl } from './AtomRepl'

const features = [
  {
    title: <>Легкость</>,
    imageUrl: 'img/synt.png',
    description: (
      <>
        Отсутствие сторонних зависимостей, размер библиотеки : <code>gzip 3кб</code>.
        <br />Максимальная скорость, минимальный расход памяти. Атомарные обновления в 1000 раз быстрее flyd.
        {/*Ядро атома gzip - 3кб, min.js - 8кб. С плагинами и фасадом gzip - 4кб, min.js - 18кб.*/}
      </>
    ),
  },
  {
    title: <>Сила в простоте</>,
    imageUrl: 'img/1200px-Oxytocin.svg.png',
    description: (
      <>
        Атом - это функция-контейнер содержащая значение и транслирующая его в дочерние функции-подписчики. <br />
        Дополнение свойств атомов возможно через создание своего расширения.
      </>
    ),
  },
  {
    title: <>Синтез практик</>,
    imageUrl: 'img/dna-tee.jpg',
    description: (
      <>
        Функция, обёрнутая в __proto__ или Proxy реализует идею наследовения в методах расширяющие функциональные возможности атома. <br />
        Отсутствие оператора присваивания освобождает от возни с переменными.
        Атом распространяет данные с истинной реактивностью по графу приложения.
      </>
    ),
  },
]

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl)
  return (
    <div className={classnames('col col--4', styles.feature)}>
      {imgUrl && (
        <div className='text--center'>
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

//console.log(useEffect)

function Home() {
  const context = useDocusaurusContext()
  const { siteConfig = {} } = context
  return (
    <Layout title={`Landing`} description='Description will go into a meta tag in <head />'>
      {/*<header className={classnames('hero hero--primary', styles.heroBanner)}>*/}
      {/*  <div className='container'>*/}
      {/*    <h1 className='hero__title'>{siteConfig.title}</h1>*/}
      {/*    <p className='hero__subtitle'>{siteConfig.tagline}</p>*/}
      {/*    <div className={styles.buttons}>*/}
      {/*      <Link className={classnames('button button--outline button--secondary button--lg start')}*/}
      {/*        to={useBaseUrl('docs/start')}> Инструкции </Link>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</header>*/}
      <main>
        <AtomRepl
          code={`const a = A();
a('some things');
trace(a());
trace(a());

a.up(v=> {
  trace("update listener:", v);
});
a('Hello World');
`}
        />
      </main>
      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className='container'>
              <div className='row'>
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  )
}

export default Home
