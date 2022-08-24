defmodule AtomicWeb.AuthController do
  use AtomicWeb, :controller

  def request(conn, _params) do
    conn
    |> text("ok")
  end

  def callback(%{assigns: %{ueberauth_auth: auth_data}} = conn, _params) do
    IO.inspect(auth_data)

    conn
    |> put_resp_cookie("token", "test")
    |> redirect(external: "http://localhost:3000/")
  end

  def callback(%{assigns: %{ueberauth_failure: failure}} = conn, _params) do
    IO.inspect(failure)

    conn
    |> text("error")
  end
end
