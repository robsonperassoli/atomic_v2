defmodule Atomic.Repo.Migrations.CreateUserIdentities do
  use Ecto.Migration

  def change do
    create table(:user_identities) do
      add :provider, :string
      add :provider_token, :string
      add :provider_email, :string
      add :provider_login, :string
      add :provider_name, :string
      add :provider_id, :string
      add :provider_meta, :map
      add :user_id, references(:users, on_delete: :nothing)

      timestamps()
    end

    create index(:user_identities, [:user_id])
  end
end
