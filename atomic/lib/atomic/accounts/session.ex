defmodule Atomic.Accounts.Session do
  @moduledoc false

  use Ecto.Schema
  import Ecto.Changeset
  import Ecto.Query

  alias Atomic.Accounts.{User, Session}

  @token_validity_in_days 60

  schema "user_sessions" do
    field :token, :binary
    belongs_to :user, User

    timestamps()
  end

  @doc false
  def changeset(session, attrs) do
    session
    |> cast(attrs, [:token, :user_id])
    |> validate_required([:token, :user_id])
  end

  def verify_token_query(token) do
    from s in Session,
      join: u in assoc(s, :user),
      where: s.token == ^token and s.inserted_at > ago(@token_validity_in_days, "day"),
      select: u
  end
end
