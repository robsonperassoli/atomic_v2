defmodule AtomicWeb.AuthController do
  use AtomicWeb, :controller

  alias Atomic.Accounts
  alias Atomic.Accounts.Session
  alias AtomicWeb.UserAuth

  def request(conn, _params) do
    conn
    |> text("ok")
  end

  def callback(%{assigns: %{ueberauth_auth: auth}} = conn, _params) do
    with {:ok, user} <- Accounts.sign_in_with_provider(auth),
         {:ok, %Session{token: token}} <- Accounts.create_session(user) do
      conn
      |> put_resp_cookie(UserAuth.cookie().key, token, UserAuth.cookie().opts)
      |> redirect(external: UserAuth.post_auth_redirect_url())
    end
  end

  def callback(%{assigns: %{ueberauth_failure: _failure}} = conn, _params) do
    conn
    |> redirect(external: UserAuth.post_auth_redirect_url())
  end

  def logout(conn, _params) do
    conn
    |> delete_resp_cookie(UserAuth.cookie().key, UserAuth.cookie().opts)
    |> redirect(external: UserAuth.post_auth_redirect_url())
  end
end
