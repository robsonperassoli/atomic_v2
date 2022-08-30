defmodule AtomicWeb.Schema.AuthenticationMiddleware do
  @behaviour Absinthe.Middleware

  def call(resolution, _config) do
    case resolution.context do
      %{current_user: _} ->
        resolution

      _ ->
        resolution
        |> Absinthe.Resolution.put_result(
          {:error, message: "Not Authenticated", code: "NOT_AUTHENTICATED"}
        )
    end
  end
end
