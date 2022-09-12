defmodule Atomic.ProjectManagement do
  @moduledoc """
  The ProjectManagement context.
  """

  import Ecto.Query, warn: false

  alias Atomic.Repo
  alias Atomic.Accounts.User
  alias Atomic.ProjectManagement.{Project, Task}

  def create_project(%User{id: user_id}, attrs) do
    attrs_with_user_id = Map.put(attrs, :created_by_user_id, user_id)

    %Project{}
    |> Project.changeset(attrs_with_user_id)
    |> Repo.insert()
  end

  def update_project(%User{} = user, project_id, attrs) do
    with {:ok, project} <- get_project(user, project_id) do
      project
      |> Project.changeset(attrs)
      |> Repo.update()
    end
  end

  def delete_project(%User{} = user, project_id) do
    with {:ok, project} <- get_project(user, project_id) do
      project
      |> Repo.delete()
    end
  end

  def get_project(%User{} = user, project_id) do
    Project.get_user_project_query(user.id, project_id)
    |> Repo.one()
    |> case do
      nil -> {:error, :not_found}
      project -> {:ok, project}
    end
  end

  def list_projects(%User{} = user) do
    Project.get_user_projects_query(user.id)
    |> Repo.all()
  end

  def create_task(%User{} = user, project_id, attrs) do
    with {:ok, project} <- get_project(user, project_id) do
      attrs
      |> Map.put(:project_id, project.id)
      |> Map.put(:created_by_user_id, user.id)
      |> Map.put(:status, :running)
      |> Task.changeset()
      |> Repo.insert()
    end
  end

  def get_task(%User{} = user, task_id) do
    Task.user_task_query(user.id, task_id)
    |> Repo.one()
    |> case do
      nil -> {:error, :task_not_found}
      task -> {:ok, task}
    end
  end

  def delete_task(%User{} = user, task_id) do
    with {:ok, task} <- get_task(user, task_id) do
      task
      |> Repo.delete()
    end
  end

  def update_task(%User{} = user, task_id, attrs) do
    with {:ok, task} <- get_task(user, task_id) do
      attrs =
        attrs
        |> Enum.reject(fn {k, v} -> k == :time_sec and is_nil(v) end)
        |> Map.new()

      task
      |> Task.changeset(attrs)
      |> Repo.update()
    end
  end

  def start_task_timer(%User{} = user, task_id) do
    with {:ok, task} <- get_task(user, task_id) do
      task
      |> Task.start_timer_changeset()
      |> Repo.update()
    end
  end

  def stop_task_timer(%User{} = user, task_id) do
    with {:ok, task} <- get_task(user, task_id) do
      task
      |> Task.stop_timer_changeset()
      |> Repo.update()
    end
  end

  def data(current_user) do
    Dataloader.Ecto.new(Atomic.Repo,
      query: &query/2,
      default_params: %{
        current_user: current_user
      }
    )
  end

  defp query(Task, %{
         current_user: current_user,
         start_time: start_time,
         end_time: end_time
       }) do
    Task.by_user_query(current_user.id)
    |> Task.created_in_interval(start_time, end_time)
  end

  defp query(queryable, _params), do: queryable
end
