defmodule Atomic.Repo.Migrations.CreateUserSessions do
  use Ecto.Migration

  def change do
    create table(:user_sessions) do
      add :token, :binary, null: false
      add :user_id, references(:users, on_delete: :nothing)

      timestamps()
    end

    create index(:user_sessions, [:user_id, :token])
  end
end
