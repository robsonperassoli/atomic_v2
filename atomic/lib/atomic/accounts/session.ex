defmodule Atomic.Accounts.Session do
  use Ecto.Schema
  import Ecto.Changeset

  alias Atomic.Accounts.User

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
end
