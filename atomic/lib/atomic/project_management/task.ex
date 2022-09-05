defmodule Atomic.ProjectManagement.Task do
  use Ecto.Schema
  import Ecto.Changeset
  import Ecto.Query

  alias Atomic.ProjectManagement.{Task, Project}
  alias Atomic.Accounts.User

  schema "tasks" do
    field :content, :string
    field :last_started_at, :utc_datetime_usec
    field :last_stopped_at, :utc_datetime_usec
    field :time_sec, :integer
    belongs_to :project, Project
    belongs_to :created_by_user, User

    timestamps()
  end

  def changeset(attrs) do
    %Task{}
    |> changeset(attrs)
  end

  @doc false
  def changeset(task, attrs) do
    task
    |> cast(attrs, [
      :content,
      :last_started_at,
      :last_stopped_at,
      :time_sec,
      :created_by_user_id,
      :project_id
    ])
    |> validate_required([:content, :time_sec, :created_by_user_id, :project_id])
    |> validate_number(:time_sec, greater_than_or_equal_to: 0)
  end

  def by_user_query(user_id) do
    from t in Task,
      where: t.created_by_user_id == ^user_id,
      order_by: {:desc, :inserted_at}
  end

  def user_task_query(user_id, task_id) do
    from t in by_user_query(user_id),
      where: t.id == ^task_id
  end

  def created_in_interval(%Ecto.Query{} = query, start_time, end_time) do
    from t in query,
      where: t.inserted_at >= ^start_time and t.inserted_at <= ^end_time
  end
end
