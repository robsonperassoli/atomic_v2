defmodule Atomic.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset
  alias Atomic.Accounts.{User, Identity}

  @providers %{
    github: "github"
  }

  schema "users" do
    field :email, :string
    field :name, :string

    has_many :identities, Identity

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:name, :email])
    |> validate_required([:name, :email])
    |> unique_constraint(:email)
  end

  def github_registration_changeset(%Ueberauth.Auth{
        info: info,
        credentials: credentials,
        uid: provider_id
      }) do
    name = info.name
    email = info.email

    identity_changeset =
      %Identity{}
      |> Identity.changeset(%{
        provider: @providers.github,
        provider_name: name,
        provider_email: email,
        provider_login: info.nickname,
        provider_id: to_string(provider_id),
        provider_token: credentials.token,
        provider_meta: Map.from_struct(info)
      })

    %User{}
    |> changeset(%{name: name, email: email})
    |> put_assoc(:identities, [identity_changeset])
  end
end
