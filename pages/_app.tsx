import { AppProps } from 'next/app'
import { useEffect } from 'react'
import React from 'react'
import ReactDOM from 'react-dom'

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      import('@axe-core/react').then((axe) => {
        axe.default(React, ReactDOM, 1000)
      })
    }
  }, [])

  return <Component {...pageProps} />
}

export default MyApp

