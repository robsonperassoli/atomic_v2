defmodule Atomic.ProjectManagement.Task do
  use Ecto.Schema
  import Ecto.Changeset

  schema "tasks" do
    field :content, :string
    field :last_started_at, :utc_datetime_usec
    field :last_stopped_at, :utc_datetime_usec
    field :time_sec, :integer
    field :project_id, :id
    field :created_by_user_id, :id

    timestamps()
  end

  @doc false
  def changeset(task, attrs) do
    task
    |> cast(attrs, [:content, :last_started_at, :last_stopped_at, :time_sec])
    |> validate_required([:content, :last_started_at, :last_stopped_at, :time_sec])
  end
end
