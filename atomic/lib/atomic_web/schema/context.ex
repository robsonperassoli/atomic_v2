defmodule AtomicWeb.Schema.Context do
  @moduledoc """
  Context used to include custom data into the absinthe context.

  The context resides in the graph resolution and is used by the resolvers and middleware.
  """

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
