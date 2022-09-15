import Image from 'next/image'

const avatars = [
  '1.jpeg',
  '2.jpg',
  '3.jpeg',
  '4.png',
  '5.png',
  '6.png',
  '7.jpeg',
  '8.png',
  '9.webp',
  '10.png',
]

const UserAvatar = ({ userId }) => {
  if (!userId) {
    return null
  }

  const avatarIndex = userId[userId.length - 1] || 0

  return (
    <figure className="rounded-full overflow-hidden flex">
      <Image
        src={`/images/avatars/${avatars[avatarIndex]}`}
        width={50}
        height={50}
        alt="user profile picture"
      />
    </figure>
  )
}

export default UserAvatar
