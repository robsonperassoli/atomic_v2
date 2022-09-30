defmodule AtomicWeb.Schema.Resolvers do
  @moduledoc """
    Absinthe resolvers for the GraphQL api
  """
  alias Atomic.ProjectManagement

  ################# QUERIES #####################
  def project(_root, %{id: id}, resolution) do
    user = get_current_user(resolution)

    ProjectManagement.get_project(user, id)
  end

  def projects(_root, _args, resolution) do
    user = get_current_user(resolution)

    {:ok, ProjectManagement.list_projects(user)}
  end

  def task(_root, %{id: id}, resolution) do
    user = get_current_user(resolution)

    ProjectManagement.get_task(user, id)
  end

  def me(_root, _args, resolution) do
    resolution
    |> get_current_user()
    |> then(&{:ok, &1})
  end

  ################# MUTATIONS ####################
  def create_project(_root, args, resolution) do
    user = get_current_user(resolution)

    ProjectManagement.create_project(user, args)
  end

  def update_project(_root, %{id: id} = args, resolution) do
    user = get_current_user(resolution)

    ProjectManagement.update_project(user, id, Map.delete(args, :id))
  end

  def delete_project(_root, %{id: id}, resolution) do
    user = get_current_user(resolution)

    ProjectManagement.delete_project(user, id)
  end

  def create_task(_root, %{project_id: project_id} = args, resolution) do
    user = get_current_user(resolution)

    ProjectManagement.create_task(user, project_id, Map.delete(args, :project_id))
  end

  def delete_task(_root, %{id: id}, resolution) do
    user = get_current_user(resolution)

    ProjectManagement.delete_task(user, id)
  end

  def start_task_timer(_root, %{task_id: task_id}, resolution) do
    user = get_current_user(resolution)

    ProjectManagement.start_task_timer(user, task_id)
  end

  def stop_task_timer(_root, %{task_id: task_id}, resolution) do
    user = get_current_user(resolution)

    ProjectManagement.stop_task_timer(user, task_id)
  end

  def update_task(_root, %{id: id} = args, resolution) do
    user = get_current_user(resolution)

    ProjectManagement.update_task(user, id, Map.delete(args, :id))
  end

  def create_tasks_report(_root, args, resolution) do
    args
    |> put_user_id(resolution)
    |> then(&Atomic.Reports.spawn_builder_task(:tasks, &1))
    |> case do
      {:ok, report_id} ->
        {:ok, report_id}

      {:error, _reason} ->
        {:error, "Report creation failed"}
    end
  end

  def create_websocket_token(_root, _args, resolution) do
    resolution
    |> get_current_user()
    |> AtomicWeb.UserAuth.create_websocket_token()
    |> then(&{:ok, &1})
  end

  defp get_current_user(%{context: %{current_user: current_user}} = _resolution), do: current_user

  defp put_user_id(map, resolution) when is_map(map) do
    resolution
    |> get_current_user()
    |> then(&Map.put(map, :user_id, &1.id))
  end
end
