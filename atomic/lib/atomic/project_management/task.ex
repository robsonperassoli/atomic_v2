defmodule Atomic.ProjectManagement.Task do
  @moduledoc """
  Task Ecto Schema
  """
  use Ecto.Schema
  import Ecto.Changeset
  import Ecto.Query

  alias Atomic.ProjectManagement.{Task, Project}
  alias Atomic.Accounts.User

  schema "tasks" do
    field :content, :string
    field :last_started_at, :utc_datetime_usec
    field :last_stopped_at, :utc_datetime_usec
    field :time_sec, :integer, default: 0
    field :status, Ecto.Enum, values: [:stopped, :running], default: :stopped

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
      :project_id,
      :status
    ])
    |> validate_required([:content, :created_by_user_id, :project_id, :status])
    |> validate_number(:time_sec, greater_than_or_equal_to: 0)
    |> validate_time_sec_timer_status()
    |> put_timer_dates()
  end

  def put_timer_dates(
        %Ecto.Changeset{
          data: %Task{
            status: current_status,
            time_sec: current_time_sec,
            last_started_at: last_started_at
          }
        } = cs
      ) do
    new_status = get_change(cs, :status)
    now = Timex.now()

    case {current_status, new_status} do
      {:stopped, :running} ->
        cs
        |> put_change(:last_started_at, now)
        |> put_change(:last_stopped_at, nil)

      {:running, :stopped} ->
        last_time_window_sec =
          if last_started_at,
            do: Timex.diff(now, last_started_at, :seconds),
            else: 0

        new_time_sec = (current_time_sec || 0) + last_time_window_sec

        cs
        |> put_change(:last_stopped_at, now)
        |> put_change(:time_sec, new_time_sec)

      _ ->
        cs
    end
  end

  def validate_time_sec_timer_status(%Ecto.Changeset{data: %Task{id: id}} = cs)
      when not is_nil(id) do
    changed_time_sec = get_change(cs, :time_sec)
    status = get_field(cs, :status)

    case {status, changed_time_sec} do
      {:running, time_sec} when is_integer(time_sec) ->
        add_error(cs, :time_sec, "cannot update time on a running task timer")

      _ ->
        cs
    end
  end

  def validate_time_sec_timer_status(%Ecto.Changeset{} = cs), do: cs

  def start_timer_changeset(%Task{} = task) do
    cs = changeset(task, %{status: :running})

    if task.status == :running,
      do: add_error(cs, :status, "cannot start a running task"),
      else: cs
  end

  def stop_timer_changeset(%Task{} = task) do
    cs =
      changeset(task, %{
        status: :stopped
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
end
