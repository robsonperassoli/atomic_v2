defmodule AtomicWeb.AuthController do
  use AtomicWeb, :controller

  alias Atomic.Accounts

  def request(conn, _params) do
    conn
    |> text("ok")
  end

  def callback(%{assigns: %{ueberauth_auth: auth}} = conn, _params) do
    with {:ok, user} <- Accounts.sign_in_with_provider(auth) do
      conn
      |> put_resp_cookie("token", to_string(user.id))
      |> redirect(external: post_auth_redirect_url())
    end
  end

  def callback(%{assigns: %{ueberauth_failure: failure}} = conn, _params) do
    IO.inspect(failure)

    conn
    |> text("error")
  end

  defp post_auth_redirect_url() do
    Application.get_env(:atomic, :frontend_app)[:auth_redirect_url]
  end
end
