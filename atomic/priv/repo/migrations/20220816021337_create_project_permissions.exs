defmodule Atomic.Repo.Migrations.CreateProjectPermissions do
  use Ecto.Migration

  def change do
    create table(:project_permissions) do
      add :type, :string
      add :project_id, references(:projects, on_delete: :nothing)
      add :user_id, references(:users, on_delete: :nothing)
      add :team_id, references(:teams, on_delete: :nothing)

      timestamps()
    end

    create index(:project_permissions, [:project_id])
    create index(:project_permissions, [:user_id])
    create index(:project_permissions, [:team_id])
  end
end
