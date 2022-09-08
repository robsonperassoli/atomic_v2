defmodule AtomicWeb.Schema do
  use Absinthe.Schema

  alias Atomic.ProjectManagement

  import_types AtomicWeb.Schema.Types
  import_types Absinthe.Type.Custom

  def context(ctx) do
    loader =
      Dataloader.new()
      |> Dataloader.add_source(ProjectManagement, ProjectManagement.data(ctx[:current_user]))

    Map.put(ctx, :loader, loader)
  end

  def plugins do
    [Absinthe.Middleware.Dataloader] ++ Absinthe.Plugin.defaults()
  end

  query do
    field :project, :project do
      arg :id, :id
      middleware AtomicWeb.Schema.AuthenticationMiddleware

      resolve &AtomicWeb.Schema.Resolvers.project/3
    end

    field :task, :task do
      arg :id, :id
      middleware AtomicWeb.Schema.AuthenticationMiddleware

      resolve &AtomicWeb.Schema.Resolvers.task/3
    end

    field :projects, list_of(:project) do
      middleware AtomicWeb.Schema.AuthenticationMiddleware

      resolve &AtomicWeb.Schema.Resolvers.projects/3
    end
  end

  mutation do
    field :create_project, :project do
      arg :name, non_null(:string)
      arg :abbreviation, non_null(:string)

      middleware AtomicWeb.Schema.AuthenticationMiddleware

      resolve &AtomicWeb.Schema.Resolvers.create_project/3
    end

    field :update_project, :project do
      arg :id, non_null(:id)
      arg :name, non_null(:string)
      arg :abbreviation, non_null(:string)

      middleware AtomicWeb.Schema.AuthenticationMiddleware

      resolve &AtomicWeb.Schema.Resolvers.update_project/3
    end

    field :delete_project, :project do
      arg :id, :id

      middleware AtomicWeb.Schema.AuthenticationMiddleware

      resolve &AtomicWeb.Schema.Resolvers.delete_project/3
    end

    field :create_task, :task do
      arg :project_id, non_null(:id)
      arg :content, non_null(:string)
      arg :time_sec, :integer

      middleware AtomicWeb.Schema.AuthenticationMiddleware

      resolve &AtomicWeb.Schema.Resolvers.create_task/3
    end

    field :start_task_timer, :task do
      arg :task_id, non_null(:id)

      middleware AtomicWeb.Schema.AuthenticationMiddleware

      resolve &AtomicWeb.Schema.Resolvers.start_task_timer/3
    end

    field :stop_task_timer, :task do
      arg :task_id, non_null(:id)

      middleware AtomicWeb.Schema.AuthenticationMiddleware

      resolve &AtomicWeb.Schema.Resolvers.stop_task_timer/3
    end

    field :delete_task, :task do
      arg :id, :id

      middleware AtomicWeb.Schema.AuthenticationMiddleware

      resolve &AtomicWeb.Schema.Resolvers.delete_task/3
    end

    field :update_task, :task do
      arg :id, non_null(:id)
      arg :content, non_null(:string)
      arg :time_sec, :integer

      middleware AtomicWeb.Schema.AuthenticationMiddleware

      resolve &AtomicWeb.Schema.Resolvers.update_task/3
    end
  end
end
