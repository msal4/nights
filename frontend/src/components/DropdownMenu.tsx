import React, { FunctionComponent, useState } from "react"
import { IoIosArrowDown } from "react-icons/io"
import { useTranslation } from "react-i18next"
import { Topic } from "~core/interfaces/topic"
import { capitalizeFirst } from "~utils/common"

export interface DropdownMenuProps {
  topics: Topic[]
  currentTopic: Topic
  onChange: (topic: Topic) => void
}

const DropdownMenu: FunctionComponent<DropdownMenuProps> = ({
  topics,
  currentTopic,
  onChange,
}) => {
  const [menuOpened, setMenuOpened] = useState(false)

  return (
    <div className="relative flex flex-col items-center mb-5">
      <button
        className={`flex items-center relative underline-before ${
          menuOpened ? "highlight-before" : ""
        } text-white focus:outline-none hover:text-white`}
        onClick={() => setMenuOpened(!menuOpened)}
      >
        {capitalizeFirst(currentTopic.name)}
        <IoIosArrowDown
          className={`ml-2 transition-transform duration-500 ease-in-out ${
            menuOpened ? "transform rotate-180" : ""
          }`}
          size="1em"
        />
      </button>
      {menuOpened && (
        <div
          className="mt-10 pt-2 absolute z-20 rounded bg-gray-800 overflow-auto"
          style={{ maxHeight: "10rem" }}
        >
          {topics
            .filter(topic => topic.id !== currentTopic.id)
            .map(topic => (
              <button
                className="block px-4 py-1 mb-2 w-full text-white hover:bg-blue-500 hover:text-black"
                key={topic.id}
                onClick={() => {
                  onChange(topic)
                  setMenuOpened(false)
                }}
              >
                {capitalizeFirst(topic.name)}
              </button>
            ))}
        </div>
      )}
      {menuOpened && (
        <div
          className="fixed top-0 bottom-0 left-0 right-0 w-full h-full"
          onClick={() => setMenuOpened(false)}
        />
      )}
    </div>
  )
}

export default DropdownMenu
