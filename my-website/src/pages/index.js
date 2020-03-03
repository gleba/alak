import React, { useCallback, useEffect, useState } from 'react'
import classnames from 'classnames'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import useBaseUrl from '@docusaurus/useBaseUrl'
import styles from './styles.module.css'
import { MirrorRepl } from './Mirror'
import { AtomRepl } from './AtomRepl'

const features = [
  {
    title: <>Легчайший вес</>,
    imageUrl: 'img/synt.png',
    description: (
      <>
        Отсутствие сторонних зависимостей. <br /> Размер библиотеки : <code>gzip 3кб</code>.
        {/*Ядро атома gzip - 3кб, min.js - 8кб. С плагинами и фасадом gzip - 4кб, min.js - 18кб.*/}
      </>
    ),
  },
  {
    title: <>Скорость и экономичность</>,
    imageUrl: 'img/1200px-Oxytocin.svg.png',
    description: (
      <>
        Атомарные обновления в 1000 раз быстрее flyd. Использование Proxy минимально расходует
        память.
      </>
    ),
  },
  {
    title: <>Синтез параддигм</>,
    imageUrl: 'img/dna-tee.jpg',
    description: (
      <>
        Атом алак - это функция-контейнер содержащая значение, с возможностью подписаться на
        обновление значения. <br />
        Расширения атома - это функции для выполнения операций над значением атома.
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
  //let codeInput = React.createRef()
  //useEffect(() => {
  //  console.log('fx')
  //
  //  //const c = document.getElementById("code")
  //  console.log(codeInput.current)
  //

  //}, [codeInput])

  //const [codeValue, setCode] = useState("f2unction myScript(){return 100;}")
  //const onCodeChange = (e, v)=>{
  //  const code = e.target.value
  //  //setCode(e.target.value)
  //  try {
  //    eval(code)
  //  } catch (e) {
  //    console.log(e)
  //  }
  //}
  return  (
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
          <AtomRepl code='const a = A();'/>
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
