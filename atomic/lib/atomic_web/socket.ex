defmodule AtomicWeb.Socket do
  @moduledoc false
  use Phoenix.Socket

  use Absinthe.Phoenix.Socket,
    schema: AtomicWeb.Schema

  @impl true
  def connect(%{"token" => token}, socket, _connect_info) when is_binary(token) do
    token
    |> AtomicWeb.UserAuth.auth_websocket_token()
    |> case do
      {:ok, user} ->
        socket =
          socket
          |> assign(:current_user, user)
          |> Absinthe.Phoenix.Socket.put_options(
            context: %{
              current_user: user
            }
          )

        {:ok, socket}

      e ->
        e
    end
  end

  def connect(_params, _socket, _connect_info) do
    {:error, :unauthorized}
  end

  @impl true
  def id(socket), do: "users_socket:#{socket.assigns.current_user.id}"
end
