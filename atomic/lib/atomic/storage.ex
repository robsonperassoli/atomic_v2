defmodule Atomic.Storage do
  @moduledoc false

  @one_day_sec 86_400

  def upload(bucket, source, destination) do
    Supabase.storage()
    |> Supabase.Storage.from(bucket)
    |> Supabase.Storage.upload(destination, source)
  end

  def sign_url(bucket, key, expires_in \\ @one_day_sec) do
    %Supabase.Connection{base_url: base_url} = connection = Supabase.storage()

    connection
    |> Supabase.Storage.from(bucket)
    |> Supabase.Storage.create_signed_url(key, expires_in)
    |> case do
      {:ok, %{"signedURL" => signed_url}} ->
        "#{base_url}/storage/v1#{signed_url}"

      e ->
        e
    end
  end
end
