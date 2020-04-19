import React, { FunctionComponent } from "react"

import InfoIcon from "~icons/InfoIcon"
import PlusIcon from "~icons/PlusIcon"
import PlayIcon from "~icons/PlayIcon"

import "../styles/Title.scss"
import { Title } from "~core/interfaces/title"

const styles = {
  card: {
    backgroundImage: "url(/static/frontend/images/dark.jpg)",
    backgroundPosition: "center",
    backgroundSize: "cover",
  },
}

export interface TitleProps {
  title: Title
}

const Title: FunctionComponent<TitleProps> = ({ title }) => {
  return (
    <div className="card-container px-1 py-2 hover:bg-white text-xss cursor-pointer select-none">
      <div className="top-info flex mb-2 justify-end">
        <PlusIcon className="mr-3 card-container-slide-reveal transition-500" />
        <InfoIcon className="card-container-slide-reveal transition-200" />
      </div>
      <div
        className="bg-black w-40 h-56 font-light flex flex-col justify-between items-center"
        style={styles.card}
      >
        <div className="m-1 bg-green-600 text-black rounded-sm px-1 self-start">
          {title.is_new ? (title.type === "s" ? "New Episodes" : "New") : ""}
        </div>
        <PlayIcon className="card-container-reveal" />
        <div className="self-stretch v-gradient">
          <h4 className="card-container-reveal self-start font-medium text-xs pl-1">
            {title.name}
          </h4>
          <div className="p-1 flex justify-between items-center self-stretch">
            <span>{new Date(title.released_at).getFullYear()}</span>
            <span>{title.rating}</span>
          </div>
        </div>
      </div>
      <div className="bottom-info card-container-reveal text-black pt-2 font-thin">
        {title.genres
          .map((g) => g.name.charAt(0).toUpperCase() + g.name.slice(1))
          .join(" • ")}
      </div>
    </div>
  )
}

export default Title
