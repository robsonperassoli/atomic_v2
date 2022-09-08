defmodule Atomic.Repo.Migrations.AddStatusToTask do
  use Ecto.Migration

  def change do
    alter table(:tasks) do
      add :status, :string, null: false, default: "stopped"
    end
  end
end
