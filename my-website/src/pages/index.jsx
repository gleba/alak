import React, { useCallback, useEffect, useState } from 'react'
import classnames from 'classnames'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import useBaseUrl from '@docusaurus/useBaseUrl'
import styles from './styles.module.css'
import { AtomRepl } from './AtomRepl'
import { codeSamples } from './codeSamples'

const features = [
  {
    title: <>Легкость</>,
    imageUrl: 'img/synt.png',
    description: (
      <>
        ● Отсутствие сторонних зависимостей, размер библиотеки : <code>gzip 3кб</code>.
        <br />▪ Атомарные обновления в 1000 раз быстрее flyd и RxJS. Максимальная скорость,
        минимальный расход памяти.
        {/*Ядро атома gzip - 3кб, min.js - 8кб. С плагинами и фасадом gzip - 4кб, min.js - 18кб.*/}
      </>
    ),
  },
  {
    title: <>Сила в простоте</>,
    imageUrl: 'img/1200px-Oxytocin.svg.png',
    description: (
      <>
        ● Атом - это функция-контейнер содержащая значение и транслирующая его в дочерние
        функции-подписчики. <br />▪ Дополнение свойств атомов возможно через создание расширяющих
        методов.
      </>
    ),
  },
  {
    title: <>Синтез практик</>,
    imageUrl: 'img/dna-tee.jpg',
    description: (
      <>
        ● Атом распространяет данные по графу приложения реактивно. Отсутствие оператора
        присваивания освобождает от перекладывания данных по переменными.
        <br /> ▪ Идея наследовения реализиована в методах расширяющих функциональные возможности
        атома.
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

function useCodeSamples() {
  //const [sampleName, setSampleName] = useState()
  const [sampleCode, setSampleCode] = useState(codeSamples[0].code)
  const [selectedId, setSelectedId] = useState(0)
  const [samples, setSamples] = useState(codeSamples)
  function select(id) {
    setSelectedId(id)
    setSampleCode(codeSamples[id].code)
  }
  return [samples, sampleCode, selectedId, select]
}

function Home() {
  const context = useDocusaurusContext()
  const { siteConfig = {} } = context
  const [samples, code, id, selectSample] = useCodeSamples()
  return (
    <Layout title={`Landing`} description='Description will go into a meta tag in <head />'>
      <header className={classnames('hero hero--primary', styles.heroBanner)}>
        <div className='container'>
          <h1 className='hero__title'>{siteConfig.title}</h1>
          <p className='hero__subtitle'>{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={classnames('button button--outline button--secondary button--lg start')}
              to={useBaseUrl('docs/start')}
            >
              Инструкции
            </Link>
          </div>
        </div>
      </header>
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

      <main>
        <div className='container'>
          <div className='home-repl'>
            <div className='try'>
              <h4>Попробуй</h4>
              <div>
                {samples.map((v, idx) => (
                  <li
                    className={idx == id ? 'selected' : ''}
                    key={idx}
                    onClick={() => selectSample(idx)}
                  >
                    {v.title}
                  </li>
                ))}
              </div>
            </div>

            <div className='full-width'>
              <AtomRepl code={code}/>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default Home
