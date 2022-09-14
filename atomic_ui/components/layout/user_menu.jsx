import Image from 'next/image'
import { Menu } from '@headlessui/react'
import { LOGOUT_URL } from '../../config'
import classNames from 'classnames'

const UserMenu = () => {
  return (
    <Menu as="div" className="relative self-stretch mr-2">
      <Menu.Button className="flex items-center h-full px-2 gap-2 text-white hover:bg-gray-800 hover:bg-opacity-25 transition-colors duration-200">
        <figure className="rounded-full overflow-hidden flex">
          <Image
            src="/images/cat.svg"
            width={50}
            height={50}
            alt="user profile picture"
          />
        </figure>

        <span className="text-lg medium tracking-wide">Robson Perassoli</span>
        <i className="fas fa-chevron-down text-xl" />
      </Menu.Button>
      <Menu.Items className="absolute right-2 origin-top-right mt-1 w-56 rounded-lg bg-white shadow-lg z-10 overflow-hidden">
        <Menu.Item>
          {({ active }) => (
            <a
              className={classNames(
                'p-3 font-medium  block text-gray-800',
                active && 'bg-slate-100'
              )}
              href={LOGOUT_URL}
            >
              <i className="fas fa-person-running text-purple-600 text-lg mr-2" />
              Logout
            </a>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  )
}

export default UserMenu
