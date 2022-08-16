defmodule Atomic.Repo.Migrations.CreateTasks do
  use Ecto.Migration

  def change do
    create table(:tasks) do
      add :content, :text
      add :last_started_at, :utc_datetime_usec
      add :last_stopped_at, :utc_datetime_usec
      add :time_sec, :integer
      add :project_id, references(:projects, on_delete: :nothing)
      add :created_by_user_id, references(:users, on_delete: :nothing)

      timestamps()
    end

    create index(:tasks, [:project_id])
    create index(:tasks, [:created_by_user_id])
  end
end
