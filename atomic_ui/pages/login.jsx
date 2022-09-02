import { GITHUB_AUTH_URL } from '../config'

const Login = () => {
  return (
    <div className="max-w-lg mx-auto">
      <a
        className="rounded-lg bg-black font-bold px-6 py-3 text-white block text-center"
        href={`${GITHUB_AUTH_URL}`}
      >
        Login with Github
      </a>
    </div>
  )
}

export default Login
