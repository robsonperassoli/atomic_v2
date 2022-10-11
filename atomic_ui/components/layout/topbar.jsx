import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import LogoSvg from '../logo_svg'
import UserMenu from './user_menu'

const MenuItem = ({ children, href }) => {
  const { pathname } = useRouter()
  const currentRoute = pathname === href
  return (
    <Link href={href} passHref>
      <a
        className={classNames(
          'hover:bg-slate-800 hover:bg-opacity-10 text-white font-medium tracking-wide py-2 px-4 hover:shadow-xl transition duration-200',
          currentRoute && 'bg-slate-800 bg-opacity-10'
        )}
      >
        {children}
      </a>
    </Link>
  )
}

const Topbar = () => {
  return (
    <header className="bg-purple-600 flex items-center">
      <figure className="p-4 text-slate-50">
        <LogoSvg />
      </figure>

      <div className="flex-grow border-l border-purple-400 ml-2 pl-2 py-1 min-h-full flex items-center">
        <MenuItem href="/">Tasks</MenuItem>
        <MenuItem href="/reports">Reports</MenuItem>
      </div>

      <UserMenu />
    </header>
  )
}

export default Topbar
