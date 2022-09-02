import Topbar from './layout/topbar'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Topbar />
      <main className="container mx-auto">{children}</main>
    </div>
  )
}

export default Layout
