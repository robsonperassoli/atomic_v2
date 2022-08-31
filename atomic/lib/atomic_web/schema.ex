defmodule AtomicWeb.Schema do
  use Absinthe.Schema

  import_types AtomicWeb.Schema.Types

  query do
    field :hello, :string do
      middleware AtomicWeb.Schema.AuthenticationMiddleware

      resolve &AtomicWeb.Schema.Resolvers.hello/3
    end

    field :project, :project do
      arg :id, :id
      middleware AtomicWeb.Schema.AuthenticationMiddleware

      resolve &AtomicWeb.Schema.Resolvers.hello/3
    end
  end

  mutation do
    field :create_project, :project do
      arg :name, :string
      arg :abbreviation, :string

      middleware AtomicWeb.Schema.AuthenticationMiddleware

      resolve &AtomicWeb.Schema.Resolvers.create_project/3
    end

    field :update_project, :project do
      arg :id, :id
      arg :name, :string
      arg :abbreviation, :string

      middleware AtomicWeb.Schema.AuthenticationMiddleware

      resolve &AtomicWeb.Schema.Resolvers.update_project/3
    end

    field :delete_project, :project do
      arg :id, :id

      middleware AtomicWeb.Schema.AuthenticationMiddleware

      resolve &AtomicWeb.Schema.Resolvers.delete_project/3
    end
  end
end
