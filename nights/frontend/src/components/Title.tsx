import React from 'react'

import InfoIcon from '~icons/InfoIcon'
import PlusIcon from '~icons/PlusIcon'
import PlayIcon from '~icons/PlayIcon'

import '../styles/Title.scss'

const styles = {
  card: {
    backgroundImage:
      'url(/static/frontend/images/dark.jpg)',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  },
}

export default () => {
  return (
    <div className="card-container px-1 py-2 hover:bg-white text-xss cursor-pointer select-none">
      <div className="top-info flex mb-2 justify-end">
        <PlusIcon className="mr-3 card-container-slide-reveal transition-500"/>
        <InfoIcon className="card-container-slide-reveal transition-200"/>
      </div>
      <div
        className="bg-black w-40 h-56 font-light flex flex-col justify-between items-center"
        style={styles.card}
      >
        <div className="m-1 bg-green-600 text-black rounded-sm px-1 self-start">
          New Episodes
        </div>
        <PlayIcon className="card-container-reveal"/>
        <div className="self-stretch h-gradient">
          <h4 className="card-container-reveal self-start font-medium text-xs pl-1">
            Dark
          </h4>
          <div className="p-1 flex justify-between items-center self-stretch">
            <span>150 mins</span>
            <span>7.5</span>
          </div>
        </div>
      </div>
      <div className="bottom-info card-container-reveal text-black pt-2 font-thin">
        Superhero . Action . Thriller
      </div>
    </div>
  )
}
