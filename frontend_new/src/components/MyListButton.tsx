import React, { useEffect, useState } from "react"

import { Redirect } from "react-router"

import { InfoIconButton } from "./common/Buttons"
import { FaCheck, FaPlus } from "react-icons/fa"
import { removeFromMyList, addToMyList } from "../api/title"
import { useAuth } from "../context/auth-context"
import { useTranslation } from "react-i18next"

export interface MyListButtonProps {
  id: string | number
  className?: string
}

export default ({ id, className }: MyListButtonProps) => {
  const { t } = useTranslation()

  const [inMyList, setInMyList] = useState<boolean>(false)
  const [redirect, setRedirect] = useState(false)

  const { token } = useAuth()

  const add = async () => {
    if (!token) return setRedirect(true)
    try {
      await addToMyList(id)
      setInMyList(true)
    } catch (err) {
      console.log(err)
    }
  }

  const remove = async () => {
    if (!token) return setRedirect(true)
    try {
      await removeFromMyList(id)
      setInMyList(false)
    } catch (err) {
      console.log(err)
    }
  }

  // const check = async () => {
  //   try {
  //     if (!loading && inMyList === null) {
  //       setLoading(true)
  //       await checkMyList(id)
  //       setInMyList(true)
  //     }
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // useEffect(() => {
  //   check()
  // }, [])

  if (redirect) return <Redirect to="/login" />

  return (
    <InfoIconButton
      className={`hidden md:flex ${className}`}
      onClick={inMyList ? remove : add}
      icon={
        inMyList ? (
          <FaCheck className="text-xl" />
        ) : (
          <FaPlus className="text-xl" />
        )
      }
    >
      {t("myList")}
    </InfoIconButton>
  )
}
