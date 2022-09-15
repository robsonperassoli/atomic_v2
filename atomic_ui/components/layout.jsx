import Topbar from './layout/topbar'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Topbar />

      <main className="container mx-auto px-4 ms:px-0">{children}</main>
    </div>
  )
}

export default Layout
