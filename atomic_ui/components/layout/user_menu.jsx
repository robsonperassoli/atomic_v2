import Image from 'next/image'

const UserMenu = () => {
  return (
    <button className="flex items-center self-stretch px-2 mr-2 gap-2 text-white hover:bg-gray-800 hover:bg-opacity-25 transition-colors duration-200">
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
    </button>
  )
}

export default UserMenu
