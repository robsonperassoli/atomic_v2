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
    field :status, Ecto.Enum, values: [:stopped, :running]

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
    |> put_status()
  end

  def put_status(%Ecto.Changeset{} = cs) do
    last_started_at = get_field(cs, :last_started_at)
    last_stopped_at = get_field(cs, :last_stopped_at)

    put_change(cs, :status, status_from_dates(last_started_at, last_stopped_at))
  end

  def start_timer_changeset(%Task{} = task) do
    cs = changeset(task, %{last_stopped_at: nil, last_started_at: Timex.now()})

    if task.status == :running,
      do: add_error(cs, :status, "cannot start a running task"),
      else: cs
  end

  def stop_timer_changeset(%Task{} = task) do
    now = Timex.now()

    cs =
      changeset(task, %{
        last_stopped_at: now,
        time_sec: Timex.diff(now, task.last_started_at, :seconds)
      })

    if task.status == :stopped,
      do: add_error(cs, :status, "cannot stop a stopped task"),
      else: cs
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

  defp status_from_dates(nil, nil), do: :stopped
  defp status_from_dates(started_at, nil) when not is_nil(started_at), do: :running

  defp status_from_dates(nil, stopped_at) when not is_nil(stopped_at),
    do: raise("Cannot determine status, start time is nil")

  defp status_from_dates(started_at, stopped_at) do
    if Timex.diff(stopped_at, started_at) > 0,
      do: :running,
      else: :stopped
  end
end
