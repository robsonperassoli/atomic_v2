defmodule Atomic.Accounts.Identity do
  use Ecto.Schema
  import Ecto.Changeset
  alias Atomic.Accounts.User

  schema "user_identities" do
    field :provider, :string
    field :provider_id, :string
    field :provider_email, :string
    field :provider_login, :string
    field :provider_name, :string

    field :provider_token, :string
    field :provider_meta, :map

    belongs_to :user, User

    timestamps()
  end

  @doc false
  def changeset(identity, attrs) do
    identity
    |> cast(attrs, [:provider, :provider_token, :provider_email, :provider_login, :provider_name, :provider_id, :provider_meta])
    |> validate_required([:provider, :provider_token, :provider_email, :provider_login, :provider_name, :provider_id, :provider_meta])
  end
end
