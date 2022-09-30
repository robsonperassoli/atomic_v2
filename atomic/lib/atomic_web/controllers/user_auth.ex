defmodule AtomicWeb.UserAuth do
  @moduledoc """
  Authentication helper functions used by the AuthController
  """

  import Plug.Conn
  import Phoenix.Controller

  alias Atomic.Accounts
  alias Atomic.Accounts.User

  @max_age 60 * 60 * 24 * 60
  @cookie_key "user_token"
  @cookie_options [sign: true, max_age: @max_age]
  @websocket_token_salt "user websocket"

  def fetch_current_user(conn, _opts) do
    conn = fetch_cookies(conn, signed: [@cookie_key])

    token = conn.cookies[@cookie_key]
    user = token && Accounts.get_user_by_session_token(token)

    conn
    |> assign(:current_user, user)
  end

  def redirect_if_user_is_authenticated(conn, _opts) do
    case conn.assigns[:current_user] do
      nil ->
        conn

      _user ->
        conn
        |> redirect(external: post_auth_redirect_url())
        |> halt()
    end
  end

  def create_websocket_token(%User{id: user_id}) do
    Phoenix.Token.sign(AtomicWeb.Endpoint, @websocket_token_salt, to_string(user_id))
  end

  def auth_websocket_token(token) do
    AtomicWeb.Endpoint
    |> Phoenix.Token.verify(@websocket_token_salt, token)
    |> case do
      {:ok, user_id} ->
        Accounts.get_user(user_id)

      e ->
        e
    end
  end

  def post_auth_redirect_url() do
    Application.get_env(:atomic, :frontend_app)[:auth_redirect_url]
  end

  def cookie() do
    %{
      opts: @cookie_options,
      key: @cookie_key
    }
  end
end
