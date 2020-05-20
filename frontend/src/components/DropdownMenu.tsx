import React, { FunctionComponent, useState } from "react"
import { IoIosArrowDown } from "react-icons/io"
import { useTranslation } from "react-i18next"

export interface Item {
  id: number | string
  name: number | string
}

export interface DropdownMenuProps {
  items: Item[]
  currentItem: Item
  onChange: (item: Item) => void
}

const DropdownMenu: FunctionComponent<DropdownMenuProps> = ({
  items,
  currentItem,
  onChange,
}) => {
  const [menuOpened, setMenuOpened] = useState(false)

  return (
    <div className="relative flex flex-col items-center">
      <button
        className={`flex items-center relative z-10 underline-before ${
          menuOpened ? "highlight-before" : ""
        } text-white focus:outline-none hover:text-white`}
        onClick={() => setMenuOpened(!menuOpened)}
      >
        {currentItem.name}
        <IoIosArrowDown
          className={`ml-2 transition-transform duration-500 ease-in-out ${
            menuOpened ? "transform rotate-180" : ""
          }`}
          size="1em"
        />
      </button>
      {menuOpened && (
        <div
          className="mt-10 pt-2 absolute z-10 rounded bg-blue-900 overflow-auto"
          style={{ maxHeight: "10rem" }}
        >
          {items
            .filter(item => item.id !== currentItem.id)
            .map(item => (
              <button
                className="block px-4 py-1 mb-2 text-white hover:bg-blue-500 hover:text-black"
                key={item.id}
                onClick={() => {
                  onChange(item)
                  setMenuOpened(false)
                }}
              >
                {item.name}
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
