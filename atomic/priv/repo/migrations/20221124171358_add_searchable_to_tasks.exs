defmodule Atomic.Repo.Migrations.AddSearchableToTasks do
  use Ecto.Migration

  def change do
    execute """
      alter table tasks
        add column searchable tsvector
        generated always as (
          setweight(to_tsvector('english', coalesce(content, '')), 'A')
        ) stored;
    """

    execute """
      create index tasks_searchable_idx on tasks using gin(searchable);
    """
  end
end
