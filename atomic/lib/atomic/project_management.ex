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

  def create_task(%User{} = user, project_id, attrs) do
    with {:ok, project} <- get_project(user, project_id) do
      attrs
      |> Map.put(:project_id, project.id)
      |> Map.put(:created_by_user_id, user.id)
      |> Task.changeset()
      |> Repo.insert()
    end
  end

  def get_task(%User{} = user, task_id) do
    Task.get_user_task_query(user.id, task_id)
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
      task
      |> Task.changeset(attrs)
      |> Repo.update()
    end
  end
end
