import React from "react"

import InfoIcon from "~icons/InfoIcon"
import PlusIcon from "~icons/PlusIcon"
import PlayIcon from "~icons/PlayIcon"
import * as styles from "./Title.css"

const styles = {
  card: {
    backgroundImage:
      "url(https://images-na.ssl-images-amazon.com/images/I/91G5xnoFOqL._AC_SY741_.jpg)",
    backgroundPosition: "center",
    backgroundSize: "cover",
  },
  bottomInfo: {
    background: "linear-gradient(transparent, black)",
  },
}

export default () => {
  return (
    <div className="red-bag px-1 py-2 bg-white text-xss cursor-pointer select-none">
      <div className="flex mb-2 justify-end">
        <PlusIcon className="mr-3" />
        <InfoIcon />
      </div>
      <div
        className="bg-black w-40 h-56 font-light flex flex-col justify-between items-center"
        style={styles.card}
      >
        <div className="m-1 bg-green-600 text-black rounded-sm px-1 self-start">
          New Episodes
        </div>
        <PlayIcon />
        <div className="self-stretch" style={styles.bottomInfo}>
          <h4 className="self-start font-medium text-xs pl-1">Dark</h4>
          <div className="p-1 flex justify-between items-center self-stretch">
            <span>150 mins</span>
            <span>7.5</span>
          </div>
        </div>
      </div>
      <div className="text-black pt-2 font-thin">
        Superhero . Action . Thriller
      </div>
    </div>
  )
}
