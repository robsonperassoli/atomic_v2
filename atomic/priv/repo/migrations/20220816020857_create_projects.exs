defmodule Atomic.Repo.Migrations.CreateProjects do
  use Ecto.Migration

  def change do
    create table(:projects) do
      add :name, :string
      add :abbreviation, :string
      add :created_by_user_id, references(:users, on_delete: :nothing)

      timestamps()
    end

    create index(:projects, [:created_by_user_id])
  end
end
