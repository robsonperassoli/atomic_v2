defmodule AtomicWeb.Schema.Resolvers do
  alias Atomic.ProjectManagement

  ################# QUERIES #####################
  def hello(root, args, resolution) do
    IO.inspect(resolution)
    IO.inspect(root)
    IO.inspect(args)

    {:ok, "world"}
  end

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

  def update_task(_root, %{id: id} = args, resolution) do
    user = get_current_user(resolution)

    ProjectManagement.update_task(user, id, Map.delete(args, :id))
  end

  defp get_current_user(%{context: %{current_user: current_user}} = _resolution), do: current_user
end
