defmodule AtomicWeb.Schema.Context do
  @behaviour Plug

  def init(opts), do: opts

  def call(conn, _) do
    conn = AtomicWeb.UserAuth.fetch_current_user(conn, [])

    Absinthe.Plug.put_options(conn, context: build_context(conn))
  end

  def build_context(conn) do
    case conn.assigns[:current_user] do
      nil ->
        %{}

      current_user ->
        %{
          current_user: current_user
        }
    end
  end
end
