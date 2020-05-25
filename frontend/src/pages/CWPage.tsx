import React, {FunctionComponent, useState} from "react";

import CWRow from "~components/containers/CWRow";
import {ViewHit} from "~core/interfaces/view-hit";
import {getHistory} from "~api/title";
import {useDisposableEffect} from "~hooks";
import {useAuth} from "~context/auth-context";
import {Redirect} from "react-router-dom";
import {useTranslation} from "react-i18next";


const CWPage: FunctionComponent = () => {
  const {token} = useAuth()
  const {titles} = useTitles(token)
  const {t} = useTranslation()

  if (!token) return <Redirect to="/landing/login" />

  return titles && <>
    <h1 className="text-xl font-semibold">{t('continueWatching')}</h1>
    <div className="rounded-lg mt-4" style={{background: '#00000055'}}>
      <CWRow responsive={{desktop: {breakpoint: {max: 6000, min: 464}, items: 2}}} showTitle={false} row={titles} />
    </div>
  </>

}

const useTitles = (token: string) => {

  const [titles, setTitles] = useState<ViewHit[]>(null)
  const [error, setError] = useState(null)

  const getTitles = async (disposed: boolean) => {
    try {
      const res = await getHistory()
      if (!disposed) {
        setTitles(res.results)
        error && setError(null)
      }
    } catch (error) {
      setError(error)
      console.error('unlucky 😔', error)
    }
  }

  useDisposableEffect((disposed) => {
    getTitles(disposed)
  }, [token])

  return {titles, error}
}

export default CWPage
