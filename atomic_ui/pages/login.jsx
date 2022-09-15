import LogoSvg from '../components/logo_svg'
import { GITHUB_AUTH_URL } from '../config'

const Login = () => {
  return (
    <div className="px-4">
      <section className="max-w-lg mx-auto rounded-xl border mt-4 sm:mt-8 lg:mt-12 overflow-hidden shadow-shiny-button">
        <header className="bg-purple-600 flex justify-center">
          <figure className="p-4 text-slate-50">
            <LogoSvg />
          </figure>
        </header>

        <div className="p-6 pb-6 pt-4">
          <h3 className="text-slate-800 font-semibold text-xl pb-2">
            Sign In or Sign Up
          </h3>
          <p className=" text-slate-800 pb-5 leading-5">
            Click the button below to Sign Up or Sign In using Github 👇.
          </p>
          <a
            className="rounded-lg bg-black font-bold px-6 py-3 text-white block text-center hover:bg-opacity-90 transition-colors duration-200"
            href={`${GITHUB_AUTH_URL}`}
          >
            <i className="fab fa-github text-lg mr-2" />
            Continue with Github
          </a>
        </div>
      </section>
    </div>
  )
}

export default Login
