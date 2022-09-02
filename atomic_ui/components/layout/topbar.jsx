import LogoSvg from '../logo_svg'
import UserMenu from './user_menu'

const Topbar = () => {
  return (
    <header className="bg-purple-600 flex items-center justify-between">
      <figure className="p-4">
        <LogoSvg />
      </figure>
      <UserMenu />
    </header>
  )
}

export default Topbar
